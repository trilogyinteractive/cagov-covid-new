import site from './site/index.js';
import tabs from './tabs/index.js';
import './video/index.js';
import waypoints from './waypoints/index.js';

document.addEventListener('DOMContentLoaded', function (DOMContentLoadedEvent) {
  window.addEventListener('scroll', site.scrollCallback);
  window.addEventListener('resize', site.addMargin);

  document.getElementById('language-menu').addEventListener('click', site.toggleLanguageMenu, true);
  document.getElementsByClassName('open-menu')[0].addEventListener('click', site.toggleMainMenu);
  document.getElementsByClassName('mobile-menu-close')[0].addEventListener('click', site.toggleMainMenu);
  document.getElementsByClassName('expanded-menu-close-mobile')[0].addEventListener('click', site.toggleMainMenu);

  // Toggle the 'expanded' class when a main menu section header is clicked.
  var mainMenuSections = document.getElementsByClassName('expanded-menu-section-header-link');
  for (site.i = 0; site.i < mainMenuSections.length; site.i++) {
    mainMenuSections[site.i].addEventListener('click', site.toggleMainMenuSection);
  }

  // Close the language menu when the user clicks anywhere else on the page
  document.body.addEventListener('click', function (e) {
    var parentMenu = e.target.closest('#language-menu');
    var clickedLanguageButton = parentMenu ? e.target.closest('#language-menu').length === 1 : false;
    var languageMenuOpen = document.getElementById('language-menu').attributes['aria-expanded'].value === 'true';

    if (!clickedLanguageButton && languageMenuOpen) {
      site.toggleLanguageMenu(e);
    }
  });

  // Add the 'focus' class when the header search field is focused
  document.getElementsByClassName('header-search')[0].addEventListener('click', function (e) {
    site.toggleFocus(
      e,
      document.getElementsByClassName('header-search')[0],
      document.getElementById('header-search-site')
    );
  }, true);

  // Remove the 'focus' class when the header search field is blurred
  document.getElementById('header-search-site').addEventListener('focusout', function (e) {
    site.toggleFocus(
      e,
      document.getElementsByClassName('header-search')[0],
      document.getElementById('header-search-site')
    );
  }, true);

  // Add the 'focus' class when the expanded menu search field is focused
  document.getElementsByClassName('expanded-menu-search')[0].addEventListener('click', function (e) {
    site.toggleFocus(
      e,
      document.getElementsByClassName('expanded-menu-search')[0],
      document.getElementById('search-site')
    );
  }, true);

  // Remove the 'focus' class when the expanded menu search field is blurred
  document.getElementById('search-site').addEventListener('focusout', function (e) {
    site.toggleFocus(
      e,
      document.getElementsByClassName('expanded-menu-search')[0],
      document.getElementById('search-site')
    );
  }, true);

  // Expand the submenu if it's hidden. Otherwise, follow the link.
  var menuLinks = document.querySelectorAll('.expanded-menu-section-header>a');
  for (site.i = 0; site.i < menuLinks.length; site.i++) {
    menuLinks[site.i].addEventListener('click', function (e) {
      if (document.body.clientWidth < 1024) {
        var submenu = site.nextSibling(e.target.parentElement, '.expanded-menu-dropdown');

        if (submenu.style.visibility === 'hidden') {
          e.preventDefault();
          submenu.style.visibility = 'visible';
          e.target.parentElement.classList.add('expanded');
        }
      }
    });
  }

  // Toggle the submenus in the expanded menu
  var menuArrows = document.querySelectorAll('.expanded-menu-section-header-arrow');
  for (site.i = 0; site.i < menuArrows.length; site.i++) {
    menuArrows[site.i].addEventListener('click', function (e) {
      if (document.body.clientWidth < 1024) {
        var submenu = site.nextSibling(e.target.parentElement, '.expanded-menu-dropdown');

        if (submenu.style.visibility === 'hidden') {
          submenu.style.visibility = 'visible';
          e.target.parentElement.classList.add('expanded');
        } else {
          submenu.style.visibility = 'hidden';
          e.target.parentElement.classList.remove('expanded');
        }
      }
    });
  }

  // Navigation with the tab key
  document.body.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 9: // Tab Key
        // The user tabbed to the 'Select Language' button, so open the language menu.
        if (document.activeElement.id === 'header-search-button' && document.getElementById('language-menu').attributes['aria-expanded'].value === 'false') {
          site.toggleLanguageMenu(e);
        }

        // The user pressed the tab key while the last item in the language menu was active, so close the menu.
        if (document.activeElement.id === 'language-more' && document.getElementById('language-menu').attributes['aria-expanded'].value === 'true') {
          site.toggleLanguageMenu(e);
        }

        // The user tabbed to the main menu, so open it.
        if (document.activeElement.classList.contains('open-menu')) {
          site.toggleMainMenu();
        }

        // Close the language menu when the user tabs out of it
        if (document.activeElement.classList.contains('hero-stats-tabs-button')) {
          site.toggleLanguageMenu(e);
        }

        break;

      case 27: // Escape key
        // The user pressed ESC while the main menu is open, so close it
        if (document.getElementsByClassName('hamburger')[0].classList.contains('is-active')) {
          site.toggleMainMenu();
        }

        break;
    }
  });

  site.animateSearchPlacholder();
  site.addMargin();
  setTimeout(site.scrollCallback, site.transition.normal);

  // Initialize tabs if they exist on this page
  var tabTriggers = document.getElementsByClassName('hero-stats-tabs-item');
  var tabLabels = document.getElementsByClassName('hero-stats-slide');

  if (tabTriggers.length > 0 && tabLabels.length > 0) {
    tabs.initialize(tabTriggers, tabLabels);
  }

  // Initialize any waypoints on the page
  var waypointTriggers = document.getElementsByClassName('trigger');
  var waypointCustoms = document.getElementsByClassName('custom-trigger');
  var waypointLowTriggers = document.getElementsByClassName('low-trigger');
  var waypointHighTriggers = document.getElementsByClassName('high-trigger');

  if (waypointTriggers.length > 0) {
    waypoints.register(waypointTriggers, '85%');
  }

  if (waypointCustoms.length > 0) {
    waypoints.register(waypointCustoms, '90%');
  }

  if (waypointLowTriggers.length > 0) {
    waypoints.register(waypointLowTriggers, '95%');
  }

  if (waypointHighTriggers.length > 0) {
    waypoints.register(waypointHighTriggers, '65%');
  }
});
