'use strict';

// Vendors modules
const $ = require('jquery');
const _ = require('lodash');
// App modules
const varsRegistry = require('demo-app/core/vars-registry');
const logger = require('demo-app/io/logger');

const WIDGET_MODULE_ID_DATA_KEY = 'widget-module-id';

const myDebugLevel = 2;
let initializationDone = false;

function initNodeWidgets() {
    const $node = $(this);
    const widgetModulesPathsStr = $node.attr(`data-${WIDGET_MODULE_ID_DATA_KEY}`);
    const widgetModulesPaths = _.uniq(widgetModulesPathsStr.split(','));

    _.forEach(widgetModulesPaths, _.partial(initWidget, $node));
}

function initWidget($node, widgetModulePath) {
    const nodeInitializedWidgets = $node.data('initializedWidgets') || [];
    if (nodeInitializedWidgets.indexOf(widgetModulePath) > -1) {
        return;//this widget has already been initialized on this node
    }

    (myDebugLevel > 1) && logger.debug(__filename, `Initializing "${widgetModulePath}" widget on DOM node:`, $node);

    nodeInitializedWidgets.push(widgetModulePath);
    $node.data('initializedWidgets', nodeInitializedWidgets);

    const widgetModuleClass = require(widgetModulePath);
    // Let's create a new widget instance on this jQuery-ized DOM node!
    new widgetModuleClass($node);
}

function searchWidgets($container) {
    if (!initializationDone) {
        initialize();
        initializationDone = true;
    }

    $container = $container || varsRegistry.dom.$document;

    const $widgetsToInit = $container.find(`[data-${WIDGET_MODULE_ID_DATA_KEY}]`);
    (myDebugLevel > 0) && logger.debug(__filename, $widgetsToInit.length + ' widgets to init.');
    $widgetsToInit.each(initNodeWidgets);
}

function onWidgetsSearchRequest(event, payload) {
    const targetContainerSelector = payload.targetSelector;
    const $targetContainer = $(targetContainerSelector);

    if (0 === $targetContainer.length) {
        logger.warn(__filename, sprintf(
            'JS Widgets search requested on "%s" container, but no DOM node has been found for this selector!',
            targetContainerSelector
        ));
        return;
    }

    searchWidgets($targetContainer);
}

function initialize() {
    varsRegistry.dom.$document.on('js-widgets:search-request', onWidgetsSearchRequest);
}

// CommonJS exports
module.exports.searchWidgets = searchWidgets;
