/* ==========================================================================
   Jivamukti Yoga Dusseldorf - Main JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. FADE CAROUSEL
     ======================================================================== */

  function initCarousel() {
    var wrap = document.querySelector('.carousel_wrap');
    if (!wrap) return;

    var images = wrap.querySelectorAll('.carousel_fade_img');
    var track = wrap.querySelector('.carousel_text_track');
    var panels = wrap.querySelectorAll('.carousel_slide_content');
    var progressBar = wrap.querySelector('.carousel_progress_bar');
    var btnPrev = wrap.querySelector('.carousel_btn_prev');
    var btnNext = wrap.querySelector('.carousel_btn_next');
    var total = panels.length;
    var current = 0;
    var autoplayDuration = 7000;
    var timer;

    function goTo(idx) {
      current = ((idx % total) + total) % total;
      images.forEach(function (img) {
        img.classList.toggle('is-active', Number(img.dataset.slide) === current);
      });
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (progressBar) {
        progressBar.style.width = ((current + 1) / total) * 100 + '%';
      }
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(next, autoplayDuration);
    }

    if (btnNext) btnNext.addEventListener('click', function () { next(); startAutoplay(); });
    if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startAutoplay(); });

    goTo(0);
    startAutoplay();
  }

  /* ========================================================================
     2. FEATURE CARD TOGGLES
     ======================================================================== */

  function initFeatureCards() {
    var toggles = document.querySelectorAll('.feature_card_toggle');
    if (!toggles.length) return;

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var card = toggle.closest('.feature_card_wrap');
        var content = card.querySelector('.feature_card_content');
        var imageWrap = card.querySelector('.feature_card_image_wrap');
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other cards (mutual exclusion)
        toggles.forEach(function (otherToggle) {
          if (otherToggle === toggle) return;
          var otherCard = otherToggle.closest('.feature_card_wrap');
          var otherContent = otherCard.querySelector('.feature_card_content');
          var otherImage = otherCard.querySelector('.feature_card_image_wrap');

          otherToggle.setAttribute('aria-expanded', 'false');
          otherContent.hidden = true;
          otherImage.classList.remove('is-collapsed');
        });

        // Toggle current card
        toggle.setAttribute('aria-expanded', String(!isOpen));
        content.hidden = isOpen;
        if (imageWrap) {
          imageWrap.classList.toggle('is-collapsed', !isOpen);
        }
      });
    });
  }

  /* ========================================================================
     3. HORIZONTAL TOGGLE (Classes Section)
     ======================================================================== */

  function initHorizontalToggle() {
    var tabs = document.querySelectorAll('.htoggle_tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var index = tab.getAttribute('data-htoggle');

        // Deactivate all
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        document.querySelectorAll('.htoggle_content').forEach(function (c) {
          c.classList.remove('is-active');
        });

        // Activate clicked
        tab.classList.add('is-active');
        var content = document.querySelector('[data-htoggle-content="' + index + '"]');
        if (content) content.classList.add('is-active');
      });
    });
  }

  /* ========================================================================
     4. CONTACT FORM
     ======================================================================== */

  function initContactForm() {
    var form = document.querySelector('.contact_form');
    if (!form) return;

    // Custom checkbox visual: mirror the real input state onto data-state so the
    // Lumos state variables (and the checkmark) reflect what the user actually did.
    form.querySelectorAll('.form_ui_input').forEach(function (input) {
      function sync() {
        var state = input.checked ? 'checked' : '';
        var item = input.closest('.form_ui_item');
        var label = input.closest('.form_ui_label');
        if (item) item.setAttribute('data-state', state);
        if (label) label.setAttribute('data-state', state);
      }
      input.addEventListener('change', sync);
      sync();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Respect required fields + the consent checkbox before showing success.
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
        return;
      }

      var successWrap = document.querySelector('.form_success_wrap');
      if (successWrap) {
        form.hidden = true;
        successWrap.hidden = false;
      }
    });
  }

  /* ========================================================================
     4b. MOBILE NAVIGATION (self-contained — static export lacks Webflow IX)
     ======================================================================== */

  function initMobileNav() {
    var wrap = document.querySelector('.nav_mobile_wrap');
    if (!wrap) return;
    var menu = wrap.querySelector('.nav_mobile_menu_wrap');

    // Hamburger toggles the whole panel.
    wrap.querySelectorAll('.nav_button_wrap').forEach(function (btn) {
      btn.addEventListener('click', function () {
        wrap.classList.toggle('is-menu-open');
      });
    });

    if (!menu) return;

    // Each dropdown group expands/collapses in place (accordion).
    menu.querySelectorAll('.nav_dropdown_component .w-dropdown-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggle.closest('.nav_dropdown_component').classList.toggle('is-dd-open');
      });
    });

    // Tapping a real link closes the menu.
    menu.querySelectorAll('a[href]').forEach(function (link) {
      if (link.classList.contains('w-dropdown-toggle')) return;
      link.addEventListener('click', function () {
        wrap.classList.remove('is-menu-open');
      });
    });
  }

  /* ========================================================================
     5. GUTSCHEIN MODAL
     ======================================================================== */

  function initGutscheinModal() {
    var modal = document.getElementById('gutscheinModal');
    if (!modal) return;

    var iframe = modal.querySelector('.gutschein_modal_iframe');
    var closeBtn = modal.querySelector('[data-close-gutschein]');

    function openModal(e) {
      e.preventDefault();
      // Lazy-load iframe src only if an iframe exists (placeholder modal has none).
      if (iframe && iframe.src === 'about:blank' && iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Bind all gutschein links (desktop + mobile nav)
    document.querySelectorAll('a[href="#gutschein"]').forEach(function (link) {
      link.addEventListener('click', openModal);
    });

    closeBtn.addEventListener('click', closeModal);

    modal.querySelector('.gutschein_modal_backdrop').addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ========================================================================
     INIT
     ======================================================================== */

  document.addEventListener('DOMContentLoaded', function () {
    initCarousel();
    initFeatureCards();
    initHorizontalToggle();
    initContactForm();
    initGutscheinModal();
    initMobileNav();
  });

})();
