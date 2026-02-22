/* ========================================
   WORKSHOP.JS
   Animacje i interakcje dla stron warsztatów
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // REVEAL ON SCROLL - Animacje przy scrollu
    // ========================================
    
    const revealElements = document.querySelectorAll('.gallery-figure, .workshop-intro__text, .workshop-detail, .workshop-pricing__container');
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal-element');
        revealOnScroll.observe(el);
    });
    
    // ========================================
    // PARALLAX HERO IMAGE
    // ========================================
    
    const heroImage = document.querySelector('.workshop-hero__image');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.workshop-hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
            }
        });
    }
    
    // ========================================
    // SMOOTH SCROLL FOR SCROLL INDICATOR
    // ========================================
    
    const scrollIndicator = document.querySelector('.workshop-hero__scroll');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const introSection = document.querySelector('.workshop-intro');
            if (introSection) {
                introSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Dodaj kursor pointer
        scrollIndicator.style.cursor = 'pointer';
    }
    
    // ========================================
    // IMAGE LAZY LOADING WITH FADE IN
    // ========================================
    
    const images = document.querySelectorAll('.gallery-figure img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('is-loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('is-loaded');
            });
        }
    });
    
    // ========================================
    // NAV BACKGROUND ON SCROLL
    // ========================================
    
    const nav = document.querySelector('.nav');
    
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
        });
    }
    
});

// ========================================
// PRELOADER (opcjonalnie)
// ========================================

window.addEventListener('load', function() {
    document.body.classList.add('is-loaded');
});
