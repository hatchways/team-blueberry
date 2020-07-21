const { Schema, model } = require("mongoose");

const paymentSchema = new Schema(
  {
    // ref to Stripe PaymentIntent object id
    stripeId: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// TODO will require instance methods to update as Stripe processes payment

module.exports = Model("Payment", paymentSchema);
