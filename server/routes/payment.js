const { Router } = require("express");
const router = Router();
const {
  getKey,
  createPayment,
  updatePayment,
} = require("../controllers/payment");

router.get("/key", getKey);
router.post("/", createPayment);
router.put("/:paymentIntentId", updatePayment);

module.exports = router;
