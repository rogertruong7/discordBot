require('dotenv').config();
const mysql = require('mysql2/promise');

mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS
}).then(() => console.log('Hello World')).catch(err => console.log(err));