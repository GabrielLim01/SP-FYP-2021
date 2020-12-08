const express = require("express");

const app = express();

const Boom = require("boom");
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

// read
app.get("/getAll", (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllUsers();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Create
app.post("/user", async (req, res) => {
  try {
    const name = req.body.name;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    console.log(hashedPassword);
    console.log(salt);

    //const pwd = req.body.password;

    const db = dbService.getDbServiceInstance();

    const result = db.insertNewUser(name, hashedPassword);

    result.then((data) => res.json({ data: data }));
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// authenticate
app.post("/authenticate", (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const db = dbService.getDbServiceInstance();

    const result = db.authenticate(username, password);

    result
      .then((data) => {
        res.json({ data: data });
        res.status(200).send("Valid request sent!");
      })
      .catch((err) => {
        console.log(err);
        res.json(Boom.notFound("Invalid Request"));
      });
  } catch (err) {
    res.json(Boom.notFound("Invalid Request"));
  }
});
