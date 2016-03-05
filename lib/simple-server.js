'use strict';

// Third-party modules
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static assets (this is a demo, we don't have any web server between the browser and the Node.js app :-)
app.use(express.static('web', {
    index: 'index.html',
}));

// Nunjucks template engine init
require('./boot/nunjucks-init').initNunjucks(app);

// Controllers
app.use('/form', require('./controllers/form-handler'));


module.exports = app;
