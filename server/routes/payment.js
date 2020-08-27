const { Router } = require("express");
const router = Router();
const {
  getKey,
  createPayment,
  updatePayment,
} = require("../controllers/payment");
const { stripePayment } = require("../controllers/stripeServer");

router.post("/", stripePayment);
// router.get("/key", getKey);
// router.post("/", createPayment);
// router.put("/:paymentIntentId", updatePayment);
// router.put("/payment_intents", stripePayment);

module.exports = router;
