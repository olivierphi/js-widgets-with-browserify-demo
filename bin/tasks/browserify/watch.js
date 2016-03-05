'use strict';

const APP_DATA = require('./_data');
const browserifyWithWidgets = require('../../../lib/tool/browserify-with-widgets');

browserifyWithWidgets.browserifyWatch(APP_DATA);
