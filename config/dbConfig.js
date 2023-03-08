require("dotenv").config();

module.exports = {
    development: {
        username: "postgres",
        password: "postgres",
        database: "restaurant",
        host: "127.0.0.1",
        dialect: "postgres",
    },
    test: {
        username: "fqurptom",
        password: "o4Ypcuq1P8pOPhtNOsE8yesGiC9ocic6",
        database: "fqurptom",
        host: process.env.SQL_HOST,
        dialect: "postgres",
    },
    production: {
        username: process.env.SQL_NAME,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_NAME,
        host: process.env.SQL_HOST,
        dialect: "postgres",
    },
};
