const Stripe = require("stripe");

const SECRET_KEY =
  "sk_test_51HKme9FHPZChBCCsc3xFLFmzx4libtEpk6iTchjdAiedrURRegxACq8pbQNmb5VdGmMVTzKuFL91FwRpelf7K2k800Vwf6AJ9j";

const stripe = new Stripe(SECRET_KEY);

const stripePayment = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { amount } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });

      res.status(200).send(paymentIntent.client_secret);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

module.exports = { stripePayment };
