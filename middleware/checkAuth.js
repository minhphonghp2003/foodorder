const {verifyToken} = require("../library/jwt")

module.exports={
    checkAuth:(req,res,next)=>{
        try {
            const token = req.headers.token
            const data = verifyToken(token) 
            req.authData = data
            next()
        } catch (error) {
            next(error)
        }
    }
}