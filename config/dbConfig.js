require('dotenv').config()

module.exports ={
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "restaurant",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.SQL_NAME,
    "password": process.env.SQL_PASSWORD,
    "database": process.env.SQL_NAME,
    "host": process.env.SQL_HOST,
    "dialect": "postgres"
  }
}
