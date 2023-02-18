const express = require("express");
const ctrler = require("./Controller").default;
const { checkAuth } = require("../../../middleware/checkAuth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.post("/",checkAuth, upload.array("images"), ctrler.createProduct);
router.post("/category",checkAuth,upload.single("image"),  ctrler.createCategory);
router.post("/review",  ctrler.createReview);
router.post("onlinepay", ctrler.onlPay)
router.get("/", ctrler.getAllProduct);
router.get("/review", ctrler.getReviews);
router.get("/detail/:id", ctrler.getProduct);
router.get("/category/all", ctrler.getAllCategory);
router.get("/search", ctrler.search);
router.put("/",checkAuth,  ctrler.updateProduct);
router.delete("/",checkAuth,  ctrler.deleteProduct);
router.delete("/category",checkAuth,  ctrler.deleteCategory);

module.exports = router;
