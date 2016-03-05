'use strict';

// Node.js modules
const fs = require('fs');
// Vendors modules
const insertCss = require('insert-css');

// jQuery plugins: we just need to "require()" them in order to enable them.
require('tipso');

// Thanks to brfs ("Browserify FS") widgets can embed their own resources :-)
const TIPSO_CSS = fs.readFileSync(
    __dirname + '/../../../node_modules/tipso/src/tipso.css',
    'utf8'
);

insertCss(TIPSO_CSS);
