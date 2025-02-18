// public/js/home-premium.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Particles.js con configuración optimizada
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.1,
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.1,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.3
                    }
                },
                "push": {
                    "particles_nb": 3
                }
            }
        },
        "retina_detect": true
    });

    // Inicializar Vanilla Tilt con configuración optimizada
    VanillaTilt.init(document.querySelectorAll(".credit-card"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
        scale: 1.05,
        perspective: 1000,
        transition: true,
        gyroscope: true,
        gyroscopeMinAngleX: -45,
        gyroscopeMaxAngleX: 45,
        gyroscopeMinAngleY: -45,
        gyroscopeMaxAngleY: 45
    });

    // Referencias DOM
    const menuButton = document.querySelector('.menu-button');
    const sidebar = document.querySelector('.sidebar');
    const menuIcon = menuButton?.querySelector('i');

    // Crear overlay para el sidebar
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay mobile-only';
    document.body.appendChild(overlay);

    // Animación de números en estadísticas
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

    // Animación de estadísticas con Intersection Observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const finalValue = parseInt(statNumber.dataset.value || statNumber.textContent);
                    animateValue(statNumber, 0, finalValue, 2000);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.stat').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Efecto parallax en tarjetas
    const handleParallax = (e) => {
        if (window.innerWidth < 1024) return; // Desactivar en móvil

        const cards = document.querySelectorAll('.credit-card');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        cards.forEach((card, index) => {
            const depth = index + 1;
            const moveX = mouseX * depth * 30;
            const moveY = mouseY * depth * 30;
            const rotateY = mouseX * depth * 20;
            const rotateX = -mouseY * depth * 20;

            requestAnimationFrame(() => {
                card.style.transform = `
                    translate3d(${moveX}px, ${moveY}px, 0)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;
            });
        });
    };

    // Throttle para el efecto parallax
    let parallaxTimeout;
    document.addEventListener('mousemove', (e) => {
        if (parallaxTimeout) return;
        parallaxTimeout = setTimeout(() => {
            handleParallax(e);
            parallaxTimeout = null;
        }, 16); // ~60fps
    });

    // Funcionalidad del sidebar
    const toggleSidebar = (show) => {
        sidebar?.classList.toggle('active', show);
        overlay?.classList.toggle('active', show);
        if (menuIcon) {
            menuIcon.classList.toggle('fa-bars', !show);
            menuIcon.classList.toggle('fa-times', show);
        }
        document.body.style.overflow = show ? 'hidden' : '';
    };

    // Event Listeners para el sidebar
    menuButton?.addEventListener('click', () => {
        toggleSidebar(!sidebar.classList.contains('active'));
    });

    overlay?.addEventListener('click', () => {
        toggleSidebar(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
            toggleSidebar(false);
        }
    });

    // Manejar resize de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth >= 1024) {
                toggleSidebar(false);
            }
        }, 100);
    });

    // Detectar preferencias de reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.credit-card').forEach(card => {
            card.style.animation = 'none';
        });
    }

    // Mejorar rendimiento de scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            // Aquí puedes agregar efectos de scroll si los necesitas
            scrollTimeout = null;
        }, 16);
    }, { passive: true });

    // Cleanup function
    const cleanup = () => {
        statsObserver.disconnect();
        document.removeEventListener('mousemove', handleParallax);
        overlay?.remove();
    };

    // Cleanup en unmount (útil si implementas SPA en el futuro)
    window.addEventListener('unload', cleanup);
});