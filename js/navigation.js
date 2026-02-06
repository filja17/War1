/* ========================================
   NAVIGATION.JS - KOMPLETNA POPRAWIONA WERSJA
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
        const hamburger = document.querySelector('.nav__hamburger');
        const menu = document.querySelector('.nav__menu');
        const body = document.body;
        const navLinks = document.querySelectorAll('.nav__link');
        
        // Sprawdź czy elementy istnieją
        if (!hamburger || !menu) {
            console.warn('Navigation: Brak wymaganych elementów');
            return;
        }

        // Stan menu
        let isOpen = false;
        let isAnimating = false;

        // ========================================
        // FUNKCJE
        // ========================================
        
        function openMenu() {
            if (isAnimating) return;
            isAnimating = true;
            isOpen = true;
            
            // Dodaj klasy
            menu.classList.add('is-open');
            hamburger.classList.add('is-active');
            hamburger.setAttribute('aria-expanded', 'true');
            
            // Zablokuj scroll
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
            body.style.top = `-${window.scrollY}px`;
            body.style.left = '0';
            body.style.right = '0';
            body.dataset.scrollY = window.scrollY;
            
            // Animacja zakończona
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        }
        
        function closeMenu() {
            if (isAnimating) return;
            isAnimating = true;
            isOpen = false;
            
            // Usuń klasy
            menu.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            hamburger.setAttribute('aria-expanded', 'false');
            
            // Przywróć scroll
            const scrollY = body.dataset.scrollY || 0;
            body.style.overflow = '';
            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
            window.scrollTo(0, parseInt(scrollY));
            
            // Animacja zakończona
            setTimeout(() => {
                isAnimating = false;
            }, 400);
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
        // EVENT LISTENERS
        // ========================================
        
        // Kliknięcie hamburger - tylko click, bez touchend
        hamburger.addEventListener('click', function(event) {
            toggleMenu(event);
        });
        
        // Kliknięcie w link
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (isOpen) {
                    // Zamknij menu
                    closeMenu();
                }
                // Link zadziała normalnie
            });
        });
        
        // Kliknięcie poza menu (na overlay)
        menu.addEventListener('click', function(event) {
            // Jeśli kliknięto bezpośrednio w menu (nie w link)
            if (event.target === menu && isOpen) {
                closeMenu();
            }
        });
        
        // Escape zamyka menu
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });
        
        // Resize - zamknij menu jeśli przeszliśmy na desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && isOpen) {
                    closeMenu();
                }
            }, 100);
        });

        // ========================================
        // RESET PRZY ŁADOWANIU STRONY
        // ========================================
        
        // Upewnij się, że menu jest zamknięte przy starcie
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        body.style.position = '';
        
        console.log('✅ Navigation initialized');
    }

})();
