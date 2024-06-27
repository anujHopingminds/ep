const env = require('dotenv');
env.config();

module.exports = {
  HOST: process.env.PG_HOST_NAME,
  PORT: process.env.PG_PORT,
  USER: process.env.PG_USERNAME,
  PASSWORD: process.env.PG_PASSWORD,
  DB: process.env.PG_DATABSE,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
