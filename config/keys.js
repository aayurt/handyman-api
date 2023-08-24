// Rename to keys.js
require("dotenv").config();
module.exports = {
  mongoURI:
    process.env.NODE_ENV === "production"
      ? process.env.DB_URL_PROD
      : process.env.DB_URL_DEV,
  dbName: "Handyman",
  jwtSecret: "lmaosomething",
};
