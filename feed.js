// feed.js - Contiene HTML, CSS y lógica de carruseles animados
export async function renderFeed(libros) {
    // Agrupar por género para carruseles
    const generos = [...new Set(libros.map(l => l.genero))];
    
    // Libros recientes (simulamos orden por fecha, usamos los primeros 6)
    const recientes = libros.slice(0, 6);
    
    return `
        <style>
            .feed-container {
                max-width: 1400px;
                margin: 0 auto;
            }
            .hero {
                background: linear-gradient(120deg, #1e293b, #0f172a);
                color: white;
                padding: 3rem 2rem;
                border-radius: 2rem;
                margin-bottom: 2.5rem;
                text-align: center;
            }
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            .section-title {
                font-size: 1.8rem;
                margin: 2rem 0 1rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .carrusel {
                display: flex;
                gap: 1.5rem;
                overflow-x: auto;
                scroll-behavior: smooth;
                padding: 1rem 0.5rem 2rem;
                scrollbar-width: thin;
            }
            .carrusel::-webkit-scrollbar {
                height: 6px;
            }
            .book-card {
                flex: 0 0 200px;
                background: white;
                border-radius: 1.5rem;
                overflow: hidden;
                box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
            }
            .book-card:hover {
                transform: translateY(-6px);
                box-shadow: 0 20px 30px rgba(0,0,0,0.1);
            }
            .book-cover {
                width: 100%;
                height: 260px;
                object-fit: cover;
                background: #e2e8f0;
            }
            .book-info {
                padding: 1rem;
            }
            .book-title {
                font-weight: 700;
                margin-bottom: 0.25rem;
            }
            .book-author {
                font-size: 0.8rem;
                color: #64748b;
            }
            .price-tag {
                margin-top: 0.5rem;
                font-weight: 600;
                color: #3b82f6;
            }
            .carrusel-controls {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }
            .ctrl-btn {
                background: white;
                border: 1px solid #cbd5e1;
                border-radius: 2rem;
                padding: 0.3rem 0.8rem;
                cursor: pointer;
                font-weight: bold;
            }
            @media (max-width: 640px) {
                .book-card { flex: 0 0 160px; }
                .book-cover { height: 210px; }
            }
        </style>
        <div class="feed-container">
            <div class="hero">
                <h1>📚 Descubre tu próxima gran lectura</h1>
                <p>Miles de libros, clásicos y novedades, gratis y premium.</p>
            </div>
            
            <div class="section-title">
                🔥 Recién llegados
            </div>
            <div class="carrusel" id="carrusel-recientes">
                ${recientes.map(libro => renderCard(libro)).join('')}
            </div>
            
            ${generos.map(genero => `
                <div class="section-title">
                    📖 ${genero}
                </div>
                <div class="carrusel" data-genero="${genero}">
                    ${libros.filter(l => l.genero === genero).map(libro => renderCard(libro)).join('')}
                </div>
            `).join('')}
        </div>
    `;
    
    function renderCard(libro) {
        return `
            <a href="/libro/${libro.id}" data-link class="book-card">
                <img class="book-cover" src="${libro.portada || 'https://picsum.photos/id/104/200/260'}" alt="${libro.titulo}">
                <div class="book-info">
                    <div class="book-title">${libro.titulo}</div>
                    <div class="book-author">${libro.autor}</div>
                    <div class="price-tag">${libro.precio === 0 ? 'Gratis' : `$${libro.precio}`}</div>
                </div>
            </a>
        `;
    }
}

// Al montar, se pueden agregar botones de scroll a los carruseles, pero con CSS overflow ya funciona.
