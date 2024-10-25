const { Pool } = require("pg");
// require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  user: "yevk",
  database: "top_users",
  password: "5656565656mM.",
  port: 5432,
});

module.exports = pool;
