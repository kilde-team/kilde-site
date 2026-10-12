/*
 * kilde.site -- Google Analytics 4 (cookieless configuration)
 *
 * Privacy notes:
 *  - Consent Mode denies analytics_storage, so GA falls back to cookieless pings:
 *    no _ga / _ga_<id> cookies and no localStorage are written. This is the lever
 *    that actually works -- client_storage:'none' alone was verified against the
 *    live site and GA still set both _ga cookies, so it is kept only as a belt.
 *  - Every advertising storage purpose is denied, Google Signals and ad
 *    personalization are off, and ads data is redacted.
 *  - Trade-off: with no identifier, returning visitors count as new users, and
 *    GA reports user/session metrics as modeled rather than measured. Page and
 *    event counts still arrive.
 */
(function () {
  'use strict';

  // Operative ID of the site's Google tag. It looks like it belongs to the old
  // "kilde" property (554727401) -- the stream of that name is where it was
  // born -- but this tag is what the 2026-10-12 setup feeds to the current
  // property "kilde-a1ae7" (555463514) as a second destination, so one load
  // delivers every ping to BOTH properties. Loading gtag.js by the stream's
  // own ID (G-L24Z769ZEQ) downloads but never initializes (verified 2026-10-12,
  // issue #11), which silently stops all measurement. If this file ever stops
  // measuring, check kilde-a1ae7 -> 管理 -> データ ストリーム -> kilde-site ->
  // タグ設定 for the tag's destinations first.
  var GA_MEASUREMENT_ID = 'G-0SRWK1ZCSC';

  // Not configured yet -- do nothing.
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

  // Every storage purpose is denied. analytics_storage in particular is what
  // keeps GA cookieless -- see the note at the top of this file.
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
