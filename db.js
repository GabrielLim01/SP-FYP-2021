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

  async createQuiz(title, desc, totalPoints, categoryId) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO quiz (categoryId, quizName, quizDesc, totalPoints) VALUES (?,?,?,?);";
        // console.log(title);

        connection.query(
          query,
          [categoryId, title, desc, totalPoints],
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

  async createQuizQuestion(quizId, questionsObj) {
    const array = [];
    Object.keys(questionsObj).forEach(function (item) {
      array.push([quizId, JSON.stringify(questionsObj[item])]);
    });

    const query =
      "INSERT into quiz_question (quizId, questionObject) values ?;";
    connection.query(query, [array], (err, result) => {
      if (err) return err.message;
      else {
        console.log("Question(s) created.");
        return result;
      }
    });
  }

  async updateQuizDetailsById(id, title, desc, totalPoints, categoryId) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, totalPoints = ?  WHERE quizId = ?";
        connection.query(
          query,
          [categoryId, title, desc, totalPoints, id],
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

  async updateQuestionDetailsById(id, questionsObject) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE quiz_question SET questionObject = ? WHERE quizId = ?";

      connection.query(query, [questionsObject, id], (err, result) => {
        if (err) reject(err.message);
        else {
          if (result.affectedRows === 0) {
            console.log(`Updated 0 rows.`);
          }
          resolve(result.affectedRows);
        }
      });
    });
  }

  async deleteQuizById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM quiz WHERE quizId = ?";

        connection.query(query, id, (err, result) => {
          if (err) reject(err.message);
          else {
            if (result.affectedRows === 0) {
              console.log(`Deleted 0 rows.`);
            }
            resolve(result.affectedRows);
          }
        });
      });
    } catch (e) {
      throw e.message;
    }
  }

  // POST /register
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
          if (err)
            reject(`There are some errors with the query statement. ${err}`);

          const jsonResults = JSON.parse(JSON.stringify(results));
          const verify = bcrypt.compareSync(password, jsonResults[0].password);

          // Case 2 - Reject promise if passwords do not match, otherwise resolve promise with the access token
          if (!verify) {
            reject("Passwords do not match!");
          } else {
            // Resolve promise with an access token string and send it back to the front-end
            const accessToken = "Congrats";
            resolve(accessToken);
          }
        });
      });

      return response;
    } catch (error) {
      // Catch rejected promises (errors)

      // If a promise is rejected above, logic gets passed to this catch block, so a return error statement
      // is needed in order to pass the error string to server.js
      // This might not be the best practice, but without further research, not sure if there is a better way to pass error message info
      return error;
    }
  }
}

module.exports = DbService;
