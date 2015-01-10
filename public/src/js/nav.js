"use strict";

var _ = require('underscore');
var helpers = require('./helpers');

var _defaults = {
    'appendTo'       : 'nav',
    'elId'           : 'mainNav',
    'className'      : 'main-nav',
    'selectedClass'  : 'selected',
    'subNavParentClass'   : 'has-sub-nav',
    'bodyNavClass' : 'nav-open'
};

function Nav (options, data) {

    this.options = _.extend(_defaults, options);
    this.targetEl = document.getElementById(this.options.appendTo);
    
    if (this.targetEl && data && data.items) {
        this.navEl = this.createNav(data.items, 1);
        this.navEl.id = this.options.elId;
        this.targetEl.appendChild(this.navEl);
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
            helpers.addClass(li, this.options.subNavParentClass);
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
        var body = document.getElementsByTagName('body')[0];
        event.preventDefault();

        if (helpers.hasClass(parentUl, selectedClass)) {
            helpers.removeClass(body, this.options.bodyNavClass);
            helpers.removeClass(parentUl, selectedClass);   
            return false;
        }
        helpers.addClass(body, this.options.bodyNavClass);
        hasSubs = this.targetEl.getElementsByClassName(this.options.subNavParentClass);
        _.each(hasSubs, function (li) {
            helpers.removeClass(li, selectedClass);
        });
        
        helpers.addClass(parentUl, this.options.selectedClass);

        return false;
    }

});

module.exports = Nav;