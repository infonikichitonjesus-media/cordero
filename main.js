import { getLibros, loadLibroData } from './content.js';
import { renderFeed } from './feed.js';
import { renderBookDetails, renderBookReader } from './book.js';
import { renderNovedades } from './novedades.js';
import { renderMyBooks } from './my/books.js';
import { renderLogin, renderRegister, getCurrentUser, isLoggedIn } from './users.js';
import { addToFavorites, removeFromFavorites, isFavorite } from './memoria.js';
import { registerPage, getPageComponent } from './pages.js';

// Estado global
let currentRoute = '';
let rootContainer = null;

// Construir header y footer común
function buildHeader() {
    const user = getCurrentUser();
    const isAuth = isLoggedIn();
    return `
        <header class="global-header">
            <a href="/" class="logo" data-link>📚 BookNest</a>
            <div class="nav-links">
                <a href="/" data-link>Inicio</a>
                <a href="/novedades" data-link>Novedades</a>
                <a href="/my/books" data-link>Mis libros</a>
            </div>
            <div class="user-area">
                ${!isAuth ? `
                    <a href="/login" data-link class="btn-outline">Iniciar sesión</a>
                    <a href="/register" data-link class="btn-primary">Registrarse</a>
                ` : `
                    <span>👋 ${user?.nombre || user?.email || 'Usuario'}</span>
                    <button id="logout-btn" class="btn-outline">Cerrar sesión</button>
                `}
            </div>
        </header>
    `;
}

function renderFooter() {
    return `<footer>© 2025 BookNest — Leer es volar ✨</footer>`;
}

// Renderizar el layout principal y luego el contenido
async function renderLayout(contentHTML) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        ${buildHeader()}
        <main class="main-content" id="main-content">
            ${contentHTML}
        </main>
        ${renderFooter()}
    `;
    // Eventos de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.dispatchEvent(new PopStateEvent('popstate'));
            navigateTo('/');
        });
    }
    // Adjuntar eventos de navegación a los data-link
    document.querySelectorAll('[data-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) navigateTo(href);
        });
    });
}

// Función de navegación programática
export async function navigateTo(url) {
    window.history.pushState({}, '', url);
    await handleRoute(url);
}

// Manejar rutas
async function handleRoute(path) {
    const pathname = path.replace(window.location.origin, '').split('?')[0];
    currentRoute = pathname;
    const libros = await getLibros();

    // Rutas dinámicas
    // Detalles de libro: /libro/:id
    const libroMatch = pathname.match(/^\/libro\/([^\/]+)$/);
    if (libroMatch) {
        const id = libroMatch[1];
        const libro = libros.find(l => l.id === id);
        if (libro) {
            const html = await renderBookDetails(libro, { isFavorite: isFavorite(id), addFavorite: addToFavorites, removeFavorite: removeFromFavorites });
            await renderLayout(html);
            return;
        }
    }

    // Lector: /libro/:id/leer/:page
    const readerMatch = pathname.match(/^\/libro\/([^\/]+)\/leer\/(\d+)$/);
    if (readerMatch) {
        const id = readerMatch[1];
        const pageNum = parseInt(readerMatch[2]);
        const libro = libros.find(l => l.id === id);
        if (libro && pageNum >= 1 && pageNum <= libro.pageCount) {
            const html = await renderBookReader(libro, pageNum);
            await renderLayout(html);
            return;
        }
    }

    // Páginas registradas (novedades, my/books, etc)
    const pageComponent = getPageComponent(pathname);
    if (pageComponent) {
        const html = await pageComponent();
        await renderLayout(html);
        return;
    }

    // Ruta por defecto: feed
    if (pathname === '/' || pathname === '') {
        const feedHtml = await renderFeed(libros);
        await renderLayout(feedHtml);
        return;
    }

    // 404
    await renderLayout(`<div style="text-align:center; padding:4rem;"><h2>📖 Página no encontrada</h2><a href="/" data-link>Volver al inicio</a></div>`);
}

// Escuchar cambios de historial
window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
});

// Inicializar la app
(async function init() {
    // Registrar páginas especiales
    registerPage('/novedades', renderNovedades);
    registerPage('/my/books', renderMyBooks);
    registerPage('/login', renderLogin);
    registerPage('/register', renderRegister);
    
    await handleRoute(window.location.pathname);
})();

// Exponer helpers globales si se necesitan
window.navigateTo = navigateTo;
