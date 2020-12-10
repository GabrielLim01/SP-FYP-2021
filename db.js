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

  joinQuizTableQuery() {
    const joinTableQuery =
      "SELECT * FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId";
    return joinTableQuery;
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
          if (!err) resolve(result);
          else reject(err.message);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  async getQuizById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = `${this.joinQuizTableQuery()} WHERE quiz.quizId = ?;`;

        connection.query(query, this.intFormatter(id), (err, result) => {
          if (!err) {
            resolve(result);
            console.log(result);
          } else {
            reject(err.message);
            console.log(err.message);
          }
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
            if (!err) resolve(result);
            else reject(err.message);
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
          if (!err) {
            console.log("Questions created. quizQuestionId:", result.insertId);
            resolve(result);
          } else reject(err.message);
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
            if (!err) {
              resolve(result.affectedRows);
            } else reject(err.message);
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
            if (!err) {
              console.log("Updated questions", result);
              resolve(result.affectedRows);
            } else reject(err.message);
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
