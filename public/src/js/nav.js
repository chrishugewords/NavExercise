"use strict";

var _ = require('underscore');
var helpers = require('./helpers');

var _defaults = {
    'appendTo'       : 'nav',
    'elId'           : 'mainNav',
    'className'      : 'main-nav',
    'navOpenClass'   : 'nav-open',
    'selectedClass'  : 'selected',
    'subParentClass' : 'has-sub-nav',
    'navBurgerClass' : 'nav-burger',
    'navBurgerId'    : 'navBurger',
    'bodySubNavClass': 'subnav-open'
};

function Nav (options, data) {

    this.options = _.extend(_defaults, options);
    this.targetEl = document.getElementById(this.options.appendTo);
    
    if (this.targetEl && data && data.items) {
        this.body = document.body;
        this.navEl = this.createNav(data.items, 1);
        this.navEl.id = this.options.elId;
        this.burgerBtn = this.createHamburger();
        this.targetEl.appendChild(this.burgerBtn);
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

    createHamburger : function () {
        
        var self = this;
        var burger = document.createElement('a');
        var topBun = document.createElement('span');
        var meat = document.createElement('span');
        var bottomBun = document.createElement('span');
        
        topBun.className = 'top bun';
        meat.className = 'meat';
        bottomBun.className = 'bottom bun';
        burger.appendChild(topBun);
        burger.appendChild(meat);
        burger.appendChild(bottomBun);
        burger.id = this.options.navBurgerId;
        burger.className = this.options.navBurgerClass;
        
        burger.addEventListener('click', function (event) {
            self.onBurgerClicked(event);
        });
        
        return burger;
    
    },

    onBurgerClicked : function (event) {
        helpers.toggleClass(this.targetEl, this.options.navOpenClass);
        helpers.toggleClass(this.body, this.options.navOpenClass);
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
            helpers.addClass(li, this.options.subParentClass);
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
            helpers.removeClass(this.body, this.options.bodySubNavClass);
            helpers.removeClass(parentUl, selectedClass);   
            return false;
        }
        
        this.closeAllSubs(false);
        
        helpers.addClass(this.body, this.options.bodySubNavClass); 
        helpers.addClass(parentUl, selectedClass);

        return false;
    },

    /**
     * close all subnavs by removing the class designated in this.options.subParentClass
     * @param  {boolean} clearBody - if true, removes this.options.bodySubNavClass from the body
     */
    closeAllSubs : function (clearBody) {
        
        var hasSubs = this.targetEl.getElementsByClassName(this.options.subParentClass);
        var selectedClass = this.options.selectedClass;
        
        _.each(hasSubs, function (li) {
            helpers.removeClass(li, selectedClass);
        });
        
        if (clearBody) {
            helpers.removeClass(this.body, this.options.bodySubNavClass); 
        }

    },

    /**
     * closes all open navs and subnavs
     */
    closeAllNavs : function () {
        this.closeAllSubs(true);
        helpers.removeClass(this.targetEl, this.options.navOpenClass);
        helpers.removeClass(this.body, this.options.navOpenClass);
    },

    /**
     * listen to the overlays by className 
     * removes open class from body and nav and selected class from any nav items with subnavs
     * @param  {string} overlayClass - the class name of the overlays you want to listen to
     */
    bindOverlay : function (overlayClass) {
        
        var self = this;
        var overlays = document.getElementsByClassName(overlayClass);
      
        _.each(overlays, function (overlay) {
            overlay.addEventListener('click', function (event) {
                self.closeAllNavs();
            });
        });
       
    },

    /**
     * fix for weird touch issue on iOs devices,
     * add class .touch-scrollable to enable touch scrolling on elements
     */
    touchHack : function () {
        document.body.addEventListener('touchmove', function (e) {
            if (helpers.hasClass(document.body, 'nav-open')) {
                e.preventDefault();
            }
        });
        
    }

});

module.exports = Nav;