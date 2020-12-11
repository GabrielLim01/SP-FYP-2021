const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
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

  //Create category
  async createCategory(catName, catDesc) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO category (categoryName, categoryDesc) VALUES (?,?);";

        connection.query(query, [catName, catDesc], (err, result) => {
          if (err) {
            console.log(err.message);
            reject(err.message);
          }
          resolve(result);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }
  //Retrieve all categories
  async getAllCategories() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * from category;";

        connection.query(query, (err, result) => {
          if (err) reject(err.message);
          resolve(result);
        });
      });
    } catch (e) {
      throw e.message;
    }
  }
  //Update category
  async updateCategoryById(id, catName, catDesc) {
    try {
      return new Promise((resolve, reject) => {
        const query =
          "UPDATE category SET categoryName = ?, categoryDesc = ? WHERE categoryId = ?";

        connection.query(
          query,
          [catName, catDesc, this.intFormatter(id)],
          (err, result) => {
            if (err) reject(err.message);
            else {
              console.log("Updated category and details", result);
              resolve(result.affectedRows);
            }
          }
        );
      });
    } catch (e) {
      throw e.message;
    }
  }
  //Delete Category
  async deleteCategoryById(id) {
    try {
      return new Promise((resolve, reject) => {
        const query = "DELETE FROM category WHERE categoryId = ?";

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
