const express = require("express");

const app = express();

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
  fiqPoints: 100,
  quizQuestion: [
    {
      questionTitle: "Question 1",
      questionDesc: "",
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
        console.log(question);
        questionObject = JSON.parse(question.questionObject);
        // console.log(questionObject.options);
      });
      // response.json({ data: JSONobject.questionObject });
    })
    .catch((err) => console.log(err));
});

// create
app.post("/createNew", (request, response) => {
  const title = quizObject.quizTitle;
  const categoryId = quizObject.quizCategoryId;
  const quizDesc = quizObject.quizDesc;
  const fiqPoints = quizObject.fiqPoints;

  const db = dbService.getDbServiceInstance();
  const createQuiz_result = db.createQuiz(
    title,
    quizDesc,
    fiqPoints,
    categoryId
  );

  createQuiz_result
    // this runs if promise is resolved
    .then((data) => {
      response.json({
        insertId: data.insertId,
        categoryid: categoryId,
        name: title,
        description: quizDesc,
        FIQ_Points: fiqPoints,
      });
      console.log("Quiz Created");
      // Next phase
      const quizId = data.insertId;
      var createQuestion_result = new Promise((resolve, reject) => {});

      const questionObject = quizObject.quizQuestion;
      console.log(typeof questionObject);
      questionObject.forEach((question) => {
        console.log(question);
        createQuestion_result = db.createQuizQuestion(
          quizId,
          JSON.stringify(question)
        );
      });
      createQuestion_result.catch((err) => console.log(err));
    })
    // this runs if promise is rejected
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
  const fiqPoints = request.body.fiqPoints;
  const categoryId = request.body.categoryId;

  const db = dbService.getDbServiceInstance();

  const result = db.updateDetailsById(id, title, desc, fiqPoints, categoryId);

  result
    .then((data) => {
      console.log("Process was a success!");
      response.json({ data: data });
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
