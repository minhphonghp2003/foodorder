require('dotenv').config()

module.exports ={
    username:process.env.ELASTIC_USERNAME,
    password:process.env.ELASTIC_PASSWORD,
    cloudId:process.env.ELASTIC_CLOUD_ID,
    nodePassword:process.env.ELASTIC_NODE_PASSWORD,
    nodeUsername:process.env.ELASTIC_NODE_USERNAME,
    node:process.env.ELASTIC_NODE,
    nodeCA:process.env.ELASTIC_NODE_CA
}