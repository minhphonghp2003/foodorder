const { customer } = require("../../../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../../../library/jwt");
const saltRounds = 10;

exports.default = {
    getLoginToken: (payload) => {
        let token = signToken(payload);
        return token;
    },

    checkValidCustomer: async (credential) => {
        let { username, password } = credential;
        let cus = await customer.findOne({
            where: { username },
        });

        const hash = cus.password;
        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) {
            throw new Error("Account is not valid");
        }
        return cus;
    },

    createCustomer: async (customerInfo) => {
        try {
            let { password } = customerInfo;
    
            const hash = await bcrypt.hash(password, saltRounds);
            customerInfo.password = hash;
            let cus = await customer.create(customerInfo);
    
            cus.password = undefined;
            return cus;
            
        } catch (error) {
           throw new Error("Cannot create account") 
        }
    },
};
