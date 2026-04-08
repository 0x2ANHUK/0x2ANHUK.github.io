// Lightweight analytics beacon for 0x2anhuk.github.io
(function(){
  // Collector URL: default to known tunnel domain; override by setting window.ANALYTICS_COLLECTOR
  var collector = (window.ANALYTICS_COLLECTOR) ? window.ANALYTICS_COLLECTOR : 'https://smith.ktano-studio.com/collect';

  // Respect Do Not Track and local opt-out (localStorage key 'analytics_opt_out' === '1')
  try {
    var dnt = (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes');
    var lsOptOut = (typeof window.localStorage !== 'undefined' && window.localStorage.getItem('analytics_opt_out') === '1');
    if (dnt || lsOptOut) {
      // expose helper to opt back in/out
      window.analyticsOptOut = function(){ try{ window.localStorage.setItem('analytics_opt_out','1'); }catch(e){} };
      window.analyticsOptIn = function(){ try{ window.localStorage.removeItem('analytics_opt_out'); }catch(e){} };
      return;
    }
  } catch(e) {
    // ignore storage errors and continue
  }

  // Helper functions to opt-in / opt-out programmatically
  if (!window.analyticsOptOut) window.analyticsOptOut = function(){ try{ window.localStorage.setItem('analytics_opt_out','1'); }catch(e){} };
  if (!window.analyticsOptIn) window.analyticsOptIn = function(){ try{ window.localStorage.removeItem('analytics_opt_out'); }catch(e){} };

  // Avoid sending beacons on local preview or preview builds
  try {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.endsWith('.githubpreview.dev') || /\bpreview\b/.test(location.search)) {
      return;
    }
  } catch(e) { /* ignore */ }

  function sendBeacon(){
    var payload = {
      path: location.pathname + location.search,
      referrer: document.referrer || null,
      title: document.title || null,
      ua: navigator.userAgent || null,
      ts: new Date().toISOString()
    };

    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(collector, body);
      } else {
        fetch(collector, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: body,
          mode: 'cors',
          keepalive: true
        }).catch(function(e){ /* ignore */ });
      }
    } catch(e) {
      console.warn('analytics beacon failed', e);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') sendBeacon();
  else document.addEventListener('DOMContentLoaded', sendBeacon);
})();
