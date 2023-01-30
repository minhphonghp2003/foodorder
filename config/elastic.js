require('dotenv').config()

module.exports ={
    username:process.env.ELASTIC_USERNAME,
    password:process.env.ELASTIC_PASSWORD,
    cloudId:process.env.ELASTIC_CLOUD_ID,
}