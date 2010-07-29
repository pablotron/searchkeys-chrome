(function () {
  var KEY_CODES = {
    zero:   '0'.charCodeAt(0),
    dot:    '.'.charCodeAt(0),
    comma:  ','.charCodeAt(0)
  };

  var SPAN_HTML = { 
    pre:  "<span class='search-key'>",
    post: "</span>",
  }

  // "global" state
  var active = false,
      links = [];

  /**
   * on - attach override event to document
   */
  function on(el, ev, fn, capture) {
    // return el.addEventListener(ev, fn, !!capture);
    return el.addEventListener(ev, fn, !!capture);
  }

  function mangle(el, i) {
    var e = document.createElement("span"),
        k = (i + 1) % 10;

    // update tmp element
    e.innerHTML = SPAN_HTML.pre + k + SPAN_HTML.post;

    // add tmp element to dom
    el.parentNode.appendChild(e);

    // add link to list of links
    links.push(el);
  }

  function init() {
    var i, l, els;

    // get list of matching elements
    els = document.querySelectorAll('h3.r a.l');

    // get number of search results on this page
    l = (els.length < 10) ? els.length : 10;

    // iterate over each result
    for (i = 0; i < l; i++)
      mangle(els[i], i);

    // return whether we had any matches
    return l > 0;
  }

  function enable() {
    active = true;
  }

  function disable() {
    active = false;
  }

  function click(el) {
    var ev = document.createEvent('MouseEvents');
    ev.initEvent('click', true, false);

    el.focus();
    el.dispatchEvent(ev);
  }

  function prev() {
    var els = document.querySelectorAll('a.pn');
    if (els.length > 0) {
      // location = els[0].href;
      click(els[0]);
    }
  }

  function next() {
    var els = document.querySelectorAll('a.pn');
      alert('next');
    if (els.length > 1) {
      // location = els[0].href;
      click(els[1]);
    }
  }

  function index_of(ev) {
    var k = ev.which - KEY_CODES.zero;

    if (k >= 0 && k <= 9)
      return (k == 0) ? 9 : k - 1;

    return -1;
  }

  function dump_key_event(ev) {
    console.log([
      'keyCode = '  + code,
      'keyIdentifier = '  + ev.keyIdentifier,
      'keyIdentifiercc = '  + ev.keyIdentifier.charCodeAt(0),
      'which = '    + ev.which,
      'textInput = '    + ev.textInput,
      'charCode = ' + ev.charCode 
    ].join(', '));
  }

  function keydown(ev) {
    if (!active || ev.altKey || ev.metaKey || ev.ctrlKey)
      return;

    var id = ev.keyIdentifier;

    if (id == '.') {
      next();
    } else if (id == ',') {
      prev();
    } else {
      // get link offset
      var ofs = index_of(ev);

      // if offset is valid, then handle link
      if (ofs != -1) {
        // location = links[ofs];
        click(links[ofs]);
        return false;
      }
    }
  }

  function wrap() {
/* 
 *     var k, cbs = { focus: disable, blur: enable, keydown: keydown };
 * 
 *     for (k in cbs)
 *       on(document, k, cbs[k], true);
 */ 
/* 
 *     var i, l, els = document.getElementsByTagName('input');
 * 
 *     // add focus/blur 
 *     for (i = 0, l = els.length; i < l; i++) {
 *       on(els[i], 'focus', disable);
 *       on(els[i], 'blur', enable);
 *     }
 */ 

    on(document, 'focus', disable, true);
    on(document, 'blur', enable, true);
    on(document, 'keypress', keydown, true);
  }

  if (init()) {
    wrap();
    enable();
  }
})();
