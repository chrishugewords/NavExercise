"use strict";

module.exports = {

    ajax : {
        get : function (url, callBack) {
            var data;
            var err;
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    try {
                        data = JSON.parse(request.responseText);
                    } catch (err) {
                        err = err;
                    }
                    callBack(data, err);
                } else {
                    callBack(null, request)
                }
            };

            request.onerror = function () {
                // There was a connection error of some sort
                callBack(null, request);
            };

            request.send();
        }
    },

    hasClass : function (el, className) {
        var elClasses = el.className.split(' ');
        return elClasses.indexOf(className) !== -1;
    },
    
    addClass : function (el, className) {
        var elClass = el.className;
        if (!this.hasClass(el, className)) {
            el.className += elClass.length ? ' ' + className : className;
        }
        return el;
    },

    removeClass : function (el, className) {
        var elClasses = el.className.split(' ');
        var i = elClasses.indexOf(className);
        if (i !== -1) {
            elClasses.splice(i, i+1);
            el.className = elClasses.join(' ').trim();
        }
        return el;
    }

 }