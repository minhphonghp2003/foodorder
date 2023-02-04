require('dotenv').config()


module.exports = {
    port:process.env.PORT || 3000,
    cors:process.env.CORS,
    isAws:process.env.IS_AWS
}