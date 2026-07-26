const Card = {
    /**
     * Convierte el numero de estrellas a caracteres visuales
     * @param {number} stars
     * @returns {string}
     */
    renderStars(stars) {
        const full = Math.round(Number(stars) || 0);
        return '★'.repeat(full) + '☆'.repeat(Math.max(0, 5 - full));
    },

    /**
     */
    escape(str) {
        return String(str ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    },

    /**
     * Crea el elemento DOM de una tarjeta de pelicula
     * @param {Object} movie - {id, title, description, year, image_url, genre, stars}
     * @returns {HTMLElement}
     */
    create(movie) {
        const article = document.createElement('article');
        article.className = 'card';
        article.setAttribute('data-id', movie.id);

        const title = this.escape(movie.title);
        const desc = this.escape(movie.description);
        const year = this.escape(movie.year);
        const img = this.escape(movie.image_url);
        const stars = this.renderStars(movie.stars);

        article.innerHTML = `
            <img
                class="card-img"
                src="${img}"
                alt="Póster de ${title}"
                loading="lazy"
                onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22><rect width=%22200%22 height=%22300%22 fill=%22%232a2a2a%22/><text x=%22100%22 y=%22150%22 fill=%22%23888%22 font-family=%22Arial%22 font-size=%2214%22 text-anchor=%22middle%22>Sin imagen</text></svg>'"
            />
            <div class="card-year-badge">
                <span>${year}</span>
                <span class="stars" aria-label="Calificación">${stars}</span>
            </div>
            <div class="card-overlay">
                <h3 class="card-title">${title}</h3>
                <p class="card-desc">${desc}</p>
            </div>
        `;

        return article;
    }
};

window.Card = Card;
