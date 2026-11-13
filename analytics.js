/*
 * Anonymous, cookie-free visit counting for elmerson.me.
 *
 * Counts are kept by Abacus (abacus.jasoncameron.dev), a free counting API that
 * needs no account. Each page view bumps a handful of named counters; nothing
 * personal is collected or stored: no cookies, no IP addresses, no fingerprinting.
 * The visitor's region comes from their browser's time-zone setting, not from IP.
 *
 * The only thing kept in the visitor's own browser is whether it has been here
 * before and on which day (so new vs returning can be counted). It never leaves
 * the device.
 *
 * Not counted: Do Not Track / Global Privacy Control, local development, and any
 * browser that has opened  https://elmerson.me/?notrack  (undo with ?track).
 *
 * Dashboard: /stats.html
 */
(function () {
  'use strict';

  var API = 'https://abacus.jasoncameron.dev/hit/';
  var host = location.hostname;
  var params = new URLSearchParams(location.search);
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '' || host === '[::1]';

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  // owner opt-out / opt-in for this browser
  if (params.has('notrack')) { store.set('el_notrack', '1'); toast('This browser will not be counted.'); }
  if (params.has('track')) { store.del('el_notrack'); toast('Counting is back on for this browser.'); }

  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  // on a local server nothing is counted unless ?devtrack is given, and then it goes
  // to a separate namespace so testing never touches the real numbers
  var devTest = isLocal && params.has('devtrack');
  if ((isLocal && !devTest) || store.get('el_notrack') === '1' || dnt) return;

  var NS = devTest ? 'elmerson.me-dev' : 'elmerson.me';

  function hit(key) {
    var url = API + encodeURIComponent(NS) + '/' + encodeURIComponent(key);
    try {
      fetch(url, { keepalive: true, cache: 'no-store' }).catch(function () {});
    } catch (e) {
      new Image().src = url;
    }
  }

  // ---- which day it is, in India time (the dashboard reads the same keys)
  function today() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date()).replace(/-/g, '');
    } catch (e) {
      return new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '');
    }
  }

  // ---- broad region from the browser's time-zone setting (no IP lookup)
  function region() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (/^Asia\/(Kolkata|Calcutta)$/.test(tz)) return 'india';
    if (/^Asia\/(Colombo|Dhaka|Karachi|Kathmandu|Thimphu)$|^Indian\/Maldives$/.test(tz)) return 'southasia';
    if (/^Asia\/(Dubai|Riyadh|Qatar|Doha|Kuwait|Bahrain|Muscat|Aden)$/.test(tz)) return 'gulf';
    if (/^Asia\/(Singapore|Kuala_Lumpur|Jakarta|Manila|Bangkok|Ho_Chi_Minh|Saigon|Yangon|Phnom_Penh)$/.test(tz)) return 'seasia';
    if (/^Asia\/(Tokyo|Seoul|Shanghai|Chongqing|Hong_Kong|Taipei|Macau)$/.test(tz)) return 'eastasia';
    if (/^Europe\//.test(tz)) return 'europe';
    if (/^(America|US|Canada)\//.test(tz)) return 'americas';
    if (/^Australia\/|^Pacific\/Auckland$/.test(tz)) return 'oceania';
    if (/^Africa\//.test(tz)) return 'africa';
    return 'other';
  }

  // ---- how they arrived: a ?ref= tag you put on links you share, else the referrer
  function source() {
    var tag = (params.get('ref') || params.get('utm_source') || '').toLowerCase();
    if (['linkedin', 'github', 'whatsapp', 'resume', 'instagram', 'qr'].indexOf(tag) >= 0) return tag;
    var r = '';
    try { r = new URL(document.referrer).hostname.replace(/^www\./, ''); } catch (e) {}
    if (!r || r === host) return 'direct';
    if (/(^|\.)linkedin\.com$|^lnkd\.in$/.test(r)) return 'linkedin';
    if (/(^|\.)google\./.test(r)) return 'google';
    if (/(^|\.)github\.(com|io)$/.test(r)) return 'github';
    if (/whatsapp|^wa\.me$/.test(r)) return 'whatsapp';
    if (/instagram|facebook|^fb\.|^t\.co$|twitter|^x\.com$/.test(r)) return 'social';
    if (/bing\.|duckduckgo|yahoo\.|yandex|ecosia|brave/.test(r)) return 'search';
    return 'other';
  }

  function device() {
    var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    return touch || window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  // ---- the page view
  var day = today();
  var firstEver = store.get('el_seen') === null;
  var lastDay = store.get('el_day');
  store.set('el_seen', '1');
  store.set('el_day', day);

  hit('views');
  hit('d-' + day);
  hit(firstEver ? 'v-new' : 'v-return');
  if (lastDay !== day) hit('u-' + day);          // unique visitors per day
  hit('geo-' + region());
  hit('src-' + source());
  hit('dev-' + device());

  // ---- how far down they got (once per page view)
  if ('IntersectionObserver' in window) {
    var done = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !done[e.target.id]) {
          done[e.target.id] = 1;
          hit('sec-' + e.target.id);
          io.unobserve(e.target);
        }
      });
    // "reached" = the section's top has scrolled into the upper part of the screen.
    // A visible-fraction threshold would never fire for sections taller than the
    // viewport (the Work section is several phone screens tall).
    }, { rootMargin: '0px 0px -45% 0px', threshold: 0 });
    ['work', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // ---- outbound clicks on anything marked data-track="name"
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
    if (a) hit('c-' + a.getAttribute('data-track'));
  }, true);

  function toast(msg) {
    function show() {
      var d = document.createElement('div');
      d.textContent = msg;
      d.setAttribute('role', 'status');
      d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);' +
        'background:#0e1013;color:#7ef0b0;border:1px solid rgba(126,240,176,.35);' +
        'padding:10px 16px;border-radius:10px;font:500 14px Inter,system-ui,sans-serif;' +
        'z-index:99;box-shadow:0 8px 30px rgba(0,0,0,.45)';
      document.body.appendChild(d);
      setTimeout(function () { d.remove(); }, 3800);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
})();
