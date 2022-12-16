const svc = require("./Service").default;
exports.default = {
    login: async (req, res, next) => {
        try {
            let credential = req.body;
            let customer = await svc.checkValidCustomer(credential);
            let token = svc.getLoginToken({id:customer.id, username:customer.username});
            let cid = customer.id
            return res.status(200).json({token,cid});
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            let customerInfo = req.body;
            let customer = await svc.createCustomer(customerInfo);
            let token = svc.getLoginToken({id:customer.id, username:customer.username});
            let cid = customer.id
            return res.status(200).json({token,cid});
        } catch (error) {
            next(error);
        }
    },
};
