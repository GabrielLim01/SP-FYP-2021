const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

// Create Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MySQL_DB
});

// To Connect
db.connect((err) => { 
    if (err) { 
        throw err;
    }
    console.log('Connection Successful!');
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
}

module.exports = DbService;
