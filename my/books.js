import { getFavorites } from '../memoria.js';
import { getLibros } from '../content.js';
import { getCurrentUser, isPremiumUser } from '../users.js';

export async function renderMyBooks() {
    const favIds = getFavorites();
    const libros = await getLibros();
    const favLibros = libros.filter(l => favIds.includes(l.id));
    const user = getCurrentUser();
    const premium = isPremiumUser(user);
    
    // libros a los que tiene acceso: gratis + premium + comprados
    const accesibles = libros.filter(l => l.precio === 0 || (user && (premium || user.compras?.includes(l.id))));
    
    return `
        <style>
            .mybooks-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 1.5rem;
                margin-top: 1.5rem;
            }
            .book-card {
                background: white;
                border-radius: 1rem;
                overflow: hidden;
                padding: 0.8rem;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
        </style>
        <div>
            <h2>❤️ Mis libros favoritos</h2>
            ${favLibros.length === 0 ? '<p>Aún no tienes favoritos. Explora y guarda tus libros.</p>' : `
                <div class="mybooks-grid">
                    ${favLibros.map(l => `<div class="book-card"><img src="${l.portada}" width="100%"><h4>${l.titulo}</h4><a href="/libro/${l.id}" data-link>Ver</a></div>`).join('')}
                </div>
            `}
            <h2 style="margin-top: 2rem;">📚 Biblioteca accesible</h2>
            <div class="mybooks-grid">
                ${accesibles.map(l => `<div class="book-card"><img src="${l.portada}" width="100%"><h4>${l.titulo}</h4><a href="/libro/${l.id}" data-link>Leer</a></div>`).join('')}
            </div>
        </div>
    `;
}
