"use strict";

var root = window || global;
var helpers = require('./helpers');
var Nav = require('./nav');


var main = {
    init : function() {
        helpers.ajax.get('/api/nav.json', function(data, err) {
            if (err) {
                console.log('error getting json', err);
            } else {
                root.nav = new Nav({}, data);
                root.nav.bindOverlay('nav-overlay');
                if ('ontouchstart' in document.documentElement) {
                    root.nav.touchHack();
                }
            }
        });
    }
};

root.onload = main.init;


