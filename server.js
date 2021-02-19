const express = require('express');

const app = express();

const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const excel = require('exceljs');
dotenv.config();

const dbService = require('./db');
const dbChatbotService = require('./chatbotdb');
const { response } = require('express');
const { spawn } = require('child_process');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 9000 || process.env.PORT;

app.listen(port, () => console.log(`Server started on port ${port}`));

const path = require('path');

//
//
function validateID(x) {
    let regex = new RegExp('^[0-9]+$');
    let result = regex.test(x);
    return result;
}

function validateString(x) {
    let regex = new RegExp('^[ A-Za-z0-9_@./#&+-^]*$');
    let result = regex.test(x);
    return result;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isBlank(str) {
    return !str || 0 === str.length;
}

function validateID(x) {
    let regex = new RegExp('^[0-9]+$');
    let result = regex.test(x);
    return result;
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function isBlank(str) {
    return !str || 0 === str.length;
}

app.post('/register', async (request, respond) => {
    const name = request.body.name;
    const password = request.body.password;

    if (!isBlank(name) && !isBlank(password)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const db = dbService.getDbServiceInstance();

        const result = db.insertNewUser(name, hashedPassword);

        result
            .then((data) => respond.json({ data: data }))
            .catch((err) => {
                response.status(400).send(`Registering of user where username equals to ${name} has failed. ${err}`);
            });
    } else response.status(400).send(`Name / Password is(are) empty.`);
});

app.post('/admin/register', async (request, respond) => {
    const name = request.body.name;
    const password = request.body.password;
    const role = request.body.role;

    if (!isBlank(name) && !isBlank(password) && !isBlank(role)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const db = dbService.getDbServiceInstance();

        const result = db.insertNewUserwRole(name, hashedPassword, role);

        result
            .then((data) => respond.json({ data: data }))
            .catch((err) =>
                response.status(400).send(`Registering of user where username equals to ${name} has failed. ${err}`),
            );
    } else response.status(400).send(`Name / Password is(are) empty.`);
});

app.post('/authenticate', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    console.log(username);
    console.log(password);

    if (!isBlank(username) && !isBlank(password)) {
        const db = dbService.getDbServiceInstance();

        const result = db.authenticate(username, password);

        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => {
                response
                    .status(400)
                    .send(`Authentication of user where username equals to ${username} has failed. ${err}`);
            });
    } else response.status(400).send(`Username / Password is(are) empty.`);
});

app.post('/category', async (request, response) => {
    const category = request.body.category;
    const categoryName = category.name;
    const categoryDesc = category.description;
    let isValid = validateString(categoryName);
    const db = dbService.getDbServiceInstance();
    if (isValid && !isBlank(categoryName)) {
        let result = db.createCategory(categoryName, categoryDesc);

        result
            .then((data) => {
                response.json({ data: data });
            })
            .catch((err) => {
                response.status(500).send(`Error creating category: ${categoryName}. ${err}`);
            });
    } else response.status(400).send(`${categoryName} contained illegal characters or is empty. Please check again.`);
});

app.get('/category', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllCategories();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

app.get('/category/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const db = dbService.getDbServiceInstance();
        const result = db.getCategoryDetailsById(request.params.id);
        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => response.status(400).send(`${err}`));
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.patch('/category/:id', (request, response) => {
    const category = request.body.category;
    const categoryName = category.name;
    const categoryDesc = category.description;
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.updateCategoryById(request.params.id, categoryName, categoryDesc);
        result
            .then((data) => {
                response.status(200).send(` Updating category of id: ${request.params.id} was a success!`);
            })
            .catch((err) => response.status(400).send(`${err}, updating of ${request.params.id} failed`));
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.delete('/category/:id', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.deleteCategoryById(request.params.id);
        result
            .then((data) => {
                response.status(200).send(` Deletion of category of id: ${request.params.id} was a success!`);
            })
            .catch((err) => {
                if (err.includes('ER_ROW_IS_REFERENCED'))
                    response
                        .status(400)
                        .send(`Category with id: ${request.params.id} is being referenced by quiz(zes).`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/quiz', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllQuizzes();
    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`Fetching of data failed. ${err}`));
});

app.get('/quiz/:id', (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuizById(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    const quizObject = JSON.parse(JSON.stringify(data));
                    response.json(quizObject);
                } else response.status(400).send(`Quiz of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified quiz of id: ${request.params.id}. ${err}`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/quiz/associatedCategory/:id', (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuizByCategoryId(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    const quizObject = JSON.parse(JSON.stringify(data));
                    response.json(quizObject);
                } else response.status(200).send(`Category of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified category of id: ${request.params.id}. ${err}`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.post('/quiz', (request, response) => {
    const quiz = request.body.quiz;
    const name = quiz.title;
    const desc = quiz.description;
    const category = quiz.category;
    const difficulty = quiz.difficulty;
    const points = quiz.points;
    const time = quiz.time;

    if (!isBlank(name) && !isBlank(category) && !isBlank(difficulty) && !isBlank(points) && !isBlank(time)) {
        const db = dbService.getDbServiceInstance();
        const createQuizResult = db.createQuiz(name, desc, category, difficulty, points, time);

        createQuizResult
            .then((data) => {
                const quizId = data.insertId;

                let createQuestionResult = new Promise((resolve, reject) => { });

                const questions = quiz.questions;
                questions.forEach((question) => {
                    createQuestionResult = db.createQuizQuestion(quizId, JSON.stringify(question));
                });

                createQuestionResult.catch((err) => response.send(`Creation of questions failed. ${err}`));

                response.status(201).send('Quiz created!');
            })
            .catch((err) => {
                response.send(`Creation of quiz failed. ${err}`);
            });
    } else response.send(`Category / Name / Description / Points/Time Per Question cannot be empty!`);
});

app.patch('/quiz/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const quiz = request.body.quiz;
        const title = quiz.title;
        const desc = quiz.description;
        const category = quiz.category;
        const difficulty = quiz.difficulty;
        const points = quiz.points;
        const time = quiz.time;
        const questions = quiz.questions;

        const db = dbService.getDbServiceInstance();
        const result = db.updateQuizDetailsById(request.params.id, title, desc, category, points, time, difficulty);

        result
            .then((data) => {
                let updateQuestionResult = new Promise((resolve, reject) => { });

                questions.forEach((question) => {
                    updateQuestionResult = db.updateQuestionDetailsById(question);
                });

                response.status(204).send();

                updateQuestionResult.catch((err) =>
                    response.send(
                        `Updating of questions where quiz id equals to ${request.params.id} has failed. ${err}`,
                    ),
                );
            })
            .catch((err) =>
                response.send(`Updating of quiz where id equals to ${request.params.id} has failed. ${err}`),
            );
    } else {
        response.send(`${request.params.id} contained illegal characters. Please check again.`);
    }
});

app.delete('/quiz/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const db = dbService.getDbServiceInstance();

        const result = db.deleteQuizById(request.params.id);

        result
            .then(() => {
                response.sendStatus(204);
            })
            .catch((err) =>
                response.status(400).send(`Deletion of quiz where id equals to ${request.params.id} has failed.`),
            );
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/quest', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllQuests();
    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`Fetching of data failed. ${err}`));
});

app.get('/quest/:id', (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuestById(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    response.json(data);
                } else response.status(400).send(`Quest of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified quest of id: ${request.params.id}. ${err}`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/quest/associatedCategory/:id', (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuestByCategory(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    const quizObject = JSON.parse(JSON.stringify(data));
                    response.json(quizObject);
                } else response.status(200).send(`Category of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified category of id: ${request.params.id}. ${err}`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.post('/quest', async (request, response) => {
    const quest = request.body.quest;
    const category = quest.categoryId;
    const title = quest.title;
    const desc = quest.description;
    const conc = quest.conclusion;
    const characterName = quest.characterName;
    const characterMood = quest.characterMood;
    const points = quest.points;

    if (!isBlank(title) && !isBlank(category) && !isBlank(points)) {
        const db = dbService.getDbServiceInstance();

        const createQuestResult = db.createQuest(category, title, desc, conc, characterName, characterMood, points);

        createQuestResult
            .then((data) => {
                const questId = data.insertId;

                let createScenarioResult = new Promise((resolve, reject) => { });

                const scenarios = quest.scenarios;
                scenarios.forEach((scenario) => {
                    createScenarioResult = db.createQuestScenario(questId, JSON.stringify(scenario));
                });

                createScenarioResult.catch((err) => response.send(`Creation of scenario failed. ${err}`));

                response.status(201).send('Quest created!');
            })
            .catch((err) => {
                response.send(`Error creating quest: ${err}`);
            });
    } else response.send(`Category / Title / Points cannot be empty!`);
});

app.patch('/quest/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const quest = request.body.quest;
        const category = quest.categoryId;
        const title = quest.title;
        const desc = quest.description;
        const conc = quest.conclusion;
        const characterName = quest.characterName;
        const characterMood = quest.characterMood;
        const points = quest.points;
        const scenarios = quest.scenarios;

        const db = dbService.getDbServiceInstance();
        const result = db.updateQuest(
            request.params.id,
            category,
            title,
            desc,
            conc,
            characterName,
            characterMood,
            points,
        );

        result
            .then((data) => {
                response.json({ data: data });

                let updateScenarioResult = new Promise((resolve, reject) => { });

                scenarios.forEach((scenario) => {
                    updateScenarioResult = db.updateQuestScenario(scenario);
                });

                updateScenarioResult.catch((err) =>
                    response
                        .status(400)
                        .send(`Updating of scenario where questId equals to ${request.params.id} has failed. ${err}`),
                );
            })
            .catch((err) => {
                response.send(`Updating of quest where id equals to ${request.params.id} has failed. ${err}`);
            });
    }
});

app.delete('/quest/:id', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.deleteQuestById(request.params.id);
        result
            .then((data) => {
                response.status(200).send(` Deletion of quest of id: ${request.params.id} was a success!`);
            })
            .catch((err) => {
                if (err.includes('ER_ROW_IS_REFERENCED'))
                    response
                        .status(400)
                        .send(`Category with id: ${request.params.id} is being referenced by quiz(zes).`);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/profile/:id', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getProfileById(request.params.id);

        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => response.status(400).send(`${err}`));
    }
});

app.patch('/profile/:id', (request, response) => {
    let hobbyStr = '';
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const detail = request.body.detail;

        const ageGroupId = detail.ageGroup;
        const hobby = detail.hobby;
        Object.values(hobby).forEach((hobbyId) => {
            hobbyStr += hobbyId;
        });

        const result = db.updateProfileById(request.params.id, ageGroupId, hobbyStr);
        result
            .then((data) => {
                response.status(200).send(` Updating profile of id: ${request.params.id} was a success!`);
            })
            .catch((err) => response.status(400).send(`${err}, updating of ${request.params.id} failed`));
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/agegroup', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAgeGroups();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

app.get('/hobby', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getHobbies();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

// app.get('/profile/hobby/:id', async (request, response) => {
//     const db = dbService.getDbServiceInstance();
//     let isValid = validateID(request.params.id);

//     if (isValid) {
//         const result = db.getAssociatedHobbyById(request.params.id);
//         result
//             .then((data) => {
//                 response.json(data);
//             })
//             .catch((err) => response.status(400).send(`${err}`));
//     } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
// });

app.patch('/fiq/:id', (request, response) => {
    const FIQ = request.body.FIQ;
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.updateFIQ(request.params.id, FIQ);
        result
            .then((data) => {
                response.status(200).send(` Updating FIQ of id: ${request.params.id} was a success!`);
            })
            .catch((err) => response.status(400).send(`${err}, updating of ${request.params.id} failed`));
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.get('/roles', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getRoles();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

app.get('/user', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllUsers();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

app.get('/user/:accountTypeId', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.accountTypeId);

    if (isValid) {
        const result = db.getUsersByAccountType(request.params.accountTypeId);

        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => response.status(400).send(`${err}`));
    } else
        response.status(400).send(`${request.params.accountTypeId} contained illegal characters. Please check again.`);
});

app.patch('/user/:accountId', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.accountId);
    if (isValid) {
        const action = request.body.action;
        const result = db.updateAccountType(request.params.accountId, action);
        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => response.status(400).send(`${err}`));
    } else
        response.status(400).send(`${request.params.accountTypeId} contained illegal characters. Please check again.`);
});

app.delete('/user/:accountId', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.accountId);

    if (isValid) {
        const result = db.deleteUserById(request.params.accountId);

        result
            .then((data) => {
                response.json(data);
            })
            .catch((err) => response.status(400).send(`${err}`));
    } else response.status(400).send(`${request.params.accountId} contained illegal characters. Please check again.`);
});

app.post('/botReply', (req, res) => {
    const userId = req.body.id;
    const userInput = req.body.userinput;
    let dataToSend = '';
    const db = dbChatbotService.getDbServiceInstance();
    const python = spawn('python', ['client\\src\\components\\chatbot\\script1.py', userInput]);

    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
        const sendChatbot = db.uploadChatbotConvo(userId, userInput, dataToSend);

        sendChatbot.catch((err) => {
            python.on('close', (code, signal) => {
                res.status(400).send(`Error in sending responses to server. ${err}`);
            });
        });

        python.on('close', (code, signal) => {
            console.log(`child process close all stdio with code ${code} and signal ${signal}`);
            res.send(dataToSend);
        });
    });
});

app.post('/ratings', (request, response) => {
    const db = dbChatbotService.getDbServiceInstance();
    const userId = request.body.id;
    const ratingsArray = request.body.ratings;
    const feedback = request.body.feedback;
    const sendRatings = db.uploadCustomerReview(userId, ratingsArray, feedback);

    sendRatings
        .then((data) => {
            response.status(201).send('Ratings inserted');
        })
        .catch((err) => {
            response.status(400).send(`insertion failed. ${err}`);
        });
});

app.get('/downloadCR/excel', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.exportCRtoCSV();
    result
        .then((data) => {
            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet(`customer_ratings`);
            worksheet.columns = [
                { header: 'Qns1', key: 'qns1', width: 10 },
                { header: 'Qns2', key: 'qns2', width: 10 },
                { header: 'Qns3', key: 'qns3', width: 10 },
                { header: 'Qns4', key: 'qns4', width: 10 },
                { header: 'Qns5', key: 'qns5', width: 10 },
                { header: 'feedback', key: 'feedback', width: 50 },
                { header: 'createdAt', key: 'createdAt', width: 50 },
            ];

            worksheet.addRows(JSON.parse(JSON.stringify(data)));

            workbook.xlsx.writeFile(`customer_ratings.xlsx`).then(function () {
                console.log('file saved!');
            });
        })
        .catch((err) => response.status(400).send(`${err}`));
});
