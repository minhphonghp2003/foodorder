const { cart, image, product, user } = require("../../../models");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const { app } = require("../../../config/firebase");
const stripeConfig = require("../../../config/stripe");
const storage = getStorage(app);
const stripe = require("stripe")(stripeConfig.sk_test);

exports.default = {
    stripeCheckout: async (products, customerDetails) => {
        let line_items = [];
        for (let p of products) {
            const product = await stripe.products.create({
                name: p.name,
                images: p.images,
            });
            const createdPrice = await stripe.prices.create({
                product: product.id,
                unit_amount: p.price,
                currency: "vnd",
            });
            line_items.push({ price: createdPrice.id, quantity: p.quantity });
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            customer_email: customerDetails.email,
            mode: "payment",
            success_url: `https://www.facebook.com/`,
            cancel_url: `https://www.youtube.com/`,
        });
        return session.url;
    },

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
            cart.dataValues.product.dataValues.images =
                await getImageFromFirebase(
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
