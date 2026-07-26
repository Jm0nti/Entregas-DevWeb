const API_BASE = 'https://devsapihub.com/api-movies';

const ApiService = {
    /**
     * Obtiene todas las peliculas
     * @returns {Promise<Array>}
     */
    async getAllMovies() {
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('[ApiService.getAllMovies]', error);
            throw error;
        }
    },

    /**
     * Filtra peliculas por genero
     * @param {string} genre 
     * @returns {Promise<Array>}
     */
    async getMoviesByGenre(genre) {
        try {
            const response = await fetch(`${API_BASE}/genre/${encodeURIComponent(genre)}`);
            if (response.status === 404) return []; // Sin coincidencias
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('[ApiService.getMoviesByGenre]', error);
            throw error;
        }
    },

    /**
     * @param {number} limit
     * @returns {Promise<Array>}
     */
    async getMoviesLimit(limit) {
        try {
            const response = await fetch(`${API_BASE}/limit/${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('[ApiService.getMoviesLimit]', error);
            throw error;
        }
    }
};

// Expone el servicio para q otros modulos lo consuman
window.ApiService = ApiService;
