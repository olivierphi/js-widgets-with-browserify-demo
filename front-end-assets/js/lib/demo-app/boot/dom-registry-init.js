'use strict';

// Vendors modules
const $ = require('jquery');
// App modules
const varsRegistry = require('demo-app/core/vars-registry');

function initDomRegistry() {
    // Let's cache some jQuery items!
    const domRegistry = {};

    domRegistry.$window = $(window);
    domRegistry.$document = $(document);
    domRegistry.$html = $('html');
    domRegistry.$body = $('body');
    domRegistry.$htmlAndBody = $('html, body');

    // Let's remove the "no-js" class (can be useful to style elements when JS is disabled)
    domRegistry.$html.removeClass('no-js');

    // Our Ajax tools will have to append temporary content to the document;
    // let's give them a dedicated HTML container for that :-)
    const $ajaxTmpContainer = $(document.createElement('div'));
    $ajaxTmpContainer.attr('id', 'ajax-tmp-container');
    $ajaxTmpContainer.attr('class', 'hidden');
    domRegistry.$body.append($ajaxTmpContainer);
    domRegistry.$ajaxTmpContainer = $ajaxTmpContainer;

    varsRegistry.dom = domRegistry;
}


// CommonJS exports
module.exports.initDomRegistry = initDomRegistry;
