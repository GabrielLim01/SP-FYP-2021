const mysql = require('mysql');

// Create Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'financial_literacy'
});

// To Connect
db.connect((err) => { 
    if (err) { 
        throw err;
    }
    console.log('Connection Successful!');
});

module.exports = db;