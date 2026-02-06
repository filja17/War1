/* ========================================
   NAVIGATION.JS - PROSTA DZIAŁAJĄCA WERSJA
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    var hamburger = document.querySelector('.nav__hamburger');
    var menu = document.querySelector('.nav__menu');
    var body = document.body;
    
    if (!hamburger || !menu) {
        return;
    }
    
    // Stwórz overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    body.appendChild(overlay);
    
    var isOpen = false;
    var scrollY = 0;
    
    function openMenu() {
        scrollY = window.scrollY;
        isOpen = true;
        menu.classList.add('is-open');
        hamburger.classList.add('is-active');
        overlay.classList.add('is-visible');
        body.classList.add('menu-is-open');
        body.style.top = '-' + scrollY + 'px';
    }
    
    function closeMenu() {
        isOpen = false;
        menu.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        overlay.classList.remove('is-visible');
        body.classList.remove('menu-is-open');
        body.style.top = '';
        window.scrollTo(0, scrollY);
    }
    
    // Klik w hamburger
    hamburger.onclick = function(e) {
        e.preventDefault();
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };
    
    // Klik w overlay zamyka menu
    overlay.onclick = function() {
        closeMenu();
    };
    
    // Klik w link
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function(e) {
            if (isOpen && window.innerWidth <= 768) {
                e.preventDefault();
                var href = this.href;
                closeMenu();
                setTimeout(function() {
                    window.location.href = href;
                }, 300);
            }
        };
    }
    
    // Escape zamyka
    document.onkeydown = function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
        }
    };
    
});
