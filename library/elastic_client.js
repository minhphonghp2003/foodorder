const { Client } = require('@elastic/elasticsearch')
const config = require("../config/elastic")


const elasticNodeClient = new  Client({
  node: config.node,
  auth: {
    username: config.nodeUsername,
    password: config.nodePassword
  },
  //
})

module.exports = {   elasticNodeClient}