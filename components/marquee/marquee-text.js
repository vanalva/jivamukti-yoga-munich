// Webflow: Goes in page-level custom code (before </body>).
// Dependencies: Swiper 8 (loaded via CDN in page's <head>).
// Initialises every `.marquee_text_track` on the page. Reverses on hover if
// data-marquee-hover="reverse". Speed via data-marquee-speed (px/sec).

(function initTextMarquees() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.marquee_text').forEach(function (component) {
        var track = component.querySelector('.marquee_text_track');
        if (!track) return;

        var speed = parseInt(track.dataset.marqueeSpeed || '40', 10);
        var direction = track.dataset.marqueeDirection || 'left';
        var hoverMode = track.dataset.marqueeHover || 'reverse';
        var isReversed = direction === 'right';

        var swiper = new Swiper(track, {
            slidesPerView: 'auto',
            spaceBetween: 0,
            loop: true,
            freeMode: true,
            allowTouchMove: true,
            speed: 1,
            autoplay: { delay: 1, disableOnInteraction: false, reverseDirection: isReversed }
        });

        // Adaptive speed — recompute based on total slide width
        var totalWidth = 0;
        track.querySelectorAll('.swiper-slide').forEach(function (s) { totalWidth += s.offsetWidth; });
        var duration = (totalWidth / speed) * 1000;
        if (swiper.autoplay && swiper.autoplay.running) {
            swiper.params.speed = duration;
            swiper.autoplay.start();
        }

        // Hover behaviour
        if (hoverMode === 'reverse') {
            track.addEventListener('mouseenter', function () {
                swiper.params.autoplay.reverseDirection = !isReversed;
                swiper.autoplay.stop(); swiper.autoplay.start();
            });
            track.addEventListener('mouseleave', function () {
                swiper.params.autoplay.reverseDirection = isReversed;
                swiper.autoplay.stop(); swiper.autoplay.start();
            });
        } else if (hoverMode === 'pause') {
            track.addEventListener('mouseenter', function () { swiper.autoplay.stop(); });
            track.addEventListener('mouseleave', function () { swiper.autoplay.start(); });
        }
    });
})();
