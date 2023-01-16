const svc = require("./Service").default;
exports.default = {
    login: async (req, res, next) => {
        try {
            let credential = req.body;
            let user = await svc.getValidCustomer(credential);
            let token = svc.getLoginToken({
                id: user.id,
                role:user.role,
                username: user.username,
            });
            let id = user.id;
            return res.status(200).json({ token, id });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            let customerInfo = req.body;
            let user = await svc.createCustomer(customerInfo);
            let token = svc.getLoginToken({
                id: user.id,
                username: user.username,
            });
            let id = user.id;
            return res.status(200).json({ token, id });
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
    getEmail:async(req,res,next) =>{
        try {
           return res.status(200).json(await svc.getEmail(req.query.id) ) 
        } catch (error) {
           next(error) 
        }
    },

    changePassword: async (req, res, next) => {
        try {
            let { password } = req.body;
            delete req.body.password;
            let field = req.body;
            //    field: email/id
            await svc.changePasswordBy(field, password);
            return res.status(200).json("Done");
        } catch (error) {
            next(error);
        }
    },

    getProfile: async (req, res, next) => {
        try {
            let id = req.authData.id;
            let user = await svc.getProfile(id);
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    },

    changeProfile: async (req, res, next) => {
        try {
            let id = req.authData.id;
            let field = req.body;
            await svc.changeProfile(field, id);
            return res.status(200).json({isDone:true});
        } catch (error) {
            next(error);
        }
    },

    getCustomerAddress: async (req, res, next) => {
        try {
            let cid = req.authData.id;
            let address = await svc.getCustomerAddress(cid);
            return res.status(200).json(address);
        } catch (error) {
            next(error);
        }
    },

    createCustomerAddress: async(req,res,next) =>{
        try {
           let customerId = req.authData.id 
           let addressDetail = req.body
           let cus_addr = await svc.createCustomerAddress(customerId,addressDetail)
           return res.status(200).json(cus_addr)
        } catch (error) {
           next(error) 
        }
    },

    changeDefaultAddress: async(req,res,next) =>{
        try {
           let customerId = req.authData.id 
           let addressId = req.body.address
           await svc.changeDefaultAddress(customerId,addressId)
           return res.status(200).json("done")
        } catch (error) {
           next(error) 
        }
    },

    changeAddressDetail: async(req,res,next) =>{
        try {
            let {id} = req.body
            delete req.body.id 
            let addressDetail = req.body
            await svc.changeAddressDetail(id,addressDetail) 
            return res.status(200).json("DONE")
        } catch (error) {
            console.log(error);
           next(error) 
        }
    },

    deletaAddress:async(req,res,next)=>{
        try {
           let {id} = req.body
           let userId = req.authData.id 
           await svc.deleteAdderss(userId,id)
           return res.status(200).json("done")
        } catch (error) {
           next(error) 
        }
    }
};
