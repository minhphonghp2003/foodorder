const jwtConf = require("../config/jwt")
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const privateKey = fs.readFileSync(path.join( jwtConf.keyFolder, 'rsa.key'), 'utf8')
const publicKey = fs.readFileSync(path.join( jwtConf.keyFolder, 'rsa.pub.pem'), 'utf8')


module.exports = {

    signToken: (payload) => {
        try {
            return jwt.sign(payload, privateKey, { algorithm: 'RS256'});
        } catch (err) {
            
            throw new Error(err)
        }
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        } catch (err) {
            
            throw new Error(err)
        }
    }

}