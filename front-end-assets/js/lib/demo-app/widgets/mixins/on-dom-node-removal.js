'use strict';

// Vendors modules
const $ = require('jquery');
const _ = require('lodash');

// This may not be the most elegant mixin solution, but... it works :-)
// @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Mix-ins

const OnDomNodeRemovalMixin = Base => class extends Base {

    initOnDomNodeRemoval($node) {
        this.__$parents = $node.parents();

        if (!this.__$parents) {
            return;
        }

        this.__bindedOnDocumentDOMNodeRemoved = _.bind(this.__onDocumentDOMNodeRemoved, this);
        $(document).on('DOMNodeRemoved', this.__bindedOnDocumentDOMNodeRemoved);
    }

    __onDocumentDOMNodeRemoved(event) {
        if (!this.__$parents) {
            return;
        }

        const removedNode = event.target;

        if (removedNode === this.$node[0] || this.__$parents.filter(removedNode).length > 0) {
            // Seems we have disappeared. This is... Seppuku Time! ⚔
            $(document).off('DOMNodeRemoved', this.__bindedOnDocumentDOMNodeRemoved);
            this.onDOMNodeRemoved();
        }
    }

};

// CommonJS exports
module.exports = OnDomNodeRemovalMixin;
