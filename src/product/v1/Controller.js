const svc = require("./Service");
exports.default = {
    createProduct: async (req, res, next) => {
        try {
            let role = req.authData.role
            if(role !=="admin" && role !=="staff"){
                throw new Error("Not allowed")
            }
            let images = req.files;
            let productDetail = req.body;
            let prd= await svc.createProduct(images, productDetail);
            return res.status(200).json(prd);
        } catch (error) {
            next(error);
        }
    },

    getAllProduct : async(req,res,next) =>{
        try {
           let {page, size} = req.query 
           let products = await svc.getAllProduct(page,size)
           return res.status(200).json(products)
        } catch (error) {
           next(error) 
        }
    }
};
