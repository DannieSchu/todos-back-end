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
app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// API Routes
app.use(express.urlencoded({ extended: true }));

// *** TODOS ***
// this is /GET request that returns whole list of todos
app.get('/api/todos', async(req, res) => {

    try {
        // make a sql query using pg.Client() to select * from todos
        const result = await client.query(`
            SELECT * from todos
            ORDER BY $1;
        `, [req.body.id]);

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
});

app.put('/api/todos/:id', async(req, res) => {
    try {
        const result = await client.query(`
            UPDATE todos
            SET complete = $1
            WHERE id = $2
            RETURNING *`,
        [req.body.complete, req.params.id]
        );
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err); 
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.delete('api/todos/:id', async(req, res) => {
    try {
        const result = await client.query(`
            DELETE from todos 
            WHERE id = $1
            RETURNING *`,
        [req.params.id]
        );
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});