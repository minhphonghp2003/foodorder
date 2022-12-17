const svc = require("./Service").default;
exports.default = {
    login: async (req, res, next) => {
        try {
            let credential = req.body;
            let customer = await svc.getValidCustomer(credential);
            let token = svc.getLoginToken({
                id: customer.id,
                username: customer.username,
            });
            let cid = customer.id;
            return res.status(200).json({ token, cid });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            let customerInfo = req.body;
            let customer = await svc.createCustomer(customerInfo);
            let token = svc.getLoginToken({
                id: customer.id,
                username: customer.username,
            });
            let cid = customer.id;
            return res.status(200).json({ token, cid });
        } catch (error) {
            next(error);
        }
    },

    createEmailForChange: async (req, res, next) => {
        try {
            let entry = await svc.createEmailForPasswordChange(req.body);
            return res.status(200).json(entry.id);
        } catch (error) {
            next(error);
        }
    },

    changePassword: async(req,res,next) =>{
        try {
           let {password} = req.body 
           delete req.body.password
           let field = req.body
           console.log(password,field);
           await svc.changePasswordBy(field,password)
           return res.status(200).json("Done")
        } catch (error) {
           next(error) 
        }
    }
};
