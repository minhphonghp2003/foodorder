const { cart, image, product, user } = require("../../../models");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const { app } = require("../../../config/firebase");
const storage = getStorage(app);

exports.default = {
    upsertCart: async (productId, userId, quanity) => {
        let result = await cart.upsert(
            { quanity, productId, userId },
            { productId, userId }
        );
        return result;
    },

    deleteCart: async (productId, userId) => {
        await cart.destroy({
            where: {
                productId,
                userId,
            },
        });
        return "done";
    },

    getCart: async (userId) => {
        
        let productInCart = await cart.findAll({
            where: { userId },

            include: [
                {
                    model: product,
                    include: image,
                },
            ],
            
        });
        for (let cart of productInCart) {
            cart.dataValues.product.dataValues.images = await getImageFromFirebase(
                cart.product.dataValues.images[0].link
            );
        }
        return productInCart;
    },
};

// -----------------------------------============================

let getImageFromFirebase = async (path) => {
    if (path) {
        const pathReference = ref(storage, path);
        const downloadUrl = await getDownloadURL(pathReference);
        return downloadUrl;
    }
    return null;
};
