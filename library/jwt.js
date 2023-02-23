const jwtConf = require("../config/jwt");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

let privateKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.key"));
let publicKey = fs.readFileSync(path.join(jwtConf.keyFolder, "rsa.pub.pem"));

module.exports = {
    signToken: async (payload) => {
        try {
            
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
           
            return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        } catch (err) {
            throw new Error(err);
        }
    },
};
