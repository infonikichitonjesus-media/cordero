import { getLibros } from './content.js';

export async function renderNovedades() {
    const libros = await getLibros();
    // Simular novedades: últimos 4 agregados
    const novedades = libros.slice(0, 4);
    return `
        <style>
            .news-section {
                max-width: 1000px;
                margin: 0 auto;
            }
            .news-card {
                background: white;
                border-radius: 1.5rem;
                padding: 1.5rem;
                margin-bottom: 1.5rem;
                display: flex;
                gap: 1rem;
                align-items: center;
            }
        </style>
        <div class="news-section">
            <h1>📰 Novedades literarias</h1>
            <p>Enterate de los últimos títulos y noticias.</p>
            ${novedades.map(l => `
                <div class="news-card">
                    <img src="${l.portada}" width="80" style="border-radius:12px;">
                    <div><strong>${l.titulo}</strong> - ${l.autor}<br>${l.descripcion.substring(0,100)}... <a href="/libro/${l.id}" data-link>Leer más</a></div>
                </div>
            `).join('')}
        </div>
    `;
}
