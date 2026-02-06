/* ========================================
   MAIN.JS - KOMPLETNA POPRAWIONA WERSJA
   ======================================== */

'use strict';

// ========================================
// KONFIGURACJA GLOBALNA
// ========================================

const CONFIG = {
    revealThreshold: 0.15,
    revealRootMargin: '0px 0px -50px 0px',
    parallaxStrength: 0.3,
    blurMax: 8,
    blurStart: 0.7,
    staggerDelay: 100,
};

// ========================================
// FIX: Problem z przyciskiem "Wróć"
// ========================================

(function fixBackButton() {
    // Wymuś przeładowanie przy nawigacji wstecz/wprzód
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // Dla starszych przeglądarek
    if (window.performance && window.performance.navigation.type === 2) {
        window.location.reload();
    }

    // Zapobiega cache'owaniu
    window.addEventListener('unload', function() {});
})();

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit = 16) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// ========================================
// SCROLL REVEAL
// ========================================

class ScrollReveal {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        this.elements = document.querySelectorAll('[data-reveal]');
        
        if (this.elements.length === 0) return;
        
        // Reset wszystkich elementów
        this.elements.forEach(el => {
            el.classList.remove('reveal-visible', 'is-revealed');
            el.classList.add('reveal-hidden');
        });
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: CONFIG.revealThreshold,
                rootMargin: CONFIG.revealRootMargin
            }
        );
        
        this.elements.forEach((el, index) => {
            if (el.dataset.revealDelay) {
                el.style.transitionDelay = `${el.dataset.revealDelay}ms`;
            } else if (el.closest('[data-reveal-stagger]')) {
                const siblings = [...el.parentElement.children];
                const idx = siblings.indexOf(el);
                el.style.transitionDelay = `${idx * CONFIG.staggerDelay}ms`;
            }
            
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-hidden');
                
                if (!entry.target.dataset.revealRepeat) {
                    this.observer.unobserve(entry.target);
                }
            } else if (entry.target.dataset.revealRepeat) {
                entry.target.classList.remove('reveal-visible');
                entry.target.classList.add('reveal-hidden');
            }
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ========================================
// WORKSHOP CARDS EFFECT
// ========================================

class WorkshopCardsEffect {
    constructor() {
        this.cards = [];
        this.isEnabled = true;
        this.init();
    }
    
    init() {
        this.cards = document.querySelectorAll('.workshop-card');
        
        if (this.cards.length === 0) return;
        
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.isEnabled = false;
            return;
        }
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                threshold: this.generateThresholds(20),
                rootMargin: '0px'
            }
        );
        
        this.cards.forEach(card => {
            this.observer.observe(card);
        });
        
        this.bindScrollEvents();
    }
    
    generateThresholds(steps) {
        return Array.from({ length: steps + 1 }, (_, i) => i / steps);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            const card = entry.target;
            const ratio = entry.intersectionRatio;
            
            this.applyBlurEffect(card, ratio);
        });
    }
    
    applyBlurEffect(card, ratio) {
        const image = card.querySelector('.workshop-card__image');
        if (!image) return;
        
        if (ratio < CONFIG.blurStart) {
            const blurAmount = mapRange(ratio, 0, CONFIG.blurStart, CONFIG.blurMax, 0);
            image.style.filter = `blur(${clamp(blurAmount, 0, CONFIG.blurMax)}px)`;
        } else {
            image.style.filter = 'blur(0px)';
        }
    }
    
    bindScrollEvents() {
        window.addEventListener('scroll', throttle(() => {
            if (!this.isEnabled) return;
            
            this.cards.forEach(card => {
                this.applyParallax(card);
            });
        }, 16));
    }
    
    applyParallax(card) {
        const image = card.querySelector('.workshop-card__image');
        if (!image) return;
        
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top > windowHeight || rect.bottom < 0) return;
        
        const cardCenter = rect.top + rect.height / 2;
        const screenCenter = windowHeight / 2;
        const distance = cardCenter - screenCenter;
        
        const parallaxOffset = distance * CONFIG.parallaxStrength * -0.1;
        
        image.style.transform = `scale(1.1) translateY(${parallaxOffset}px)`;
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// ========================================
// HERO PARALLAX
// ========================================

class HeroParallax {
    constructor() {
        this.hero = null;
        this.content = null;
        this.scrollIndicator = null;
        this.init();
    }
    
    init() {
        this.hero = document.querySelector('.hero');
        if (!this.hero) return;
        
        this.content = this.hero.querySelector('.hero__content');
        this.scrollIndicator = this.hero.querySelector('.hero__scroll-indicator');
        
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        window.addEventListener('scroll', throttle(() => {
            this.update();
        }, 16));
    }
    
    update() {
        const scrollY = window.scrollY;
        const heroHeight = this.hero.offsetHeight;
        
        if (scrollY > heroHeight) return;
        
        const progress = scrollY / heroHeight;
        
        if (this.content) {
            const translateY = scrollY * 0.4;
            const opacity = 1 - progress * 1.5;
            
            this.content.style.transform = `translateY(${translateY}px)`;
            this.content.style.opacity = clamp(opacity, 0, 1);
        }
        
        if (this.scrollIndicator) {
            const opacity = 1 - progress * 3;
            this.scrollIndicator.style.opacity = clamp(opacity, 0, 1);
        }
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                this.scrollTo(target);
            });
        });
    }
    
    scrollTo(target, offset = 0) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = targetPosition - navHeight - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// ========================================
// PAGE LOADER - UPROSZCZONY
// ========================================

class PageLoader {
    constructor() {
        this.loader = null;
        this.init();
    }
    
    init() {
        this.loader = document.createElement('div');
        this.loader.className = 'page-loader';
        this.loader.innerHTML = `
            <div class="page-loader__content">
                <div class="page-loader__line"></div>
            </div>
        `;
        document.body.appendChild(this.loader);
        
        // Ukryj po załadowaniu
        if (document.readyState === 'complete') {
            this.hide();
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.hide(), 200);
            });
        }
    }
    
    show() {
        if (this.loader) {
            this.loader.classList.add('is-visible');
        }
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('is-loaded');
            document.body.classList.add('is-loaded');
            
            setTimeout(() => {
                this.loader.classList.remove('is-visible', 'is-loaded');
            }, 600);
        }
    }
}

// ========================================
// NAVBAR SCROLL BEHAVIOR
// ========================================

class NavbarScroll {
    constructor() {
        this.nav = null;
        this.init();
    }
    
    init() {
        this.nav = document.querySelector('.nav');
        if (!this.nav) return;
        
        window.addEventListener('scroll', throttle(() => {
            this.update();
        }, 100));
    }
    
    update() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            this.nav.classList.add('nav--scrolled');
        } else {
            this.nav.classList.remove('nav--scrolled');
        }
    }
}

// ========================================
// IMAGE LOADER
// ========================================

class ImageLoader {
    constructor() {
        this.images = [];
        this.init();
    }
    
    init() {
        this.images = document.querySelectorAll('.gallery-figure img, .workshop-hero__image, .team-member__image img');
        
        if (this.images.length === 0) return;
        
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: '100px 0px',
                threshold: 0.01
            }
        );
        
        this.images.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('is-loaded');
            } else {
                this.observer.observe(img);
                
                img.addEventListener('load', () => {
                    img.classList.add('is-loaded');
                });
                
                img.addEventListener('error', () => {
                    img.classList.add('is-error');
                });
            }
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                
                this.observer.unobserve(img);
            }
        });
    }
}

// ========================================
// FLOATING WORDS BLUR
// ========================================

class FloatingWordsBlur {
    constructor() {
        this.words = [];
        this.section = null;
        this.init();
    }
    
    init() {
        this.section = document.querySelector('.about-gallery');
        this.words = document.querySelectorAll('.floating-word');
        
        if (!this.section || this.words.length === 0) return;
        
        window.addEventListener('scroll', () => {
            this.update();
        }, { passive: true });
        
        this.update();
    }
    
    update() {
        const sectionRect = this.section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (sectionRect.top > windowHeight || sectionRect.bottom < 0) {
            this.words.forEach(word => word.classList.remove('is-visible'));
            return;
        }
        
        this.words.forEach(word => {
            const wordRect = word.getBoundingClientRect();
            const wordCenter = wordRect.top + wordRect.height / 2;
            
            const focusZoneTop = windowHeight * 0.3;
            const focusZoneBottom = windowHeight * 0.7;
            
            if (wordCenter > focusZoneTop && wordCenter < focusZoneBottom) {
                word.classList.add('is-visible');
            } else {
                word.classList.remove('is-visible');
            }
        });
    }
}

// ========================================
// INICJALIZACJA - JEDNA GŁÓWNA
// ========================================

(function initApp() {
    
    function init() {
        console.log('🎨 Initializing workshop website...');
        
        // Reset stanów przy każdym ładowaniu
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.remove('is-revealed', 'reveal-visible');
        });
        
        // Inicjalizuj moduły
        try {
            new ScrollReveal();
            new WorkshopCardsEffect();
            new HeroParallax();
            new SmoothScroll();
            new NavbarScroll();
            new PageLoader();
            new ImageLoader();
            new FloatingWordsBlur();
            
            console.log('✅ All modules initialized');
        } catch (error) {
            console.error('❌ Error initializing modules:', error);
        }
    }
    
    // Uruchom po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
