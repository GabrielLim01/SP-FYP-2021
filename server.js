const express = require("express");

const app = express();

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./db");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const text = "Hello World from server.js";
  res.json(text);
});

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
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
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
