"use strict";

(function () {
  var body = document.body;
  var html = document.documentElement;
  var searchParams = new URLSearchParams(window.location.search || "");
  var hostname = window.location.hostname || "";
  var isLocalEnv = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  function readUtmParams() {
    var utm = {};
    var source = searchParams.get("utm_source");
    var medium = searchParams.get("utm_medium");
    var campaign = searchParams.get("utm_campaign");

    if (source) {
      utm.utm_source = source;
    }
    if (medium) {
      utm.utm_medium = medium;
    }
    if (campaign) {
      utm.utm_campaign = campaign;
    }

    return utm;
  }

  function detectDeviceType() {
    var ua = navigator.userAgent || "";
    var isTablet = /iPad|Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 9|SM-T|Tab/i.test(ua);
    var isMobile = /Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i.test(ua);

    if (isTablet) {
      return "tablet";
    }
    if (isMobile) {
      return "mobile";
    }
    return "desktop";
  }

  function readReferrerDomain() {
    if (!document.referrer) {
      return "";
    }

    try {
      return new URL(document.referrer).hostname || "";
    } catch (error) {
      return "";
    }
  }

  function readMeta() {
    var pageType = body && body.getAttribute("data-page-type") ? body.getAttribute("data-page-type") : "page";
    var siteLang = body && body.getAttribute("data-site-lang") ? body.getAttribute("data-site-lang") : (html.getAttribute("lang") || "en");
    var referrerDomain = readReferrerDomain();
    var meta = {
      site_lang: siteLang,
      page_type: pageType,
      page_path: window.location.pathname,
      device_type: detectDeviceType(),
      runtime_env: isLocalEnv ? "local" : "prod"
    };

    if (isLocalEnv) {
      meta.debug_mode = true;
    }

    if (referrerDomain) {
      meta.referrer_domain = referrerDomain;
    }

    return Object.assign(meta, readUtmParams());
  }

  function pushEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, readMeta(), params || {}));
  }

  window.adbAnalyticsTrack = pushEvent;

  pushEvent("page_context");

  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest ? event.target.closest("a, button") : null;
    if (!target) {
      return;
    }

    var href = target.getAttribute("href") || "";
    var explicitTrack = target.getAttribute("data-track");
    var ctaId = target.getAttribute("data-cta-id");
    var contactChannel = target.getAttribute("data-contact-channel");

    if (explicitTrack === "cta_click") {
      pushEvent("cta_click", {
        cta_id: ctaId || "cta_unknown"
      });
      return;
    }

    if (explicitTrack === "contact_click") {
      pushEvent("contact_click", {
        contact_channel: contactChannel || "unknown",
        contact_target: href
      });
      return;
    }

    if (href.indexOf("/brief") !== -1 || href === "/brief.html") {
      pushEvent("cta_click", {
        cta_id: ctaId || "cta_to_brief_auto"
      });
    }
  });
})();
