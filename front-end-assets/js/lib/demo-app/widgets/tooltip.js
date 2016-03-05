'use strict';

// Vendors modules
const _ = require('lodash');
// App modules
const OnDomNodeRemovalMixin = require('./mixins/on-dom-node-removal');

// jQuery plugins: we just need to "require()" them in order to enable them.
require('demo-app/shims/tipso');

class TooltipWidget extends OnDomNodeRemovalMixin(class {}) {

    constructor($node) {
        super($node);
        this.$node = $node;
        this.bindEvents();
        this.initOnDomNodeRemoval($node);
    }

    bindEvents() {
        this.$node.css('outline', 'solid red 1px');//just to show people where this widget is used :-)
        this.$node.on('mouseover.tooltip', _.bind(this.onMouseOver, this));
        this.$node.on('mouseout.tooltip', _.bind(this.onMouseOut, this));
    }

    onMouseOver() {
        if (!this._tooltipInitialized) {
            this.initTooltip();
        }
        this.$node.tipso('show');
    }

    onMouseOut() {
        this.$node.tipso('hide');
    }

    initTooltip() {
        this.$node.tipso({
            content: this.$node.data('tooltip-content'),
            background: this.$node.data('tooltip-bg-color') || 'rgba(0, 0, 0, 0.5)',
        });
        this._tooltipInitialized = true;
    }

    // Thanks to the "OnDomNodeRemovalMixin", this method is called automatically if this widget DOM node is removed.
    onDOMNodeRemoved() {
        this.destroy();
    }

    destroy() {
        this.$node.tipso('destroy');
        this.$node.off('.tooltip');
        this.$node = null;
    }

}

// CommonJS exports
module.exports = TooltipWidget;
