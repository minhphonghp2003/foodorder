const { cart, image, product, user } = require("../../../models");
const { getStorage, ref, getDownloadURL } = require("firebase/storage");
const { app } = require("../../../config/firebase");
const stripeConfig = require("../../../config/stripe");
const vnpayConfig = require("../../../config/vnpay");
const storage = getStorage(app);
const stripe = require("stripe")(stripeConfig.sk_test);
const { Op } = require("sequelize");


module.exports = new (function () {
    this.updateBilling = async (value, userId, products) => {
        for (let product of products) {
            await cart.update(
                { billing: value },
                {
                    where: {
                        userId,
                        productId: product.id,
                    },
                }
            );
        }
    };
    this.vnpayCheckout = async (information) => {
        var ipAddr = information.ipAddr;
        var tmnCode = vnpayConfig.vnp_TmnCode;
        var secretKey = vnpayConfig.vnp_HashSecret;
        var vnpUrl = vnpayConfig.vnp_Url;
        var returnUrl = vnpayConfig.vnp_ReturnUrl;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const createDate = `${year}${month}${day}${hours}${minutes}${seconds}`;

        var orderId = `${hours}${minutes}${seconds}`;
        var amount = 0;
        for (p of information.products) {
            amount += parseInt(p.price) * parseInt(p.quantity);
        }
        var orderInfo = `Customer ${information.userId} has transferred money into this account. Email ${information.customerDetail.email}`;
        var locale = "vn";
        var currCode = "VND";
        var vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;

        vnp_Params = sortObject(vnp_Params);

        var querystring = require("qs");
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        return vnpUrl;
    };
    (this.stripeCheckout = async (products, customerDetail) => {
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
            customer_email: customerDetail.email,
            mode: "payment",
            success_url: stripeConfig.success_url,
        });
        return session.url;
    }),
        (this.upsertCart = async (productId, userId, quantity) => {
            let result = await cart.upsert(
                { quantity, productId, userId },
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
            let inCartProduct = await cart.findAll({
                where: { userId, billing: null },

                include: [
                    {
                        model: product,
                        include: image,
                    },
                ],
            });
            let orderedProduct = await cart.findAll({
                where: {
                    userId,
                    billing: {
                        [Op.ne]: null,
                    },
                },

                include: [
                    {
                        model: product,
                        include: image,
                    },
                ],
            });
            let products = [...inCartProduct,...orderedProduct]
            for (let cart of products) {
                cart.dataValues.product.dataValues.images =
                    await getImageFromFirebase(
                        cart.product.dataValues.images[0].link
                    );
            }
            return {
                inCart: inCartProduct,
                ordered:orderedProduct
            };
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
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}
