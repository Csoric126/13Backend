const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
    database : process.env. DB_DATABASE
})

