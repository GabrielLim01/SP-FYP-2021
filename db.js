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

  async getAllQuizzes() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM quiz;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createQuiz(title, desc, fiqPoints, categoryId) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO quiz (categoryId, quizId, quizName, quizDesc, fiqPoints) VALUES (?,0,?,?,?);";

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return {
        insertId: insertId,
        categoryid: categoryId,
        name: title,
        description: desc,
        FIQ_Points: fiqPoints,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateDetailsById(id, title, desc, fiqPoints, categoryId) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, fiqPoints = ?  WHERE quizId = ?";

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.affectedRows);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteQuizById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM quiz WHERE quizId = ?";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = DbService;
