/* ========================================
   KLIMAT.JS
   Efekt blur zdjęć i lewitujących napisów
   ======================================== */

(function() {
    'use strict';

    class KlimatSection {
        constructor() {
            this.section = null;
            this.sticky = null;
            this.backgrounds = [];
            this.words = [];
            this.totalItems = 0;
            this.currentIndex = -1;
            
            this.init();
        }
        
        init() {
            this.section = document.querySelector('.klimat-section');
            if (!this.section) return;
            
            this.sticky = this.section.querySelector('.klimat-sticky');
            this.backgrounds = Array.from(this.section.querySelectorAll('.klimat-bg'));
            this.words = Array.from(this.section.querySelectorAll('.klimat-word'));
            
            this.totalItems = Math.max(this.backgrounds.length, this.words.length);
            
            if (this.totalItems === 0) return;
            
            // Ustaw początkowe stany
            this.words.forEach(word => word.classList.add('is-entering'));
            
            // Binduj scroll
            this.bindScroll();
            
            // Początkowa aktualizacja
            this.update();
            
            console.log('Klimat initialized:', {
                backgrounds: this.backgrounds.length,
                words: this.words.length
            });
        }
        
        bindScroll() {
            let ticking = false;
            
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
        
        update() {
            const sectionRect = this.section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            const windowHeight = window.innerHeight;
            
            // Czy sekcja jest w viewport?
            if (sectionTop > windowHeight || sectionTop + sectionHeight < 0) {
                return;
            }
            
            // Oblicz postęp (0 do 1)
            const scrollableHeight = sectionHeight - windowHeight;
            const scrolled = -sectionTop;
            const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
            
            // Dodaj klasę gdy zaczyna się scroll
            if (progress > 0.05) {
                this.section.classList.add('is-scrolled');
            } else {
                this.section.classList.remove('is-scrolled');
            }
            
            // Który element powinien być aktywny?
            const newIndex = Math.min(
                Math.floor(progress * this.totalItems),
                this.totalItems - 1
            );
            
            if (newIndex !== this.currentIndex) {
                this.currentIndex = newIndex;
                this.updateBackgrounds(newIndex);
                this.updateWords(newIndex);
            }
        }
        
        updateBackgrounds(activeIndex) {
            this.backgrounds.forEach((bg, index) => {
                bg.classList.remove('is-active', 'is-previous');
                
                if (index === activeIndex) {
                    bg.classList.add('is-active');
                } else if (index === activeIndex - 1) {
                    bg.classList.add('is-previous');
                }
            });
        }
        
        updateWords(activeIndex) {
            this.words.forEach((word, index) => {
                word.classList.remove('is-entering', 'is-visible', 'is-exiting');
                
                if (index === activeIndex) {
                    word.classList.add('is-visible');
                } else if (index < activeIndex) {
                    word.classList.add('is-exiting');
                } else {
                    word.classList.add('is-entering');
                }
            });
        }
    }

    // Inicjalizacja
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new KlimatSection());
    } else {
        new KlimatSection();
    }

})();
