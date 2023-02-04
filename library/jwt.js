const jwtConf = require("../config/jwt");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

module.exports = {
    signToken: async (payload) => {
        try {
            let privateKey = (
                await s3
                    .getObject({
                        Bucket: "cyclic-bunny-pinafore-ap-southeast-2",
                        Key: "privRsa",
                    })
                    .promise()
            ).Body.toString();
            return jwt.sign(
                payload,
                privateKey,
                { algorithm: "RS256" },
                { expiresIn: "1h" }
            );
        } catch (err) {
            throw new Error(err);
        }
    },

    verifyToken: async (token) => {
        try {
            let publicKey = (
                await s3
                    .getObject({
                        Bucket: "cyclic-bunny-pinafore-ap-southeast-2",
                        Key: "pubRsa",
                    })
                    .promise()
            ).Body.toString();
            return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        } catch (err) {
            throw new Error(err);
        }
    },
};
