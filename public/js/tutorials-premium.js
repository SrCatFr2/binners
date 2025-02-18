class TutorialsManager {
    constructor() {
        // Estado inicial
        this.state = {
            tutorials: [
                {
                    id: 1,
                    platform: "NordVpn",
                    title: "Como calar bin de Nord Vpn 2025",
                    description: "Tutorial completo del método más reciente para Nord Vpn",
                    videoUrl: "../images/tutorials/nordvpn.mp4",
                    duration: "2:19",
                    views: 100,
                    date: "2025-02-17",
                    difficulty: "Intermedio"
                }
            ],
            currentPlatform: 'all'
        };

        // Referencias DOM
        this.elements = {
            grid: document.getElementById('tutorialsGrid'),
            platformButtons: document.querySelectorAll('.platform-btn'),
            particles: document.getElementById('particles-js')
        };

        // Inicializar
        this.init();
    }

    init() {
        this.initParticles();
        this.initEvents();
        this.renderTutorials();
    }

    initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#ffffff"
                },
                opacity: {
                    value: 0.1,
                    random: false
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "grab"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }

    initEvents() {
        this.elements.platformButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.platformButtons.forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.state.currentPlatform = button.dataset.platform;
                this.renderTutorials();
            });
        });
    }

    renderTutorials() {
        if (!this.elements.grid) return;

        const filteredTutorials = this.filterTutorials();

        if (filteredTutorials.length === 0) {
            this.elements.grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-video-slash"></i>
                    <p>No hay tutoriales disponibles para esta plataforma</p>
                </div>
            `;
            return;
        }

        this.elements.grid.innerHTML = filteredTutorials.map(tutorial => `
            <article class="tutorial-card" data-id="${tutorial.id}">
                <div class="tutorial-content">
                    <div class="tutorial-platform">
                        <img src="../images/platforms/${tutorial.platform.toLowerCase()}.png" 
                             alt="${tutorial.platform}">
                        <span>${tutorial.platform}</span>
                    </div>

                    <h3 class="tutorial-title">${tutorial.title}</h3>
                    <p class="tutorial-description">${tutorial.description}</p>

                    <div class="tutorial-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${tutorial.duration}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${this.formatViews(tutorial.views)}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${tutorial.difficulty}
                        </span>
                    </div>

                    <button class="watch-button">
                        <i class="fas fa-play"></i>
                        Ver Tutorial
                    </button>
                </div>
            </article>
        `).join('');

        requestAnimationFrame(() => {
            document.querySelectorAll('.tutorial-card').forEach((card, index) => {
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            });
        });

        this.initializeTutorialCards();
    }

    filterTutorials() {
        if (this.state.currentPlatform === 'all') {
            return this.state.tutorials;
        }
        return this.state.tutorials.filter(tutorial => 
            tutorial.platform.toLowerCase() === this.state.currentPlatform
        );
    }

    initializeTutorialCards() {
        document.querySelectorAll('.tutorial-card').forEach(card => {
            card.addEventListener('click', () => {
                const tutorialId = parseInt(card.dataset.id);
                const tutorial = this.state.tutorials.find(t => t.id === tutorialId);
                if (tutorial) {
                    this.openTutorialModal(tutorial);
                }
            });
        });
    }

    openTutorialModal(tutorial) {
        const modal = document.createElement('div');
        modal.className = 'tutorial-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="video-container">
                    <video controls autoplay>
                        <source src="${tutorial.videoUrl}" type="video/mp4">
                        Tu navegador no soporta el elemento video.
                    </video>
                </div>
                <div class="modal-info">
                    <h3>${tutorial.title}</h3>
                    <p>${tutorial.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => modal.classList.add('active'));

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    formatViews(views) {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M vistas`;
        }
        if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K vistas`;
        }
        return `${views} vistas`;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialsManager = new TutorialsManager();
});