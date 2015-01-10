"use strict";

var _ = require('underscore');
var helpers = require('./helpers');

function Nav (options, data) {

    var _defaults = {
        'appendTo' : 'nav',
        'el' : 'mainNav',
        'className' : 'main-nav',
        'selectedClass' : 'selected',
        'hasSubNavClass'   : 'has-sub-nav'
    };

    this.options = _.extend(_defaults, options);
    this.targetEl = document.getElementById(this.options.appendTo);
    if (this.targetEl && data && data.items) {
        this.targetEl.appendChild(this.createNav(data.items, 1));
    }

}

_.extend(Nav.prototype, {

    
    createNav : function (items, level) {
        
        var ul = document.createElement('ul');        
        
        ul.className = this.options.className + '-l' + level +'-nav';
        for (var i = 0; i < items.length; i++) {
            ul.appendChild(this.createNavItem(items[i], level));
        }

        return ul;
    },

    createNavItem : function (data, level) {
        
        var self = this;
        var li = document.createElement('li');
        var a  = document.createElement('a');

        li.className = this.options.className + '-l' + level +'-item';
        a.className = this.options.className + '-l' + level + '-link';
        a.textContent = data.label;
        a.href = data.url;
        li.appendChild(a);

        if (data.items && data.items.length) {
            li.appendChild(this.createNav(data.items, level + 1));
            helpers.addClass(li, this.options.hasSubNavClass);
            a.addEventListener('click', function (event) {
                self.onSubNavClicked(event);
            });
        }

        return li;
    },

    onSubNavClicked : function (event) {
        
        var hasSubs; 
        var selectedClass = this.options.selectedClass;
        var parentUl = event.target.parentNode;
        
        event.preventDefault();

        if (helpers.hasClass(parentUl, selectedClass)) {
            helpers.removeClass(parentUl, selectedClass);   
            return false;
        }

        hasSubs = this.targetEl.getElementsByClassName(this.options.hasSubNavClass);
        _.each(hasSubs, function (li) {
            helpers.removeClass(li, selectedClass);
        });
        
        helpers.addClass(parentUl, this.options.selectedClass);

        return false;
    }

});

module.exports = Nav;