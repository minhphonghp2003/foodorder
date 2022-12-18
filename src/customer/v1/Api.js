const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");

const router = express.Router();
router.get("/profile", checkAuth, ctrler.getProfile);
router.get("/address", checkAuth, ctrler.getCustomerAddress);
router.post("/login", ctrler.login);
router.post("/register", ctrler.register);
router.post("/address",checkAuth, ctrler.createCustomerAddress);
router.post("/emailentry", ctrler.createEmailForChange);
router.put("/password", ctrler.changePassword);
router.put("/profile", checkAuth, ctrler.changeProfile);
router.put("/defaultaddress", checkAuth, ctrler.changeDefaultAddress);
router.put("/address", checkAuth, ctrler.changeAddressDetail);
module.exports = router;
