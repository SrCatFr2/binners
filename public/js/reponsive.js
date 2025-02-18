// public/js/responsive.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    const filterToggle = document.querySelector('.filter-toggle');
    const sidebar = document.querySelector('.sidebar');
    const closeMenuButton = document.querySelector('.close-menu');

    // Menú móvil
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
            menuButton.querySelector('i').classList.toggle('fa-bars');
            menuButton.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Filtros móviles (para página de bins)
    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.menu-button')) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            menuButton.querySelector('i').classList.add('fa-bars');
            menuButton.querySelector('i').classList.remove('fa-times');
        }

        if (sidebar?.classList.contains('active') && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.filter-toggle')) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Cerrar al presionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (navLinks?.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                menuButton.querySelector('i').classList.add('fa-bars');
                menuButton.querySelector('i').classList.remove('fa-times');
            }
            if (sidebar?.classList.contains('active')) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Animación de scroll suave para links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Cerrar menú móvil si está abierto
                if (navLinks?.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
});