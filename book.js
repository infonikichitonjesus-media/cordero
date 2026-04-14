import { getCurrentUser, isPremiumUser } from './users.js';

// Renderizar vista de detalles
export async function renderBookDetails(libro, { isFavorite, addFavorite, removeFavorite }) {
    const user = getCurrentUser();
    const tieneAcceso = (libro.precio === 0) || (user && (isPremiumUser(user) || user.compras?.includes(libro.id)));
    
    return `
        <style>
            .book-detail {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                border-radius: 2rem;
                padding: 2rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .detail-grid {
                display: flex;
                gap: 2rem;
                flex-wrap: wrap;
            }
            .detail-cover {
                flex: 0 0 240px;
            }
            .detail-cover img {
                width: 100%;
                border-radius: 1rem;
                box-shadow: 0 15px 25px rgba(0,0,0,0.1);
            }
            .detail-info {
                flex: 1;
            }
            .btn-group {
                display: flex;
                gap: 1rem;
                margin: 1.5rem 0;
                flex-wrap: wrap;
            }
            .btn-leer, .btn-descargar, .btn-fav {
                padding: 0.7rem 1.5rem;
                border-radius: 40px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s;
            }
            .btn-leer {
                background: #3b82f6;
                color: white;
            }
            .btn-descargar {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
            }
            .btn-fav {
                background: #fee2e2;
                color: #b91c1c;
            }
        </style>
        <div class="book-detail">
            <div class="detail-grid">
                <div class="detail-cover">
                    <img src="${libro.portada || 'https://picsum.photos/id/104/240/320'}" alt="${libro.titulo}">
                </div>
                <div class="detail-info">
                    <h1>${libro.titulo}</h1>
                    <p style="color:#475569;">${libro.autor}</p>
                    <p style="margin: 1rem 0;">${libro.descripcion}</p>
                    <p><strong>Género:</strong> ${libro.genero} | <strong>Páginas:</strong> ${libro.pageCount}</p>
                    <p><strong>Precio:</strong> ${libro.precio === 0 ? 'Gratis' : `$${libro.precio}`}</p>
                    
                    <div class="btn-group">
                        ${tieneAcceso ? `<a href="/libro/${libro.id}/leer/1" data-link class="btn-leer">📖 Leer ahora</a>` : `<button class="btn-leer" disabled style="opacity:0.5;">🔒 Requiere compra</button>`}
                        ${libro.pdf_url ? `<a href="${libro.pdf_url}" download class="btn-descargar">📥 Descargar PDF</a>` : ''}
                        <button id="fav-btn" class="btn-fav">${isFavorite ? '❤️ Favorito' : '🤍 Agregar a favoritos'}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderizar el lector de páginas (imágenes PNG)
export async function renderBookReader(libro, currentPage) {
    const total = libro.pageCount;
    const baseUrl = libro.pageBaseUrl || ''; // si no hay base, usaremos generador local
    const generateImageUrl = (pageNum) => {
        if (baseUrl) return `${baseUrl}${pageNum}.png`;
        // Simulación de páginas con canvas (para demo sin imágenes reales)
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23fdf8ed'/%3E%3Ctext x='50%25' y='40%25' font-size='32' text-anchor='middle' fill='%233b3b3b'%3EPágina ${pageNum}%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='20' text-anchor='middle' fill='%23666'%3E${libro.titulo}%3C/text%3E%3C/svg%3E`;
    };
    
    return `
        <style>
            .reader-container {
                max-width: 700px;
                margin: 0 auto;
                background: #fef9e6;
                border-radius: 20px;
                padding: 2rem;
                box-shadow: 0 20px 35px rgba(0,0,0,0.1);
                text-align: center;
            }
            .page-image {
                max-width: 100%;
                border-radius: 12px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                margin-bottom: 2rem;
                background: white;
            }
            .page-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .page-controls button {
                padding: 0.6rem 1.2rem;
                background: #3b82f6;
                border: none;
                border-radius: 40px;
                color: white;
                font-weight: bold;
                cursor: pointer;
            }
            .page-controls button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .page-indicator {
                font-weight: 600;
            }
            .slider {
                width: 200px;
            }
        </style>
        <div class="reader-container">
            <h3>${libro.titulo}</h3>
            <img class="page-image" src="${generateImageUrl(currentPage)}" alt="Página ${currentPage}">
            <div class="page-controls">
                <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>◀ Anterior</button>
                <div class="page-indicator">Página ${currentPage} de ${total}</div>
                <button id="next-page" ${currentPage === total ? 'disabled' : ''}>Siguiente ▶</button>
                <input type="range" min="1" max="${total}" value="${currentPage}" class="slider" id="page-slider">
            </div>
            <div style="margin-top: 2rem;">
                <a href="/libro/${libro.id}" data-link>← Volver al libro</a>
            </div>
        </div>
    `;
}

// El script para la navegación del lector se agrega después del renderizado (en main.js o aquí).
// Para simplificar, añadimos eventos en el mismo componente cuando se monta, pero main.js se encarga de llamar a un setup.
// main.js debería inyectar y luego ejecutar script, pero por ahora dejamos que los botones tengan data-link? no, son eventos directos.
// Añadiremos una función initReader si es necesario.
