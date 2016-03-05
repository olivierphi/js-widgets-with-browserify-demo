'use strict';

// Vendors modules
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;


const PICTURE_PATTERN = 'http://pipsum.com/%(width)dx%(height)d.jpg?random=%(uniqueId)s';

class LoremPictureWidget {

    constructor($node) {
        this.$node = $node;
        this.$node.css('outline', 'solid purple 1px');
        this.bindEvents();
    }

    bindEvents() {
        this.$node.one('mouseover.lorem-picture', _.bind(this.onOver, this));
    }

    onOver() {
        this.loadLoremPicture();
    }

    loadLoremPicture() {
        const pictureUrl = sprintf(PICTURE_PATTERN, {
            width: this.$node.width(),
            height: this.$node.height(),
            uniqueId: _.uniqueId('lorem-picture-'),
        });

        this.$node.addClass('loading');
        this.$node.one('load', () => this.$node.removeClass('loading'));
        this.$node.attr('src', pictureUrl);
    }

    destroy() {
        this.$node.off('.lorem-picture');
        this.$node = null;
    }

}

// CommonJS exports
module.exports = LoremPictureWidget;
