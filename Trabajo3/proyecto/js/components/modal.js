const Modal = {
    container: null,

    init(container) {
        this.container = container;
        // Cierra al hacer click fuera del contenido
        container.addEventListener('click', (e) => {
            if (e.target === container) this.close();
        });
        // Cierra con la tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    /**
     * @param {string} title
     * @param {string} message
     */
    show(title, message) {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="modal-content">
                <h3>${this.escape(title)}</h3>
                <p>${this.escape(message)}</p>
                <button class="nav-btn" id="modal-close">Cerrar</button>
            </div>
        `;
        this.container.classList.add('open');
        this.container.setAttribute('aria-hidden', 'false');
        this.container.querySelector('#modal-close')
            .addEventListener('click', () => this.close());
    },

    close() {
        if (!this.container) return;
        this.container.classList.remove('open');
        this.container.setAttribute('aria-hidden', 'true');
        this.container.innerHTML = '';
    },

    escape(str) {
        return String(str ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
    }
};

window.Modal = Modal;
