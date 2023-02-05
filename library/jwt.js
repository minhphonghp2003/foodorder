const jwtConf = require("../config/jwt");
const appConf = require("../config/app");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

let privateKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.key"));
let publicKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.pub.pem"));

module.exports = {
    signToken: async (payload) => {
        try {
            if (appConf.isAws) {
                privateKey = (
                    await s3
                        .getObject({
                            Bucket: "cyclic-bunny-pinafore-ap-southeast-2",
                            Key: "privRsa",
                        })
                        .promise()
                ).Body.toString();
            }

            return jwt.sign(
                payload,
                privateKey,
                { algorithm: "RS256",  expiresIn: "7d"  },
               
            );
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },

    verifyToken: async (token) => {
        try {
            if (appConf.isAws) {
                publicKey = (
                    await s3
                        .getObject({
                            Bucket: "cyclic-bunny-pinafore-ap-southeast-2",
                            Key: "pubRsa",
                        })
                        .promise()
                ).Body.toString();
            }
            return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        } catch (err) {
            throw new Error(err);
        }
    },
};
