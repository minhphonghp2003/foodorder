const { cart, image, product, user } = require("../../../models");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const { app } = require("../../../config/firebase");
const stripeConfig = require("../../../config/stripe");
const storage = getStorage(app);
const stripe = require("stripe")(stripeConfig.sk_test);

module.exports = new (function () {
    (this.stripeCheckout = async (products, customerDetails) => {
        let line_items = [];
        for (let p of products) {
            line_items.push({
                price_data: {
                    unit_amount: p.price,
                    currency: "vnd",
                    product_data: {
                        name: p.name,
                        images: p.images,
                    },
                },
                quantity: p.quantity,
            });
        }

        const session = await stripe.checkout.sessions.create({
            line_items,
            customer_email: customerDetails.email,
            mode: "payment",
            success_url: stripeConfig.success_url,
        });
        return session.url;
    }),
        (this.upsertCart = async (productId, userId, quanity) => {
            let result = await cart.upsert(
                { quanity, productId, userId },
                { productId, userId }
            );
            return result;
        }),
        (this.deleteCart = async (productId, userId) => {
            await cart.destroy({
                where: {
                    productId,
                    userId,
                },
            });
            return "done";
        }),
        (this.getCart = async (userId) => {
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
        });
})();

// -----------------------------------============================

let getImageFromFirebase = async (path) => {
    if (path) {
        const pathReference = ref(storage, path);
        const downloadUrl = await getDownloadURL(pathReference);
        return downloadUrl;
    }
    return null;
};
