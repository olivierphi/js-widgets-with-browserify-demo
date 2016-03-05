'use strict';

// Node.js core modules
const path = require('path');
// Vendors modules
const nunjucks = require('nunjucks');

function initNunjucks(expressApp) {

    // Nunjucks template engine init
    const env = nunjucks.configure(path.join(__dirname, '/../templates'), {
        autoescape: true,
        express: expressApp,
        cache: false,//demo mode ^_^
    });

    // Set Nunjucks as rendering engine for pages with .html.twig suffix
    expressApp.engine('.html.twig', env.render) ;
    expressApp.set('view engine', '.html.twig');

    // Extensions initialization!
    require('./nunjucks-extensions/misc').registerExtension(env);
}

module.exports.initNunjucks = initNunjucks;
