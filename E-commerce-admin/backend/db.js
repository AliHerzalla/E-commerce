const mysql = require('mysql2');
require("dotenv").config();

const dbConfig = {
    host: process.env.MYSQL_DATABASE_HOST,
    user: process.env.MYSQL_DATABASE_USER,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    port: process.env.MYSQL_DATABASE_PORT,
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;