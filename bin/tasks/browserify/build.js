'use strict';

const APP_DATA = require('./_data');
const browserifyWithWidgets = require('../../../lib/tool/browserify-with-widgets');

browserifyWithWidgets.browserifyBuild(APP_DATA);
