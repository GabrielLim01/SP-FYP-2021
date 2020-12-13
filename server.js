const express = require("express");

const app = express();

const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./db");

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
  ],
};

// read
app.get("/quizDashboard", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllQuizzes();

  result
    .then((data) => {
      console.log("Process was a success!");
      response.json({ data: data });
    })
    .catch((err) => console.log(err));
});

app.get("/quiz/:id", (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();

  const result = db.getQuizById(id);

  result
    .then((data) => {
      console.log("Process was a success!");

      quizObject = JSON.parse(JSON.stringify(data));
      quizObject.forEach((question) => {
        questionObject = JSON.parse(question.questionObject);
      });
      return response.json({ data: data });
    })
    .catch((err) => {
      // return response.status(500).send(err);
      console.log(err);
    });
});

// create
app.post("/createNew", (request, response) => {
  const title = quizObject.quizTitle;
  const categoryId = quizObject.quizCategoryId;
  const quizDesc = quizObject.quizDesc;
  const totalPoints = quizObject.totalPoints;

  const db = dbService.getDbServiceInstance();
  const createQuiz_result = db.createQuiz(
    title,
    quizDesc,
    totalPoints,
    categoryId
  );

  createQuiz_result
    .then((data) => {
      response.json({
        insertId: data.insertId,
        categoryid: categoryId,
        name: title,
        description: quizDesc,
        totalPoints: totalPoints,
      });
      console.log("Quiz Created");
      const quizId = data.insertId;
      var createQuizResult = new Promise((resolve, reject) => {});

      const questionObject = quizObject.questions;
      console.log(typeof questionObject);
      questionObject.forEach((question) => {
        createQuizResult = db.createQuizQuestion(
          quizId,
          JSON.stringify(question)
        );
      });
      createQuizResult.catch((err) => console.log("Some Caught Error:", err));
    })

    .catch((err) => {
      // Please addon to this list if you encountered something new
      console.log("Some Caught Error:", err);
    });
});

// update
app.patch("/update/:id", (request, response) => {
  const { id } = request.params;

  const title = request.body.title;
  const desc = request.body.desc;
  const totalPoints = request.body.totalPoints;
  const categoryId = request.body.categoryId;
  const quizQuestionObject = request.body.quizQuestion;
  console.log(quizQuestionObject);

  const db = dbService.getDbServiceInstance();

  const result = db.updateQuizDetailsById(
    id,
    title,
    desc,
    totalPoints,
    categoryId
  );

  result
    .then((data) => {
      console.log("Process was a success!");
      response.json({ data: data });

      // phase 2
      var updateQuestionsResult = new Promise((resolve, reject) => {});
      quizQuestionObject.forEach((question) => {
        updateQuestionsResult = db.updateQuestionDetailsById(
          id,
          JSON.stringify(question)
        );
      });
      updateQuestionsResult.catch((err) =>
        console.log("Some Caught Error:", err)
      );
    })
    .catch((err) => console.log(err));
});

// delete
app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;

  const db = dbService.getDbServiceInstance();

  const result = db.deleteQuizById(id);

  result
    .then((data) => {
      console.log("Process was a success!");
      response.json({ data: data });
    })
    .catch((err) => console.log(err));
});

// POST /register
app.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    const db = dbService.getDbServiceInstance();

    const result = db.insertNewUser(name, hashedPassword);

    result.then((data) => res.json({ data: data }));
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// POST /authenticate
app.post("/authenticate", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const db = dbService.getDbServiceInstance();

    // const result is a Promise, not raw JSON data
    const result = db.authenticate(username, password);

    // In order to access the data of the Promise, you have to do a .then((data => console.log(data))),
    // then use res.json to send the data back to the front-end (axios.POST)
    result
      .then((data) => {
        res.json({ data: data });
      })
      // should not be invoked normally
      .catch((err) => {
        console.log("Server.js error: " + err);
        //res.json(Boom.notFound("Invalid Request"));
      });
  } catch (err) {
    //res.json(Boom.notFound("Invalid Request"));
  }
});
