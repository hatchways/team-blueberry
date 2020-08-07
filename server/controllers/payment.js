require("dotenv").config();
const PUBLIC_STRIPE_API_KEY = process.env.PUBLIC_STRIPE_API_KEY;
const SECRET_STRIPE_API_KEY = process.env.SECRET_STRIPE_API_KEY;
const stripe = require("stripe")(SECRET_STRIPE_API_KEY);
const Payment = require("../models/payment");
const User = require("../models/user");
const itemLookup = require("../helper/itemLookup");

const handleError = (e, res) =>
  e.status && e.message
    ? res.status(e.status).send(e.message)
    : res.status(400).send(e);

const getKey = (req, res, next) => {
  try {
    return res.status(200).send({ STRIPE_API_KEY: PUBLIC_STRIPE_API_KEY });
  } catch (e) {
    return handleError(e, res);
  }
};

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
    console.log(e);
    return handleError(e, res);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;
    stripe.paymentIntents.retrieve(paymentIntentId, (err, paymentIntent) => {
      // confirm Stripe
      if (err) {
        console.log(err);
        throw new Error({
          status: 424,
          message: "Failure to retrieve payment intent",
        });
      }
      if (paymentIntent.status !== "succeeded") {
        console.log(paymentIntent);
        throw new Error({
          status: 409,
          message: "Payment intent is invalid",
        });
      }
    });
    // update payment + user
    const { cart } = await Payment.confirmIntent(paymentIntentId, req.user.id);
    // TODO handle successful confirmation where user is not updated
    const user = await User.addCredits({
      user: req.user.id,
      credits: Number(
        cart.find((item) => item.name === "Review Credits").quantity
      ),
    });
    // return success message with updated user
    return res.status(200).send(user);
  } catch (e) {
    console.log(e);
    return handleError(e, res);
  }
};

module.exports = {
  getKey,
  createPayment,
  updatePayment,
};
