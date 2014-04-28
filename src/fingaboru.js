/*
 * Fingaboru : Enhance your single page app transitions
 * Source : http://github.com/prenaudin/fingaboru
 *
 * Copyright (c) 2014 Pierre Renaudin
 * Licensed under the MIT license.
 */

+function ($) {
  'use strict';

  var animationEndEventNames = {
    'WebkitAnimation' : 'webkitAnimationEnd',
    'OAnimation' : 'oAnimationEnd',
    'msAnimation' : 'MSAnimationEnd',
    'animation' : 'animationend'
  }

  var transitionEndEventNames = {
    'WebkitTransition' : 'webkitTransitionEnd',
    'OTransition' : 'oTransitionEnd',
    'msTransition' : 'MSTransitionEnd',
    'transition' : 'transitionend'
  }

  // FINGABORU PUBLIC CLASS DEFINITION
  // ===============================

  var Fingaboru = function (element, options) {
    this.type       =
    this.options    =
    this.$element   = null

    this.init('fingaboru', element, options)
  }

   Fingaboru.DEFAULTS = {
     pageIndex     : 1,
     pageSelector  : '[data-fingaboru-page]'
  }

  Fingaboru.prototype.init = function (type, element, options) {
    this.type       = type
    this.$element   = $(element)
    this.options    = this.getOptions(options)
    this.$pages     = this.$element.find(this.options.pageSelector)

    this.transitionEndEventName      = this.getTransitionEndEventNames()
    this.animationEndEventName       = this.getAnimationEndEventNames()
    this.transitionAnimationEndEvent = this.animationEndEventName + ' ' + this.transitionEndEventName

    this.from = this.$pages.first().addClass('page-active')
    this.to   = null
  }

  Fingaboru.prototype.getDefaults = function () {
    return Fingaboru.DEFAULTS
  }

  Fingaboru.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), options)
    return options
  }

  Fingaboru.prototype.getTransitionEndEventNames = function () {
    return this.getEndEventNames( transitionEndEventNames )
  }

  Fingaboru.prototype.getAnimationEndEventNames = function () {
    return this.getEndEventNames( animationEndEventNames )
  }

  Fingaboru.prototype.getEndEventNames = function (obj) {
    var events = []
    for ( var eventName in obj ) {
      events.push( obj[ eventName ] )
    }
    return events.join(' ')
  }

  Fingaboru.prototype.goto = function(pageIndex) {
    var diff = pageIndex - this.options.pageIndex
    if(diff > 0)
      this.transitionPage(pageIndex, 'slide-from-right', 'slide-to-left')
    else
      this.transitionPage(pageIndex, 'slide-from-left', 'slide-to-right')
    this.options.pageIndex = pageIndex
  }

  Fingaboru.prototype.transitionPage = function( transitionPage, transitionInEffect, transitionOutEffect ) {

    if ( this.isAnimating ) {
      return false
    }

    this.isAnimating      = true
    this.isCurrentPageEnd = false
    this.isNextPageEnd    = false
    this.transitionInEffect  = transitionInEffect
    this.transitionOutEffect = transitionOutEffect

    // Get Pages
    this.from = this.$element.find('[data-fingaboru-page].page-active')
    this.to   = this.$element.find('[data-fingaboru-page="' + transitionPage + '"]')

    // Add this class to prevent scroll to be displayed
    this.to.addClass('page-animating page-active ' + this.transitionInEffect)
    this.from.addClass('page-animating')

    // Set Transition Class
    this.from.addClass(this.transitionOutEffect)

    var self= this

    this.to.on( this.transitionAnimationEndEvent, function() {

      self.to.off( self.transitionAnimationEndEvent )
      self.isNextPageEnd = true

      if ( self.isCurrentPageEnd ) {
        self.resetTransition()
      }
    })

    this.from.on( this.transitionAnimationEndEvent, function () {

      self.from.off( this.transitionAnimationEndEvent )
      self.isCurrentPageEnd = true

      if ( self.isNextPageEnd ) {
        self.resetTransition()
      }
    })
  }

  Fingaboru.prototype.resetTransition = function() {
    this.isAnimating      = false
    this.isCurrentPageEnd = false
    this.isNextPageEnd    = false

    this.from.removeClass('page-animating page-active ' + this.transitionOutEffect)
    this.to.removeClass('page-animating ' + this.transitionInEffect)

    $("html").removeClass("md-perspective")
  }

  Fingaboru.prototype.destroy = function () {
    this.$element.off('.' + this.type).removeData(this.type)
  }

  // FINGABORU PLUGIN DEFINITION
  // =========================
  var old = $.fn.fingaboru

  $.fn.fingaboru = function (option, params) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('fingaboru')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('fingaboru', (data = new Fingaboru(this, options)))
      if (typeof option == 'string') data[option](params)
    })
  };

  $.fn.fingaboru.Constructor = Fingaboru

  // FINGABORU NO CONFLICT
  // ===================

  $.fn.fingaboru.noConflict = function () {
    $.fn.fingaboru = old
    return this
  }

}(jQuery);
