const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");

const router = express.Router();

router.post("/", checkAuth, ctrler.upsertCart);
router.post("/payment",ctrler.newPayment)
router.delete("/", checkAuth, ctrler.deleteCart);
router.get("/", checkAuth, ctrler.getCart);
router.get("/vnpaySuccess",  ctrler.vnpaySuccess);

module.exports = router;
