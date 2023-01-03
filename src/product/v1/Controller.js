const svc = require("./Service");
exports.default = {
    createProduct: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let images = req.files;
            let productDetail = req.body;
            let prd = await svc.createProduct(images, productDetail);
            return res.status(200).json(prd);
        } catch (error) {
            next(error);
        }
    },

    getAllProduct: async (req, res, next) => {
        try {
            let { page, size } = req.query;
            let sort = req.query.sort;
            switch (sort) {
                case "lastest":
                    sort = "createdAt";
                    break;
                case "price":
                    sort = "price";
                    break;

                default:
                    sort = "createdAt";
                    break;
            }
            let products = await svc.getAllProduct(page, size, sort);
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let id = req.body.id;
            delete req.body.id;
            let field = req.body;

            await svc.updateProduct(id, field);
            return res.status(200).json("DONNNNE");
        } catch (error) {
            next(error);
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let id = req.body.id;
            await svc.deleteProduct(id);
            return res.status(200).json("done");
        } catch (error) {
            next(error);
        }
    },

    createCategory: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let name = req.body.name;
            let id = await svc.createCategory(name);
            return res.status(200).json(id);
        } catch (error) {
            next(error);
        }
    },

    getProductByCategory: async (req, res, next) => {
        try {
            let {id,page,size} = req.query;
            let categoryAndProduct = await svc.getProductByCategory(id,page,size);
            return res.status(200).json(categoryAndProduct);
        } catch (error) {
            next(error);
        }
    },

    getProduct: async (req, res, next) => {
        try {
            let id = req.params.id;
            let productDetail = await svc.getProductDetail(id);
            return res.status(200).json(productDetail);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    createReview: async(req,res,next) =>{
        try {
           let {productId,email,name,rating, content} = req.body 
           let  review= await svc.createReview(productId,rating,name,email,content)
           return res.status(200).json(review)
        } catch (error) {
            console.log(error);
           next(error) 
        }
    }
};
