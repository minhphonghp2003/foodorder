const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");

const router = express.Router();

router.post("/", checkAuth, ctrler.upsertCart);
router.delete("/", checkAuth, ctrler.deleteCart);
router.get("/", checkAuth, ctrler.getCart);

module.exports = router;
