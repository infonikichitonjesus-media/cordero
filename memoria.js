const FAV_KEY = 'booknest_favs';

export function getFavorites() {
    const stored = localStorage.getItem(FAV_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function addToFavorites(bookId) {
    const favs = getFavorites();
    if (!favs.includes(bookId)) {
        favs.push(bookId);
        localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    }
}

export function removeFromFavorites(bookId) {
    let favs = getFavorites();
    favs = favs.filter(id => id !== bookId);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export function isFavorite(bookId) {
    return getFavorites().includes(bookId);
}
