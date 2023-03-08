const jwtConf = require("../config/jwt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

module.exports = {
    signToken: async (payload) => {
        let privateKey = fs.readFileSync(
            path.join(jwtConf.keyFolder, "rsa.key")
        );
        let publicKey = fs.readFileSync(
            path.join(jwtConf.keyFolder, "rsa.pub.pem")
        );

        try {
            return jwt.sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "7d",
            });
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    verifyToken: async (token) => {
        let privateKey = fs.readFileSync(
            path.join(jwtConf.keyFolder, "rsa.key")
        );
        let publicKey = fs.readFileSync(
            path.join(jwtConf.keyFolder, "rsa.pub.pem")
        );

        try {
            return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        } catch (err) {
            throw new Error(err);
        }
    },
};
