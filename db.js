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
    if (!instance) instance = new DbService();
    return instance;
  }

  async getAllQuizzes() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM quiz;";

        connection.query(query, (err, results) => {
          if (err) reject(err.message);
          else resolve(results);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  async createQuiz(title, desc, fiqPoints, categoryId) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO quiz (categoryId, quizName, quizDesc, fiqPoints) VALUES (?,?,?,?);";

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints],
          (err, result) => {
            // Checks the status of promise
            if (err) reject(err.message);
            else resolve(result);
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async createQuizQuestion(quizId, questionTitle, questionDesc, optionArray) {
    try {
      console.log(typeof optionArray);
      return new Promise((resolve, reject) => {
        const query =
          "INSERT into quiz_question (quizId, quizQuestion, quizQuestionDesc) values (?,?,?);";
        connection.query(
          query,
          [quizId, questionTitle, questionDesc],
          (err, result) => {
            if (!err) {
              console.log(
                `questions for quiz: ${quizId} are created. ${result.insertId}`
              );
              resolve(result);
              const secondQuery = "";
            } else console.log("error somewhere");
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async createQuizOptions() {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT into quiz_question (quizId, quizQuestion, quizQuestionDesc) values (?,?,?);";
        connection.query(
          query,
          [quizId, questionTitle, questionDesc],
          (err, result) => {
            if (!err) {
              resolve(result);
            } else {
              console.log("error somewhere");
              reject(err);
            }
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async updateDetailsById(id, title, desc, fiqPoints, categoryId) {
    try {
      id = parseInt(id, 10);
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, fiqPoints = ?  WHERE quizId = ?";

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints, id],
          (err, result) => {
            if (err) reject(err.message);
            resolve(result.affectedRows);
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async deleteQuizById(id) {
    try {
      id = parseInt(id, 10);
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM quiz WHERE quizId = ?";

        connection.query(query, [id], (err, result) => {
          if (err) reject(err.message);
          resolve(result.affectedRows);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }
}

module.exports = DbService;
