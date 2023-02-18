const svc = require("./Service").default;
exports.default = {
    upsertCart: async (req, res, next) => {
        try {
            let userId = req.authData.id;
            let { productId, quanity } = req.body;
            let result = await svc.upsertCart(productId, userId, quanity);
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    deleteCart: async (req, res, next) => {
        try {
            let userId = req.authData.id;
            let productId = req.body.productId;
            let result = await svc.deleteCart(productId, userId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    },

    getCart: async(req,res,next) =>{
        try {
           let userId = req.authData.id 
           let productInCart = await svc.getCart(userId)
           return res.status(200).json(productInCart)
        } catch (error) {
           next(error) 
        }
    }
};
