'use strict';

exports.command = function(selector) {
    return this.waitForElementVisible(selector)
        .click(selector);
};
