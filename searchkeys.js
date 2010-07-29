//
// searchkeys.js - SearchKeys extension for Chrome.
//
// Copyright (C) 2010 Paul Duncan <pabs@pablotron.org>
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies of the Software, its documentation and
// marketing & publicity materials, and acknowledgment shall be given in
// the documentation, materials and software packages that this Software
// was used.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

(function () {
  // list of supported search engines
  var SEARCH_ENGINES = [{
    // name and hostname match
    name:   'google',
    match:  /www\.google\./,

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
      return document.querySelector('a.sb_pagP');
    },

    // next page link
    next: function() {
      return document.querySelector('a.sb_pagN');
    }
  }, {
    // name and hostname match
    name:   'yahoo',
    match:  /search\.yahoo\.com/,

    // result link selector
    links:  '#web ol li h3 a',

    // prev page link
    prev: function() {
      return document.querySelector('a#pg-prev');
    },

    // next page link
    next: function() {
      return document.querySelector('a#pg-next');
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
