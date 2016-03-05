'use strict';

// Vendors modules
const colors = require('colors');
// App modules
const server = require('./lib/simple-server');

const port = process.env.PORT || 8080;

server.listen(port);
console.log(`Magic happens on port ${port}`.rainbow);
