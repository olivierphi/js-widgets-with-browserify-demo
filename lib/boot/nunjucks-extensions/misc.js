'use strict';

// Vendors modules
const shortid = require('shortid');

function registerExtension(env) {
    env.addGlobal('uniqueId', uniqueId);
}

function uniqueId(prefix) {
    prefix = prefix || '';
    return shortid.generate(prefix);
}


module.exports.registerExtension = registerExtension;
