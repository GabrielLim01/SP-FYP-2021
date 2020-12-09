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

  joinQuizTable() {
    const joinTableQuery =
      "SELECT * FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId INNER JOIN quiz_question_options ON quiz_question.quizQuestionId = quiz_question_options.quizQuestionId";
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

        connection.query(query, (err, results) => {
          if (err) reject(err.message);
          else resolve(results);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  async getQuizById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = `${this.joinQuizTable()} WHERE quiz.quizId = ?;`;
        console.log(query);

        connection.query(query, this.intFormatter(id), (err, results) => {
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
            if (err) reject(err.message);
            else resolve(result);
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async createQuizQuestion(quizId, questionTitle, questionDesc, optionObject) {
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

              var option = "";
              var optionDesc = "";
              var isCorrect = true;
              const secondQuery =
                "INSERT into quiz_question_options (quizId, quizQuestionId, optionTitle, optionDesc, correctAnswer) values (?,?,?,?,?);";

              Object.entries(optionObject).forEach(([key, value]) => {
                option = value.option;
                optionDesc = value.optionDesc;
                isCorrect = value.isCorrect;

                connection.query(
                  secondQuery,
                  [quizId, result.insertId, option, optionDesc, isCorrect],
                  (err, result) => {
                    if (!err) resolve(result);
                    else reject(err.message);
                  }
                );
              });
            } else console.log("error somewhere");
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }

  async updateDetailsById(id, title, desc, fiqPoints, categoryId) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, fiqPoints = ?  WHERE quizId = ?";

        connection.query(
          query,
          [categoryId, title, desc, fiqPoints, this.intFormatter(id)],
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
