require('dotenv').config()


module.exports = {
    port:process.env.LISTEN_PORT || 3000,
    cors:process.env.CORS,
    
}