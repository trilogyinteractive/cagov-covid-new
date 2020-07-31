var tabs = {
  i: 0 // A reusable iterator
};

/**
 * Turns a container with triggers and panels into tabbed content.
 * @param {array} triggers - All HTMLElements that act as a trigger to display a panel.
 * @param {array} panels - All HTMLElements that triggers can show/hide.
 */
tabs.initialize = function (triggers, panels) {
  // var labels = document.getElementsByClassName('hero-stats-tabs-item');
  // var tabs = document.getElementsByClassName('hero-stats-slide');

  // Show only the first tab
  for (tabs.i = 1; tabs.i < panels.length; tabs.i++) {
    panels[tabs.i].style.display = 'none';
  }

  // Activate the first tab
  triggers[0].classList.add('active');
  panels[0].attributes['aria-hidden'].value = 'false';

  // Toggle the panels whenever their triggers are clicked.
  for (tabs.i = 0; tabs.i < triggers.length; tabs.i++) {
    triggers[tabs.i].addEventListener('click', function (e) {
      // Elements to be toggled off begin with 'old'; Elements to be toggled on begin with 'new'.
      var oldLabel = document.querySelector('.hero-stats-tabs-item.active');
      var newLabel = e.target.parentElement;

      var oldButton = oldLabel.children[0];
      var newButton = newLabel.children[0];

      var oldTab = document.querySelector('.hero-stats-slide[aria-labelledby="' + oldButton.attributes['aria-controls'].value + '"]');
      var newTab = document.querySelector('.hero-stats-slide[aria-labelledby="' + newButton.attributes['aria-controls'].value + '"]');

      // Toggle the triggers
      oldLabel.classList.remove('active');
      newLabel.classList.add('active');

      // Toggle the panels
      oldTab.attributes['aria-hidden'].value = 'true';
      oldTab.style.display = 'none';

      newTab.attributes['aria-hidden'].value = 'false';
      newTab.style.display = 'block';
    });
  }
};

export default tabs;
