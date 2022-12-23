const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post("/",checkAuth, upload.array("images"), ctrler.createProduct);
router.get("/", ctrler.getAllProduct);

module.exports = router;
