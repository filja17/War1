/* ========================================
   NAVIGATION.JS - PEŁNA WERSJA Z EFEKTAMI
   ======================================== */

(function() {
    'use strict';

    // Poczekaj na DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }

    function initNavigation() {
        
        // ========================================
        // ELEMENTY
        // ========================================
        
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.nav__hamburger');
        const menu = document.querySelector('.nav__menu');
        const body = document.body;
        const navLinks = document.querySelectorAll('.nav__link');
        const menuItems = document.querySelectorAll('.nav__menu li');
        
        // Sprawdź czy elementy istnieją
        if (!hamburger || !menu) {
            console.warn('Navigation: Brak wymaganych elementów');
            return;
        }

        // ========================================
        // STAN
        // ========================================
        
        let isOpen = false;
        let isAnimating = false;
        let scrollPosition = 0;

        // ========================================
        // TWORZENIE OVERLAY (blur background)
        // ========================================
        
        // Stwórz element overlay dla efektu blur
        let overlay = document.querySelector('.nav__overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav__overlay';
            document.body.appendChild(overlay);
        }

        // ========================================
        // FUNKCJE
        // ========================================
        
        function openMenu() {
            if (isAnimating) return;
            isAnimating = true;
            isOpen = true;
            
            // Zapamiętaj pozycję scrolla
            scrollPosition = window.scrollY;
            
            // Dodaj klasy
            menu.classList.add('is-open');
            hamburger.classList.add('is-active');
            overlay.classList.add('is-visible');
            body.classList.add('menu-is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            
            // Zablokuj scroll na body
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
            body.style.top = `-${scrollPosition}px`;
            body.style.left = '0';
            body.style.right = '0';
            body.style.width = '100%';
            
            // Animuj linki z opóźnieniem
            menuItems.forEach((item, index) => {
                item.style.transitionDelay = `${0.1 + index * 0.05}s`;
                item.classList.add('is-visible');
            });
            
            // Zakończ animację
            setTimeout(() => {
                isAnimating = false;
            }, 500);
            
            console.log('Menu opened');
        }
        
        function closeMenu() {
            if (isAnimating) return;
            isAnimating = true;
            isOpen = false;
            
            // Usuń klasy
            menu.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            overlay.classList.remove('is-visible');
            body.classList.remove('menu-is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Resetuj animację linków
            menuItems.forEach((item) => {
                item.style.transitionDelay = '0s';
                item.classList.remove('is-visible');
            });
            
            // Przywróć scroll
            body.style.overflow = '';
            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
            body.style.width = '';
            
            // Wróć do pozycji scrolla
            window.scrollTo(0, scrollPosition);
            
            // Zakończ animację
            setTimeout(() => {
                isAnimating = false;
            }, 500);
            
            console.log('Menu closed');
        }
        
        function toggleMenu(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // ========================================
        // EVENT LISTENERS - HAMBURGER
        // ========================================
        
        // Click
        hamburger.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            toggleMenu(event);
        });
        
        // Touch - dla lepszej responsywności na mobile
        let touchStartY = 0;
        let touchMoved = false;
        
        hamburger.addEventListener('touchstart', function(event) {
            touchStartY = event.touches[0].clientY;
            touchMoved = false;
        }, { passive: true });
        
        hamburger.addEventListener('touchmove', function(event) {
            const touchY = event.touches[0].clientY;
            if (Math.abs(touchY - touchStartY) > 10) {
                touchMoved = true;
            }
        }, { passive: true });
        
        hamburger.addEventListener('touchend', function(event) {
            // Tylko jeśli nie było przesunięcia (swipe)
            if (!touchMoved) {
                event.preventDefault();
                toggleMenu(event);
            }
        });

        // ========================================
        // EVENT LISTENERS - LINKI W MENU
        // ========================================
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                if (isOpen) {
                    // Zamknij menu przed nawigacją
                    event.preventDefault();
                    const href = link.getAttribute('href');
                    
                    closeMenu();
                    
                    // Nawiguj po zamknięciu animacji
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });

        // ========================================
        // EVENT LISTENERS - OVERLAY (kliknięcie poza menu)
        // ========================================
        
        overlay.addEventListener('click', function() {
            if (isOpen) {
                closeMenu();
            }
        });

        // ========================================
        // EVENT LISTENERS - KLAWIATURA
        // ========================================
        
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        // ========================================
        // EVENT LISTENERS - RESIZE
        // ========================================
        
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Zamknij menu jeśli przeszliśmy na desktop
                if (window.innerWidth > 768 && isOpen) {
                    closeMenu();
                }
            }, 100);
        });

        // ========================================
        // NAVBAR SCROLL EFFECT
        // ========================================
        
        let lastScrollY = 0;
        let ticking = false;
        
        function updateNavOnScroll() {
            const currentScrollY = window.scrollY;
            
            // Dodaj cień/tło gdy strona jest przewinięta
            if (currentScrollY > 50) {
                nav.classList.add('nav--scrolled');
            } else {
                nav.classList.remove('nav--scrolled');
            }
            
            // Opcjonalnie: ukryj/pokaż nav przy scrollowaniu
            // if (currentScrollY > lastScrollY && currentScrollY > 100) {
            //     nav.classList.add('nav--hidden');
            // } else {
            //     nav.classList.remove('nav--hidden');
            // }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking && !isOpen) {
                window.requestAnimationFrame(updateNavOnScroll);
                ticking = true;
            }
        }, { passive: true });

        // ========================================
        // INITIAL STATE
        // ========================================
        
        // Upewnij się, że menu jest zamknięte na starcie
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        overlay.classList.remove('is-visible');
        body.classList.remove('menu-is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        body.style.position = '';
        
        // Początkowy stan nav
        updateNavOnScroll();
        
        console.log('✅ Navigation initialized');
    }

})();
