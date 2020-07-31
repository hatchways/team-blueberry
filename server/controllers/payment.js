const stripe = require("stripe")(); // ! remove API_KEY before commit
const Payment = require("../models/payment");
const itemLookup = require("../helper/itemLookup");

const prepareCart = (cart) => {
  const verificationError = new Error({ status: 400, message: "Invalid cart" });
  const badItem = cart.find(
    ({ name, unitCost }) =>
      itemLookup.find((inventoryItem) => inventoryItem.name === name)
        .unitCost !== unitCost
  );
  if (badItem) throw verificationError;
  const total = cart.reduce(
    (sum, { unitCost, quantity }) => sum + unitCost * quantity,
    0
  );
  if (total) return total;
  throw verificationError;
};

const createPayment = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const total = prepareCart(cart);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      // Verify your integration in this guide by including this parameter
      metadata: { integration_check: "accept_a_payment" },
    });
    const newPayment = await Payment.createIntent({
      stripeId: paymentIntent.id,
      amount: Number(total),
      cart,
      user: req.user.id,
    });
    if (newPayment)
      throw new Error({ status: 500, message: "Error processing payment." });
    return res.status(201).send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    if (e.status && e.message) return res.status(status).send(message);
    console.log(e);
    return res.status(400).send(e);
  }
};

const checkPayment = async (req, res, next) => {};

module.exports = {
  createPayment,
  checkPayment,
};
