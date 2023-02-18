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
        let productInCart = await user.findAll({
            where: { id: userId },

            attributes: [],
            include: [
                {
                    model: cart,
                    include: [{ model: product, include: image }],
                },
            ],
            // include: [{ model: product,attributes:["name","price","id"], include:image }],
            raw: true,
            nest: true,
        });
        console.log(productInCart);
        for (let cart of productInCart) {
            cart.carts.product.images = cart.carts.product.images.link
                ? await getImageFromFirebase(cart.carts.product.images.link)
                : null;
            // cart.carts.product.quanity = cart.products.cart.quanity;
            // delete cart.products.cart;
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
