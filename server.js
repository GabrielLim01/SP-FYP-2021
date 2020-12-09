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

// read
app.get("/quizDashboard", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllQuizzes();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// create
app.post("/createNew", (request, response) => {
  const title = request.body.title;
  const desc = request.body.desc;
  const fiqPoints = request.body.fiqPoints;
  const categoryId = request.body.categoryId;

  const db = dbService.getDbServiceInstance();

  const result = db.createQuiz(title, desc, fiqPoints, categoryId);

  result
    // this runs if promise is resolved
    .then((data) => {
      response.json({
        insertId: data.insertId,
        categoryid: categoryId,
        name: title,
        description: desc,
        FIQ_Points: fiqPoints,
      });
    })
    // this runs if promise is rejected
    .catch((err) => {
      if (err.includes("ER_NO_SUCH_TABLE"))
        console.log("Table 'quiz' does not exist!");
      else if (err.includes("ER_NO_REFERENCED"))
        console.log("Foreign Key does not exist! Check parent table.");
      // Please addon to this list if you encountered something new
      else console.log("Some Caught Error ", err);
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
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// delete
app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;

  const db = dbService.getDbServiceInstance();

  const result = db.deleteQuizById(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
