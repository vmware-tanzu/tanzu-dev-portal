// Code By Webdevtrick ( https://webdevtrick.com )
(function($){
    "use strict";

    var bindToClass      = 'carousel',
        containerWidth   = 0,
        scrollWidth      = 0,
        posFromLeft      = 0,    
        stripePos        = 0,   
        animated         = null,
        $slide, $carousel, el, $el, ratio, scrollPos, nextMore, prevMore, pos, padding;

    function calc(e){
        $el = $(this).find(' > .wrap');
        el  = $el[0];
        $carousel = $el.parent();
        $slide = $el.prev('.slide');

        nextMore = prevMore  = false; 

        containerWidth       = el.clientWidth;
        scrollWidth          = el.scrollWidth; 
        padding              = 0.2 * containerWidth; 
        posFromLeft          = $el.offset().left;
        stripePos            = e.pageX - padding - posFromLeft;
        pos                  = stripePos / (containerWidth - padding*2);
        scrollPos            = (scrollWidth - containerWidth ) * pos;
        
        if( scrollPos < 0 )
          scrollPos = 0;
        if( scrollPos > (scrollWidth - containerWidth) )
          scrollPos = scrollWidth - containerWidth;
      
        $el.animate({scrollLeft:scrollPos}, 200, 'swing');
        
        if( $slide.length )
            $slide.css({
                width: (containerWidth / scrollWidth) * 100 + '%',
                left: (scrollPos / scrollWidth ) * 100 + '%'
            });

        clearTimeout(animated);
        animated = setTimeout(function(){
            animated = null;
        }, 200);

        return this;
    }

    function move(e){
        if( animated ) return;

        ratio     = scrollWidth / containerWidth;
        stripePos = e.pageX - padding - posFromLeft; 

        if( stripePos < 0)
            stripePos = 0;

        pos = stripePos / (containerWidth - padding*2); 

        scrollPos = (scrollWidth - containerWidth ) * pos;   

        el.scrollLeft = scrollPos;
        if( $slide[0] && scrollPos < (scrollWidth - containerWidth) )
          $slide[0].style.left = (scrollPos / scrollWidth ) * 100 + '%';

        prevMore = el.scrollLeft > 0;
        nextMore = el.scrollLeft < (scrollWidth - containerWidth);

        $carousel.toggleClass('left', prevMore);
        $carousel.toggleClass('right', nextMore);
    }

    $.fn.carousel = function(options){
        $(document)
            .on('mouseenter.carousel', '.' + bindToClass, calc)
            .on('mousemove.carousel', '.' + bindToClass, move);
    };

    $.fn.carousel();

})(jQuery);