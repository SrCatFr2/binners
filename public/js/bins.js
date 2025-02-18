// public/js/bins-premium.js

class BinsManager {
    constructor() {
        // Estado
        this.state = {
            bins: [],
            filters: {
                search: '',
                platform: 'all',
                active: true,
                verified: false
            }
        };

        // Referencias DOM
        this.elements = {
            binsGrid: document.getElementById('binsGrid'),
            searchInputs: document.querySelectorAll('.search-box input'),
            platformButtons: document.querySelectorAll('[data-platform]'),
            statusCheckboxes: document.querySelectorAll('.status-checkbox input'),
            menuButton: document.querySelector('.menu-button'),
            sidebar: document.querySelector('.sidebar'),
            overlay: document.querySelector('.sidebar-overlay'),
            menuIcon: document.querySelector('.menu-button i'),
            clearFilters: document.querySelector('.clear-filters')
        };

        this.init();
    }

    async init() {
        // Inicializar Particles.js
        this.initParticles();

        // Inicializar eventos
        this.initEvents();

        // Cargar bins
        await this.loadBins();
    }

    initParticles() {
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
                "opacity": {
                    "value": 0.1,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
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
                }
            },
            "retina_detect": true
        });
    }

    initEvents() {
        // Búsqueda
        this.elements.searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.state.filters.search = e.target.value;
                this.renderBins();
            });
        });

        // Filtros de plataforma
        this.elements.platformButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.elements.platformButtons.forEach(btn => 
                    btn.classList.remove('active'));
                button.classList.add('active');
                this.state.filters.platform = button.dataset.platform;
                this.renderBins();
            });
        });

        // Checkboxes de estado
        this.elements.statusCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const filterType = checkbox.closest('.status-checkbox').dataset.filter;
                this.state.filters[filterType] = checkbox.checked;
                this.renderBins();
            });
        });

        // Sidebar móvil
        this.initSidebar();

        // Limpiar filtros
        this.elements.clearFilters?.addEventListener('click', () => {
            this.clearFilters();
        });
    }

    initSidebar() {
        // Toggle sidebar
        this.elements.menuButton?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Cerrar con overlay
        this.elements.overlay?.addEventListener('click', () => {
            this.toggleSidebar(false);
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.toggleSidebar(false);
        });

        // Cerrar en resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) this.toggleSidebar(false);
        });
    }

    toggleSidebar(show) {
        const isActive = show ?? !this.elements.sidebar?.classList.contains('active');
        this.elements.sidebar?.classList.toggle('active', isActive);
        this.elements.overlay?.classList.toggle('active', isActive);
        if (this.elements.menuIcon) {
            this.elements.menuIcon.className = `fas fa-${isActive ? 'times' : 'bars'}`;
        }
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    async loadBins() {
        try {
            this.showLoader();
            const response = await fetch('/api/bins');
            const data = await response.json();
            this.state.bins = data.bins;
            this.renderBins();
        } catch (error) {
            console.error('Error loading bins:', error);
            this.showError('Error al cargar los bins. Por favor, intenta de nuevo.');
        }
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
                 style="animation: cardReveal 0.5s ease forwards ${index * 0.1}s">
                <div class="bin-header">
                    <img src="${bin.image}" alt="${bin.platform}" class="bin-platform">
                    <div class="bin-info">
                        <div class="bin-name">${bin.platform}</div>
                        <div class="bin-location">
                            <i class="fas fa-globe"></i>
                            ${bin.location}
                        </div>
                    </div>
                </div>

                <div class="bin-number">
                    <span class="bin-digits">${this.formatBin(bin.bin)}</span>
                    <button class="copy-btn" data-bin="${bin.bin}" title="Copiar">
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
            const matchesVerified = !this.state.filters.verified || bin.verified;

            return matchesSearch && matchesPlatform && matchesActive && matchesVerified;
        });
    }

    formatBin(bin) {
        const visible = bin.slice(0, 6);
        const hidden = '••••';
        const last = bin.slice(-4);
        return `${visible} ${hidden} ${last}`;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    initializeCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const bin = e.currentTarget.dataset.bin;
                try {
                    await navigator.clipboard.writeText(bin);
                    this.showToast('Bin copiado al portapapeles');

                    const icon = e.currentTarget.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        icon.className = 'fas fa-copy';
                    }, 2000);
                } catch (err) {
                    this.showToast('Error al copiar el bin', 'error');
                }
            });
        });
    }

    clearFilters() {
        this.state.filters = {
            search: '',
            platform: 'all',
            active: true,
            verified: false
        };

        this.elements.searchInputs.forEach(input => input.value = '');
        this.elements.platformButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.platform === 'all');
        });
        this.elements.statusCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.dataset.filter === 'active';
        });

        this.renderBins();
    }

    showLoader() {
        if (!this.elements.binsGrid) return;
        this.elements.binsGrid.innerHTML = `
            <div class="loader">
                <div class="loader-spinner"></div>
            </div>
        `;
    }

    showError(message) {
        if (!this.elements.binsGrid) return;
        this.elements.binsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));

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