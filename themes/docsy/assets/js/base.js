/*
 * Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function($) {

    'use strict';

    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        $('.popover-dismiss').popover({
            trigger: 'focus'
        });


        //Samples filters
        $(".filters .filter").click(function(){
            var filter = $(this).attr("filter");
            $(this).addClass("active").siblings().removeClass("active");
            $(".filter-item").hide();
            $(".filter-item[class*=" + filter + "]").show();
            if (filter == "all") { 
                $(".filter-item").show();
            }
        });

        
        //Newsletter
        $(".click-to-show").click(function(){
            $(this).hide();
            $(".hidden").slideToggle();
        });
        $(".scroll-to-bottom").click(function(){
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        });



        //Light/dark toggle
        $('#toggle-light-dark-mode').click(function(){
            if ($('html').hasClass('light-mode')) {
                $('html').removeClass('light-mode');
                document.getElementById("light-theme").remove();
                localStorage.setItem("light-dark-mode-storage", "dark");
            } else {
                $('html').addClass('light-mode');
                changeTheme("light");
                localStorage.setItem("light-dark-mode-storage", "light");
            }
        });

    });


    function bottomPos(element) {
        return element.offset().top + element.outerHeight();
    }

    // Bootstrap Fixed Header
    $(function() {
        var promo = $(".js-td-cover");
        if (!promo.length) {
            return
        }

        var promoOffset = bottomPos(promo);
        var navbarOffset = $('.js-navbar-scroll').offset().top;

        var threshold = Math.ceil($('.js-navbar-scroll').outerHeight());
        if ((promoOffset - navbarOffset) < threshold) {
            $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
        }


        $(window).on('scroll', function() {
            var navtop = $('.js-navbar-scroll').offset().top - $(window).scrollTop();
            var promoOffset = bottomPos($('.js-td-cover'));
            var navbarOffset = $('.js-navbar-scroll').offset().top;
            if ((promoOffset - navbarOffset) < threshold) {
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll');
            } else {
                $('.js-navbar-scroll').removeClass('navbar-bg-onscroll');
                $('.js-navbar-scroll').addClass('navbar-bg-onscroll--fade');
            }
        });
    });


}(jQuery));
