'use strict';

// Node.js modules
const fs = require('fs');
const path = require('path');
// Browserify stuff
const browserify = require('browserify');
const watchify = require('watchify');
// Third-party modules
const _ = require('lodash');
const colors = require('colors');
const shell = require('shelljs');

const ROOT_DIR = path.resolve(__dirname, '../..');
const JS_MODULES_SRC_DIR = path.join(ROOT_DIR, '/front-end-assets/js');
const JS_MODULES_TARGET_DIR = path.join(ROOT_DIR, '/web/js/modules');

const TEMPLATES_SEARCH_PATTERN = /\.html$/;
const MODULE_ID_PATTERN = /data-widget-module-id="([^"]+)"/;

const myDebug = false;


function browserifyBuild (appData) {

    const browserifyBundlerPromise = getBrowserifyBundler(appData, false);

    return browserifyBundlerPromise
        .then(_.partial(triggerBrowserifyBundle, appData));
}

function browserifyWatch (appData) {

    const browserifyBundlerPromise = getBrowserifyBundler(appData, true);

    return browserifyBundlerPromise
        .then(watchBrowserifyBundler);

    function watchBrowserifyBundler(browserifyBundler) {
        let nbRebundlesDone = 0;

        browserifyBundler.on('update', () => {
            console.log('Bundled because of "watch".'.green + ` (${++nbRebundlesDone})`.grey.italic);
            triggerBrowserifyBundle(appData, browserifyBundler)
        });

        triggerBrowserifyBundle(appData, browserifyBundler)
    }
}

function triggerBrowserifyBundle(appData, browserifyBundler) {
    const targetFilePath = `${JS_MODULES_TARGET_DIR}/${_.kebabCase(appData.LABEL)}-bundle.js`;
    console.log('Bundled in ', targetFilePath.cyan);

    return browserifyBundler.bundle()
        .on('error', _.bind(console.error, console, 'Browserify Error:'))
        .pipe(fs.createWriteStream(targetFilePath));
}

function getBrowserifyBundler(appData, doWatchify, browserifyArgs) {
    browserifyArgs = browserifyArgs || {};

    return findUsedWidgetsModules(appData.VIEWS_PATHS)
        .then(_.partial(setupBrowserifyWithWidgetsModulesIds, appData, doWatchify, browserifyArgs))
        .catch((e) => {
            console.error(e);
            throw e;
        })
    ;
}

function setupBrowserifyWithWidgetsModulesIds(appData, doWatchify, browserifyArgs, widgetsModulesIds) {

    myDebug && console.log('widgetsModulesIds=', widgetsModulesIds);

    ensureAppSrcIsInNodeModules();

    if (doWatchify) {
        browserifyArgs = { cache: {}, packageCache: {} };
    }

    // Builder init
    const browserifyFullArgs = _.defaults(
        browserifyArgs,
        {
            basedir: JS_MODULES_SRC_DIR + '/node_modules',
            debug: true,
            standalone: appData.LABEL,
        }
    );

    const bundler = browserify(browserifyFullArgs);

    if (doWatchify) {
        bundler.plugin(watchify);
    }

    // Browserify transforms
    bundler.transform('brfs', {
        global: true
    });

    // ES6 please!
    bundler.transform('babelify', {
        presets: ['es2015'],
        only: /demo-app/ //we don't want to babelify vendors modules :-)
    });

    // App components
    bundler.add(appData.ENTRY_POINT_MODULE_ID);
    // App Widgets (must be "requireable")
    widgetsModulesIds.forEach((widgetModuleId) => {
        bundler.require(widgetModuleId);
    });
    // Additional Modules
    appData.ADDITIONAL_MODULES_TO_REQUIRE.forEach((moduleId) => {
        bundler.require(moduleId);
    });

    console.log('JS app compilation:'.yellow);
    console.log((` > ${widgetsModulesIds.length} widgets modules included ` + '(from HTML templates parsing)'.italic + ':').yellow);
    if (appData.ADDITIONAL_MODULES_TO_REQUIRE.length) {
        console.log(` > ${appData.ADDITIONAL_MODULES_TO_REQUIRE.length} additional modules included on demand:`.yellow);
    }

    return bundler;
}

function findUsedWidgetsModules (viewsDirsArray) {

    const widgetsPromisesArray = _.map(viewsDirsArray, (viewDir) => {
        return new Promise(_.partial(findWidgetsModules, viewDir));
    });

    return Promise.all(widgetsPromisesArray).then((modulesArrays) => {
        modulesArrays = _.chain(modulesArrays).flatten().filter().uniq().value();

        return modulesArrays;
    });
}

function findWidgetsModules(targetViewsDir, resolve, reject) {

    const relativeDir = path.relative(ROOT_DIR, targetViewsDir);

    // ShellJS for the win! :-)
    const templatesFilesPaths = shell
            .find(relativeDir)
            .filter((filePath) => { return filePath.match(TEMPLATES_SEARCH_PATTERN) })
    ;
    const usedWidgetsLinesAsStr = shell.grep(MODULE_ID_PATTERN, templatesFilesPaths);

    // Thanks to ShellJS find+grep, we now have a string with raw HTML lines containing our widgets ids. We just have to clean it!
    const usedWidgetsLines = usedWidgetsLinesAsStr.split('\n');

    const usedWidgetsModulesIds = _.chain(usedWidgetsLines)
        .filter(removeFalsy)
        .map(getWidgetModuleIdFromLine)
        .filter(removeFalsy)
        .uniq()
        .value()
    ;

    resolve(usedWidgetsModulesIds);

    function removeFalsy(item) {
        return !!item;
    }

    function getWidgetModuleIdFromLine(line) {
        const matches = MODULE_ID_PATTERN.exec(line);
        if (matches) {
            return matches[1];
        }
    }
}

function ensureAppSrcIsInNodeModules() {

    // In order to use our "lib/demo-app" CommonJS modules, we have to create a symbolic link of it into "node_modules/":
    const linkSource = JS_MODULES_SRC_DIR + '/lib/demo-app';
    const linkTarget = JS_MODULES_SRC_DIR + '/node_modules/demo-app';

    try {
        fs.statSync(linkTarget);
    } catch (e) {
        myDebug && console.log(`Let's create a symlink from ${linkSource.yellow} to ${linkTarget.yellow}`);
        shell.ln('-s', linkSource, linkTarget);
    }

}

// CommonJS exports
module.exports.browserifyBuild = browserifyBuild;
module.exports.browserifyWatch = browserifyWatch;

