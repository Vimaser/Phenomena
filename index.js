require('dotenv').config(); // Use the dotenv package, to create environment variables

const port = process.env.PORT || 3000; // Create a constant variable, PORT, based on what's in process.env.PORT or fallback to 3000
const express = require('express'); // Import express, and create a server
const app = express();

const morgan = require('morgan'); // Require morgan and body-parser middleware
const cors = require('cors'); // Import cors 
const bodyParser = require('body-parser');// Have the server use bodyParser.json()

// Middleware
app.use(morgan('dev')); // Have the server use morgan with setting 'dev'
app.use(cors()); // Have the server use cors()
app.use(bodyParser.json());

// Import the client from your db/index.js
const { client } = require('./db/index');
// Have the server use your api router with prefix '/api'
const apiRouter = require('./api');
app.use('/api', apiRouter);

// Create custom 404 handler that sets the status code to 404.
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found'});
});

// Create custom error handling that sets the status code to 500
// and returns the error as an object
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start the server listening on port PORT
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    // On success, connect to the database
    client.connect()
        .then(() => {
            console.log('Connected to the database');
        })
        .catch((err) => {
            console.error('Failed to connect to the database', err);
        });
});


