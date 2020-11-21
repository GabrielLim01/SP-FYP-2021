const express = require('express');

const app = express();

const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.get('/', (req, res) => { 
    const text = 'Hello World from server.js';
    res.json(text);
});

const port = 9000;

app.listen(port, () => console.log(`Server started on port ${port}`));