const client = require('../lib/client');
// import our seed data:
const todos = require('./todos');

run();

async function run() {

    try {
        await client.connect();

        await client.query(`
            INSERT INTO users (email, hash)
            VALUES ($1, $2);
            `,
        ['me@mydomain.com', 'gh289t894ht']);

        await Promise.all(
            todos.map(todo => {
                return client.query(`
                    INSERT INTO todos (task, user_id, complete)
                    VALUES ($1, $2, $3);
                `,
                [todo.task, todo.user_id, todo.complete]);
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}