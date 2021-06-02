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

  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $(".popover-dismiss").popover({
      trigger: "focus",
    });

    //Samples filters
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

    // Team Index Page
    //// Make social links works inside clickable div
    $("div.person div.card").click(function () {
      window.location = $(this).find("a").attr("href");
    });
    $("div.card a").click(function (e) {
      e.stopPropagation();
    });

    function testMode(currentMode) {
      if (currentMode == "light") {
        if ($('html').hasClass('pride-mode')) {
          triggerGlitter();
        }
      }
      else if(currentMode == "dark") {
        if ($('html').hasClass('pride-mode')) {
          triggerGlitter();
        }
      }
    }

    //Pride toggle
    $("#toggle-pride-mode").click(function () {
      localStorage.setItem("light-dark-mode-storage", "pride");
      var iframe = document.getElementById("auth-iframe");
      $("#pride-select").show();
      $("#light-select, #dark-select").hide();

      if ($("html").hasClass("light-mode")) {
        $("html").removeClass("light-mode");
        document.getElementById("light-theme").remove();
        $("html").addClass("pride-mode");
        changeTheme("pride");
        $('body').append('<div class="rounded bg-white align-items-center row flex-nowrap justify-content-between px-2" id="pride-playlist"><a href="https://open.spotify.com/playlist/2QuVSrZPsWRl1zqt4YCv31?si=SNMYlGHDRjmmXPrGi4g8oQ"><img src="/developer/images/pride/playlist-lockup.svg"></a><iframe src="https://open.spotify.com/embed/playlist/2QuVSrZPsWRl1zqt4YCv31" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>');
        testMode("light");
      }
      else {
        $("html").addClass("pride-mode");
        testMode("dark");
        changeTheme("pride")      
        $('body').append('<div class="rounded bg-white align-items-center row flex-nowrap justify-content-between px-2" id="pride-playlist"><a href="https://open.spotify.com/playlist/2QuVSrZPsWRl1zqt4YCv31?si=SNMYlGHDRjmmXPrGi4g8oQ"><img src="/developer/images/pride/playlist-lockup.svg"></a><iframe src="https://open.spotify.com/embed/playlist/2QuVSrZPsWRl1zqt4YCv31" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>');
      }
    });


    //Light toggle
    $("#toggle-light-mode").click(function () {
      localStorage.setItem("light-dark-mode-storage", "light");
      var iframe = document.getElementById("auth-iframe");
      $(".sparkleItem").remove();
      $("#light-select").show();
      $("#pride-select, #dark-select").hide();

      if ($("html").hasClass("light-mode")) {
        // if (iframe && iframe.contentWindow) {
        //   iframe.contentWindow.postMessage("dark", "*");
        // }
      }
      else if ($("html").hasClass("pride-mode")) {
        $("html").removeClass("pride-mode");
        $("html").addClass("light-mode");
        document.getElementById("pride-theme").remove();
        changeTheme("light");
        $( "#pride-playlist" ).remove();
      }
      else {
        $("html").addClass("light-mode");
        changeTheme("light");
      }
    });

    $("#toggle-dark-mode").click(function () {
      var iframe = document.getElementById("auth-iframe");
      $("#dark-select").show();
      $("#light-select, #pride-select").hide();

      $(".sparkleItem").remove();
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage("dark", "*");
      }
      changeTheme('dark');
      localStorage.setItem("light-dark-mode-storage", "dark");
      var hasPride = document.getElementById("pride-theme");
      var hasLight = document.getElementById("light-theme");

      if(hasPride) {
        document.getElementById("pride-theme").remove();
        $("html").removeClass("pride-mode");
        $( "#pride-playlist" ).remove();
      }
      if(hasLight) {
        document.getElementById("light-theme").remove();
        $("html").removeClass("light-mode");
      }
    });
    //Open external links/rss in new tab, tvc links in same tab
    $("a[href^='http']").attr("target", "_blank");
    $("a[href^='https://tanzu.vmware.com/developer']").attr("target", "_self");
    $("a[href*='rss']").attr("target", "_blank");

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
      $(".td-navbar .td-navbar-nav-hamburger").toggleClass("open");
      $(".td-navbar .td-navbar-nav-hamburger .navbar-nav .nav-item").toggle();
    });
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
    $("#mega-menus").toggleClass("no-border");
  });

  $("header li .search-icon").keypress(function (e) {
    if (e.which == 13) {
      $("#search-nav").slideToggle();
      //$(this).toggleClass('close');
      $("#searchheaderform input").focus();
      $("#mega-menus").toggleClass("no-border");
    }
  });

  $(".search-hide").click(function () {
    $("#search-nav").slideToggle();
    $(this).toggleClass("close");
    $("#searchheaderform input").focus();
    $("#mega-menus").toggleClass("no-border");
  });

  //Nav hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";
  
  $(window).on("load resize", function() {$dropdown.hover(
      function() {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
      },
      function() {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
      });
  });
}(jQuery));

function animate(n,y,x,n6,ns,ie,d,a,n6r,s){
  if ($('html').hasClass('pride-mode')) return;
  o=(ns||n6)?window.pageYOffset:0;

  if (ie)con.style.top=document.body.scrollTop + 'px';

  for (i = 0; i < n; i++){

    var temp1 = eval(d+a+"dots"+i+n6r+s);

    randcolours = colours[Math.floor(Math.random()*colours.length)];

    (ns)?temp1.bgColor = randcolours:temp1.background = randcolours; 

    if (i < n-1){

      var temp2 = eval(d+a+"dots"+(i+1)+n6r+s);
      temp1.top = parseInt(temp2.top) + 'px';
      temp1.left = parseInt(temp2.left) + 'px';

    } 
    else{

      temp1.top = y+o + 'px';
      temp1.left = x + 'px';
    }
  }

  setTimeout(function() {
    if ($('html').hasClass('pride-mode')){
      animate();
    }
    else {
      return;
    } 
  },10);
}

  var colour="random"; // "random" can be replaced with any valid colour ie: "red"...
  var sparkles=100;// increase of decrease for number of sparkles falling

  var x=ox=400;
  var y=oy=300;
  var swide=800;
  var shigh=600;
  var sleft=sdown=0;
  var tiny=new Array();
  var star=new Array();
  var starv=new Array();
  var starx=new Array();
  var stary=new Array();
  var tinyx=new Array();
  var tinyy=new Array();
  var tinyv=new Array();
  
  colours=new Array('#ff0000','#00ff00','#ffffff','#ff00ff','#ffa500','#ffff00','#00ff00','#ffffff','ff00ff')
  
  n = 10;
  y = 0;
  x = 0;
  n6=(document.getElementById&&!document.all);
  ns=(document.layers);
  ie=(document.all);
  d=(ns||ie)?'document.':'document.getElementById("';
  a=(ns||n6)?'':'all.';
  n6r=(n6)?'")':'';
  s=(ns)?'':'.style';
  
  if (ns){
    for (i = 0; i < n; i++)
      document.write('<layer name="dots'+i+'" top=0 left=0 width='+i/2+' height='+i/2+' bgcolor=#ff0000></layer>');
  }
  
  if (ie)
    document.write('<div id="con" style="position:absolute;top:0px;left:0px"><div style="position:relative">');
  
  if (ie||n6){
    for (i = 0; i < n; i++)
      document.write('<div id="dots'+i+'" style="position:absolute;top:0px;left:0px;width:'+i/2+'px;height:'+i/2+'px;background:#ff0000;font-size:'+i/2+'"></div>');
  }
  
  if (ie)
    document.write('</div></div>');
  (ns||n6)?window.captureEvents(Event.MOUSEMOVE):0;
  
  function Mouse(evnt){
  
    y = (ns||n6)?evnt.pageY+4 - window.pageYOffset:event.y+4;
    x = (ns||n6)?evnt.pageX+1:event.x+1;
  }
  
  (ns)?window.onMouseMove=Mouse:document.onmousemove=Mouse;
  

  animate(n,y,x,n6,ns,ie,d,a,n6r,s);
  
  function triggerGlitter() {
    var i, rats, rlef, rdow;
    for (var i=0; i<sparkles; i++) {
      var rats=createDiv(3, 3);
      rats.style.visibility="hidden";
      rats.style.zIndex="999";
      document.body.appendChild(tiny[i]=rats);
      starv[i]=0;
      tinyv[i]=0;
      var rats=createDiv(5, 5);
      rats.style.backgroundColor="transparent";
      rats.style.visibility="hidden";
      rats.style.zIndex="999";
      var rlef=createDiv(1, 2);
      var rdow=createDiv(2, 1);
      rats.appendChild(rlef);
      rats.appendChild(rdow);
      rlef.style.top="2px";
      rlef.style.left="0px";
      rdow.style.top="0px";
      rdow.style.left="2px";
      document.body.appendChild(star[i]=rats);
    }
    set_width();
    sparkle();
  }
  window.onload=function() { if (document.getElementById) {
    if ($('html').hasClass('pride-mode')) {
      console.log("Trigger glit");
      triggerGlitter();
    }
  }}
  
  function sparkle() {
    console.log("SPARKLE");
    var c;
    // if ($('html').hasClass('pride-mode')) return;
    if (Math.abs(x-ox)>1 || Math.abs(y-oy)>1) {
      ox=x;
      oy=y;
      for (c=0; c<sparkles; c++) if (!starv[c]) {
        star[c].style.left=(starx[c]=x)+"px";
        star[c].style.top=(stary[c]=y+1)+"px";
        star[c].style.clip="rect(0px, 5px, 5px, 0px)";
        star[c].childNodes[0].style.backgroundColor=star[c].childNodes[1].style.backgroundColor=(colour=="random")?newColour():colour;
        star[c].style.visibility="visible";
        starv[c]=50;
        break;
      }
    }
    for (c=0; c<sparkles; c++) {
      if (starv[c]) update_star(c);
      if (tinyv[c]) update_tiny(c);
    }

    setTimeout(function() {
      if ($('html').hasClass('pride-mode')){
        console.log("Animating");
        sparkle();
      }
      else {
        return;
      } 
    },40);
  }
  
  function update_star(i) {
    if (--starv[i]==25) star[i].style.clip="rect(1px, 4px, 4px, 1px)";
    if (starv[i]) {
      stary[i]+=1+Math.random()*3;
      starx[i]+=(i%5-2)/5;
      if (stary[i]<shigh+sdown) {
        star[i].style.top=stary[i]+"px";
        star[i].style.left=starx[i]+"px";
      }
      else {
        star[i].style.visibility="hidden";
        starv[i]=0;
        return;
      }
    }
    else {
      tinyv[i]=50;
      tiny[i].style.top=(tinyy[i]=stary[i])+"px";
      tiny[i].style.left=(tinyx[i]=starx[i])+"px";
      tiny[i].style.width="2px";
      tiny[i].style.height="2px";
      tiny[i].style.backgroundColor=star[i].childNodes[0].style.backgroundColor;
      star[i].style.visibility="hidden";
      tiny[i].style.visibility="visible"
    }
  }
  
  function update_tiny(i) {
    if (--tinyv[i]==25) {
      tiny[i].style.width="1px";
      tiny[i].style.height="1px";
    }
    if (tinyv[i]) {
      tinyy[i]+=1+Math.random()*3;
      tinyx[i]+=(i%5-2)/5;
      if (tinyy[i]<shigh+sdown) {
        tiny[i].style.top=tinyy[i]+"px";
        tiny[i].style.left=tinyx[i]+"px";
      }
      else {
        tiny[i].style.visibility="hidden";
        tinyv[i]=0;
        return;
      }
    }
    else tiny[i].style.visibility="hidden";
  }
  
  document.onmousemove=mouse;
  function mouse(e) {
    if (e) {
      y=e.pageY;
      x=e.pageX;
    }
    else {
      set_scroll();
      y=event.y+sdown;
      x=event.x+sleft;
    }
  }
  
  window.onscroll=set_scroll;
  function set_scroll() {
    if (typeof(self.pageYOffset)=='number') {
      sdown=self.pageYOffset;
      sleft=self.pageXOffset;
    }
    else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
      sdown=document.body.scrollTop;
      sleft=document.body.scrollLeft;
    }
    else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
      sleft=document.documentElement.scrollLeft;
      sdown=document.documentElement.scrollTop;
    }
    else {
      sdown=0;
      sleft=0;
    }
  }
  
  window.onresize=set_width;
  function set_width() {
    var sw_min=999999;
    var sh_min=999999;
    if (document.documentElement && document.documentElement.clientWidth) {
      if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
      if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
    }
    if (typeof(self.innerWidth)=='number' && self.innerWidth) {
      if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
      if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
    }
    if (document.body.clientWidth) {
      if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
      if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
    }
    if (sw_min==999999 || sh_min==999999) {
      sw_min=800;
      sh_min=600;
    }
    swide=sw_min;
    shigh=sh_min;
  }
  
  function createDiv(height, width) {
    var div=document.createElement("div");
    div.classList.add("sparkleItem");
    div.style.position="absolute";
    div.style.height=height+"px";
    div.style.width=width+"px";
    div.style.overflow="hidden";
    return (div);
  }
    
  function newColour() {
    var c=new Array();
    c[0]=255;
    c[1]=Math.floor(Math.random()*256);
    c[2]=Math.floor(Math.random()*(256-c[1]/2));
    c.sort(function(){return (0.5 - Math.random());});
    return ("rgb("+c[0]+", "+c[1]+", "+c[2]+")");
  }

if ($('html').hasClass('pride-mode')) {
  $('body').append('<div class="rounded bg-white align-items-center row flex-nowrap justify-content-between px-2" id="pride-playlist"><a href="https://open.spotify.com/playlist/2QuVSrZPsWRl1zqt4YCv31?si=SNMYlGHDRjmmXPrGi4g8oQ"><img src="/developer/images/pride/playlist-lockup.svg"></a><iframe src="https://open.spotify.com/embed/playlist/2QuVSrZPsWRl1zqt4YCv31" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe></div>');
}

