"use strict";

(function () {
  var body = document.body;
  var html = document.documentElement;

  function readMeta() {
    var pageType = body && body.getAttribute("data-page-type") ? body.getAttribute("data-page-type") : "page";
    var siteLang = body && body.getAttribute("data-site-lang") ? body.getAttribute("data-site-lang") : (html.getAttribute("lang") || "en");

    return {
      site_lang: siteLang,
      page_type: pageType,
      page_path: window.location.pathname
    };
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
