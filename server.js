// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const client = require('./lib/client');
// Initiate database connection
client.connect();

// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder
app.use(express.json()); // enable reading incoming json data
// API Routes

app.use(express.urlencoded({ extended: true }));

// *** TODOS ***
// this is /GET request that returns whole list of todos
app.get('/api/todos', async(req, res) => {

    try {
        // make a sql query using pg.Client() to select * from todos
        const result = await client.query(`
            SELECT * from todos;
        `);

        // respond to the client with that data
        res.json(result.rows);
    }
    catch (err) {
        // handle errors
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.post('/api/todos', async(req, res) => {
    try {
        const result = await client.query(`
            INSERT into todos (task, complete)
            VALUES ($1, $2)
            RETURNING *`,
        [req.body.task, false]
        );
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});