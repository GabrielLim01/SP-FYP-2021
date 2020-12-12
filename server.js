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
  fiqPoints: 100,
  questions: [
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

function isbetween(x, min, max) {
  return x >= min && x <= max;
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
  const fiqPoints = quizObject.fiqPoints;

  const db = dbService.getDbServiceInstance();
  const createQuiz_result = db.createQuiz(
    title,
    quizDesc,
    fiqPoints,
    categoryId
  );

  createQuiz_result
    .then((data) => {
      response.json({
        insertId: data.insertId,
        categoryid: categoryId,
        name: title,
        description: quizDesc,
        FIQ_Points: fiqPoints,
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
  let id = parseInt(request.params.id, 10);

  const title = request.body.title;
  const desc = request.body.desc;
  const fiqPoints = request.body.fiqPoints;
  const categoryId = request.body.categoryId;
  const quizQuestionObject = request.body.quizQuestion;
  console.log(quizQuestionObject);

  const db = dbService.getDbServiceInstance();

  const result = db.updateQuizDetailsById(
    id,
    title,
    desc,
    fiqPoints,
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
  try {
    const name = request.body.name;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hashSync(request.body.password, salt);

    const db = dbService.getDbServiceInstance();

    const result = db.insertNewUser(name, hashedPassword);

    result.then((data) => response.json({ data: data }));
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// POST /authenticate
app.post("/authenticate", (request, response) => {
  try {
    const username = request.body.username;
    const password = request.body.password;

    const db = dbService.getDbServiceInstance();

    // const result is a Promise, not raw JSON data
    const result = db.authenticate(username, password);

    // In order to access the data of the Promise, you have to do a .then((data => console.log(data))),
    // then use res.json to send the data back to the front-end (axios.POST)
    result
      .then((data) => {
        response.json({ data: data });
      })

      .catch((err) => {
        console.log("Server.js error: " + err);
        response.status(500).send();
      });
  } catch (err) {
    response.status(500).send();
  }
});

//create
app.post("/createCategory", async (request, response) => {
  try {
    const categoryName = request.body.catName;
    const categoryDesc = request.body.catDesc;

    const db = dbService.getDbServiceInstance();
    let result = db.createCategory(categoryName, categoryDesc);

    result
      .then((data) => {
        response.json({ data: data });
      })

      .catch((err) => {
        console.log(`Error creating category: ${categoryName}`, err);
        response.status(500).send();
      });
  } catch (error) {
    console.log(error);
    response.status(500).send();
  }
});
//read
app.get("/getAllCategories", async (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllCategories();

  result
    .then((data) => {
      console.log("Process was a success!");
      response.json({ data: data });
    })
    .catch((err) => console.log(err));
});

//update
app.patch("/updateCategory/:id", (request, response) => {
  let id = parseInt(request.params.id, 10);
  const categoryName = request.body.catName;
  const categoryDesc = request.body.catDesc;

  const db = dbService.getDbServiceInstance();
  const result = db.updateCategoryById(id, categoryName, categoryDesc);

  result
    .then((data) => {
      console.log(`Updating category of id: ${id} was a success!`);
      response.json({ data: data });
    })
    .catch((err) => {
      console.log(err);
      response.status(400).send(`Update failed`);
    });
});

//delete
app.delete("/deleteCategory/:id", async (request, response) => {
  let id = parseInt(request.params.id, 10);
  const db = dbService.getDbServiceInstance();
  const result = db.getAllCategories();
  result
    .then((data) => {
      const obj = JSON.parse(JSON.stringify(data));

      if (isbetween(id, 0, Object.keys(obj).length)) {
        const outcome = db.deleteCategoryById(id);
        outcome
          .then((data) => {
            console.log(`Deletion of category of id: ${id} was a success!`);
            response.json({ data: data });
          })
          .catch((err) => {
            if (err.includes("ER_ROW_IS_REFERENCED_2"))
              console.log(
                `Category with id: ${id} is being referenced by quiz(zes).`
              );
          });
      } else {
        response
          .status(400)
          .send(`The id: ${id} you provided was not valid. Please try again.`);
      }
    })
    .catch((err) => {
      console.log("Server error: " + err);
      response.status(500).send();
    });
});
