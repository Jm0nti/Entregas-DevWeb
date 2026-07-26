const HomeView = {
    state: {
        allMovies: [],
        filtered: [],
        currentPage: 1,
        pageSize: 20,
        searchQuery: '',
        selectedGenre: ''
    },

    elements: {},

    async init({ catalogEl, paginationEl, statusEl }) {
        this.elements = { catalogEl, paginationEl, statusEl };

        // Suscribirse a eventos emitidos por el navbar
        document.addEventListener('search:change', (e) => {
            this.state.searchQuery = e.detail.query;
            this.state.currentPage = 1;
            this.applyFilters();
        });

        document.addEventListener('genre:change', (e) => {
            this.state.selectedGenre = e.detail.genre;
            this.state.currentPage = 1;
            this.loadData();
        });

        document.addEventListener('filters:reset', () => {
            this.state.searchQuery = '';
            this.state.selectedGenre = '';
            this.state.currentPage = 1;
            this.loadData();
        });

        // Carga inicial
        await this.loadData();
    },

    async loadData() {
        this.setStatus('Cargando películas...');
        try {
            const movies = this.state.selectedGenre
                ? await ApiService.getMoviesByGenre(this.state.selectedGenre)
                : await ApiService.getAllMovies();

            this.state.allMovies = Array.isArray(movies) ? movies : [];
            this.applyFilters();
        } catch (error) {
            this.state.allMovies = [];
            this.state.filtered = [];
            this.render();
            this.setStatus('');
            Modal.show(
                'Error al cargar películas',
                'No se pudo conectar con la API. Verifica tu conexión e intenta de nuevo.'
            );
        }
    },

    applyFilters() {
        const q = this.state.searchQuery;
        this.state.filtered = q
            ? this.state.allMovies.filter(m =>
                (m.title || '').toLowerCase().includes(q))
            : [...this.state.allMovies];
        this.render();
    },


    render() {
        const { catalogEl, paginationEl } = this.elements;
        const { filtered, currentPage, pageSize } = this.state;

        catalogEl.innerHTML = '';

        if (filtered.length === 0) {
            this.setStatus('No se encontraron películas con esos filtros.');
            paginationEl.innerHTML = '';
            return;
        }

        this.setStatus('');

        const totalPages = Math.ceil(filtered.length / pageSize);
        const safePage = Math.min(currentPage, totalPages);
        this.state.currentPage = safePage;

        const start = (safePage - 1) * pageSize;
        const end = start + pageSize;
        const pageMovies = filtered.slice(start, end);

        // Construir cards dinámicamente (sin escribir HTML en el archivo estático)
        const fragment = document.createDocumentFragment();
        pageMovies.forEach(movie => fragment.appendChild(Card.create(movie)));
        catalogEl.appendChild(fragment);

        this.renderPagination(totalPages);
    },

    renderPagination(totalPages) {
        const { paginationEl } = this.elements;
        const { currentPage, filtered, pageSize } = this.state;
        paginationEl.innerHTML = '';

        if (totalPages <= 1) {
            paginationEl.innerHTML =
                `<span class="page-info">${filtered.length} resultado(s)</span>`;
            return;
        }

        // Btn anterior
        const prev = document.createElement('button');
        prev.className = 'page-btn';
        prev.textContent = '‹ Anterior';
        prev.disabled = currentPage === 1;
        prev.addEventListener('click', () => this.goToPage(currentPage - 1));
        paginationEl.appendChild(prev);

        // Rango de pags a mostrar
        const range = this.getPageRange(currentPage, totalPages, 5);
        range.forEach(p => {
            if (p === '...') {
                const dots = document.createElement('span');
                dots.className = 'page-info';
                dots.textContent = '…';
                paginationEl.appendChild(dots);
                return;
            }
            const btn = document.createElement('button');
            btn.className = 'page-btn' + (p === currentPage ? ' active' : '');
            btn.textContent = p;
            btn.addEventListener('click', () => this.goToPage(p));
            paginationEl.appendChild(btn);
        });

        // Btn Siguiente
        const next = document.createElement('button');
        next.className = 'page-btn';
        next.textContent = 'Siguiente ›';
        next.disabled = currentPage === totalPages;
        next.addEventListener('click', () => this.goToPage(currentPage + 1));
        paginationEl.appendChild(next);

        // Info
        const info = document.createElement('span');
        info.className = 'page-info';
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, filtered.length);
        info.textContent = `${start}–${end} de ${filtered.length}`;
        paginationEl.appendChild(info);
    },

    /**
     * Calcula que pags mostrar.
     */
    getPageRange(current, total, visible) {
        if (total <= visible + 2) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        const half = Math.floor(visible / 2);
        let start = Math.max(2, current - half);
        let end = Math.min(total - 1, current + half);

        if (current <= half + 1) end = visible;
        if (current >= total - half) start = total - visible + 1;

        const range = [1];
        if (start > 2) range.push('...');
        for (let i = start; i <= end; i++) range.push(i);
        if (end < total - 1) range.push('...');
        range.push(total);
        return range;
    },

    /**
     * Navega a una página
     */
    goToPage(page) {
        this.state.currentPage = page;
        this.render();
        this.elements.catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    setStatus(msg) {
        if (this.elements.statusEl) this.elements.statusEl.textContent = msg;
    }
};

window.HomeView = HomeView;
