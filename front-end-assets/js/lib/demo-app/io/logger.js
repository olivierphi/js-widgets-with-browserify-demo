'use strict';

const consoleMethods = [
    'debug',
    'error',
    'info',
    'log',
    'warn',
    'dir',
    'dirxml',
    'table',
    'trace',
    'assert',
    'count',
    'markTimeline',
    'profile',
    'profileEnd',
    'time',
    'timeEnd',
    'timeStamp',
    'timeline',
    'timelineEnd',
    'group',
    'groupCollapsed',
    'groupEnd',
    'clear',
];

const c = window.console;
for (let i = 0, j = consoleMethods.length; i < j; i++) {
    let currentMethod = consoleMethods[i];
    (function(method) {
        module.exports[currentMethod] = function() {
            if (c && c[method] && (c[method] instanceof Function)) {
                return c[method].apply(c, arguments);
            }
        };
    })(currentMethod);
}
