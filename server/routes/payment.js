const { Router } = require("express");
const router = Router();

const { stripePayment } = require("../controllers/stripeServer");

router.post("/", stripePayment);

module.exports = router;
