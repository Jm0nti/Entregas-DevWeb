const Navbar = {
    // Genros segun la API
    GENRES: [
        'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
        'Crime', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
        'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
        'War', 'Western'
    ],

    /**
     * Renderiza el navbar en contenedor
     * @param {HTMLElement} container
     */
    render(container) {
        const genreOptions = this.GENRES
            .map(g => `<option value="${g}">${g}</option>`)
            .join('');

        container.innerHTML = `
            <nav class="navbar">
                <div class="navbar-inner">
                    <div class="brand" id="brand">
                        <img src="assets/logo.png" alt="Logo Películas Cancheras" class="brand-logo" />
                        <span class="brand-text">Películas Cancheras</span>
                    </div>
                    <div class="nav-controls">
                        <input
                            type="search"
                            id="search-input"
                            class="nav-input"
                            placeholder="Buscar por título..."
                            aria-label="Buscar películas por título"
                        />
                        <select id="genre-select" class="nav-select" aria-label="Filtrar por género">
                            <option value="">Todos los géneros</option>
                            ${genreOptions}
                        </select>
                        <button id="reset-btn" class="nav-btn secondary" type="button">
                            Limpiar
                        </button>
                    </div>
                </div>
            </nav>
        `;

        this.bindEvents(container);
    },

    bindEvents(container) {
        const brand = container.querySelector('#brand');
        const searchInput = container.querySelector('#search-input');
        const genreSelect = container.querySelector('#genre-select');
        const resetBtn = container.querySelector('#reset-btn');

        let debounceId;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceId);
            debounceId = setTimeout(() => {
                document.dispatchEvent(new CustomEvent('search:change', {
                    detail: { query: e.target.value.trim().toLowerCase() }
                }));
            }, 250);
        });

        genreSelect.addEventListener('change', (e) => {
            document.dispatchEvent(new CustomEvent('genre:change', {
                detail: { genre: e.target.value }
            }));
        });

        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            genreSelect.value = '';
            document.dispatchEvent(new CustomEvent('filters:reset'));
        });

        brand.addEventListener('click', () => {
            searchInput.value = '';
            genreSelect.value = '';
            document.dispatchEvent(new CustomEvent('filters:reset'));
        });
    }
};

window.Navbar = Navbar;
