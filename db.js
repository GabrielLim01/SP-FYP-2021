const { response } = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: 'fyp-database.c01lfveairsf.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'financial_literacy',
});

connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connection Successful!');
});

const joinQuizTableQuery = 'SELECT * FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId';

const retrieveQuizByCategoryIdQuery =
    'SELECT DISTINCT(quiz.quizId), quiz.quizName FROM quiz INNER JOIN quiz_question ON quiz.quizId = quiz_question.quizId';

const retrieveQuestByCategoryIdQuery =
    'SELECT DISTINCT(quest.questId), quest.title FROM quest INNER JOIN quest_scenario ON quest.questId = quest_scenario.questId';

const joinQuestTableQuery = 'SELECT * FROM quest INNER JOIN quest_scenario ON quest.questId = quest_scenario.questId';

class DbService {
    static getDbServiceInstance() {
        if (!instance) instance = new DbService();
        return instance;
    }

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
            return error.message;
        }
    }

    async insertNewUserwRole(name, pwd, roleId) {
        try {
            const insertId = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO users (name, password, accountType) VALUES (?,?,?);';

                connection.query(query, [name, pwd, roleId], (err, result) => {
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
            return error.message;
        }
    }

    async authenticate(username, password) {
        const response = await new Promise((resolve, reject) => {
            const query = 'SELECT * from users where name=?;';

            connection.query(query, [username], (err, results) => {
                if (err) reject(`There are some errors with the query statement. ${err}`);
                else {
                    if (results.length <= 0) {
                        reject('No records found!');
                    } else {
                        const jsonResults = JSON.parse(JSON.stringify(results));
                        const verify = bcrypt.compareSync(password, jsonResults[0].password);

                        if (!verify) {
                            reject('Passwords do not match!');
                        } else {
                            const data = {
                                user: jsonResults,
                                token: 'Congrats',
                            };
                            resolve(data);
                        }
                    }
                }
            });
        });

        return response;
    }

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

    async getCategoryDetailsById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from category WHERE categoryId = ?;';

            connection.query(query, id, (err, result) => {
                if (err) reject(err.message);
                else {
                    console.log(result);
                    resolve(result);
                }
            });
        });
    }

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

    async createQuiz(name, desc, category, difficulty, points, time) {
        try {
            return new Promise((resolve, reject) => {
                let createdAt = new Date();
                const query =
                    'INSERT INTO quiz (categoryId, quizName, quizDesc, pointsPerQuestion, timePerQuestion, difficulty, createdAt) VALUES (?,?,?,?,?,?,?);';
                connection.query(query, [category, name, desc, points, time, difficulty, createdAt], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async createQuizQuestion(quizId, question) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'INSERT into quiz_question (quizId, question) values (?,?);';
                connection.query(query, [quizId, question], (err, result) => {
                    if (err) reject(err.message);
                    else {
                        console.log('Questions created. quizQuestionId:', result.insertId);
                        resolve(result);
                    }
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuizDetailsById(id, title, desc, categoryId, points, time, difficulty) {
        try {
            return new Promise((resolve, reject) => {
                const query =
                    'UPDATE quiz SET categoryId= ?, quizName = ?, quizDesc = ?, pointsPerQuestion = ?, timePerQuestion = ?, difficulty = ? WHERE quizId = ?';
                connection.query(query, [categoryId, title, desc, points, time, difficulty, id], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuestionDetailsById(question) {
        let quizQuestionId = question.quizQuestionId;

        let quizQuestion = JSON.stringify({ question: question.question });

        return new Promise((resolve, reject) => {
            const query = 'UPDATE quiz_question SET question = ? WHERE quizQuestionId = ?;';

            connection.query(query, [quizQuestion, quizQuestionId], (err, result) => {
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
                    }
                    resolve();
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

    async getQuestById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = `${joinQuestTableQuery} WHERE quest.questId = ?;`;

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getQuestByCategory(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = `${retrieveQuestByCategoryIdQuery} WHERE quest.categoryId = ?;`;

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async createQuest(category, title, desc, conc, characterName, characterMood, points) {
        try {
            return new Promise((resolve, reject) => {
                let createdAt = new Date();
                const query =
                    'INSERT INTO quest (categoryId, title, description, conclusion, characterName, characterMood, points, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
                connection.query(
                    query,
                    [category, title, desc, conc, characterName, characterMood, points, createdAt],
                    (err, result) => {
                        if (err) {
                            console.log(err.message);
                            reject(err.message);
                        }
                        resolve(result);
                    },
                );
            });
        } catch (e) {
            throw e.message;
        }
    }

    async createQuestScenario(questId, scenario) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'INSERT into quest_scenario (questId, scenario) values (?,?);';
                connection.query(query, [questId, scenario], (err, result) => {
                    if (err) reject(err.message);
                    else {
                        console.log('Scenario created. questScenarioId:', result.insertId);
                        resolve(result);
                    }
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuest(id, category, title, desc, conc, characterName, characterMood, points) {
        try {
            return new Promise((resolve, reject) => {
                const query =
                    'UPDATE quest SET categoryId = ?, title = ?, description = ?, conclusion = ?, characterName = ?, characterMood = ?, points = ? WHERE questId = ?';
                connection.query(
                    query,
                    [category, title, desc, conc, characterName, characterMood, points, id],
                    (err, result) => {
                        if (err) return reject(err.message);
                        resolve(result.affectedRows);
                    },
                );
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateQuestScenario(scenario) {
        console.log(scenario);
        let questScenarioId = scenario.scenarioId;

        let questScenario = JSON.stringify(scenario.scenario);

        return new Promise((resolve, reject) => {
            const query = 'UPDATE quest_scenario SET scenario = ? WHERE questScenarioId = ?;';

            connection.query(query, [questScenario, questScenarioId], (err, result) => {
                if (err) reject(err.message);
                else {
                    console.log(`Updated scenarios ${questScenarioId}. ${result}`);
                    resolve(result.affectedRows);
                }
            });
        });
    }

    async deleteQuestById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM quest WHERE questId = ?';

                connection.query(query, [id], (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getProfileById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT ageGroupId, hobby from users  WHERE insertId = ?;';

            connection.query(query, [id], (err, result) => {
                if (err) return reject(err.message);
                resolve(result);
            });
        });
    }

    async updateProfileById(id, ageGroupId, hobby) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET ageGroupId = ?, hobby = ? WHERE insertId = ?;';

            connection.query(query, [ageGroupId, hobby, id], (err, result) => {
                if (err) return reject(err.message);
                resolve(result.affectedRows);
            });
        });
    }

    async getAgeGroups() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM agegroup;';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getHobbies() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM hobby;';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getAssociatedHobbyById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT hobbyId FROM user_hobby where userId = ?;';

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateFIQ(id, FIQ) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET FIQ = ? WHERE insertId = ?';
            connection.query(query, [FIQ, id], (err, result) => {
                if (err) return reject(err.message);
                resolve('Test ' + result.affectedRows);
            });
        });
    }

    async getRoles() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM roles;';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getAllUsers() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users ORDER BY FIQ desc';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async getUsersByAccountType(accountTypeId) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM users WHERE accountType = ?;';

                connection.query(query, accountTypeId, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async updateAccountType(id, action) {
        let accountType = 1;
        if (action === 'Demote') accountType = 2;
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET accountType = ? WHERE insertId = ?;';

            connection.query(query, [accountType, id], (err, result) => {
                if (err) return reject(err.message);
                resolve(result.affectedRows);
            });
        });
    }

    async deleteUserById(id) {
        try {
            return new Promise((resolve, reject) => {
                const query = 'DELETE FROM users WHERE insertId = ?';

                connection.query(query, id, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result.affectedRows);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }

    async exportCRtoCSV() {
        try {
            return new Promise((resolve, reject) => {
                const query = 'SELECT * FROM customer_ratings';

                connection.query(query, (err, result) => {
                    if (err) return reject(err.message);
                    resolve(result);
                });
            });
        } catch (e) {
            throw e.message;
        }
    }
}

module.exports = DbService;
