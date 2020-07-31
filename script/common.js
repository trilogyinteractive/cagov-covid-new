window.onYouTubeIframeAPIReady = function(){
  site.youtubeStatus = "loaded";
};

window.site = {
  modalOpener:   null, // Which element opened a modal window?
  players:       {},   // All of the videos on the page
  previousY:     0,    // The Y position of the scrollbar before the user scrolls again.
  videoId:       null, // The ID of the YouTube video the user wants to play
  scrollDir:     "up", // Keep track of whether the user is scrolling 'up' or 'down'.
  waypoints:     [],   // An array of every Waypoint on the page.
  youtubeStatus: "notLoaded" // One of: "notLoaded", "loading", "loaded"
};

// Define the transition speeds and events.
site.transition = {
  fast:   300,
  normal: 500,
  slow:   750,
  end:    "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend"
};

/**
 * Responsively apply the header's height as margin-top for the next element.
 */
site.addMargin = function(){
  $header = $(".header");
  $header.next().css({"margin-top": $header.height()});
};

/**
 * Animates the placeholder attribute so text appars as if it is being typed for you.
 */
site.animateSearchPlacholder = function(){
  var string   = window.innerWidth < 1024 ? "SEARCH" : "What are you looking for?";
  var interval = 50;
  var letters  = string.split("");
  var index    = 0;

  $("#header-search-site").attr("placeholder", "");

  site.placeholderInterval = window.setInterval(function(){
    current = $("#header-search-site").attr("placeholder");

    if(letters[index]){
      $("#header-search-site").attr("placeholder", current + letters[index]);
      index += 1;
    } else {
      clearInterval(site.placeholderInterval);
    }

  }, interval);
};

/**
 * Pause the video, hids its container, and close the modal.
 */
site.closeVideoModal = function(){
  var player = site.players[site.videoId];

  if(player && typeof player.pauseVideo === "function"){
     player.pauseVideo()
  }

  $("#video-"+site.videoId).parent().hide();
  $("#modal").popup("hide");
};

/**
 * The user clicked a video, so load the YouTube API.
 */
site.initYouTube = function(){
  if(site.youtubeStatus === "notLoaded"){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";

    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    site.youtubeStatus = "loading";
    site.waitForYouTube();
  }
};

/**
 * When .fixed is applied to <body>, resize some of the <header> elements.
 */
site.fixedHeader = function(){
  var top, headerHeight = $(".header").height();

  if (site.scrollY() > 1) {
    top = parseInt(headerHeight / 2);
    $(".menu-trigger").addClass("fixed-menu");
  } else {
    top = 0;
    $(".menu-trigger").removeClass("fixed-menu");
  }

  $(".menu-trigger").css("top", top+"px");
};

site.playerReady = function(e){
  e.target.playVideo();
};

/**
 * The user clicked a video, so play it in a modal.
 */
site.playVideo = function(){
  var playerId = "video-"+site.videoId;

  if($("#"+playerId).length === 0){
    $("#modal").append("<div class='video-modal-player'><div id='" + playerId + "'></div></div>");
  } else {
    $("#"+playerId).show();
  }

  if(site.players[site.videoId] === undefined){
    site.players[site.videoId] = new YT.Player(playerId, {
      host:    "https://www.youtube.com",
      height:  "390",
      width:   "640",
      videoId: site.videoId,
       events: {
        onReady: site.playerReady
      }
    });
  } else {
    site.players[site.videoId].playVideo();
  }

  $("#modal").popup("show");
};

/**
 * Called whenever the window is scrolled.
 */
site.scrollCallback = function(){
  var scrollY = site.scrollY();

  // Toggle body.fixed
  if (scrollY > 1) {
    $("body").addClass("fixed");
  } else {
    $("body").removeClass("fixed");
    site.fixedHeader();
  }

  // Keep track of which direction the user is scrolling
  if (scrollY > site.previousY){
    site.scrollDir = "down";
  } else {
    site.scrollDir = "up";
  }

  // Clamp the previousY to 0
  site.previousY = scrollY <= 0 ? 0 : scrollY;
};

/**
 * What is the Y position of the scrollbar?
 * @return {Integer} - The number of pixels from the top of the window that the user has scrolled.
 */
site.scrollY = function(){
  return window.scrollY || window.pageYOffset;
};

/**
 * Called whenever the language menu needs to be hidden or showed.
 */
site.toggleLanguageMenu = function(){
  if($("#language-menu").attr("aria-expanded") === "false"){
    // Expand the menu
    $("#language-menu").attr("aria-expanded", "true");
    $("#language-menu").addClass("expanded");
    $(".header-language-dropdown").attr("aria-hidden", "false");

    if(window.innerWidth < 1024){
      $(".header-language-dropdown").slideToggle();
    } else {
      $(".header-language-dropdown").addClass("is-open");
    }
  } else {
    // Hide the menu
    $("#language-menu").attr("aria-expanded", "false");
    $("#language-menu").removeClass("expanded");
    $(".header-language-dropdown").attr("aria-hidden", "true");

    if(window.innerWidth < 1024){
      $(".header-language-dropdown").slideToggle();

      // If the screen resolution changed while the menu is open, this class will be leftover, so clean it up.
      if($(".header-language-dropdown").hasClass("is-open")){
        $(".header-language-dropdown").removeClass("is-open");
      }
    } else {
      $(".header-language-dropdown").removeClass("is-open");
    }
  }
};

/**
 * Called whenever the main menu needs to be hidden or showed.
 */
site.toggleMainMenu = function(){
  if($(".hamburger").hasClass("is-active")){
    // Hide the menu
    $("body").removeClass("display-menu");
    $("body").removeClass("reveal-items");
    $(".hamburger").removeClass("is-active");
    $("#main-menu-button").attr("aria-expanded", "false");
    $("#main-menu").attr("aria-hidden", "true");

    if(site.modalOpener){
      site.modalOpener.focus();
      site.modalOpener = null;
    }
  } else {
    // Show the menu
    site.modalOpener = $(".open-menu")[0];
    $("body").addClass("display-menu");
    $(".hamburger").addClass("is-active");
    $("#main-menu-button").attr("aria-expanded", "true");
    $("#main-menu").attr("aria-hidden", "false");
    setTimeout(
      function(){
        $("body").addClass("reveal-items");
        $("#search-site").focus();
      },
      site.transition.fast
    );
  }
};

/**
 * The user requested a video. Send them here to wait until YouTube tells us it has loaded.
 */
site.waitForYouTube = function(){
  site.interval = setInterval(function(){
    if(site.youtubeStatus === "loaded"){
      clearInterval(site.interval);
      site.playVideo();
    }
  }, 100);
};

$(document).ready(function() {
  $(window).on("scroll", site.scrollCallback);
  $(window).on("resize", site.addMargin);
  $("body").on("click", "#language-menu", site.toggleLanguageMenu);
  $("body").on("click", ".open-menu", site.toggleMainMenu);
  $("body").on("click", ".mobile-menu-close", site.toggleMainMenu);
  $("body").on("click", ".expanded-menu-close-mobile", site.toggleMainMenu);
  $("body").on("click", "#close-modal", site.closeVideoModal);

  // Toggle classes when the language menu is open or closed
  $("body").on("click", ".header-language-trigger", function(){
    $("body").toggleClass("display-language-menu");
    $(".header-language-trigger").toggleClass("is-open");
  });

  // Close the language menu when the user clicks anywhere else on the page
  $("body").on("click", function(e){
    console.log();
    var clickedLanguageButton = $(e.target).parents("#language-menu").length === 1;
    var languageMenuOpen = $("#language-menu").attr("aria-expanded") === "true";

    if(!clickedLanguageButton && languageMenuOpen){
      site.toggleLanguageMenu();
    }
  });

  // Add a class when the search fields are focused
  $("body").on("focus", "#header-search-site, .header-search-button, .header-search-label", function(){
    $(".header-search").addClass("focused");
  });
  $("body").on("focus", ".expanded-menu-search-label, .expanded-menu-search-field, .expanded-menu-search-button", function(){
    $(".expanded-menu-search").addClass("focused");
  });

  // Remove a class when the search fields are blurred
  $("body").on("blur", "#header-search-site, .header-search-button, .header-search-label", function(){
    $(".header-search").removeClass("focused");
  });
  $("body").on("blur", "expanded-menu-search-label, .expanded-menu-search-field, .expanded-menu-search-button", function(){
    $(".expanded-menu-search").removeClass("focused");
  });  

  // Expand the submenu if it's hidden. Otherwise, follow the link.
  $("body").on("click", '.expanded-menu-section-header>a', function(e){
    if($(document).width() < 1024){
      $submenu = $(this).parent().next('.expanded-menu-dropdown');

      if($submenu.is(":hidden")){
        e.preventDefault();
        $submenu.slideToggle();
        $(this).parent().addClass('expanded');
      }
    }
  });

  // Toggle the submenu
  $("body").on("click", '.expanded-menu-section-header-arrow', function(){
    if($(document).width() < 1024){
      $submenu = $(this).parent().next('.expanded-menu-dropdown');

      if($submenu.is(":visible")) {
        $submenu.slideToggle();
        $(this).parent().removeClass('expanded');
      } else {
        $submenu.slideToggle();
        $(this).parent().addClass('expanded');
      }
    }
  });

  // Play a video in a modal.
  $("body").on("click", ".video-item", function(){
    site.videoId = $(this).data("id");

    switch(site.youtubeStatus){
      case "notLoaded":
        site.initYouTube();
        break;

      case "loading":
        site.waitForYouTube();
        break;

      case "loaded":
        site.playVideo();
    }
  });

  // Navigation with the tab key
  $("body").on("keydown", function(e){
    switch(e.keyCode){
      case 9: // Tab Key
        // The user tabbed to the "Select Language" button, so open the language menu.
        if(document.activeElement.id === "dropdown-menu-button" && $("#dropdown-menu-button").attr("aria-expanded") === "false"){
          site.toggleLanguageMenu();
        }

        // The user pressed the tab key while the last item in the language menu was active, so close the menu.
        if(document.activeElement.id === "language-more" && $("#dropdown-menu-button").attr("aria-expanded") === "true"){
          site.toggleLanguageMenu();
        }

        // The user tabbed to the main menu, so open it.
        if(document.activeElement.id === "main-menu-button" && $("#dropdown-menu-button").attr("aria-expanded") === "false"){
          site.toggleMainMenu();
        }

        break;

      case 27: // Escape key
        // The user pressed ESC while the main menu is open, so close it
        if($(".hamburger").hasClass("is-active")){
          site.toggleMainMenu();
        }

        break;
    }
  });

  // Stats Tabs
  $('.hero-stats-slider').slick({
      arrows: false,
      swipe: true,
      speed: 500,
      touchMove: true,
      infinite: false,
      autoplay: false,
  });

  $(".hero-stats-tabs-button").click(function(e) {
    e.preventDefault();
    index = $(this).parent().index();
    $('.hero-stats-slider').slick('slickGoTo', parseInt(index));
    $(".hero-stats-tabs-item.active").removeClass("active");
    $(this).parent().addClass("active");
  });

  $(".hero-stats-slider").on("afterChange", function(e, slick, current) {
    $(".hero-stats-tabs-item.active").removeClass("active");
    $("li[data-index='"+current+"']").addClass("active");

    $(".hero-stats-tabs-item").removeClass("active");
    $($(".hero-stats-tabs-item")[current]).addClass("active");
  });

  $(".hero-stats-tabs-item:first .hero-stats-tabs-button").click();

  /**
   * DO THIS ON PAGE LOAD
   */
  site.animateSearchPlacholder();
  site.addMargin();
  setTimeout(site.scrollCallback, site.transition.normal);

  $("#modal").popup({
    onclose: site.closeVideoModal
  });

  site.waypoints.push($('.trigger').waypoint({
    handler: function(direction) {
      jQuery(this.element).addClass('reveal');
    }, offset: '85%'
  }));
  site.waypoints.push($('.custom-trigger').waypoint({
    handler: function(direction) {
      jQuery(this.element).addClass('reveal');
    }, offset: '90%'
  }));
  site.waypoints.push($('.low-trigger').waypoint({
    handler: function(direction) {
      jQuery(this.element).addClass('reveal');
    }, offset: '95%'
  }));

  site.waypoints.push($('.low-trigger').waypoint({
    handler: function(direction) {
      jQuery(this.element).addClass('reveal');
    }, offset: '65%'
  }));

});

document.addEventListener("touchstart", function() {},false);
