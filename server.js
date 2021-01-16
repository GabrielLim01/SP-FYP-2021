const express = require('express');

const app = express();

const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./db');
const { response } = require('express');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 9000;

app.listen(port, () => console.log(`Server started on port ${port}`));
app.get('/', function (req, res) {
    res.send('hello world');
});

// var quizObject = {
//   quizTitle: "Hello",
//   quizCategoryId: 1,
//   quizDesc: "",
//   totalPoints: 100,
//   questions: [
//     {
//       questionTitle: "Question 1",
//       questionDesc: "",
//       fiqPoints: 50,
//       timeLimit: 30,
//       options: [
//         {
//           option: "Option 1",
//           optionDesc: "",
//           isCorrect: true,
//         },
//         {
//           option: "Option 2",
//           optionDesc: "",
//           isCorrect: false,
//         },
//       ],
//     },
//     {
//       questionTitle: "Question 2",
//       questionDesc: "",
//       fiqPoints: 50,
//       timeLimit: 30,
//       options: [
//         {
//           option: "Option 1",
//           optionDesc: "",
//           isCorrect: true,
//         },
//         {
//           option: "Option 2",
//           optionDesc: "",
//           isCorrect: false,
//         },
//       ],
//     },
//   ],
// };

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

// read
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

// get quiz by category
app.get('/quiz/category/:id', (request, response) => {
    // URL to change to however you want it to be
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuizByCategoryId(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    const quizObject = JSON.parse(JSON.stringify(data));
                    response.json(quizObject);
                } else response.status(400).send(`Category of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified category of id: ${request.params.id}.`, err);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

// POST /quiz
app.post('/quiz', (request, response) => {
    const quiz = request.body.quiz;
    const name = quiz.name;
    const desc = quiz.description;
    const category = quiz.category;
    const points = quiz.points;
    const time = quiz.time;

    if (!isBlank(name) && !isBlank(category) && !isBlank(points)) {
        const db = dbService.getDbServiceInstance();
        const createQuizResult = db.createQuiz(name, desc, category, points, time);

        createQuizResult
            .then((data) => {
                response.json({
                    insertId: data.insertId,
                    categoryid: category,
                    name: name,
                    description: desc,
                    points: points,
                    time: time,
                });

                const quizId = data.insertId;
                let createQuestionResult = new Promise((resolve, reject) => {});
                createQuestionResult = db.createQuizQuestion(quizId, quiz.questions);
                createQuestionResult.catch((err) => response.status(400).send(`Creation of questions failed. ${err}`));
            })
            .catch((err) => {
                // Please addon to this list if you encountered something new
                response.status(400).send(`Creation of quiz failed. ${err}`);
            });
    } else response.status(400).send(`Category / Name / Description / Points/Time Per Question cannot be empty!`);
});

// update
app.patch('/quiz/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const title = request.body.quizTitle;
        const desc = request.body.quizDesc;
        const categoryId = request.body.quizCategoryId;
        const quizQuestionObject = request.body.questions;

        const db = dbService.getDbServiceInstance();
        const result = db.updateQuizDetailsById(request.params.id, title, desc, categoryId);

        result
            .then((data) => {
                response.json({ data: data });

                var updateQuestionsResult = new Promise((resolve, reject) => {});
                quizQuestionObject.forEach((question) => {
                    updateQuestionsResult = db.updateQuestionDetailsById(request.params.id, question);
                });
                updateQuestionsResult.catch((err) =>
                    response
                        .status(400)
                        .send(`Updating of questions where quiz id equals to ${request.params.id} has failed. ${err}`),
                );
            })
            .catch((err) =>
                response
                    .status(400)
                    .send(`Updating of quiz where id equals to ${request.params.id} has failed. ${err}`),
            );
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

// delete
app.delete('/quiz/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const db = dbService.getDbServiceInstance();

        const result = db.deleteQuizById(request.params.id);

        result
            .then((data) => {
                response.json({ data: data });
            })
            .catch((err) =>
                response.status(400).send(`Deletion of quiz where id equals to ${request.params.id} has failed.`),
            );
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

// POST /register
app.post('/register', async (request, respond) => {
    const name = request.body.name;
    const password = request.body.password;

    if (!isBlank(name) && !isBlank(password)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const db = dbService.getDbServiceInstance();

        const result = db.insertNewUser(name, hashedPassword);

        result
            .then((data) => respond.json({ data: data }))
            .catch((err) =>
                response.status(400).send(`Registering of user where username equals to ${name} has failed.`, err),
            );
    } else response.status(400).send(`Name / Password is(are) empty.`);
});

// POST /authenticate
app.post('/authenticate', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (!isBlank(username) && !isBlank(password)) {
        const db = dbService.getDbServiceInstance();

        const result = db.authenticate(username, password);

        result
            .then((data) => {
                response.json(data);
                //response.status(200).send(`User is authenticated`);
            })
            .catch((err) => {
                response
                    .status(400)
                    .send(`Authentication of user where username equals to ${username} has failed. ${err}`);
            });
    } else response.status(400).send(`Username / Password is(are) empty.`);
});

//create
app.post('/category', async (request, response) => {
    const categoryName = request.body.catName;
    const categoryDesc = request.body.catDesc;
    let isValid = validateString(categoryName);
    const db = dbService.getDbServiceInstance();
    if (isValid) {
        let result = db.createCategory(categoryName, categoryDesc);

        result
            .then((data) => {
                response.json({ data: data });
            })
            .catch((err) => {
                response.status(500).send(`Error creating category: ${categoryName}`, err);
            });
    } else response.status(400).send(`${categoryName} contained illegal characters. Please check again.`);
});

//read
app.get('/category', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllCategories();

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

app.get('/category/:name', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getCategoryByName(request.params.name);

    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`${err}`));
});

//update
app.patch('/category/:id', (request, response) => {
    const categoryName = request.body.catName;
    const categoryDesc = request.body.catDesc;
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

//delete
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

//update profile
app.patch('/profile/:id', (request, response) => {
    const username = request.body.username;
    const hobbyId = request.body.hobbyId;
    //const hobbies = [];
    //hobbyId.forEach((id) => hobbies.push(id));
    const ageGroupId = request.body.ageGroupId;
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.updateProfileById(
            request.params.id,
            username,
            hobbyId,
            // hobbies,
            ageGroupId,
        );
        result
            .then((data) => {
                response.status(200).send(` Updating profile of id: ${request.params.id} was a success!`);
            })
            .catch((err) => response.status(400).send(`${err}, updating of ${request.params.id} failed`));
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});
/////////////////////////////////////////
/*
1. Declare mock object
2. Create
3. Read
4. Update
5. Delete
*/
const obj = {
    questTitle: 'dvzdvc',
    questCategoryId: 1,
    questDesc: '',
    questObjective: '',
    fiqPoints: 100,
    questions: [
        {
            scenarioId: 5,
            sub_questTitle: 'Scenario A',
            sub_questDesc: '',
            options: [
                {
                    option: 'Option 1',
                    optionDesc: '',
                    pros: '',
                    cons: '',
                },
                {
                    option: 'Option 2',
                    optionDesc: '',
                    pros: '',
                    cons: '',
                },
            ],
        },
        {
            scenarioId: 6,
            sub_questTitle: 'Scenario B',
            sub_questDesc: '',
            options: [
                {
                    option: 'Option 1',
                    optionDesc: '',
                    pros: '',
                    cons: '',
                },
                {
                    option: 'Option 2',
                    optionDesc: '',
                    pros: '',
                    cons: '',
                },
            ],
        },
    ],
};

// Get all quests from database
app.get('/quests', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllQuests();
    result
        .then((data) => {
            response.json(data);
        })
        .catch((err) => response.status(400).send(`Fetching of data failed. ${err}`));
});

//create
app.post('/quests/createNew', async (request, response) => {
    const quest = request.body.quest;
    //syntaxes to change during integration
    const title = quest.title;
    const desc = quest.desc;
    const categoryId = quest.categoryId;
    const fiqPoints = quest.fiqPoints;
    const scenarioObj = quest.scenarios;
    let isValid = validateString(title);
    const db = dbService.getDbServiceInstance();
    if (isValid) {
        let result = db.createQuest(title, desc, categoryId, fiqPoints);
        result
            .then((data) => {
                response.json({ data: data.insertId });

                let createQuestScenarioResult = db.createQuestScenario(data.insertId, scenarioObj);
                createQuestScenarioResult.catch((err) => console.log(`Creation of scenario(s) failed. ${err}`));
            })
            .catch((err) => {
                response.status(500).send(`Error creating quest: ${title}, ${err}`);
            });
    } else response.status(400).send(`${title} contained illegal characters. Please check again.`);
});

app.get('/quests/:id', (request, response) => {
    const db = dbService.getDbServiceInstance();
    let isValid = validateID(request.params.id);
    if (isValid) {
        const result = db.getQuestById(request.params.id);
        result
            .then((data) => {
                if (!isEmpty(data)) {
                    const questObject = JSON.parse(JSON.stringify(data));
                    response.json({ data: questObject });
                } else response.status(400).send(`Quest of id: ${request.params.id} is not present.`);
            })
            .catch((err) => {
                response.status(400).send(`Unable to retrieve specified quest of id: ${request.params.id}.`, err);
            });
    } else response.status(400).send(`${request.params.id} contained illegal characters. Please check again.`);
});

app.patch('/quests/:id', (request, response) => {
    let isValid = validateID(request.params.id);
    if (isValid) {
        const title = obj.questTitle;
        const desc = obj.questDesc;
        const objective = obj.questObjective;
        const categoryId = obj.questCategoryId;
        const fiqPoint = obj.fiqPoints;
        const scenearioObj = obj.questions;

        const db = dbService.getDbServiceInstance();
        const result = db.updateQuestDetailsById(request.params.id, title, desc, objective, categoryId, fiqPoint);

        result
            .then((data) => {
                response.json({ data: data });

                let updateScenarioResult = new Promise((resolve, reject) => {});
                scenearioObj.forEach((scenario) => {
                    updateScenarioResult = db.updateScenarioDetailsById(
                        request.params.id,
                        scenario.scenarioId,
                        scenario.sub_questTitle,
                        scenario.sub_questDesc,
                        JSON.stringify(scenario.options),
                    );
                });
                updateScenarioResult.catch((err) =>
                    response
                        .status(400)
                        .send(`Updating of questions where questId equals to ${request.params.id} has failed. ${err}`),
                );
            })
            .catch((err) => {
                response
                    //.status(400)
                    .send(`Updating of quiz where id equals to ${request.params.id} has failed. ${err}`);
            });
    }
});

app.delete('/quests/:id', async (request, response) => {
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
