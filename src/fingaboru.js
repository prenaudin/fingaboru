/*
 * Fingaboru : Enhance your single page app transitions
 * Source : http://github.com/prenaudin/fingaboru
 *
 * Copyright (c) 2014 Pierre Renaudin
 * Licensed under the MIT license.
 */

+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function animationEnd() {
    var el = document.createElement('fingaboru')

    var animationEndEventNames = {
      'WebkitAnimation' : 'webkitAnimationEnd',
      'OAnimation' : 'oAnimationEnd',
      'msAnimation' : 'MSAnimationEnd',
      'animation' : 'animationend'
    }

    var animationEndName

    for (var animname in animationEndEventNames) {
      if (el.style[animname] !== undefined) {
        animationEndName = animationEndEventNames[animname]
      }
    }

    if(animationEndName) return { end: animationEndName }
    return false // explicit for ie8
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateAnimationEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('fgbAnimationEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.animation.end) }
    setTimeout(callback, duration)
    return this
  }

  $.support.animation = animationEnd()

  if ($.support.animation) {
    $.event.special.fgbAnimationEnd = {
      bindType: $.support.animation.end,
      delegateType: $.support.animation.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
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
     index     : 1,
     attr  : 'data-fingaboru-page'
  }

  Fingaboru.prototype.init = function (type, element, options) {
    this.type       = type
    this.$element   = $(element)
    this.options    = this.getOptions(options)
    this.$pages     = this.$element.find(this.options.attr)

    var startIndex = this.options.index
    var selector   = '[' + this.options.attr + '="' + startIndex + '"]'
    this.from = this.$element.find(selector).addClass('page-active')
    this.to   = null
  }

  Fingaboru.prototype.getDefaults = function () {
    return Fingaboru.DEFAULTS
  }

  Fingaboru.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), options)
    return options
  }

  Fingaboru.prototype.goto = function(options) {
    options = $.extend({}, {
        index : 1,
        animate   : true }, options)
    var index = options.index

    var diff
    if(index === 'previous')
      index = this.options.index-1
    else if(index === 'next')
      index = this.options.index+1

    diff = index - this.options.index
    this.selectPage(index)
    this.options.index = index

    if(options.animate === false || diff === 0) {
      console.log('FGB - diff', diff)
      console.log('FGB - to', this.to)
      this.to.addClass('page-active')
      console.log('FGB - to class', this.to.attr('class'))
      this.complete()
      console.log('FGB - to class', this.to.attr('class'))
      return
    }

    if(diff > 0)
      this.transitionPage(index, 'slide-from-right', 'slide-to-left')
    else
      this.transitionPage(index, 'slide-from-left', 'slide-to-right')
  }

  Fingaboru.prototype.selectPage = function( transitionPage ) {
    this.from = this.$element.find('[' + this.options.attr + '].page-active')
    this.to   = this.$element.find('[' + this.options.attr + '="' + transitionPage + '"]')
  }

  Fingaboru.prototype.transitionPage = function( transitionPage, transitionInEffect, transitionOutEffect ) {
    if (this.isAnimating) {
      this.complete()
    }

    this.isAnimating      = true
    this.transitionInEffect  = transitionInEffect
    this.transitionOutEffect = transitionOutEffect

    this.selectPage(transitionPage)

    this.to.addClass('page-animating page-active ' + this.transitionInEffect)
    this.from.addClass('page-animating ' + this.transitionOutEffect)

    $.support.animation ?
      this.to
        .one('fgbAnimationEnd', $.proxy(this.complete, this))
        .emulateAnimationEnd(500) :
      this.complete()
  }

  Fingaboru.prototype.complete = function() {
    this.isAnimating = false
    if (this.from.get(0) !== this.to.get(0)) this.from.removeClass('active')

    this.from.removeClass('page-animating ' + this.transitionOutEffect)
    this.to.removeClass('page-animating ' + this.transitionInEffect)

    this.$element.trigger($.Event('shown.fingaboru'))
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
  }

  $.fn.fingaboru.Constructor = Fingaboru

  // FINGABORU NO CONFLICT
  // ===================

  $.fn.fingaboru.noConflict = function () {
    $.fn.fingaboru = old
    return this
  }

}(jQuery);
