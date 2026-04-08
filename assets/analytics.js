// Lightweight analytics beacon for 0x2anhuk.github.io
(function(){
  // Collector URL: default to known tunnel domain; override by setting window.ANALYTICS_COLLECTOR
  var collector = (window.ANALYTICS_COLLECTOR) ? window.ANALYTICS_COLLECTOR : 'https://smith.ktano-studio.com/collect';

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
