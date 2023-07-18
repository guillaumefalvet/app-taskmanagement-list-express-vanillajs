// Load environnement variables
const dotenv = require('dotenv');
dotenv.config();

// External dependencies
const express = require('express');
const cors = require('cors');

// Internal dependencies
const router = require('./app/router');
const middlewares = require('./app/middlewares');

// Create app
const app = express();

// Body parsers
app.use(express.json()); // Deserialiser les body au format 'application/json'
app.use(express.urlencoded({ extended: true })); // Désérialiser les body au format 'application/x-www/urlencoded'

// Security middlewares
app.use(cors('*'));  // On autorise toutes les origines à envoyer des requests vers nos routes
app.use(middlewares.bodySanitizer);

// Serve frontend files
app.use(express.static("dist"));

// App routers
app.use(router);

// Error handling
app.use(middlewares.notFound);

// Start application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT} ...`)
});
