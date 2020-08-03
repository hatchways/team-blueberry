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
    cart: [
      {
        // ? subSchema ?
        name: { type: String, required: true },
        unitCost: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    state: {
      type: Schema.Types.String,
      required: true,
      enum: ["intent_created", "intent_paid"],
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.statics.createIntent = function (intent) {
  return this.create({ ...intent, state: "intent_created" }, (err, payment) => {
    if (err) return { error: "could not create payment" };
    // ? Why does this cb not return the created document ?
    return payment;
  });
};

paymentSchema.statics.confirmIntent = function (stripeId, user) {
  return this.findOneAndUpdate(
    { stripeId, user, state: "intent_created" },
    { state: "intent_paid" },
    { returnOriginal: false, new: true }
  );
};

// TODO will require instance methods to update as Stripe processes payment

module.exports = model("Payment", paymentSchema);
