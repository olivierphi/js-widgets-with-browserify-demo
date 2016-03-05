'use strict';

// Vendors modules
const $ = require('jquery');
// App modules
const domRegistryInit = require('demo-app/boot/dom-registry-init');
const widgetsInitializer = require('demo-app/core/widgets-initializer-from-dom');

// Only JS modules contained in this one will be accessible from external JavaScripts:
require('demo-app/boot/expose-modules');

$(document).ready(bootApp);


function bootApp () {

    domRegistryInit.initDomRegistry();
    widgetsInitializer.searchWidgets();

}
