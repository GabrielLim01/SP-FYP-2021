const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

// Create Database Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.MySQL_DB,
  port: 3306,
});

// To Connect
connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connection Successful!");
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllUsers() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async insertNewUser(name, pwd) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO users (name, password, insertId) VALUES (?,?,0);";

        connection.query(query, [name, pwd], (err, result) => {
          if (err) reject(new Error(err.message));
        });
      });
      return {
        name: name,
        password: pwd,
        insertId: insertId,
      };
    } catch (error) {
      console.log(error.message);
    }
  }

  async get(name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE name=?;";

        connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
