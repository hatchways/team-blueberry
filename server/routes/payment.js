const { Router } = require("express");
const router = Router();
const { createPayment } = require("../controllers/payment");

router.post("/", createPayment);

module.exports = router;
