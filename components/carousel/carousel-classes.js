// Webflow: Goes in page-level custom code (before </body>) OR in a component embed.
// Dependencies: Swiper 8 (loaded via CDN in the page's <head>).
// Initialises every `.carousel_classes_track` on the page.

(function initClassesCarousel() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.carousel_classes').forEach(function (component) {
        var track = component.querySelector('.carousel_classes_track');
        var prev = component.querySelector('.carousel_classes_prev');
        var next = component.querySelector('.carousel_classes_next');
        if (!track) return;

        new Swiper(track, {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
            breakpoints: {
                768: { slidesPerView: 1, effect: 'slide' },
                992: { slidesPerView: 2, spaceBetween: 24, effect: 'slide' }
            }
        });
    });
})();
