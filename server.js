const express = require('express');

const app = express();


const dbService = require('./db');

app.get('/', (req, res) => { 
    const text = 'Hello World from server.js';
    res.json(text);
});

const port = 9000;

app.listen(port, () => console.log(`Server started on port ${port}`));