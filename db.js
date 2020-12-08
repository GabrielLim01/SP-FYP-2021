const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { response } = require("express");
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

  // NOT IN USE
  // async getAllUsers() {
  //   try {
  //     const response = await new Promise((resolve, reject) => {
  //       const query = "SELECT * FROM users;";

  //       connection.query(query, (err, results) => {
  //         if (err) reject(new Error(err.message));
  //         resolve(results);
  //       });
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // NOT IN USE
  // async get(name) {
  //   try {
  //     const response = await new Promise((resolve, reject) => {
  //       const query = "SELECT * FROM users WHERE name=?;";

  //       connection.query(query, [name], (err, results) => {
  //         if (err) reject(new Error(err.message));
  //         resolve(results);
  //       });
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // POST /user
  async insertNewUser(name, pwd) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO users (name, password) VALUES (?,?);";

        connection.query(query, [name, pwd], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
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

  // POST /authenticate
  async authenticate(username, password) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * from users where name=?";

        connection.query(query, [username], (err, results) => {

          // Case 1 - Reject promise if query fails
          if (err) reject(`There are some errors with the query statement. ${err}`);

          const JSONresults = JSON.parse(JSON.stringify(results));
          const verify = bcrypt.compareSync(password, JSONresults[0].password);

          // Case 2 - Reject promise if passwords do not match, otherwise resolve promise with the access token
          if (!verify) {
            reject("Passwords do not match!")
          }
          else {
            const accessToken = "Congrats";
            resolve(accessToken);
          }
        });
      });

      return response;

    } catch (error) {
      // Catch rejected promises (errors)
      console.log(error);

      // If a promise is rejected above, logic gets passed to this catch block, so a return error statement 
      // is needed in order to pass the error string to server.js
      // This might not be the best practice, but without further research, not sure if there is a better way to pass error message info
      return error;
    }
  }
}

module.exports = DbService;
