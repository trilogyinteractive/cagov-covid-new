import 'waypoints/lib/noframework.waypoints.min.js';

var waypoints = {
  i: 0, // A reusable iterator
  store: [] // Collection of each waypoint object
};

/**
 * Adds a waypoint to the page.
 * @param {HTMLCollection} elements - All elements to add a waypoint to.
 * @param {string} offset - How far past the element does the user have to scroll to activate it?
 */
waypoints.register = function (elements, offset) {
  for (waypoints.i = 0; waypoints.i < elements.length; waypoints.i++) {
    waypoints.store.push(new Waypoint({
      element: elements[waypoints.i],
      offset: offset,
      handler: function (direction) {
        this.element.classList.add('reveal');
      }
    }));
  }
};

export default waypoints;
