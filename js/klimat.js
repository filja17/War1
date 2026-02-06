/* ========================================
   KLIMAT.JS
   Efekt blur zdjęć i pojawiających się napisów
   ======================================== */

(function() {
    'use strict';

    class KlimatSection {
        constructor() {
            this.section = null;
            this.backgrounds = [];
            this.words = [];
            this.isActive = false;
            this.currentBgIndex = 0;
            this.currentWordIndex = -1;
            
            this.init();
        }
        
        init() {
            this.section = document.querySelector('.klimat-section');
            if (!this.section) return;
            
            this.backgrounds = this.section.querySelectorAll('.klimat-bg');
            this.words = this.section.querySelectorAll('.klimat-word');
            
            if (this.backgrounds.length === 0 || this.words.length === 0) return;
            
            // Binduj scroll
            this.bindScroll();
            
            // Początkowa aktualizacja
            this.update();
            
            console.log('Klimat section initialized:', {
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
            
            // Sprawdź czy sekcja jest widoczna
            const sectionStart = sectionTop;
            const sectionEnd = sectionTop + sectionHeight;
            
            if (sectionStart < windowHeight && sectionEnd > 0) {
                // Sekcja jest widoczna
                if (!this.isActive) {
                    this.section.classList.add('is-active');
                    this.isActive = true;
                }
                
                // Oblicz postęp scrollowania przez sekcję (0 do 1)
                const scrollProgress = Math.max(0, Math.min(1, 
                    (windowHeight - sectionTop) / (sectionHeight + windowHeight)
                ));
                
                // Aktualizuj tła i słowa
                this.updateBackgrounds(scrollProgress);
                this.updateWords(scrollProgress);
                
            } else {
                // Sekcja niewidoczna
                if (this.isActive) {
                    this.section.classList.remove('is-active');
                    this.isActive = false;
                    this.resetAll();
                }
            }
        }
        
        updateBackgrounds(progress) {
            const totalBgs = this.backgrounds.length;
            if (totalBgs === 0) return;
            
            // Które zdjęcie powinno być aktywne
            const bgIndex = Math.min(
                Math.floor(progress * totalBgs),
                totalBgs - 1
            );
            
            if (bgIndex !== this.currentBgIndex) {
                this.currentBgIndex = bgIndex;
            }
            
            // Ustaw klasy dla każdego tła
            this.backgrounds.forEach((bg, index) => {
                bg.classList.remove('is-active', 'is-blur');
                
                if (index === bgIndex) {
                    bg.classList.add('is-active');
                } else if (index === bgIndex - 1 || index === bgIndex + 1) {
                    bg.classList.add('is-blur');
                }
            });
        }
        
        updateWords(progress) {
            const totalWords = this.words.length;
            if (totalWords === 0) return;
            
            // Które słowo powinno być widoczne
            const wordIndex = Math.min(
                Math.floor(progress * totalWords),
                totalWords - 1
            );
            
            // Aktualizuj słowa
            this.words.forEach((word, index) => {
                word.classList.remove('is-visible', 'is-exiting');
                
                if (index === wordIndex) {
                    word.classList.add('is-visible');
                } else if (index < wordIndex) {
                    word.classList.add('is-exiting');
                }
            });
            
            this.currentWordIndex = wordIndex;
        }
        
        resetAll() {
            this.backgrounds.forEach(bg => {
                bg.classList.remove('is-active', 'is-blur');
            });
            
            this.words.forEach(word => {
                word.classList.remove('is-visible', 'is-exiting');
            });
            
            this.currentBgIndex = 0;
            this.currentWordIndex = -1;
        }
    }

    // Inicjalizacja po załadowaniu DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new KlimatSection());
    } else {
        new KlimatSection();
    }

})();
