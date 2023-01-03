const {
    user,
    pass_reset_email,
    customer_address,
    address,
} = require("../../../models");
const bcrypt = require("bcrypt");
const { signToken } = require("../../../library/jwt");
const saltRounds = 10;

exports.default = {
    createEmailForPasswordChange: async (email) => {
        let entry = await pass_reset_email.create(email);
        return entry;
    },
    getEmail: async (id) => {
        return await pass_reset_email.findOne({
            where: { id },
            attributes: ["email"],
        });
    },

    changePasswordBy: async (field, newPass) => {
        const hash = await bcrypt.hash(newPass, saltRounds);
        await user.update(
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
        let cus = await user.findOne({
            where: { username },
        });

        const hash = cus.password;
        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) {
            throw new Error("Account is not valid");
        }
        return cus;
    },

    createCustomer: async (userInfo) => {
        try {
            let { password } = userInfo;

            const hash = await bcrypt.hash(password, saltRounds);
            userInfo.password = hash;
            userInfo.role = "customer";
            let usr = await user.create(userInfo);

            usr.password = undefined;
            return usr;
        } catch (error) {
            throw new Error("Cannot create account");
        }
    },

    getProfile: async (id) => {
        let profile = await user.findOne({
            where: { id },
        });
        profile.password = undefined;
        return profile;
    },

    changeProfile: async (field, id) => {
        await user.update(field, { where: { id } });
        return;
    },

    getCustomerAddress: async (userId) => {
        let addr = await customer_address.findAll({
            where: { userId },
            include: "address",
        });
        return addr;
    },

    createCustomerAddress: async (userId, addressDetail) => {
        await customer_address.update(
            { default: 0 },
            { where: { default: 1, userId } }
        );
        let addr = await address.create(addressDetail);
        let addressId = addr.id;
        let cus_addr = await customer_address.create({
            addressId,
            userId,
            addressDetail,
        });
        return cus_addr;
    },

    changeDefaultAddress: async (userId, addressId) => {
        await customer_address.update(
            { default: 0 },
            { where: { default: 1, userId } }
        );
        await customer_address.update(
            { default: 1 },
            { where: { userId, addressId } }
        );
        return;
    },

    changeAddressDetail: async (id, addressDetail) => {
        await address.update(addressDetail, { where: { id } });
        return;
    },
};
