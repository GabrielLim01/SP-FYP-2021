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

function validateID(x) {
  let regex = new RegExp("^[0-9]+$");
  let result = regex.test(x);
  return result;
}

function validateString(x) {
  let regex = new RegExp("^[ A-Za-z0-9_@./#&+-^]*$");
  let result = regex.test(x);
  return result;
}
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
  let id = parseInt(request.params.id, 10);
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

      let createQuizResult = new Promise((resolve, reject) => {});


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
  let id = parseInt(request.params.id, 10);

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

      let updateQuestionsResult = new Promise((resolve, reject) => {});

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
  let id = parseInt(request.params.id, 10);

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
app.post("/register", async (request, response) => {
  const name = request.body.name;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hashSync(request.body.password, salt);

  const db = dbService.getDbServiceInstance();


  const result = db.insertNewUser(name, hashedPassword);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => response.status(500).send("Server.js error: ", err));

});

// POST /authenticate
app.post("/authenticate", (request, response) => {
  const username = request.body.username;
  const password = request.body.password;
  const db = dbService.getDbServiceInstance();
  const result = db.authenticate(username, password);
  result
    .then((data) => {
      response.json({ data: data });
    })

    .catch((err) => {
      response.status(500).send("Server.js error: ", err);
    });
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

  }

});
