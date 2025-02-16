// public/js/bins.js
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const binsGrid = document.getElementById('binsGrid');
    const searchInput = document.querySelector('.search-input');
    const categoryPills = document.querySelectorAll('.category-pill');

    // Estado
    let binsData = [];
    let currentFilters = {
        search: '',
        category: 'all'
    };

    // Función para cargar los bins
    const loadBins = async () => {
        try {
            showLoader();
            const response = await fetch('/api/bins');
            const data = await response.json();
            binsData = data.bins;
            renderBins(filterBins(binsData));
        } catch (error) {
            showError('Error al cargar los bins. Por favor, intenta de nuevo.');
            console.error('Error loading bins:', error);
        } finally {
            hideLoader();
        }
    };

    // Función para renderizar los bins
    const renderBins = (bins) => {
        if (!binsGrid) return;

        if (bins.length === 0) {
            binsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron bins con los filtros actuales</p>
                </div>
            `;
            return;
        }

        binsGrid.innerHTML = bins.map((bin, index) => `
            <div class="bin-card" data-platform="${bin.platform.toLowerCase()}"
                 style="animation-delay: ${index * 100}ms">
                <div class="bin-header">
                    <img src="${bin.image}" alt="${bin.platform}" class="platform-icon">
                    <h3 class="platform-name">${bin.platform}</h3>
                    ${bin.isActive ? '<span class="badge badge-success">Verificado</span>' : ''}
                </div>

                <div class="bin-content">
                    <div class="bin-number">
                        <i class="fas fa-credit-card"></i>
                        <span>${maskBin(bin.bin)}</span>
                        <button class="copy-btn" data-bin="${bin.bin}" title="Copiar bin">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>

                    <div class="bin-details">
                        <div class="detail-item">
                            <i class="fas fa-globe"></i>
                            <span>${bin.location}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-info-circle"></i>
                            <span>${bin.tip}</span>
                        </div>
                        ${bin.success_rate ? `
                        <div class="detail-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Tasa de éxito: ${bin.success_rate}%</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="bin-footer">
                    <span class="bin-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(bin.verifiedDate)}
                    </span>
                    <span class="status-badge ${bin.isActive ? 'status-active' : 'status-expired'}">
                        ${bin.isActive ? 'Activo' : 'Expirado'}
                    </span>
                </div>
            </div>
        `).join('');

        // Inicializar los botones de copiar
        initializeCopyButtons();
    };

    // Función para filtrar bins
    const filterBins = (bins) => {
        return bins.filter(bin => {
            const matchesSearch = bin.platform.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
                                bin.location.toLowerCase().includes(currentFilters.search.toLowerCase());
            const matchesCategory = currentFilters.category === 'all' || 
                                  bin.platform.toLowerCase() === currentFilters.category;

            return matchesSearch && matchesCategory;
        });
    };

    // Función para enmascarar el número del bin
    const maskBin = (bin) => {
        return bin.replace(/(\d{6})(\d{6})(\d{4})/, '$1******$3');
    };

    // Función para formatear fechas
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Inicializar botones de copiar
    const initializeCopyButtons = () => {
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const bin = e.currentTarget.dataset.bin;
                try {
                    await navigator.clipboard.writeText(bin);
                    showToast('Bin copiado al portapapeles');

                    // Cambiar el icono temporalmente
                    const icon = e.currentTarget.querySelector('i');
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        icon.className = 'fas fa-copy';
                    }, 2000);
                } catch (err) {
                    showToast('Error al copiar el bin', 'error');
                }
            });
        });
    };

    // Función para mostrar el loader
    const showLoader = () => {
        binsGrid.innerHTML = `
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
        binsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    };

    // Función para mostrar notificaciones toast
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);

        // Animar salida y remover
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Event Listeners
    searchInput?.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        renderBins(filterBins(binsData));
    });

    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Actualizar pills activas
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Actualizar filtros y renderizar
            currentFilters.category = pill.dataset.category;
            renderBins(filterBins(binsData));
        });
    });

    // Inicializar
    loadBins();

    // Opcional: Recargar bins cada cierto tiempo
    setInterval(loadBins, 300000); // Cada 5 minutos
});