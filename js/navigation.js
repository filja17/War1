/* ========================================
   NAVIGATION.JS - DZIAŁAJĄCA WERSJA
   ======================================== */

(function() {
    'use strict';

    function initNavigation() {
        
        var hamburger = document.querySelector('.nav__hamburger');
        var menu = document.querySelector('.nav__menu');
        var body = document.body;
        var navLinks = document.querySelectorAll('.nav__link');
        
        if (!hamburger || !menu) {
            console.warn('Navigation: brak elementów');
            return;
        }
        
        var isOpen = false;
        var scrollPosition = 0;

        // Stwórz overlay dla blur
        var overlay = document.createElement('div');
        overlay.className = 'nav__overlay';
        body.appendChild(overlay);

        function openMenu() {
            isOpen = true;
            scrollPosition = window.scrollY;
            
            menu.classList.add('is-open');
            hamburger.classList.add('is-active');
            overlay.classList.add('is-visible');
            body.classList.add('menu-is-open');
            hamburger.setAttribute('aria-expanded', 'true');
            
            body.style.top = '-' + scrollPosition + 'px';
        }
        
        function closeMenu() {
            isOpen = false;
            
            menu.classList.remove('is-open');
            hamburger.classList.remove('is-active');
            overlay.classList.remove('is-visible');
            body.classList.remove('menu-is-open');
            hamburger.setAttribute('aria-expanded', 'false');
            
            body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }
        
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Event: kliknięcie hamburger
        hamburger.addEventListener('click', toggleMenu);

        // Event: kliknięcie w link
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].addEventListener('click', function(e) {
                if (isOpen) {
                    var href = this.getAttribute('href');
                    e.preventDefault();
                    closeMenu();
                    
                    setTimeout(function() {
                        window.location.href = href;
                    }, 300);
                }
            });
        }

        // Event: kliknięcie w overlay
        overlay.addEventListener('click', function() {
            if (isOpen) {
                closeMenu();
            }
        });

        // Event: klawisz Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        // Event: resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isOpen) {
                closeMenu();
            }
        });

        // Reset na start
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
    }

    // Uruchom po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }

})();
