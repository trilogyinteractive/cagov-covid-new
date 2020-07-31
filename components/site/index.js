var site = {
  modalOpener: null, // Remember which element opened a modal so we can return focus to it when the modal closes.
  previousY: 0, // The Y position of the scrollbar before the user scrolls again.
  scrollDir: 'up', // Keep track of whether the user is scrolling 'up' or 'down'.
  i: 0 // A reusable iterator
};

// Define the transition speeds and events.
site.transition = {
  fast: 300,
  normal: 500,
  slow: 750,
  end: 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend'
};

/**
 * Responsively apply the header's height as margin-top for the next element.
 */
site.addMargin = function () {
  var header = document.getElementsByTagName('header')[0];
  header.nextElementSibling.setAttribute('style', 'margin-top: ' + header.clientHeight + 'px');
};

/**
 * Animates the placeholder attribute so text appars as if it is being typed for you.
 */
site.animateSearchPlacholder = function () {
  var string = window.innerWidth < 1024 ? 'SEARCH' : 'What are you looking for?';
  var delay = 50;
  var letters = string.split('');
  var index = 0;
  var input = document.getElementById('header-search-site');

  input.placeholder = '';

  site.searchInterval = window.setInterval(function () {
    if (letters[index]) {
      input.placeholder = input.placeholder + letters[index];
      index += 1;
    } else {
      clearInterval(site.searchInterval);
    }
  }, delay);
};

/**
 * When .fixed is applied to <body>, resize some of the <header> elements.
 */
site.fixedHeader = function () {
  var header = document.getElementsByTagName('header')[0];
  var headerHeight = header.clientHeight;
  var menuTrigger = document.getElementsByClassName('menu-trigger')[0];
  var top;

  if (site.scrollY() > 1) {
    top = parseInt(headerHeight / 2);
    menuTrigger.classList.add('fixed-menu');
  } else {
    top = 0;
    menuTrigger.classList.remove('fixed-menu');
  }

  menuTrigger.style.top = top + 'px';
};

site.nextSibling = function (element, selector) {
  var sibling = element.nextElementSibling;

  if (selector) {
    while (sibling) {
      if (sibling.matches(selector)) {
        return sibling;
      } else {
        sibling = sibling.nextElementSibling;
      }
    }
  } else {
    return sibling;
  }
};

/**
 * Called whenever the window is scrolled.
 */
site.scrollCallback = function () {
  var scrollY = site.scrollY();

  // Toggle body.fixed
  if (scrollY > 1) {
    document.body.classList.add('fixed');
  } else {
    document.body.classList.remove('fixed');
    site.fixedHeader();
  }

  // Keep track of which direction the user is scrolling
  if (scrollY > site.previousY) {
    site.scrollDir = 'down';
  } else {
    site.scrollDir = 'up';
  }

  // Clamp the previousY to 0
  site.previousY = scrollY <= 0 ? 0 : scrollY;
};

/**
 * What is the Y position of the scrollbar?
 * @return {Integer} - The number of pixels from the top of the window that the user has scrolled.
 */
site.scrollY = function () {
  return window.scrollY || window.pageYOffset;
};

/**
 * Toggle a class when an element receives or removes focus.
 * @param {HTMLElement} container - The element to add the 'focus' class to.
 * @param {HTMLElement} input - The search input that the user types in.
 */
site.toggleFocus = function (e, container, input) {
  if (container.classList.contains('header-search') || container.classList.contains('expanded-menu-search')) {
    e.stopPropagation();

    var currentlyFocused = container.classList.contains('focused');
    var focusedOnSearch = document.activeElement.id === input.id;

    if (currentlyFocused && !focusedOnSearch) {
      container.classList.remove('focused');
    } else if (!currentlyFocused && focusedOnSearch) {
      container.classList.add('focused');
    }
  }
};

/**
 * Called whenever the language menu needs to be hidden or showed.
 */
site.toggleLanguageMenu = function (e) {
  e.stopPropagation();

  var button = document.getElementById('language-menu');
  var dropdown = document.getElementsByClassName('header-language-dropdown')[0];

  if (button.attributes['aria-expanded'].value === 'false') {
    // Expand the menu
    button.attributes['aria-expanded'].value = 'true';
    button.classList.add('expanded');
    dropdown.attributes['aria-hidden'].value = 'false';

    if (window.innerWidth < 1024) {
      dropdown.style.display = 'block';
    } else {
      dropdown.classList.add('is-open');
    }
  } else {
    // Hide the menu
    button.attributes['aria-expanded'].value = 'false';
    button.classList.remove('expanded');
    dropdown.attributes['aria-hidden'].value = 'true';

    if (window.innerWidth < 1024) {
      dropdown.style.display = 'none';

      // If the screen resolution changed while the menu is open, this class will be leftover, so clean it up.
      if (dropdown.classList.contains('is-open')) {
        dropdown.classList.remove('is-open');
      }
    } else {
      dropdown.classList.remove('is-open');
    }
  }
};

/**
 * Called whenever the main menu needs to be hidden or showed.
 */
site.toggleMainMenu = function (e) {
  e.stopPropagation();

  var button = document.getElementsByClassName('menu-trigger')[0];
  var nav = document.getElementById('main-menu');

  if (button.classList.contains('is-active')) {
    // Hide the menu
    document.body.classList.remove('display-menu');
    document.body.classList.remove('reveal-items');
    button.classList.remove('is-active');
    button.attributes['aria-expanded'].value = 'false';
    nav.attributes['aria-hidden'].value = 'true';

    if (site.modalOpener) {
      site.modalOpener.focus();
      site.modalOpener = null;
    }
  } else {
    // Show the menu
    site.modalOpener = document.getElementsByClassName('open-menu')[0];
    document.body.classList.add('display-menu');
    button.classList.add('is-active');
    button.attributes['aria-expanded'].value = 'true';
    nav.attributes['aria-hidden'].value = 'false';

    setTimeout(
      function () {
        var evt = new window.Event('click');
        document.body.classList.add('reveal-items');
        document.getElementById('search-site').focus();
        document.getElementsByClassName('expanded-menu-search')[0].dispatchEvent(evt);
      }, site.transition.fast
    );
  }
};

/**
 * Expand / contract the main menu sections when their headers are clicks.
 */
site.toggleMainMenuSection = function (e) {
  e.target.closest('.expanded-menu-section').classList.toggle('expanded');
};

export default site;
