const svc = require("./Service");
exports.default = {
    createProduct: async (req, res, next) => {
        try {
            let images = req.files;
            let productDetail = req.body;
            let prd= await svc.createProduct(images, productDetail);
            return res.status(200).json(prd);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
};
