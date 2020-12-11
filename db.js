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

const joinQuizTableQuery =
  "SELECT * FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId";

class DbService {
  static getDbServiceInstance() {
    if (!instance) instance = new DbService();
    return instance;
  }

  intFormatter(id) {
    const int = parseInt(id, 10);
    return int;
  }

  async getAllQuizzes() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM quiz;";

        connection.query(query, (err, result) => {
          if (err) return reject(result);
          resolve(err.message);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  async getQuizById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = `${joinQuizTableQuery} WHERE quiz.quizId = ?;`;

        connection.query(query, this.intFormatter(id), (err, result) => {
          if (err) return reject(err.message);
          resolve(result);
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
        // console.log(title);

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints],
          (err, result) => {
            if (err) return reject(err.message);
            resolve(result);
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async createQuizQuestion(quizId, question) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT into quiz_question (quizId, questionObject) values (?,?);";
        connection.query(query, [quizId, question], (err, result) => {
          if (err) reject(err.message);
          else {
            console.log("Questions created. quizQuestionId:", result.insertId);
            resolve(result);
          }
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  async updateQuizDetailsById(id, title, desc, fiqPoints, categoryId) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, fiqPoints = ?  WHERE quizId = ?";
        connection.query(
          query,
          [categoryId, title, desc, fiqPoints, this.intFormatter(id)],
          (err, result) => {
            if (err) return reject(err.message);
            resolve(result.affectedRows);
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async updateQuestionDetailsById(id, questionObject) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz_question SET questionObject = ? WHERE quizId = ?";

        connection.query(
          query,
          [questionObject, this.intFormatter(id)],
          (err, result) => {
            if (err) reject(err.message);
            else {
              console.log("Updated questions", result);
              resolve(result.affectedRows);
            }
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async deleteQuizById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM quiz WHERE quizId = ?";

        connection.query(query, [this.intFormatter(id)], (err, result) => {
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
