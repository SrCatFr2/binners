class BinsManager {
    constructor() {
        // Estado inicial
        this.state = {
            bins: [],
            filters: {
                search: '',
                platform: 'all',
                active: true
            }
        };

        // Referencias DOM
        this.elements = {
            binsGrid: document.getElementById('binsGrid'),
            searchInputs: document.querySelectorAll('.search-box input'),
            platformButtons: document.querySelectorAll('[data-platform]'),
            menuButton: document.querySelector('.menu-button'),
            sidebar: document.querySelector('.sidebar'),
            overlay: document.querySelector('.sidebar-overlay'),
            menuIcon: document.querySelector('.menu-button i')
        };

        this.init();
    }

    async init() {
        this.initParticles();
        this.initEvents();
        await this.loadBins();
    }

    // En la función loadBins dentro de la clase BinsManager
    async loadBins() {
        try {
            // Datos de respaldo en caso de error
            const defaultBins = [
                {
                    "platform": "Express VPN",
                    "bin": "434769205823xxxx|11|2029",
                    "location": "Estados Unidos",
                    "tip": "Sacar live en limpio oh a generadas.",
                    "isActive": true,
                    "verifiedDate": "2025-02-17",
                    "image": "/images/platforms/express.png"
                },
                {
                    "platform": "Netflix",
                    "bin": "552637429925xxxx|02|2026",
                    "location": "Propia o Brasil",
                    "tip": "Usar CCN Live.",
                    "isActive": true,
                    "verifiedDate": "2025-02-18",
                    "image": "/images/platforms/netflix.png"
                },
{
                    "platform": "Netflix",
                    "bin": "545973689005xxxx|04|2026",
                    "location": "Brasil",
                    "tip": "Usar CCN Live.",
                    "isActive": true,
                    "verifiedDate": "2025-02-18",
                    "image": "/images/platforms/netflix.png"
                },
{
                    "platform": "Canva",
                    "bin": " 402766585480",
                    "location": "Propia, pago a Mexico",
                    "tip": "Usar Lives o Generadas.",
                    "isActive": true,
                    "verifiedDate": "2025-02-18",
                    "image": "/images/platforms/canva.png"
                },
{
                    "platform": "Prime Video",
                    "bin": "416916144434xxxx|03|2029|xxx",
                    "location": "Mexico",
                    "tip": "Calar plan anual.",
                    "isActive": true,
                    "verifiedDate": "2025-02-18",
                    "image": "/images/platforms/prime.png"
                }
            ];

            // Intentar cargar desde el archivo
            const response = await fetch('/bins.json');

            if (!response.ok) {
                console.warn('Usando datos de respaldo');
                this.state.bins = defaultBins;
            } else {
                const data = await response.json();
                this.state.bins = data;
            }

            // Renderizar los bins
            this.renderBins();

        } catch (error) {
            console.warn('Error loading bins, using fallback data:', error);
            // Usar datos de respaldo en caso de error
            this.state.bins = defaultBins;
            this.renderBins();
        }
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
        // Búsqueda
        this.elements.searchInputs?.forEach(input => {
            input.addEventListener('input', (e) => {
                this.state.filters.search = e.target.value;
                this.renderBins();
            });
        });

        // Filtros de plataforma
        this.elements.platformButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.platformButtons.forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.state.filters.platform = button.dataset.platform;
                this.renderBins();
            });
        });
    }

    renderBins() {
        if (!this.elements.binsGrid) return;

        const filteredBins = this.filterBins();

        if (filteredBins.length === 0) {
            this.elements.binsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron bins con los filtros actuales</p>
                </div>
            `;
            return;
        }

        this.elements.binsGrid.innerHTML = filteredBins.map((bin, index) => `
            <div class="bin-card" data-platform="${bin.platform.toLowerCase()}"
                 style="animation: fadeInUp 0.5s ease forwards ${index * 0.1}s">
                <div class="bin-header">
                    <img src="${bin.image}" alt="${bin.platform}" class="platform-icon">
                    <div class="bin-info">
                        <div class="bin-name">${bin.platform}</div>
                        <div class="bin-location">
                            <i class="fas fa-globe"></i>
                            ${bin.location}
                        </div>
                    </div>
                </div>

                <div class="bin-number">
                    <span class="bin-digits">${this.maskBin(bin.bin)}</span>
                    <button class="copy-btn" data-bin="${bin.bin}" title="Copiar bin">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>

                <div class="bin-details">
                    <div class="detail-item">
                        <i class="fas fa-info-circle"></i>
                        <span>${bin.tip}</span>
                    </div>
                </div>

                <div class="bin-footer">
                    <span class="bin-date">
                        <i class="fas fa-clock"></i>
                        ${this.formatDate(bin.verifiedDate)}
                    </span>
                    <span class="bin-status status-active">
                        ${bin.isActive ? 'Activo' : 'Expirado'}
                    </span>
                </div>
            </div>
        `).join('');

        this.initializeCopyButtons();
    }

    filterBins() {
        return this.state.bins.filter(bin => {
            const matchesSearch = bin.platform.toLowerCase().includes(this.state.filters.search.toLowerCase()) ||
                                bin.location.toLowerCase().includes(this.state.filters.search.toLowerCase());
            const matchesPlatform = this.state.filters.platform === 'all' || 
                                  bin.platform.toLowerCase() === this.state.filters.platform;
            const matchesActive = !this.state.filters.active || bin.isActive;

            return matchesSearch && matchesPlatform && matchesActive;
        });
    }

    initializeCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const bin = e.currentTarget.dataset.bin;
                try {
                    await navigator.clipboard.writeText(bin);
                    const icon = e.currentTarget.querySelector('i');
                    icon.className = 'fas fa-check';
                    this.showToast('Bin copiado correctamente', 'success');
                    setTimeout(() => {
                        icon.className = 'fas fa-copy';
                    }, 2000);
                } catch (err) {
                    console.log('Bin copiado, pero hubo un error en la API:', err);
                    this.showToast('Bin copiado correctamente', 'success');
                }
            });
        });
    }

    maskBin(bin) {
        const visible = bin.slice(0, 6);
        const hidden = '••••';
        const last = bin.slice(-4);
        return `${visible} ${hidden} ${last}`;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.binsManager = new BinsManager();
});
