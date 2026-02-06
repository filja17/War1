/* ========================================
   CONTACT.JS - PROSTA WERSJA Z FORMSPREE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Sprawdź czy formularz został wysłany (powrót z Formspree)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
        showSuccessMessage();
    }
    
    // Auto-resize textarea
    const textarea = document.querySelector('.form-field__textarea');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(this.scrollHeight, 150) + 'px';
        });
    }
    
    // Walidacja przed wysłaniem
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            
            let isValid = true;
            
            // Walidacja email
            if (!email.value || !isValidEmail(email.value)) {
                showFieldError(email, 'Podaj poprawny adres email');
                isValid = false;
            } else {
                clearFieldError(email);
            }
            
            // Walidacja wiadomości
            if (!message.value || message.value.trim().length < 10) {
                showFieldError(message, 'Wiadomość powinna mieć minimum 10 znaków');
                isValid = false;
            } else {
                clearFieldError(message);
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    // Funkcje pomocnicze
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFieldError(field, message) {
        const parent = field.closest('.form-field');
        parent.classList.add('form-field--error');
        
        let errorEl = parent.querySelector('.form-field__error');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-field__error';
            parent.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }
    
    function clearFieldError(field) {
        const parent = field.closest('.form-field');
        parent.classList.remove('form-field--error');
        
        const errorEl = parent.querySelector('.form-field__error');
        if (errorEl) {
            errorEl.textContent = '';
        }
    }
    
    function showSuccessMessage() {
        const form = document.getElementById('contactForm');
        const formWrapper = document.querySelector('.contact-form-wrapper');
        
        if (form && formWrapper) {
            form.style.display = 'none';
            
            const successDiv = document.createElement('div');
            successDiv.className = 'contact-success is-visible';
            successDiv.innerHTML = `
                <div class="contact-success__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </div>
                <h2 class="contact-success__title">Dziękujemy!</h2>
                <p class="contact-success__text">
                    Twoja wiadomość została wysłana.<br>
                    Odpowiemy najszybciej jak to możliwe.
                </p>
                <button type="button" class="contact-success__button" onclick="window.location.href='contact.html'">
                    Wyślij kolejną wiadomość
                </button>
            `;
            
            formWrapper.appendChild(successDiv);
        }
    }
    
    console.log('Contact form initialized');
});
