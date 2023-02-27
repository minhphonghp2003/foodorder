const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");

const router = express.Router();

router.post("/", checkAuth, ctrler.upsertCart);
router.post("/payment",checkAuth,ctrler.newPayment)
router.delete("/", checkAuth, ctrler.deleteCart);
router.get("/", checkAuth, ctrler.getCart);
router.get("/vnpaySuccess/:userId",  ctrler.vnpayPaymentSuccess);
router.get("/stripeSuccess",  ctrler.stripePaymentSuccess);


module.exports = router;
