// public/js/community.js
document.addEventListener('DOMContentLoaded', () => {
    // Animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.feature-card, .server-feature').forEach(el => {
        observer.observe(el);
    });

    // Contador de estadísticas animado
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Animación de estadísticas al cargar la página
    const statsElements = document.querySelectorAll('.stat span');
    statsElements.forEach(el => {
        const finalValue = parseInt(el.textContent);
        animateValue(el, 0, finalValue, 2000);
    });
});