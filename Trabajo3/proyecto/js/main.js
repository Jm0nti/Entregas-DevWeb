document.addEventListener('DOMContentLoaded', () => {
    const navbarEl = document.getElementById('navbar');
    const catalogEl = document.getElementById('catalog');
    const paginationEl = document.getElementById('pagination');
    const statusEl = document.getElementById('status');
    const modalEl = document.getElementById('modal');

    // 1) Modal 
    Modal.init(modalEl);

    // 2) Navbar 
    Navbar.render(navbarEl);

    // 3) Vista principal
    HomeView.init({ catalogEl, paginationEl, statusEl });
});
