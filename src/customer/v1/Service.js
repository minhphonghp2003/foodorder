const {
    customer,
    pass_reset_email,
    customer_address,
    address,
} = require("../../../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../../../library/jwt");
const { where } = require("sequelize");
const saltRounds = 10;

exports.default = {
    createEmailForPasswordChange: async (email) => {
        let entry = await pass_reset_email.create(email);
        return entry;
    },

    changePasswordBy: async (field, newPass) => {
        const hash = await bcrypt.hash(newPass, saltRounds);
        await customer.update(
            { password: hash },
            {
                where: field,
            }
        );
        return;
    },

    getLoginToken: (payload) => {
        let token = signToken(payload);
        return token;
    },

    getValidCustomer: async (credential) => {
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
            throw new Error("Cannot create account");
        }
    },

    getProfile: async (id) => {
        let profile = await customer.findOne({
            where: { id },
        });
        profile.password = undefined;
        return profile;
    },

    changeProfile: async (field, id) => {
        await customer.update(field, { where: { id } });
        return;
    },

    getCustomerAddress: async (customerId) => {
        let addr = await customer_address.findAll({
            where: { customerId },
            include: "address",
        });
        return addr;
    },

    createCustomerAddress: async (customerId, addressDetail) => {
        await customer_address.update(
            { default: 0 },
            { where: { default: 1, customerId } }
        );
        let addr = await address.create(addressDetail);
        let addressId = addr.id;
        let cus_addr = await customer_address.create({
            addressId,
            customerId,
            addressDetail,
        });
        return cus_addr;
    },

    changeDefaultAddress: async (customerId, addressId) => {
        await customer_address.update(
            { default: 0 },
            { where: { default: 1, customerId } }
        );
        await customer_address.update(
            { default: 1 },
            { where: { customerId, addressId } }
        );
        return;
    },

    changeAddressDetail: async (id, addressDetail) => {
        await address.update(addressDetail, { where: { id } });
        return 
    },
};
