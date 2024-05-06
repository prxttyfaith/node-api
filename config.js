require('dotenv').config();

const config = {
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      connectTimeout: 60000,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
      dateStrings: true,
    },
    listPerPage: 10,
  };
  module.exports = config;