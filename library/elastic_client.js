const { Client } = require('@elastic/elasticsearch')
const config = require("../config/elastic")
const elasticCloudClient = new Client({
  cloud: { id: config.cloudId },
auth: {
        username: config.username,
        password: config.password,
    },
})

const elasticNodeClient = new  Client({
  node: config.node,
  auth: {
    username: config.nodeUsername,
    password: config.nodePassword
  },
  // tls: {
  //   ca: config.nodeCA,
  //   rejectUnauthorized: false
  // }
})

module.exports = { elasticCloudClient,  elasticNodeClient}