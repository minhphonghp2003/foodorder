const svc = require("./Service");
const axios = require("axios");
const appConf = require("../../../config/app");
const { updateBilling } = require("./Service");

exports.default = {
    stripePaymentSuccess: async (req, res, next) => {
        let productIds = JSON.parse(req.query.productIds);
        let  user  = JSON.parse(req.query.customer)
        for (let pid of productIds) {
            await updateBilling("paid", user.userId, pid.id);
        }
        return res.redirect(appConf.webUrl);
    },

    vnpayPaymentSuccess: async (req, res, next) => {
        let description = JSON.parse(req.query.vnp_OrderInfo);
        let email = description.CustomerEmail
        if (req.query.vnp_ResponseCode == 0) {
            axios.post("https://eoa80jvueiqxcfj.m.pipedream.net", {
                email,
                amount: req.query.vnp_Amount,
            });
            for (pid of description.Products) {
                await updateBilling("paid",req.params.userId,pid)
            }
        }

        res.redirect(appConf.webUrl);
    },
    newPayment: async (req, res, next) => {
        let userId = req.authData.id;
        let { method, products, customerDetail } = req.body;
        customerDetail.userId = userId;
        try {
            if (method == "offline") {
                for (let p of products) {
                    await updateBilling("unpaid", userId, p.id);
                }
                return res.status(200).json("Done payment");
            } else if (method == "stripe") {
                let url = await svc.stripeCheckout(products, customerDetail);
                return res.status(200).json(url);
            } else if (method == "vnpay") {
                var ipAddr =
                    req.headers["x-forwarded-for"] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress ||
                    "127.0.0.1";
                let information = { ipAddr, products, customerDetail };
                let url = await svc.vnpayCheckout(information);
                return res.status(200).json(url);
            }
            return res.status(500).json("error");
        } catch (error) {
            next(error);
        }
    },
    upsertCart: async (req, res, next) => {
        try {
            let userId = req.authData.id;
            let { productId, quanity: quantity } = req.body;
            let result = await svc.upsertCart(productId, userId, quantity);
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

    getCart: async (req, res, next) => {
        try {
            let userId = req.authData.id;
            let productInCart = await svc.getCart(userId);
            return res.status(200).json(productInCart);
        } catch (error) {
            next(error);
        }
    },
};
