/*
 * stickyfloat - jQuery plugin for verticaly floating anything in a constrained area
 *
 * Example: jQuery('#menu').stickyfloat({duration: 400});
 * parameters:
 *    duration    - the duration of the animation
 *    startOffset - the amount of scroll offset after it the animations kicks in
 *    offsetY     - the offset from the top when the object is animated
 *    lockBottom  - 'true' by default, set to false if you don't want your floating box to stop at parent's bottom
 *    paused      - 'false' by default. pauses the scrolling
 *
 * Current version: 2.0
 * Matte Edens - matte@silent-e.com
 * https://github.com/silent-e/stickyfloat
 *
 * Based on the original version and mods
 *
 * Original 05.16.2009 r1
 * Copyright (c) 2009 Yair Even-Or
 * vsync.design@gmail.com
 *
 * Mods by: Christopher Haupt, Webvanta Inc.
 * http://www.webvanta.com/, http://twitter.com/chaupt, http://github.com/chaupt
 * Honor options set by user.
 * https://gist.github.com/728487
 */

(function($){
  $.stickyfloat = function(el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;

    base.$el.data('stickyfloat', base);

    base.init = function() {
      base.options = $.extend({}, $.stickyfloat.defaultOptions, options);

      var $parent          = base.$el.parent();
      var parentPaddingTop = parseInt($parent.css('padding-top'));
      var startOffset      = $parent.offset().top;

      // recalcHeight because the container the stickyfloater lives is in positioned
      recalcHeight($parent);

      if(base.options.lockBottom){
        var bottomPos = $parent.height() - base.$el.height() + parentPaddingTop; //get the maximum scrollTop value
        if( bottomPos < 0 )
          bottomPos = 0;
      }

      var calculatedOptions = {
        startOffset: startOffset,
        offsetY: parentPaddingTop,
        bottomPos: bottomPos
      }

      base.options = $.extend(calculatedOptions, base.options);

      base.$el.css({ position: 'absolute' });

      base.enableScroll();
    };

    base.scroll = function() {
      base.$el.stop(); // stop all calculations on scroll event

      var pastStartOffset      = $(document).scrollTop() > base.options.startOffset; // check if the window was scrolled down more than the start offset declared.
      var objFartherThanTopPos = base.$el.offset().top > base.options.startOffset;  // check if the object is at it's top position (starting point)
      var objBiggerThanWindow  = base.$el.outerHeight() < $(window).height();  // if the window size is smaller than the Obj size, then do not animate.

      var doScroll = (pastStartOffset || objFartherThanTopPos) && objBiggerThanWindow;

      var docScrollTop = $(document).scrollTop();

      // if window scrolled down more than startOffset OR obj position is greater than
      // the top position possible (+ offsetY) AND window size must be bigger than Obj size
      if( doScroll ){
        var newpos = (docScrollTop - base.options.startOffset + base.options.offsetY );
        if ( newpos > base.options.bottomPos )
          newpos = base.options.bottomPos;
        if ( docScrollTop < base.options.startOffset ) {// if window scrolled < starting offset, then reset Obj position (opts.offsetY);
          newpos = base.options.offsetY;
        }

        base.$el.animate({ top: newpos }, base.options.duration );
      }
    };

    base.enableScroll = function() {
      $(window).bind('scroll', base.scroll);
    }

    base.disableScroll = function() {
      $(window).unbind('scroll', base.scroll);
    }

    base.init();
  };

  $.stickyfloat.defaultOptions = {
    duration: 1200,  // duration of the animation
    lockBottom: true,
    paused: false
  }

  $.fn.stickyfloat = function(options) {

    return this.each(function() {
      (new $.stickyfloat(this, options));
    });

  };

  // PRIVATE FUNCTIONS

  function recalcHeight($obj) {
    $obj.css({ height: $obj.parent().height() - $obj.height()})
  };

})(jQuery);


