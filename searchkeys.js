(function () {
  // "global" state
  var active = false,
      links = [];

  /******************/
  /* util functions */
  /******************/

  /**
   * click - click selected element.
   */
  function click(el) {
    // build click event
    var ev = document.createEvent('MouseEvents');
    ev.initEvent('click', true, false);

    // fire event
    el.focus();
    el.dispatchEvent(ev);
  }

  /***********/
  /* actions */
  /***********/

  /**
   * prev - go to previous page of links.
   */
  function prev() {
    var els = document.querySelectorAll('a.pn');

    if (els.length > 1)
      click(els[0]);
  }

  /**
   * next - go to next page of links.
   */
  function next() {
    var els = document.querySelectorAll('a.pn');

    if (els.length > 0)
      click(els[els.length - 1]);
  }

  /**
   * jump - select Nth link on page.
   */
  function jump(ofs) {
    click(links[ofs]);
  }

  /******************/
  /* init functions */
  /******************/

  // event callbacks
  var CALLBACKS = {
    // disable key monitoring if any element is focused
    blur: function() {
      // enable keypress monitoring
      active = true;
    },

    // enable key monitoring if any element is blurred
    focus: function() {
      // disable keypress monitoring
      active = false;
    },

    // monitor keypress events for navigation keys
    keypress: function(ev) {
      // skip keypress if we're focused on a text field or a 
      // modifier key is pressed
      if (!active || ev.altKey || ev.metaKey || ev.ctrlKey)
        return;

      // get key code
      var kc = ev.which;

      if (kc == ','.charCodeAt(0)) {
        prev();
      } else if (kc == '.'.charCodeAt(0)) {
        next();
      } else {
        var o = kc - '0'.charCodeAt(0);

        // if key is navkey (0-9), then jump to link
        if (o >= 0 && o <= 9) {
          jump(o ? o - 1 : 9);
        } else {
          // unknown key - ignore event
          return;
        }
      }

      // stop event
      return false;
    }
  };

  /**
   * add - add link to list of links
   */
  function add(el, i) {
    var e = document.createElement('span'),
        k = (i + 1) % 10;

    // update tmp element
    e.innerHTML = "<span class='search-key'>" + k + "</span>";

    // add tmp element to dom
    el.parentNode.appendChild(e);

    // add link to list of links
    links.push(el);
  }

  /**
   * init - find navigation links and bind them to keys
   */
  function init() {
    var i, l, els;

    // get list of search result links
    els = document.querySelectorAll('h3.r a.l');

    // get number of search results on this page
    l = (els.length < 10) ? els.length : 10;

    // add links
    for (i = 0; i < l; i++)
      add(els[i], i);

    // if we had matches, then bind event handlers
    if (l > 0) {
      // bind to relevant event handlers
      for (var k in CALLBACKS)
        document.addEventListener(k, CALLBACKS[k], true);

      // enable key monitoring
      active = true;
    }
  }

  // init searchkeys
  init();
})();
