const {
    user,
    pass_reset_email,
    customer_address,
    address,
    oauthauthen,
} = require("../../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { generateFromEmail, generateUsername } = require("unique-username-generator");
const { signToken } = require("../../../library/jwt");
const saltRounds = 10;

module.exports = new (function () {
    (this.oauthLogin = async (profile) => {
        // profile: {id,name.familyName, name.givenName,email}
        let oauthedUser = await oauthauthen.findOne({
            where: {
                third_party_id: profile.email + profile.id,
            },
        });
        if (!oauthedUser) {
            function userInfo() {
                (this.email = profile.email),
                    (this.username = profile.email? generateFromEmail(profile.email, 4):generateUsername(profile.name.givenName,4)),
                    (this.password = uuidv4()),
                    (this.first_name = profile.name.familyName),
                    (this.last_name = profile.name.givenName);
            }

            let userProfile = await this.createCustomer(new userInfo());
            await oauthauthen.create({
                third_party_id: profile.email + profile.id,
                userId: userProfile.id,
            });
            return userProfile;
        }
        return await user.findOne({
            where: {
                id: oauthedUser.userId,
            },
        });
    }),
        (this.createEmailForPasswordChange = async (email) => {
            let entry = await pass_reset_email.create(email);
            return entry;
        }),
        (this.getEmail = async (id) => {
            return await pass_reset_email.findOne({
                where: { id },
                attributes: ["email"],
            });
        }),
        (this.changePasswordBy = async (field, newPass) => {
            const hash = await bcrypt.hash(newPass, saltRounds);
            await user.update(
                { password: hash },
                {
                    where: field,
                }
            );
            return;
        }),
        (this.getLoginToken = async(payload) => {
            let token =await signToken(payload);
            return token;
        }),
        (this.getValidCustomer = async (credential) => {
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
        }),
        (this.createCustomer = async (userInfo) => {
            try {
                let { password } = userInfo;

                const hash = await bcrypt.hash(password, saltRounds);
                userInfo.password = hash;
                userInfo.role = "customer";
                let usr = await user.create(userInfo);

                usr.password = undefined;
                return usr;
            } catch (error) {
                console.log(error);
                throw new Error("Cannot create account");
            }
        }),
        (this.getProfile = async (id) => {
            let profile = await user.findOne({
                where: { id },
            });
            profile.password = undefined;
            return profile;
        }),
        (this.changeProfile = async (field, id) => {
            await user.update(field, { where: { id } });
            return;
        }),
        (this.getCustomerAddress = async (userId) => {
            let addr = await customer_address.findAll({
                where: { userId },
                include: "address",
            });
            return addr;
        }),
        (this.createCustomerAddress = async (userId, addressDetail) => {
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
        }),
        (this.changeDefaultAddress = async (userId, addressId) => {
            await customer_address.update(
                { default: 0 },
                { where: { default: 1, userId } }
            );
            await customer_address.update(
                { default: 1 },
                { where: { userId, addressId } }
            );
            return;
        }),
        (this.changeAddressDetail = async (id, addressDetail) => {
            await address.update(addressDetail, { where: { id } });
            return;
        }),
        (this.deleteAdderss = async (userId, addressId) => {
            await customer_address.destroy({
                where: {
                    userId,
                    addressId,
                },
            });
            await address.destroy({
                where: {
                    id: addressId,
                },
            });
            return;
        });
})();

// module.exports =new Service()
