/* ========================================
   WORKSHOP.JS
   Animacje dla stron warsztatów
   Arbitraż Sztuki
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // REVEAL ON SCROLL
    // ========================================

    const revealElements = document.querySelectorAll(
        '.gallery-figure, .workshop-intro__container, .workshop-detail, .workshop-pricing__container'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('workshop-reveal');
        revealObserver.observe(el);
    });

    // ========================================
    // PARALLAX HERO
    // ========================================

    const heroImage = document.querySelector('.workshop-hero__image');
    const hero = document.querySelector('.workshop-hero');

    if (heroImage && hero) {
        let ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    const scrolled = window.pageYOffset;
                    const heroHeight = hero.offsetHeight;

                    if (scrolled < heroHeight) {
                        heroImage.style.transform =
                            'translateY(' + (scrolled * 0.25) + 'px) scale(1.05)';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ========================================
    // SCROLL INDICATOR CLICK
    // ========================================

    const scrollIndicator = document.querySelector('.workshop-hero__scroll');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const introSection = document.querySelector('.workshop-intro');
            if (introSection) {
                introSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // ========================================
    // IMAGE LOAD FADE-IN
    // ========================================

    const galleryImages = document.querySelectorAll('.gallery-figure img');

    galleryImages.forEach(img => {
        if (img.complete) {
            img.classList.add('img-loaded');
        } else {
            img.addEventListener('load', function () {
                this.classList.add('img-loaded');
            });
        }
    });

    // ========================================
    // NAV SCROLL STATE
    // ========================================

    const nav = document.querySelector('.nav');

    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        });
    }

});
