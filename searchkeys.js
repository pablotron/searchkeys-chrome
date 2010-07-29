(function () {
  // list of supported search engines
  var SEARCH_ENGINES = [{
    // name and hostname match
    name:   'google',
    match:  /google\.com/,

    // result link selector
    links:  'h3.r a.l',

    // prev page link
    prev: function() {
      var els = document.querySelectorAll('a.pn');
      return (els.length > 1) ? els[0] : null;
    },

    // next page link
    next: function() {
      var els = document.querySelectorAll('a.pn');
      return (els.length > 0) ? els[els.length - 1] : null;
    },
  }, {
    // name and hostname match
    name:   'bing',
    match:  /bing\.com/,

    // result link selector
    links:  '#results div.sb_tlst h3 a',

    // prev page link
    prev: function() {
      var els = document.querySelectorAll('a.sb_pagP');
      return (els.length > 0) ? els[0] : null;
    },

    // next page link
    next: function() {
      var els = document.querySelectorAll('a.sb_pagN');
      return (els.length > 0) ? els[0] : null;
    }
  }, {
    // name and hostname match
    name:   'yahoo',
    match:  /search\.yahoo\.com/,

    // result link selector
    links:  '#web ol li h3 a',

    // prev page link
    prev: function() {
      var els = document.querySelectorAll('a#pg-prev');
      return (els.length > 0) ? els[0] : null;
    },

    // next page link
    next: function() {
      var els = document.querySelectorAll('a#pg-next');
      return (els.length > 0) ? els[0] : null;
    }
  }];

  // "global" state
  var engine,
      active = false,
      links = [];

  /******************/
  /* util functions */
  /******************/

  /**
   * click - click selected element.
   */
  function click(el) {
    // handle null elements
    if (!el)
      return;

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
    click(engine.prev());
  }

  /**
   * next - go to next page of links.
   */
  function next() {
    click(engine.next());
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
   * tag - mark specified link with navigation label
   */
  function tag(el, k) {
    var e = document.createElement('span');

    // update tmp element
    e.innerHTML = "<span class='search-key'>" + k + "</span>";

    // add tmp element to dom
    el.parentNode.appendChild(e);
  }

  /**
   * add - add link to list of links
   */
  function add(el, i) {
    // mark link
    tag(el, (i + 1) % 10);

    // add link to list of links
    links.push(el);
  }

  /**
   * init_engine - find matching engine for current page.
   */
  function init_engine() {
    var i, l, E = SEARCH_ENGINES;

    // find matching search engine
    for (i = 0, l = E.length; i < l; i++) {
      if (location.host.match(E[i].match)) {
        // save engine
        engine = E[i];

        // return success
        return true;
      }
    }

    // no matching search engine found; return failure
    return false;
  }

  /**
   * init - find navigation links and bind them to keys
   */
  function init() {
    var i, l, els;

    // init engine
    if (!init_engine())
      return;

    // console.log('engine = ' + engine.name);

    // get list of search result links
    els = document.querySelectorAll(engine.links);

    // get number of search results on this page
    l = (els.length < 10) ? els.length : 10;

    // add links
    for (i = 0; i < l; i++)
      add(els[i], i);

    // if we had matches, then bind event handlers
    if (l > 0) {
      var e;

      // bind to relevant event handlers
      for (var k in CALLBACKS)
        document.addEventListener(k, CALLBACKS[k], true);

      // mark prev link
      if (e = engine.prev())
        tag(e, ',');

      // mark next link
      if (e = engine.next())
        tag(e, '.');

      // enable key monitoring
      active = true;
    }
  }

  // init searchkeys
  init();
})();
