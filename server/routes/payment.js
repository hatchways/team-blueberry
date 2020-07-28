const { Router } = require("express");
const router = Router();

const createPayment = (req, res, next) => {
  try {
    // verify value
    // call Stripe API
    // post to db
    console.log(req.body);
    return res.status(201).send({ result: {} });
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
};

router.post("/", createPayment);

module.exports = router;
