'use strict';

// Vendors modules
const $ = require('jquery');
const _ = require('lodash');
// App modules
const varsRegistry = require('demo-app/core/vars-registry');

class AjaxForm {

    constructor($node) {
        this.$node = $node;
        this.$node.css('outline', 'solid red 1px');
        this.bindEvents();
    }

    bindEvents() {
        this.$node.on('submit.ajax-form', _.bind(this.onSubmit, this));
    }

    onSubmit(event) {
        event.preventDefault();
        this.sendAjaxForm();

        return false;
    }

    sendAjaxForm() {
        if (!this.$node.attr('id')) {
            this.$node.attr('id', _.uniqueId('ajax-form-'));
        }

        if (0 === this.$node.find('[name="form-id"]').length) {
            // Let's send some additional info about the HTML structure...
            this.$node.append(`<input type="hidden" name="form-id" value="${this.$node.attr('id')}">`);
        }

        // Go!
        const formData = this.$node.serialize();
        $.ajax({
            url: this.$node.attr('action') || document.location,
            method: this.$node.attr('method') || 'POST',
            data: formData
        })
            .done( _.bind(this.onAjaxFormSendingSuccess, this))
            .fail( _.bind(this.onAjaxFormSendingError, this))
        ;
    }

    onAjaxFormSendingSuccess(receivedHtml) {
        varsRegistry.dom.$ajaxTmpContainer.html(receivedHtml);
    }

    onAjaxFormSendingError(jqXHR, textStatus, error) {
        throw error;
    }

    destroy() {
        this.$node.off('.test-widget');
        this.$node = null;
    }

}

// CommonJS exports
module.exports = AjaxForm;
