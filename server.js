const express = require("express");

const app = express();

const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./db");
const { response } = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 9000;

app.listen(port, () => console.log(`Server started on port ${port}`));

var quizObject = {
  quizTitle: "Hello",
  quizCategoryId: 1,
  quizDesc: "",
  totalPoints: 100,
  questions: [
    {
      questionTitle: "Question 1",
      questionDesc: "",
      fiqPoints: 50,
      timeLimit: 30,
      options: [
        {
          option: "Option 1",
          optionDesc: "",
          isCorrect: true,
        },
        {
          option: "Option 2",
          optionDesc: "",
          isCorrect: false,
        },
      ],
    },
    {
      questionTitle: "Question 2",
      questionDesc: "",
      fiqPoints: 50,
      timeLimit: 30,
      options: [
        {
          option: "Option 1",
          optionDesc: "",
          isCorrect: true,
        },
        {
          option: "Option 2",
          optionDesc: "",
          isCorrect: false,
        },
      ],
    },
    {
      questionTitle: "Question 3",
      questionDesc: "",
      fiqPoints: 50,
      timeLimit: 30,
      options: [
        {
          option: "Option 1",
          optionDesc: "",
          isCorrect: true,
        },
        {
          option: "Option 2",
          optionDesc: "",
          isCorrect: false,
        },
      ],
    },
  ],
};
function validateID(x) {
  let regex = new RegExp("^[0-9]+$");
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
  let regex = new RegExp("^[0-9]+$");
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
app.get("/quizDashboard", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllQuizzes();
  result
    .then((data) => {
      response.json({ data: data });
    })
    .catch((err) =>
      response.status(400).send(`Fetching of data failed. ${err}`)
    );
});

app.get("/quiz/:id", (request, response) => {
  const db = dbService.getDbServiceInstance();
  let isValid = validateID(request.params.id);
  if (isValid) {
    const result = db.getQuizById(request.params.id);
    result
      .then((data) => {
        if (!isEmpty(data)) {
          const quizObject = JSON.parse(JSON.stringify(data));
          response.json({ data: quizObject });
        } else
          response
            .status(400)
            .send(`Quiz of id: ${request.params.id} is not present.`);
      })
      .catch((err) => {
        response
          .status(400)
          .send(
            `Unable to retrieve specified quiz of id: ${request.params.id}. ${err}`
          );
      });
  } else
    response
      .status(400)
      .send(
        `${request.params.id} contained illegal characters. Please check again.`
      );
});

app.post("/createNew", (request, response) => {
  const title = quizObject.quizTitle; // to be changed
  const categoryId = quizObject.quizCategoryId; // to be changed
  const quizDesc = quizObject.quizDesc; // to be changed
  const totalPoints = quizObject.totalPoints; // to be changed

  if (!isBlank(title) && !isBlank(categoryId) && !isBlank(totalPoints)) {
    const db = dbService.getDbServiceInstance();
    const createQuizResult = db.createQuiz(
      title,
      quizDesc,
      totalPoints,
      categoryId
    );

    createQuizResult
      .then((data) => {
        response.json({
          insertId: data.insertId,
          categoryid: categoryId,
          name: title,
          description: quizDesc,
          totalPoints: totalPoints,
        });
        const quizId = data.insertId;
        let createQuestionResult = new Promise((resolve, reject) => { });
        createQuestionResult = db.createQuizQuestion(
          quizId,
          quizObject.questions
        );
        createQuestionResult.catch((err) =>
          response.status(400).send(`Creation of questions failed. ${err}`)
        );
      })

      .catch((err) => {
        // Please addon to this list if you encountered something new
        response.status(400).send(`Creation of quiz failed. ${err}`);
      });
  } else
    response.status(400).send(`Title / categoryId / totalPoints is(are) empty`);
});

// update
app.patch("/quiz/:id", (request, response) => {
  let isValid = validateID(request.params.id);
  if (isValid) {
    const title = request.body.title;
    const desc = request.body.desc;
    const totalPoints = request.body.totalPoints;
    const categoryId = request.body.categoryId;
    const quizQuestionObject = request.body.quizQuestion;

    const db = dbService.getDbServiceInstance();
    const result = db.updateQuizDetailsById(
      request.params.id,
      title,
      desc,
      totalPoints,
      categoryId
    );

    result
      .then((data) => {
        response.json({ data: data });

        let updateQuestionsResult = new Promise((resolve, reject) => { });
        quizQuestionObject.forEach((question) => {
          updateQuestionsResult = db.updateQuestionDetailsById(
            request.params.id,
            JSON.stringify(question)
          );
        });
        updateQuestionsResult.catch((err) =>
          response
            .status(400)
            .send(
              `Updating of questions where quiz id equals to ${request.params.id} has failed. ${err}`
            )
        );
      })
      .catch((err) =>
        response
          .status(400)
          .send(
            `Updating of quiz where id equals to ${request.params.id} has failed. ${err}`
          )
      );
  } else
    response
      .status(400)
      .send(
        `${request.params.id} contained illegal characters. Please check again.`
      );
});

// delete
app.delete("/quiz/:id", (request, response) => {
  let isValid = validateID(request.params.id);
  if (isValid) {
    const db = dbService.getDbServiceInstance();

    const result = db.deleteQuizById(request.params.id);

    result
      .then((data) => {
        response.json({ data: data });
      })
      .catch((err) =>
        response
          .status(400)
          .send(
            `Deletion of quiz where id equals to ${request.params.id} has failed.`
          )
      );
  } else
    response
      .status(400)
      .send(
        `${request.params.id} contained illegal characters. Please check again.`
      );
});

// POST /register
app.post("/register", async (request, respond) => {
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
        response
          .status(400)
          .send(
            `Registering of user where username equals to ${name} has failed.`,
            err
          )
      );
  } else response.status(400).send(`Name / Password is(are) empty.`);
});

// POST /authenticate
app.post("/authenticate", (request, response) => {
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
          .send(
            `Authentication of user where username equals to ${username} has failed. ${err}`
          );
      });
  } else response.status(400).send(`Username / Password is(are) empty.`);
});

//create
app.post("/category", async (request, response) => {
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
        response
          .status(500)
          .send(`Error creating category: ${categoryName}`, err);
      });
  } else
    response
      .status(400)
      .send(
        `${categoryName} contained illegal characters. Please check again.`
      );
});

//read
app.get("/category", async (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllCategories();

  result
    .then((data) => {
      response.json({ data: data });
    })
    .catch((err) => response.status(400).send(`${err}`));
});

//update
app.patch("/category/:id", (request, response) => {
  const categoryName = request.body.catName;
  const categoryDesc = request.body.catDesc;
  const db = dbService.getDbServiceInstance();
  let isValid = validateID(request.params.id);
  if (isValid) {
    const result = db.updateCategoryById(
      request.params.id,
      categoryName,
      categoryDesc
    );
    result
      .then((data) => {
        response
          .status(200)
          .send(
            ` Updating category of id: ${request.params.id} was a success!`
          );
      })
      .catch((err) =>
        response
          .status(400)
          .send(`${err}, updating of ${request.params.id} failed`)
      );
  } else
    response
      .status(400)
      .send(
        `${request.params.id} contained illegal characters. Please check again.`
      );
});

//delete
app.delete("/category/:id", async (request, response) => {
  const db = dbService.getDbServiceInstance();
  let isValid = validateID(request.params.id);
  if (isValid) {
    const result = db.deleteCategoryById(request.params.id);
    result
      .then((data) => {
        response
          .status(200)
          .send(
            ` Deletion of category of id: ${request.params.id} was a success!`
          );
      })
      .catch((err) => {
        if (err.includes("ER_ROW_IS_REFERENCED"))
          response
            .status(400)
            .send(
              `Category with id: ${request.params.id} is being referenced by quiz(zes).`
            );
      });
  } else
    response
      .status(400)
      .send(
        `${request.params.id} contained illegal characters. Please check again.`
      );
});
