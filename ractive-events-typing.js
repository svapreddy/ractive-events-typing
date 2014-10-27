;
(function (global, factory) {

    'use strict';

    // Common JS (i.e. browserify) environment
    if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
        factory(require('ractive'));
    }

    // AMD?
    else if (typeof define === 'function' && define.amd) {
        define(['ractive'], factory);
    }

    // browser global
    else if (global.Ractive) {
        factory(global.Ractive);
    } else {
        throw new Error('Could not find Ractive! It must be loaded before the ractive-events-typing plugin');
    }

}(typeof window !== 'undefined' ? window : this, function (Ractive) {

    'use strict';

    var typing = function (node, fire) {

        var eligibleForTyping = ({
            "inputtext": 0,
            "input": 0,
            "textareatextarea": 0
        })[[(node.tagName || "").toLowerCase(), (node.type || "").toLowerCase()].join('')] === 0 || typeof(node.contentEditable) != 'undefined';

        var delay;

        // Options
        try {
            document.createEvent("TouchEvent");
            delay = 1000;
        } catch (e) {
            delay = 500;
        }

        if (eligibleForTyping) {
            var typing = false,
                timer = null,
                stopped;

            var startedTyping = function (event) {

                var that = this;

                clearTimeout(timer);

                (stopped === undefined || stopped === true) && fire({
                    node: that,
                    original: event,
                    typingState: 'typing',
                    sourceKey: event.type === "paste" ? "paste" : "typed"
                });

                stopped = false;

                timer = setTimeout(function () {
                    // stopped is used to stop continuous fire of state `typing`
                    stopped = true;
                    fire({
                        node: that,
                        original: event,
                        typingState: 'paused'
                    });
                }, delay);

            };

            var typedKeys = function (event) {
                if ([8, 46].indexOf(event.keyCode) > -1) {
                    startedTyping.call(this, event);
                }
            };

            var stoppedTyping = function (event) {
                timer && clearTimeout(timer);
                fire({
                    node: this,
                    original: event,
                    typingState: 'stopped'
                });
                stopped = undefined;
            };

            var beforeTyping = function (event) {
                fire({
                    node: this,
                    original: event,
                    typingState: 'beforetyping' // may be, need a good name for this.
                });
            };

            node.addEventListener('focus', beforeTyping);
            node.addEventListener('keypress', startedTyping);
            node.addEventListener('keydown', typedKeys);
            node.addEventListener('paste', startedTyping);
            node.addEventListener('blur', stoppedTyping);
            // Todo : stoppedTyping when window lose focus, for now getting error from ractive.js (?)
            // window.addEventListener('blur', stoppedTyping);
        }

        return {
            teardown: function () {
                node.removeEventListener('focus', beforeTyping);
                node.removeEventListener('keypress', startedTyping);
                node.removeEventListener('keydown', typedKeys);
                node.removeEventListener('paste', startedTyping);
                node.removeEventListener('blur', stoppedTyping);
                // window.removeEventListener('blur', stoppedTyping);
            }
        };
    };

    Ractive.events.typing = typing;

}));
