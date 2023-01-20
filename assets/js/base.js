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

(function ($) {
  "use strict";


  // Make nav dark after scrolling past hero
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 180 || document.documentElement.scrollTop > 180) {
      document.querySelector("#navbar").classList.add("darken");
    }
    else {
      document.querySelector("#navbar").classList.remove("darken");
    }
  }


  // Skip to main content
  $("#skip-link").focus(function(e){
    $(this).addClass("active");
  });

  $(".navbar-brand").focus(function(e){
    $("#skip-link").removeClass("active");
  });

  const skipLink = document.getElementById("skip-link");
  skipLink.addEventListener("keydown", function(event) {
    if (event.which == 13 || event.which == 32) {
      $("header").nextAll().find("a[href]:not([href*='#'])").first().focus();
      $("#skip-link").removeClass("active");
    }
  });


  // Dim body div when nav is activated
  function dimBody () {
    $("header + .container-fluid").addClass("dim");
    $("#navbar").addClass("dropShadow");
  }

  // Hover nav w/ scope
  function removeNavClasses () {
    $('#scope').removeClass('learn-scope topics-scope tanzutv-scope community-scope');
    $('.dropdown').removeClass('show');
    $("header + .container-fluid").removeClass("dim");
    $("#navbar").removeClass("dropShadow");
  }
  $('#learn-target').mouseenter(function(){
    removeNavClasses();
    $('#scope').addClass('learn-scope');
    $('#learn').addClass('show');
    dimBody();
  });
  $('#tanzutv-target').mouseenter(function(){
    removeNavClasses();
    $('#scope').addClass('tanzutv-scope');
    $('#tanzutv').addClass('show');
    dimBody();
  });
  $('#community-target').mouseenter(function(){
    removeNavClasses();
    $('#scope').addClass('community-scope');
    $('#community').addClass('show');
    dimBody();
  });
  $('.drop-menu').mouseenter(function () {
    $('this').addClass('show');
    dimBody();
  });
  $('#main_navbar, #main_navbar .drop-menu').mouseleave(function () {
    removeNavClasses();
  });

  $( ".dropdown-item" ).focus(function() {
    $(".dropdown").removeClass("show");
    var parentDropdown = $(this).closest(".dropdown")
    parentDropdown.addClass("show");
    $("#scope").addClass(parentDropdown.attr("id") + "-scope");
  });

  $( "a:not(.dropdown-item)" ).focus(function() {
    $(".dropdown").removeClass("show");
    $("#scope").removeClass();
  });


  // Tab nav
  const mainNavbar = document.getElementById("main_navbar");
  mainNavbar.addEventListener("keydown", function(event) {

    const targetKey = event.target.getAttribute("data-menu");

    if (event.which == 13 || event.which == 32) {

      if (!$('#' + targetKey).hasClass('show')) {
        removeNavClasses();
        $('#scope').addClass(targetKey + '-scope');
        $('#' + targetKey).addClass('show');
        dimBody();
      } else {
        removeNavClasses();
      }

    }

    if ($('#' + targetKey).hasClass('show') && event.which == "9") {
      event.preventDefault();
      const firstLink = $('#' + targetKey).find("a").first();
      firstLink.focus();
      const firstLinkHref = firstLink.attr("href");

      const thisMenu = document.getElementById(targetKey);
      thisMenu.addEventListener("keydown", function(e) {
        if (e.shiftKey && e.which == "9") {
          if (e.target.getAttribute("href") == firstLinkHref) {
            e.preventDefault();
            $(event.target).focus();
            removeNavClasses();
          }
        }
        if (e.which == "27") {
          removeNavClasses();
          $(event.target).focus();
        }
      });
    }

    if (event.which == "27") {
      removeNavClasses();
    }

  });



  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $(".popover-dismiss").popover({
      trigger: "focus",
    });

    //Samples and Workshop page filters
    $(".filters .filter").click(function () {
      if (this.classList.contains("active")) {
        this.classList.remove("active");
      } else {
        this.classList.add("active")
        if($(this).attr("filter") === "all") {
          $(this).siblings().removeClass("active")
        } else {
          $("[filter=all]").removeClass("active")
        }
      }
      updateFilters()
    });

    //Newsletter
    $(".click-to-show").click(function () {
      $(this).hide();
      $(".hidden").slideToggle();
    });
    $(".scroll-to-bottom").click(function () {
      $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    });
    $(".click-to-show").keydown(function(event){
      if (event.which == 13 || event.which == 32) {
        $(this).hide();
        $(".hidden").slideToggle();
      }
    });

    // Team Index Page
    //// Make social links works inside clickable div
    $("div.person div.card").click(function () {
      window.location = $(this).find("a").attr("href");
    });
    $("div.card a").click(function (e) {
      e.stopPropagation();
    });

    //Light toggle
    $("#toggle-light-mode").click(function () {
      localStorage.setItem("light-dark-mode-storage", "light");
      var iframe = document.getElementById("auth-iframe");

      $("html").addClass("light-mode");
      changeTheme("light");
    });

    // Dark toggle
    $("#toggle-dark-mode").click(function () {
      var iframe = document.getElementById("auth-iframe");

      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage("dark", "*");
      }
      changeTheme('dark');
      localStorage.setItem("light-dark-mode-storage", "dark");

      if ($("html").hasClass("light-mode")) {
        $("html").removeClass("light-mode");
        document.getElementById("light-theme").remove();
      }
    });

    $("#theme-select").keyup(function (event) {
      if (event.which == 13 || event.which == 32) {

        if ($("html").hasClass("light-mode")) {
          var iframe = document.getElementById("auth-iframe");

          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage("dark", "*");
          }
          changeTheme('dark');
          localStorage.setItem("light-dark-mode-storage", "dark");

          $("html").removeClass("light-mode");
          document.getElementById("light-theme").remove();

        }  else {
          localStorage.setItem("light-dark-mode-storage", "light");
          var iframe = document.getElementById("auth-iframe");

          $("html").addClass("light-mode");
          changeTheme("light");

        }

        $("header + .container-fluid").removeClass("dim");

      }
    });

    $("#theme-select").keydown(function (e) {
      if (e.which == 9) {
        e.preventDefault();
        if ($(".promo-nav-banner a[href]").length) {
          $(".promo-nav-banner a[href]").focus();
        } else {
          $("header").nextAll().find("a[href]:not([href*='#'])").first().focus();
        }
      }
    });

    //Open external links/rss in new tab, tvc links in same tab
    $("a[href^='http']").attr("target", "_blank");
    $("a[href^='https://tanzu.vmware.com/developer']").attr("target", "_self");
    $("a[href*='rss']").attr("target", "_blank");

    // External link notification on tab
    const blankTargets = document.querySelectorAll("a[target*='blank']");
    blankTargets.forEach(function(elem) {
      elem.addEventListener("keyup", function(event) {
          $(event.target).addClass("external-link");
      });
      elem.addEventListener("keydown", function(event) {
          $(event.target).removeClass("external-link");
      });
    });


    //Open youtube links with class 'lightbox' in lightbox
    $("a.lightbox[href*=youtube]").click(function () {
      var href = $(this).attr("href");
      $(this).attr(
        "href",
        href + "?autoplay=1&autohide=1&showinfo=0&controls=1"
      );
      $.fancybox({
        padding: 0,
        href: this.href.replace(new RegExp("watch\\?v=", "i"), "embed/"),
        type: "iframe",
        width: 1000,
        height: 560,
        autoSize: false,
        fitToView: true,
      });
      return false;
    });

    $(".lightbox").fancybox({
      padding: 0,
    });

    //Show contact form lightbox if #contact in URL
    if (window.location.hash.indexOf("contact") > -1) {
      $("a.lightbox[href*=contact]").trigger("click");
    }

    //Adjust styles on embedded Marketo contact form on rabbmq-vs-kafka blog
    if (location.href.indexOf("rabbitmq-vs-kafka") > -1) {
      var checkContactFormExistsConsent = setInterval(function(){
        if ($('#contact .mktoForm input[id*=First]').length) {
          $('#contact .mktoForm select#Country').change(function(){
            if ($('#contact .mktoForm input[name=Phone_Consent__c]').length) {
              $("#contact .mktoForm input[type=checkbox]").parents("#contact .mktoForm .mktoFormCol").attr('style', 'width: auto');
              $(".fancybox-inner").attr('style','overflow-x: hidden');
            }
          });
          clearInterval(checkContactFormExistsConsent);
        }
      }, 100);
    }


    //Copy videos index iframe embed URLs to parent for lightbox
    $(".youtube-container").each(function () {
      var src = $(this)
        .children(".youtube-small")
        .attr("src")
        .replace("?wmode=transparent&rel=0&modestbranding=1", "");
      $(this).attr("href", src);
    });

    //Open youtube embeds in lightbox
    $(".youtube-container").click(function () {
      var href = $(this).attr("href");
      $(this).attr(
        "href",
        href + "?autoplay=1&autohide=1&showinfo=0&controls=1"
      );
      $.fancybox({
        padding: 0,
        href: this.href,
        type: "iframe",
        width: 1000,
        height: 560,
        autoSize: false,
        fitToView: true,
      });

      return false;
    });

    //Toggle mobile menu
    $("#menu-toggle").click(function () {
      $("#mobile-nav, #menu-toggle, body, nav").toggleClass("isOpen");
    });
    $("#menu-bars").keydown(function(event){
      if (event.which == 13 || event.which == 32) {
        $("#mobile-nav, #menu-toggle, body, nav").toggleClass("isOpen");
        $("#menu-close").focus();
      }
      if (event.which == 9) {
        event.preventDefault();
        if ($(".promo-nav-banner a[href]").length) {
          $(".promo-nav-banner a[href]").focus();
        } else {
          $("header").nextAll().find("a[href]:not([href*='#'])").first().focus();
        }
      }
    });
    $("#menu-close").keydown(function(event){
      if (event.which == 13 || event.which == 32) {
        $("#mobile-nav, #menu-toggle, body, nav").toggleClass("isOpen");
        $("#menu-bars").focus();
      }
    });

    //Capture shift+tab from main content to menu
    if ($(".promo-nav-banner a[href]").length) {
      $(".promo-nav-banner a[href]").keydown(function(e){
        if (e.shiftKey && e.which == "9") {
          e.preventDefault();
          $("#theme-select").focus();
          $("#menu-bars").focus();
        }
      });
    } else {
      $("header").nextAll().find("a[href]:not([href*='#'])").first().keydown(function(e){
        if (e.shiftKey && e.which == "9") {
          e.preventDefault();
          $("#theme-select").focus();
          $("#menu-bars").focus();
        }
      });
    }
  });

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
  $(function () {
    var promo = $(".js-td-cover");
    if (!promo.length) {
      return;
    }
    var promoOffset = bottomPos(promo);
    var navbarOffset = $(".js-navbar-scroll").offset().top;

    var threshold = Math.ceil($(".js-navbar-scroll").outerHeight());
    if (promoOffset - navbarOffset < threshold) {
      $(".js-navbar-scroll").addClass("navbar-bg-onscroll");
    }

    $(window).on("scroll", function () {
      var navtop = $(".js-navbar-scroll").offset().top - $(window).scrollTop();
      var promoOffset = bottomPos($(".js-td-cover"));
      var navbarOffset = $(".js-navbar-scroll").offset().top;
      if (promoOffset - navbarOffset < threshold) {
        $(".js-navbar-scroll").addClass("navbar-bg-onscroll");
      } else {
        $(".js-navbar-scroll").removeClass("navbar-bg-onscroll");
        $(".js-navbar-scroll").addClass("navbar-bg-onscroll--fade");
      }
    });
  });

  // Amplitude Events
  $(function () {
    // Track topic clicks - menu vs. explore section
    $(".topic a").click(function () {
      var topicName = this.innerHTML
        .substring(this.innerHTML.indexOf(">") + 2)
        .toLowerCase();
      sendAmplitudeEvent("topic clicked", {
        "topic name": topicName,
        source: "explore",
        "url path": window.location.pathname,
      });
    });

    $("a.dropdown-item[href*='/topic']").click(function () {
      var topicName = this.innerHTML.toLowerCase();
      sendAmplitudeEvent("topic clicked", {
        "topic name": topicName,
        source: "menu",
        "url path": window.location.pathname,
      });
    });

    // Track featured link clicks on home page
    $("a.featured-link").click(function () {
      var linkTitle = $("h4", this).text();
      sendAmplitudeEvent("featured link clicked", {
        "link title": linkTitle,
        "link url": this.href,
        "url path": window.location.pathname,
      });
    });

    // Track sample clicks - code download vs visit repo
    $("#sample-gh").click(function () {
      var sampleName = this.title;
      sendAmplitudeEvent("sample github clicked", {
        "sample name": sampleName,
        "url path": window.location.pathname,
      });
    });
    $("#sample-zip").click(function () {
      var sampleName = this.title;
      sendAmplitudeEvent("sample download clicked", {
        "sample name": sampleName,
        "url path": window.location.pathname,
      });
    });

    // Link Clicks (Guides, Tanzu.TV, Blog, Patterns, Videos)
    $(
      "body.guide a, body.guides a, body.tanzu-tv a, body.tv-show a, body.tv-episode a, body.blog a, body.pattern a, a.youtube-container"
    ).click(function () {
      var linkTitle = this.innerHTML;
      if (linkTitle.includes("navbar-logo")) linkTitle = "Home";
      else if (linkTitle.startsWith("<")) linkTitle = this.innerText;
      if (!this.href.endsWith("#"))
        sendAmplitudeEvent("link clicked", {
          "link title": linkTitle,
          "link url": this.href,
          "url path": window.location.pathname,
        });
    });

    // Track scroll depth on guides and blogs
    var scrollDepthCurrent = -1;
    $(window).scroll(function () {
      if ($("body.guide").length > 0 || $("div.blog").length > 0 || $("div.practices").length > 0) {
        var totalScrollHeight =
          document.querySelector("body").scrollHeight - window.innerHeight;
        var percentScrolled = window.scrollY / totalScrollHeight;
        var scrollDepth;
        if (percentScrolled < 0.25) scrollDepth = 0;
        else if (percentScrolled >= 0.25 && percentScrolled < 0.5)
          scrollDepth = 0.25;
        else if (percentScrolled >= 0.5 && percentScrolled < 0.75)
          scrollDepth = 0.5;
        else if (percentScrolled >= 0.75 && percentScrolled < 1)
          scrollDepth = 0.75;
        else if (percentScrolled == 1) scrollDepth = 1;

        if (scrollDepthCurrent < scrollDepth) {
          scrollDepthCurrent = scrollDepth;
          var pageTitle = document.title.substring(
            0,
            document.title.indexOf("|") - 1
          );
          var pageCategory;
          if ($("body.guide").length > 0) pageCategory = "guide";
          else if ($("div.blog").length > 0) pageCategory = "blog";
          else if ($("div.practices").length > 0) pageCategory = "practices";
          sendAmplitudeEvent("page scrolled", {
            "scroll depth": scrollDepth * 100,
            "page title": pageTitle,
            "page category": pageCategory,
            "url path": window.location.pathname,
          });
        }
      }
    });

    // Track how far into VOD TV episode before leaving
    var percentageCompletedCurrent = -1;
    $(window).on("unload", function () {
      if ($("body.tv-episode").length > 0) {
        var pageTitle = document.title.substring(
          0,
          document.title.indexOf("|") - 1
        );
        if (player != null) {
          var currentTime = !player.getCurrentTime ? 0.0 : player.getCurrentTime();
          var duration = !player.getDuration ? 0.0 : player.getDuration();
          var elapsedPercentage = currentTime / duration;
          var percentageCompleted;
          if (elapsedPercentage < 0.25) percentageCompleted = 0;
          else if (elapsedPercentage >= 0.25 && elapsedPercentage < 0.5)
            percentageCompleted = 0.25;
          else if (elapsedPercentage >= 0.5 && elapsedPercentage < 0.75)
            percentageCompleted = 0.5;
          else if (elapsedPercentage >= 0.75 && elapsedPercentage < 1)
            percentageCompleted = 0.75;
          else if (elapsedPercentage == 1) percentageCompleted = 1;

          if (percentageCompletedCurrent < percentageCompleted) {
            percentageCompletedCurrent = percentageCompleted;
            var showTitle = $("h1").innerHTML;
            var episodeTitle = document.title.substring(
              0,
              document.title.indexOf("|") - 1
            );
            var episodeType = "vod";
            sendAmplitudeEvent("episode session ended", {
              "percentage complete": percentageCompleted * 100,
              "show title": showTitle,
              "episode title": episodeTitle,
              "episode type": episodeType,
              "url path": window.location.pathname,
            });
          }
        }
      }
      if ($("body.workshop-live").length > 0) {
        var pageTitle = document.title.substring(
          0,
          document.title.indexOf("|") - 1
        );
        sendAmplitudeEvent("workshop session ended", {
          "workshop name": pageTitle,
          "url path": window.location.pathname,
        });
      }
    });
  });

  //Header search
  $("header li .search-icon").click(function () {
    $("#search-nav").slideToggle();
    //$(this).toggleClass('close');
    $("#searchheaderform input").focus();
  });

  $("header li .search-icon").keypress(function (e) {
    if (e.which == 13) {
      $("#search-nav").slideToggle();
      $("#searchheaderform input").focus();
    }
  });

  $("#search-nav").on('keydown', function(event) {
    if (event.key == "Escape") {
      $("#search-nav").slideToggle();
      $("header li .search-icon").focus();
      removeNavClasses();
    }
  });

  $(".search-hide").click(function () {
    $("#search-nav").slideToggle();
    $(this).toggleClass("close");
    $("#searchheaderform input").focus();
  });

  $(".search-hide svg").keypress(function (event) {
    if (event.which === 13 || event.which === 32) {
      $("#search-nav").slideToggle();
      $(this).parent().toggleClass("close");
      $("header li .search-icon").focus();
      removeNavClasses();
    }
  });

  $(".search-hide svg").keydown(function (e) {
    if (e.which === 9) {
      $(".nav-link[data-menu='community']").focus();
      $("#search-nav").slideToggle();
      $(this).parent().toggleClass("close");
      removeNavClasses();
    }
  });

  // Featured Learning paths
  $( ".learning-path-card" ).mouseenter(function() {
    $(".learning-path-card").removeClass("active");
    $(this).addClass("active");
  });

  // Beyond Agenda Toggle
  $( ".day" ).click(function() {
    $(".day").removeClass("active");
    $(this).addClass("active");

    if( $(this).attr('id') === 'day-1') {
      $("#day-2-agenda").hide();
      $("#day-1-agenda").show();
    }
    else {
      $("#day-1-agenda").hide();
      $("#day-2-agenda").show();
    }
  });
  
}(jQuery));