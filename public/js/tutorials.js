// public/js/tutorials.js
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const tutorialsGrid = document.getElementById('tutorialsGrid');
    const categoryPills = document.querySelectorAll('.category-pill');

    // Estado
    let tutorialsData = [];
    let currentCategory = 'all';

    // Función para cargar los tutoriales
    const loadTutorials = async () => {
        try {
            showLoader();
            const response = await fetch('/api/tutorials');
            const data = await response.json();
            tutorialsData = data.tutorials;
            renderTutorials(filterTutorials(tutorialsData));
        } catch (error) {
            showError('Error al cargar los tutoriales. Por favor, intenta de nuevo.');
            console.error('Error loading tutorials:', error);
        } finally {
            hideLoader();
        }
    };

    // Función para renderizar los tutoriales
    const renderTutorials = (tutorials) => {
        if (!tutorialsGrid) return;

        if (tutorials.length === 0) {
            tutorialsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-video-slash"></i>
                    <p>No hay tutoriales disponibles en esta categoría</p>
                </div>
            `;
            return;
        }

        tutorialsGrid.innerHTML = tutorials.map((tutorial, index) => `
            <div class="tutorial-card" data-category="${tutorial.category.toLowerCase()}"
                 style="animation-delay: ${index * 100}ms">
                <div class="tutorial-thumbnail">
                    <img src="${tutorial.thumbnail}" alt="${tutorial.title}">
                    <div class="play-button">
                        <i class="fas fa-play"></i>
                    </div>
                    <span class="tutorial-duration">
                        <i class="fas fa-clock"></i>
                        ${tutorial.duration}
                    </span>
                </div>

                <div class="tutorial-content">
                    <span class="badge">
                        <i class="fas fa-${getCategoryIcon(tutorial.category)}"></i>
                        ${tutorial.category}
                    </span>

                    <h3 class="tutorial-title">${tutorial.title}</h3>
                    <p class="tutorial-description">${tutorial.description}</p>

                    <div class="tutorial-meta">
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(tutorial.date)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${formatViews(tutorial.views)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${tutorial.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Inicializar los click handlers para los tutoriales
        initializeTutorialCards();
    };

    // Función para filtrar tutoriales
    const filterTutorials = (tutorials) => {
        if (currentCategory === 'all') return tutorials;
        return tutorials.filter(tutorial => 
            tutorial.category.toLowerCase() === currentCategory
        );
    };

    // Función para obtener el icono según la categoría
    const getCategoryIcon = (category) => {
        const icons = {
            'Netflix': 'play',
            'Disney+': 'play',
            'Spotify': 'music',
            'Básicos': 'graduation-cap',
            'default': 'video'
        };
        return icons[category] || icons.default;
    };

    // Función para formatear fechas
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Función para formatear número de vistas
    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M vistas`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K vistas`;
        }
        return `${views} vistas`;
    };

    // Inicializar cards de tutoriales
    const initializeTutorialCards = () => {
        document.querySelectorAll('.tutorial-card').forEach(card => {
            card.addEventListener('click', () => {
                const tutorial = tutorialsData.find(t => 
                    t.title === card.querySelector('.tutorial-title').textContent
                );
                openVideoModal(tutorial);
            });
        });
    };

    // Función para abrir el modal de video
    const openVideoModal = (tutorial) => {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-container">
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
                <video controls autoplay>
                    <source src="/videos/tutorials/${tutorial.videoFile}" type="video/mp4">
                    Tu navegador no soporta el elemento video.
                </video>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Animar entrada
        requestAnimationFrame(() => modal.classList.add('active'));

        // Manejadores de eventos para cerrar
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Cerrar con Escape
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    };

    // Función para mostrar el loader
    const showLoader = () => {
        tutorialsGrid.innerHTML = `
            <div class="loader">
                <div class="loader-content"></div>
            </div>
        `;
    };

    // Función para ocultar el loader
    const hideLoader = () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    };

    // Función para mostrar errores
    const showError = (message) => {
        tutorialsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    };

    // Event Listeners para las pills de categorías
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Actualizar pills activas
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Actualizar categoría y renderizar
            currentCategory = pill.dataset.category;
            renderTutorials(filterTutorials(tutorialsData));
        });
    });

    // Inicializar
    loadTutorials();

    // Opcional: Actualizar tutoriales periódicamente
    setInterval(loadTutorials, 300000); // Cada 5 minutos
});