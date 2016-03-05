'use strict';

// Only Modules required here will be accessible through "window.appRequire()".
require('jquery');
require('lodash');

// These Modules are not secret; let's expose them!
window.appRequire = require;
