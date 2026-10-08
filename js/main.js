/* Michael Romani Balloon Twisting — site behavior
   Vanilla JS, no dependencies. Every animation respects
   prefers-reduced-motion. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------
     Analytics events: pushed to dataLayer, read by Google Tag Manager
  --------------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  var trackEvent = function (name, params) {
    var payload = { event: name };
    for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) payload[k] = params[k];
    window.dataLayer.push(payload);
  };
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var name = href.indexOf("tel:") === 0 ? "phone_click"
      : href.indexOf("sms:") === 0 ? "text_click"
      : href.indexOf("mailto:") === 0 ? "email_click"
      : (/(^|\/)contact\.html/.test(href) && /\bbtn-primary\b/.test(a.className)) ? "quote_button_click"
      : "";
    if (name) {
      trackEvent(name, {
        link_url: href,
        link_text: (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60),
        page_path: location.pathname
      });
    }
  }, true);

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------------------------------------------------------
     Sticky header shrink-on-scroll
  --------------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    if ("IntersectionObserver" in window) {
      /* A 13px marker at the very top of the page: once it scrolls out of view,
         the page is scrolled past 12px. No scroll listener and no layout reads,
         so it can't force a reflow. */
      var topMarker = document.createElement("div");
      topMarker.setAttribute("aria-hidden", "true");
      topMarker.style.cssText = "position:absolute;top:0;left:0;width:1px;height:13px;opacity:0;pointer-events:none;";
      document.body.appendChild(topMarker);
      new IntersectionObserver(function (entries) {
        header.classList.toggle("is-scrolled", !entries[entries.length - 1].isIntersecting);
      }).observe(topMarker);
    } else {
      document.addEventListener("scroll", function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------------
     Decorative balloon dogs — subtle scroll parallax
     Each dog keeps its own gentle float (CSS animation on
     translate/rotate); this adds a slow drift on the whole field as
     the user scrolls, so the background visibly responds without
     fighting the per-dog animation (different CSS properties).
  --------------------------------------------------------------- */
  var balloonFields = Array.prototype.slice.call(document.querySelectorAll(".balloon-field"));
  if (balloonFields.length && !reduceMotion.matches) {
    var visibleFields = new Set();
    var fieldObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleFields.add(entry.target);
        else visibleFields.delete(entry.target);
      });
    }, { rootMargin: "200px 0px" });
    balloonFields.forEach(function (el) { fieldObserver.observe(el); });

    var parallaxTicking = false;
    var updateParallax = function () {
      parallaxTicking = false;
      visibleFields.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2 - window.innerHeight / 2;
        var offset = Math.max(-24, Math.min(24, center * -0.04));
        el.style.setProperty("--parallax-y", offset.toFixed(1) + "px");
      });
    };
    document.addEventListener("scroll", function () {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---------------------------------------------------------------
     Mobile nav
  --------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    var closeBtn = mobileNav.querySelector(".mobile-nav-close");
    var backdrop = mobileNav.querySelector(".mobile-nav-backdrop");
    var focusable = mobileNav.querySelectorAll("a, button");
    var lastFocused = null;

    var openNav = function () {
      lastFocused = document.activeElement;
      mobileNav.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    };
    var closeNav = function () {
      mobileNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      if (lastFocused) lastFocused.focus();
    };
    var onKeydown = function (e) {
      if (e.key === "Escape") { closeNav(); return; }
      if (e.key === "Tab" && focusable.length) {
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    if (backdrop) backdrop.addEventListener("click", closeNav);
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------------------------------------------------------------
     Scroll reveal (IntersectionObserver, staggered)
  --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var groups = {};
      revealEls.forEach(function (el) {
        var group = el.getAttribute("data-reveal-group") || "default";
        groups[group] = groups[group] || [];
        groups[group].push(el);
      });
      var io = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var group = el.getAttribute("data-reveal-group") || "default";
            var index = groups[group].indexOf(el);
            var delay = Math.min(index, 7) * 90;
            setTimeout(function () { el.classList.add("is-visible"); }, delay);
            obs.unobserve(el);
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------------------------------------------------------
     Area pills "See more" (mobile only, collapsed via CSS)
  --------------------------------------------------------------- */
  var areaToggle = document.querySelector("[data-area-pills-toggle]");
  if (areaToggle) {
    var areaPills = document.querySelector("[data-area-pills]");
    areaToggle.addEventListener("click", function () {
      var expanded = areaPills.classList.toggle("is-expanded");
      areaToggle.textContent = expanded ? "See fewer areas" : "See more areas";
    });
  }

  /* ---------------------------------------------------------------
     Google Reviews carousel
  --------------------------------------------------------------- */
  var reviewsTrack = document.querySelector("[data-reviews-track]");
  if (reviewsTrack) {
    var reviewCards = Array.prototype.slice.call(reviewsTrack.querySelectorAll("[data-review-card]"));
    var prevBtn = document.querySelector("[data-reviews-prev]");
    var nextBtn = document.querySelector("[data-reviews-next]");
    var dotButtons = Array.prototype.slice.call(document.querySelectorAll("[data-reviews-dots] button"));

    var trackStep = function () {
      var gap = parseFloat(getComputedStyle(reviewsTrack).columnGap || getComputedStyle(reviewsTrack).gap || 16);
      return reviewCards.length ? reviewCards[0].getBoundingClientRect().width + gap : 300;
    };
    if (prevBtn) prevBtn.addEventListener("click", function () { reviewsTrack.scrollBy({ left: -trackStep(), behavior: "smooth" }); });
    if (nextBtn) nextBtn.addEventListener("click", function () { reviewsTrack.scrollBy({ left: trackStep(), behavior: "smooth" }); });

    dotButtons.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        var card = reviewCards[i];
        if (card) reviewsTrack.scrollTo({ left: card.offsetLeft - reviewsTrack.offsetLeft, behavior: "smooth" });
      });
    });

    /* The active dot follows the leftmost mostly-visible card. IntersectionObserver
       reports visibility without any layout reads (no forced reflow). */
    if ("IntersectionObserver" in window) {
      var cardRatios = reviewCards.map(function () { return 0; });
      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          cardRatios[reviewCards.indexOf(entry.target)] = entry.intersectionRatio;
        });
        var active = 0;
        for (var i = 0; i < cardRatios.length; i++) {
          if (cardRatios[i] >= 0.6) { active = i; break; }
          if (cardRatios[i] > cardRatios[active]) active = i;
        }
        dotButtons.forEach(function (dot, i) { dot.classList.toggle("is-active", i === active); });
      }, { root: reviewsTrack, threshold: [0, 0.25, 0.6, 0.9] });
      reviewCards.forEach(function (card) { cardObserver.observe(card); });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-read-more]")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest("[data-review-card]");
        var text = card.querySelector("[data-review-text]");
        var expanded = text.classList.toggle("is-expanded");
        btn.textContent = expanded ? "Read less" : "Read more";
      });
    });
  }

  /* ---------------------------------------------------------------
     Event-type carousel — pages of photo cards, auto-advance every
     4s, pause on hover/focus/hidden-tab/offscreen (same pattern as
     the reviews carousel below, adapted for whole-page slides).
  --------------------------------------------------------------- */
  document.querySelectorAll("[data-event-carousel]").forEach(function (root) {
    var track = root.querySelector(".event-track");
    var pages = Array.prototype.slice.call(root.querySelectorAll(".event-page"));
    var dotsWrap = root.querySelector(".event-dots");
    var prevBtn = root.querySelector("[data-event-prev]");
    var nextBtn = root.querySelector("[data-event-next]");
    if (!track || pages.length < 2) return;

    var index = 0;
    var timer = null;
    var onscreen = true;
    var interval = parseInt(root.getAttribute("data-event-carousel"), 10) || 4000;

    pages.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show event group " + (i + 1) + " of " + pages.length);
      dot.addEventListener("click", function () { show(i); stop(); start(); });
      if (dotsWrap) dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function show(i) {
      index = (i + pages.length) % pages.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, di) { d.setAttribute("aria-current", di === index ? "true" : "false"); });
    }
    function next() { show(index + 1); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (!reduceMotion.matches && !document.hidden && onscreen) {
        timer = setInterval(next, interval);
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); stop(); start(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); stop(); start(); });

    root.addEventListener("focusin", stop);
    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", start);
    root.addEventListener("focusout", start);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onscreen = entries[0].isIntersecting;
        onscreen ? start() : stop();
      }, { threshold: 0.2 }).observe(root);
    }

    var touchStartX = null;
    track.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : show(index - 1); }
      touchStartX = null;
      start();
    });

    show(0);
    start();
  });

  /* ---------------------------------------------------------------
     Lightbox
  --------------------------------------------------------------- */
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lbImg = lightbox.querySelector("[data-lightbox-img]");
    var lbPlaceholder = lightbox.querySelector("[data-lightbox-placeholder]");
    var lbCaption = lightbox.querySelector("[data-lightbox-caption]");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-item]:not([data-gallery-item] [data-gallery-item])"));
    var visibleItems = function () {
      return galleryItems;
    };
    var current = 0;
    var lastFocused = null;

    function openAt(item) {
      var list = visibleItems();
      current = list.indexOf(item);
      render();
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      document.body.style.overflow = "hidden";
      lbClose.focus();
      document.addEventListener("keydown", onKey);
    }
    function render() {
      var list = visibleItems();
      var item = list[current];
      if (!item) return;
      var src = item.getAttribute("data-full") || "";
      var caption = item.getAttribute("data-caption") || "";
      lbImg.src = src;
      lbImg.alt = caption;
      lbImg.style.display = "block";
      lbPlaceholder.style.display = "none";
      lbImg.onerror = function () {
        lbImg.style.display = "none";
        lbPlaceholder.style.display = "flex";
      };
      lbCaption.textContent = caption;
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      if (lastFocused) lastFocused.focus();
    }
    function step(dir) {
      var list = visibleItems();
      current = (current + dir + list.length) % list.length;
      render();
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () { openAt(item); });
    });
    lightbox.querySelector(".lightbox-backdrop").addEventListener("click", close);
    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
  }

  /* ---------------------------------------------------------------
     Contact form — progressive AJAX enhancement
     Works as a normal POST if JS fails; the endpoint is configured
     via the form's action attribute (see README for setup).
  --------------------------------------------------------------- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    var statusEl = contactForm.querySelector(".form-status");
    contactForm.addEventListener("submit", function (e) {
      var honeypot = contactForm.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) { e.preventDefault(); return; }

      e.preventDefault();
      var submitBtn = contactForm.querySelector('[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      var eventTypeSelect = contactForm.querySelector("select");
      var submittedEventType = eventTypeSelect ? eventTypeSelect.value : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = "Thanks! Your message is on its way — Michael will get back to you soon.";
            statusEl.className = "form-status success";
            trackEvent("generate_lead", { form_name: "quote_request", event_type: submittedEventType });
            contactForm.reset();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong sending your message. Please call or text (812) 887-9056, or email romanimike@gmail.com directly.";
          statusEl.className = "form-status error";
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
          statusEl.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
        });
    });
  }

  // Header photos: size each photo to the height of the text block beside it (never wider than leaves room for the text)
  var headerGrids = document.querySelectorAll(".contact-hero-grid, .hero-side-grid");
  if (headerGrids.length) {
    var tablet = window.matchMedia("(max-width: 600px)");
    var fitHeaderPhoto = function (grid) {
      var text = grid.querySelector(".contact-hero-text, .hero-side-text");
      if (!text) return;
      if (tablet.matches) { grid.style.removeProperty("--hp"); return; }
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 24;
      var cap = Math.max(8 * rem, Math.min(26 * rem, grid.clientWidth * 0.44));
      var best = null;
      for (var pass = 0; pass < 4; pass++) {
        var size = Math.round(Math.max(8 * rem, Math.min(text.getBoundingClientRect().height, cap)));
        if (best !== null && Math.abs(size - best) < 3) break;
        best = size;
        grid.style.setProperty("--hp", size + "px");
      }
    };
    var fitAllHeaderPhotos = function () { headerGrids.forEach(fitHeaderPhoto); };
    var fitQueued = false;
    var queueFit = function () {
      if (fitQueued) return;
      fitQueued = true;
      requestAnimationFrame(function () { fitQueued = false; fitAllHeaderPhotos(); });
    };
    window.addEventListener("resize", queueFit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);
    window.addEventListener("load", queueFit);
    queueFit();
  }
})();
