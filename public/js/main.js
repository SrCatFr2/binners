// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const elements = {
        navbar: document.querySelector('.navbar'),
        cards: document.querySelectorAll('.card'),
        stats: document.querySelectorAll('.stat-number'),
        visualCards: document.querySelectorAll('.visual-card')
    };

    // Función segura para manipular estilos
    const safeStyle = (element, action) => {
        if (element && element.style) {
            action(element.style);
        }
    };

    // Función segura para manipular clases
    const safeClass = (element, action) => {
        if (element && element.classList) {
            action(element.classList);
        }
    };

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        safeStyle(elements.navbar, (style) => {
            style.transform = currentScroll > lastScroll ? 
                'translateY(-100%)' : 'translateY(0)';
        });

        lastScroll = currentScroll;
    });

    // Card hover effect
    document.addEventListener('mousemove', (e) => {
        elements.cards.forEach(card => {
            if (card && card.getBoundingClientRect) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                safeStyle(card, (style) => {
                    style.setProperty('--mouse-x', `${x}px`);
                    style.setProperty('--mouse-y', `${y}px`);
                });
            }
        });
    });

    // Stats animation
    const animateValue = (element, start, end, duration) => {
        if (!element) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);

            if (element.textContent) {
                element.textContent = value;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Inicializar animaciones de estadísticas
    elements.stats.forEach(stat => {
        if (stat && stat.textContent) {
            const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
            if (!isNaN(finalValue)) {
                animateValue(stat, 0, finalValue, 2000);
            }
        }
    });

    // Visual cards parallax
    document.addEventListener('mousemove', (e) => {
        elements.visualCards.forEach((card, index) => {
            if (!card) return;

            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            const depth = index + 1;
            const moveX = mouseX * depth * 30;
            const moveY = mouseY * depth * 30;

            safeStyle(card, (style) => {
                style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    });
});