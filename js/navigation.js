/* ========================================
   NAVIGATION.JS - WERSJA PROSTA DEBUG
   ======================================== */

(function() {
    
    // Poczekaj na załadowanie strony
    document.addEventListener('DOMContentLoaded', function() {
        
        console.log('Navigation: Start');
        
        // Znajdź elementy
        var hamburger = document.querySelector('.nav__hamburger');
        var menu = document.querySelector('.nav__menu');
        
        console.log('Hamburger:', hamburger);
        console.log('Menu:', menu);
        
        // Sprawdź czy istnieją
        if (!hamburger) {
            console.error('NIE ZNALEZIONO HAMBURGERA!');
            return;
        }
        
        if (!menu) {
            console.error('NIE ZNALEZIONO MENU!');
            return;
        }
        
        // Stan menu
        var isOpen = false;
        
        // Funkcja toggle
        function toggleMenu() {
            console.log('Toggle menu, isOpen:', isOpen);
            
            if (isOpen) {
                // ZAMKNIJ
                menu.classList.remove('is-open');
                hamburger.classList.remove('is-active');
                document.body.classList.remove('menu-is-open');
                isOpen = false;
                console.log('Menu ZAMKNIĘTE');
            } else {
                // OTWÓRZ
                menu.classList.add('is-open');
                hamburger.classList.add('is-active');
                document.body.classList.add('menu-is-open');
                isOpen = true;
                console.log('Menu OTWARTE');
            }
            
            // Debug - sprawdź klasy
            console.log('Menu classes:', menu.className);
        }
        
        // Kliknięcie w hamburger
        hamburger.addEventListener('click', function(e) {
            console.log('Hamburger CLICKED');
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Kliknięcie w linki - zamknij menu
        var links = document.querySelectorAll('.nav__link');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                console.log('Link clicked');
                if (isOpen) {
                    toggleMenu();
                }
            });
        });
        
        console.log('Navigation: Ready');
        
    });
    
})();
