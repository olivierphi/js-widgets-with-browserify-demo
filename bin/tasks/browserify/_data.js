'use strict';

// Node.js modules
const path = require('path');
// Browserify stuff
const watchify = require('watchify');

const APP_DATA = {
    ENTRY_POINT_MODULE_ID: 'demo-app/app',
    LABEL: 'demoApp',
    VIEWS_PATHS: [
        path.join(__dirname, '../../../web'),
    ],
    ADDITIONAL_MODULES_TO_REQUIRE: [],
    WATCHIFY_ARGS: watchify.args,
};

module.exports = APP_DATA;
