const express = require("express");
const ctrler = require("./Controller").default
const {checkAuth} = require("../../../middleware/checkAuth")

const router = express.Router()
router.post('/login',ctrler.login)
router.post('/register',ctrler.register)
router.post('/emailentry',ctrler.createEmailForChange)
router.put('/password',ctrler.changePassword)
module.exports = router