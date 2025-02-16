document.addEventListener('DOMContentLoaded', () => {
    // Animación de números en las estadísticas
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString() + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // Animación cuando los elementos son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const finalValue = parseInt(statNumber.textContent);
                    animateValue(statNumber, 0, finalValue, 2000);
                }
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observar elementos para animación
    document.querySelectorAll('.stat-item, .feature-card').forEach(el => {
        observer.observe(el);
    });

    // Actualizar estadísticas en tiempo real
    const updateStats = async () => {
        try {
            const response = await fetch('/api/community/stats');
            const stats = await response.json();

            // Actualizar números con animación
            Object.entries(stats).forEach(([key, value]) => {
                const element = document.querySelector(`[data-stat="${key}"]`);
                if (element) {
                    const currentValue = parseInt(element.textContent);
                    if (currentValue !== value) {
                        animateValue(element, currentValue, value, 1000);
                    }
                }
            });
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    };

    // Actualizar estadísticas cada minuto
    setInterval(updateStats, 60000);
});