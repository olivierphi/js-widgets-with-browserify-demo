'use strict';

// Node.js modules
const fs = require('fs');
// Vendors modules
const Pikaday = require('pikaday');//pika pika!
const insertCss = require('insert-css');
// App modules
const OnDomNodeRemovalMixin = require('./mixins/on-dom-node-removal');

// Pikaday css inclusion

// Thanks to brfs ("Browserify FS") widgets can embed their own resources :-)
const PIKADAY_CSS = fs.readFileSync(
    __dirname + '/../../../node_modules/pikaday/css/pikaday.css',
    'utf8'
);
const PIKADAY_DARK_THEME_CSS = fs.readFileSync(
    __dirname + '/../../../node_modules/pikaday/css/theme.css',
    'utf8'
);

insertCss(PIKADAY_CSS);
insertCss(PIKADAY_DARK_THEME_CSS);


class DatePickerWidget extends OnDomNodeRemovalMixin(class {}) {

    constructor($node) {
        super($node);
        this.$node = $node;
        this.datePicker = new Pikaday({ field: $node[0] });
        this.initOnDomNodeRemoval(this.$node);
    }

    // Thanks to the "OnDomNodeRemovalMixin", this method is called automatically if this widget DOM node is removed.
    onDOMNodeRemoved() {
        this.destroy();
    }

    destroy() {
        this.datePicker.destroy();
    }

}

// CommonJS exports
module.exports = DatePickerWidget;
