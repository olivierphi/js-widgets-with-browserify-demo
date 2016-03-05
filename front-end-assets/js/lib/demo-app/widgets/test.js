'use strict';

// Vendors modules
const _ = require('lodash');

class TestWidget {

    constructor($node) {
        this.$node = $node;
        this.$node.css('outline', 'solid lime 1px');
        this.bindEvents();
    }

    bindEvents() {
        this.$node.on('click.test-widget', _.bind(this.onClick, this));
    }

    onClick() {
        this.$node.fadeOut(_.bind(this.destroy, this));
    }

    destroy() {
        this.$node.off('.test-widget');
        this.$node = null;
    }

}

// CommonJS exports
module.exports = TestWidget;
