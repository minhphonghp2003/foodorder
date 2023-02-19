const svc = require("./Service");
const axios = require('axios');

exports.default = {
    vnpaySuccess:async(req,res,next) =>{
        let description = req.query.vnp_OrderInfo.split(" ");
        let email = description[description.length-1]
        axios.post('https://eoa80jvueiqxcfj.m.pipedream.net', {
            email ,
            amount:req.query.vnp_Amount
          })
        //   TODO: add order
    res.status(200).json("Done");
    },
    newPayment: async (req, res, next) => {
        try {
            let {method } = req.body;
            if (method == "offline") {
                return res.status(200).json("Done payment");
            } else if (method == "stripe") {
                let {products,customerDetails} = req.body
                let url = await svc.stripeCheckout(products, customerDetails);
                return res.status(200).json(url);
            } else if (method == "vnpay") {
                var ipAddr =
                    req.headers["x-forwarded-for"] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress||
                    "127.0.0.1";
                let information = {ipAddr,...req.body}
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
