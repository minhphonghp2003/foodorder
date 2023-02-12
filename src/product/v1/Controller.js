const svc = require("./Service");
const { v4, parse } = require("uuid");
exports.default = {
    createProduct: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let images = req.files;
            let categories = req.body.categories;
            delete req.body.categories;
            let productDetail = req.body;
            let prd = await svc.createProduct(
                images,
                productDetail,
                categories
            );
            return res.status(200).json(prd);
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
    getAllProduct: async (req, res, next) => {
        try {
            let query = req.query;
            let products = await svc.getAllProduct(query);
            return res.status(200).json(products);
        } catch (error) {
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
            return res.status(200).json({ isDone: true });
        } catch (error) {
            next(error);
        }
    },
    createAddons: async (req, res, next) => {
        try {
            let role = req.authData.role;
            if (role !== "admin" && role !== "staff") {
                throw new Error("Not allowed");
            }
            let image = req.file;
            let { name, price } = req.body;
            let addon = await svc.createAddons(image, name, price);
            return res.status(200).json(addon);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    getALlAddons: async (req, res, next) => {
        try {
            let addons = await svc.getAllAddons();
            return res.status(200).json(addons);
        } catch (error) {
            console.log(error);
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
            let image = req.file;
            let id = await svc.createCategory(name, image);
            return res.status(200).json(id);
        } catch (error) {
            next(error);
        }
    },

    getAllCategory: async (req, res, next) => {
        try {
            let categories = await svc.getAllCategory();
            return res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            if (req.authData.role != "admin") {
                throw new Error("You are now allowed");
            }
            let { id } = req.body;
            await svc.deleteCategory(id);
            return res.status(200).json("done");
        } catch (error) {
            next(error);
        }
    },

    createReview: async (req, res, next) => {
        try {
            let { productId, email, name, rating, content } = req.body;
            let review = await svc.createReview(
                productId,
                rating,
                name,
                email,
                content
            );
            return res.status(200).json(review);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    // search: async (req, res, next) => {
    //     try {
    //         let {  keyword, size,page,sort } = req.query;
    //         let result = await svc.search(keyword,size,page,sort);
    //         return res.status(200).json(result);
    //     } catch (error) {
    //         next(error);
    //     }
    // },
};
