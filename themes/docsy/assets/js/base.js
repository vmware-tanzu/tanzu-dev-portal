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
            $(".filter-item[class*='" + filter + "']").show();
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

        // Team Index Page
        //// Make social links works inside clickable div
        $("div.person div.card").click(function() {
            window.location = $(this).find("a").attr("href");
        });
        $('div.card a').click(function(e) {
            e.stopPropagation();
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

        //Open external links/rss in new tab, tvc links in same tab
        $("a[href^='http']").attr('target', '_blank');
        $("a[href*='tanzu.vmware.com/developer']").attr('target', '_self');
        $("a[href*='rss']").attr('target', '_blank');


        //Open youtube links with class 'lightbox' in lightbox
        $("a.lightbox[href*=youtube]").click(function() {
          var href = $(this).attr('href');
          $(this).attr('href', href + '?autoplay=1&autohide=1&showinfo=0&controls=1');
          $.fancybox({
              'padding'   : 0,
              'href'      : this.href.replace(new RegExp("watch\\?v=", "i"), 'embed/'),
              'type'      : 'iframe',
              'width'     : 1000,
              'height'    : 560,
              'autoSize'  : false,
              fitToView   : true
            });

          return false;
        });

        //Copy videos index iframe embed URLs to parent for lightbox
        $(".youtube-container").each(function(){
            var src = $(this).children(".youtube-small").attr('src').replace("?wmode=transparent&rel=0&modestbranding=1", "");
            $(this).attr("href", src);
        });

        //Open youtube embeds in lightbox
        $(".youtube-container").click(function() {
          var href = $(this).attr('href');
          $(this).attr('href', href + '?autoplay=1&autohide=1&showinfo=0&controls=1');
          $.fancybox({
              'padding'   : 0,
              'href'      : this.href,
              'type'      : 'iframe',
              'width'     : 1000,
              'height'    : 560,
              'autoSize'  : false,
              fitToView   : true
            });

          return false;
        });

        //Toggle mobile menu
        $("#menu-toggle").click(function(){
          $(".td-navbar .td-navbar-nav-hamburger").toggleClass("open");
          $(".td-navbar .td-navbar-nav-hamburger .navbar-nav .nav-item").toggle();
        });

        // Handle in-page anchor links with fixed header
        $('a[href^="#"]').click(function(e) {
            if (this.hash.length > 1) { // don't do this for empty # links
                window.location.href = this.href;
                e.preventDefault();
                scrollToTarget(this.hash);
            }
        });

        // Scroll to the right place when loading in-page anchor links
        $(window).on('load', function(e){
            var target = window.location.hash;
            if (target) {
                scrollToTarget(target);
            }
        });

    });  

    function scrollToTarget(target) {
        var headerHeight = 80; 
        if (document.getElementById("live-notify").style.display == "block")
            headerHeight = headerHeight + 40;
        var targetId = target.replace(":","\\:");
        $('html, body').animate(
            { scrollTop: $(targetId).offset().top - headerHeight },
            0,
            'linear'
        );
    }

    var check = isTvShowLive();
    if (check) {
        document.getElementsByClassName("td-main")[0].style.marginTop = 40;
        var liveShowElement = document.getElementById("live-show-name");
        if (liveShowElement != null) liveShowElement.innerHTML = liveShowName;
        var liveNotify = document.getElementById("live-notify");
        if (liveNotify != null) {
            liveNotify.href = liveShowLink;
            liveNotify.style.display = "block";
        }
    }   

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
