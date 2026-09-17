/*
 * kilde.site — Google Analytics 4 (cookieless configuration)
 *
 * Privacy notes:
 *  - client_storage: 'none'  -> gtag writes no _ga / _gid cookies and no localStorage.
 *  - Consent Mode defaults deny every storage purpose, so GA sends cookieless pings.
 *  - Google Signals and ad personalization are switched off; ads data is redacted.
 *  - Trade-off: with no client identifier, returning visitors are counted as new
 *    users. Session and user counts are therefore inflated; page views are accurate.
 */
(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-0SRWK1ZCSC';

  // Not configured yet — do nothing.
  if (!/^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID) || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

  // Respect Do Not Track / Global Privacy Control.
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl) return;

  // Skip local development unless explicitly forced with ?ga_debug=1
  var host = location.hostname;
  var forced = location.search.indexOf('ga_debug=1') !== -1;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || /\.local$/.test(host);
  if (isLocal && !forced) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    client_storage: 'none',
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);
})();
