const pagesRegistry = new Map();

export function registerPage(routePath, renderFunction) {
    pagesRegistry.set(routePath, renderFunction);
}

export function getPageComponent(routePath) {
    return pagesRegistry.get(routePath) || null;
}
