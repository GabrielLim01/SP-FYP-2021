const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { response } = require('express');
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
    console.log('Connection Successful!');
});

const joinQuizTableQuery = 'SELECT * FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId';

const retrieveQuizByCategoryIdQuery =
    'SELECT DISTINCT(quiz.quizId), quiz.quizName FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId';

const joinQuestTableQuery = 'SELECT * FROM quest INNER JOIN quest_scenario ON quest.insertId = quest_scenario.questId';

class DbService {
    static getDbServiceInstance() {
        if (!instance) instance = new DbService();
        return instance;
    }

    async getAllQuizzes() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM quiz;';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
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

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getQuizByCategoryId(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = `${retrieveQuizByCategoryIdQuery} WHERE quiz.categoryId = ?;`;

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async createQuiz(name, desc, category, points, time) {
        try {
            return new Promise((resolve, reject) => {
                const query =
                    'INSERT INTO quiz (categoryId, quizName, quizDesc, totalPoints, timePerQuestion) VALUES (?,?,?,?,?);';
                connection.query(query, [category, name, desc, points, time], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async createQuizQuestion(quizId, questionsObj) {
        const array = [];
        Object.keys(questionsObj).forEach(function (item) {
            console.log(JSON.stringify(questionsObj[item].options));
            array.push([
                quizId,
                questionsObj[item].questionTitle,
                questionsObj[item].questionDesc,
                questionsObj[item].fiqPoints,
                questionsObj[item].timeLimit,
                questionsObj[item].explanation,
                JSON.stringify(questionsObj[item].options),
            ]);
        });

        const query =
            'INSERT into quiz_question (quizId, questionTitle, questionDesc, fiqPoint, timeLimit, explanation, optionObject) values ?;';
        connection.query(query, [array], (err, result) => {
            if (err) return err.message;
            else {
                console.log('Question(s) created.');
                return result;
            }
        });
    }

    async updateQuizDetailsById(id, title, desc, categoryId) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ? WHERE quizId = ?';
                connection.query(query, [categoryId, title, desc, id], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuestionDetailsById(id, questionObject) {
        let quizQuestionId = questionObject.quizQuestionId;
        let questionTitle = questionObject.questionTitle;
        let questionDesc = questionObject.questionDesc;
        let options = JSON.stringify(questionObject.options);

        return new Promise((resolve, reject) => {
            const query =
                'UPDATE quiz_question SET questionTitle = ?, questionDesc = ?, optionObject = ? WHERE quizId = ? and quizQuestionId = ?;';

            connection.query(query, [questionTitle, questionDesc, options, id, quizQuestionId], (err, result) => {
                if (err) reject(err.message);
                else {
                    console.log(`Updated questions ${quizQuestionId}. ${result}`);
                    resolve(result.affectedRows);
                }
            });
        });
    }

    async deleteQuizById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM quiz WHERE quizId = ?';

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
                const query = 'INSERT INTO users (name, password) VALUES (?,?);';

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
                const query = 'SELECT * from users where name=?';

                connection.query(query, [username], (err, results) => {
                    // Case 1 - Reject promise if query fails
                    if (err) reject(`There are some errors with the query statement. ${err}`);

                    const jsonResults = JSON.parse(JSON.stringify(results));
                    const verify = bcrypt.compareSync(password, jsonResults[0].password);

                    // Case 2 - Reject promise if passwords do not match, otherwise resolve promise with the access token
                    if (!verify) {
                        reject('Passwords do not match!');
                    } else {
                        // Resolve promise with an access token string and send it back to the front-end
                        const accessToken = 'Congrats';
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
                const query = 'INSERT INTO category (categoryName, categoryDesc) VALUES (?,?);';

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
                const query = 'SELECT * from category;';

                connection.query(query, (err, result) => {
                    if (err) reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    // Retrieve a category by its name
    async getCategoryByName(name) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * from category WHERE categoryName = ?;';

                connection.query(query, name, (err, result) => {
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
                const query = 'UPDATE category SET categoryName = ?, categoryDesc = ? WHERE categoryId = ?';

                connection.query(query, [catName, catDesc, id], (err, result) => {
                    if (err) reject(err.message);
                    else {
                        console.log('Updated category and details', result);
                        resolve(result.affectedRows);
                    }
                });
            });
        } catch (e) {
            throw e.message;
        }
    }
    //Delete Category
    async deleteCategoryById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM category WHERE categoryId = ?';

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getAllQuests() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM quest;';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    //Create quest
    async createQuest(title, description, categoryId, fiqPoints) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO quest (title, description, categoryId, fiqPoint) VALUES (?, ?, ?, ?);';
            connection.query(query, [title, description, categoryId, fiqPoints], (err, result) => {
                if (err) {
                    console.log(err.message);
                    reject(err.message);
                }
                resolve(result);
            });
        });
    }
    //Create quest scenarios
    async createQuestScenario(questId, obj) {
        const array = [];
        Object.keys(obj).forEach(function (item) {
            array.push([questId, obj[item].scenario, JSON.stringify(obj[item].options)]);
        });

        const query = 'INSERT into quest_scenario (questId, sub_questTitle, options) values ?;';
        connection.query(query, [array], (err, result) => {
            if (err) return err.message;
            else {
                console.log('Scenario(s) created.');
                return result;
            }
        });
    }

    async getQuestById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = `${joinQuestTableQuery} WHERE quest.insertId = ?;`;

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuestDetailsById(id, title, desc, objective, categoryId, fiqPoint) {
        return new Promise((resolve, reject) => {
            const query =
                'UPDATE quest SET title = ?, description = ?, objective = ?, categoryId = ?, fiqPoint = ?  WHERE insertId = ?;';
            connection.query(query, [title, desc, objective, categoryId, fiqPoint, id], (err, result) => {
                if (err) return reject(err.message);
                resolve(result.affectedRows);
            });
        });
    }

    async updateScenarioDetailsById(id, scenarioId, sub_questTitle, sub_questDesc, options) {
        return new Promise((resolve, reject) => {
            const query =
                'UPDATE quest_scenario SET sub_questTitle = ?, sub_questDesc= ?, options = ? WHERE questId = ? and scenarioId = ?;';
            console.log(query);
            connection.query(query, [sub_questTitle, sub_questDesc, options, id, scenarioId], (err, result) => {
                if (err) reject(err.message);
                else {
                    console.log('Updated scenario(s)', result);
                    resolve(result.affectedRows);
                }
            });
        });
    }

    async deleteQuestById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM quest WHERE insertId = ?';

                connection.query(query, [id], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateProfileById(id, name, hobbyId, ageGroupId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET name = ?, hobbyId = ?, ageGroupId = ? WHERE insertId = ?';
            connection.query(query, [name, hobbyId, ageGroupId, id], (err, result) => {
                if (err) return reject(err.message);
                resolve(result.affectedRows);
            });
        });
    }
}

module.exports = DbService;
