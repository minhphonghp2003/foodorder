const { Client } = require("@elastic/elasticsearch");
const client = new Client({
    cloud: {
        id: "foodhub:dXMtZWFzdC0yLmF3cy5lbGFzdGljLWNsb3VkLmNvbTo0NDMkNDIzMTdmNDYyYWQwNDE0NTgzMDg4NDY0NDk2NzI1ZWUkN2I0NjU2MDdmNWIyNDY2ZGI1M2QyNzQ4MGI2NzIzZDU=",
    },
    auth: {
        username: "elastic",
        password: "JRPvS5KLQ19jEEQymMGbFHTo",
    },
});
async function run() {
    // Let's start by indexing some data
    await client.index({
        index: "game-of-thrones",
        document: {
            character: "Ned Stark",
            quote: "Winter is coming.",
        },
    });

    await client.index({
        index: "game-of-thrones",
        document: {
            character: "Daenerys Targaryen",
            quote: "I am the blood of the dragon.",
        },
    });

    await client.index({
        index: "game-of-thrones",
        // here we are forcing an index refresh,
        // otherwise we will not get any result
        // in the consequent search
        refresh: true,
        document: {
            character: "Tyrion Lannister",
            quote: "A mind needs books like a sword needs a whetstone.",
        },
    });
    const result = await client.search({
        index: 'game-of-thrones',
        query: {
          match: {
            quote: 'winter'
          }
        }
      })
    
      console.log(result.hits.hits)
}
run()