const { Client } = require('@elastic/elasticsearch')
const config = require("../config/elastic")
const client = new Client({
  cloud: { id: config.cloudId },
auth: {
        username: config.username,
        password: config.password,
    },
})

module.exports = client