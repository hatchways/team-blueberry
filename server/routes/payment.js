const { Router } = require("express");
const router = Router();
const {
  getKey,
  createPayment,
  updatePayment,
} = require("../controllers/payment");

router.get("/key", getKey);
router.post("/", createPayment);
router.put("/:id", updatePayment);

module.exports = router;
