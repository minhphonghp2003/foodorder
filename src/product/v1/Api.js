const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post("/",checkAuth, upload.array("images"), ctrler.createProduct);
router.post("/category",checkAuth,  ctrler.createCategory);
router.post("/review",  ctrler.createReview);
router.get("/", ctrler.getAllProduct);
router.get("/detail/:id", ctrler.getProduct);
router.get("/category", ctrler.getProductByCategory);
router.put("/",checkAuth,  ctrler.updateProduct);
router.delete("/",checkAuth,  ctrler.deleteProduct);

module.exports = router;
