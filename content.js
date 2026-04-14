// Aquí se importan dinámicamente los archivos de libros desde /data/libros/
// Para el ejemplo, definimos una lista manual y también demostramos carga dinámica

let librosCache = null;

// Función para cargar todos los libros registrados
export async function getLibros() {
    if (librosCache) return librosCache;
    
    // Lista de módulos de libros (podrías generar automáticamente)
    const librosModules = [
        './data/libros/el-misterio.js',
        './data/libros/aventura-galactica.js',
        './data/libros/poesias-del-alma.js',
        './data/libros/no-os-dejare'
    ];
    
    const libros = [];
    for (const modulePath of librosModules) {
        try {
            const module = await import(modulePath);
            if (module.default) {
                libros.push(module.default);
            }
        } catch (e) {
            console.warn(`Error cargando ${modulePath}`, e);
        }
    }
    librosCache = libros;
    return libros;
}

// Obtener un libro por ID
export async function loadLibroData(id) {
    const libros = await getLibros();
    return libros.find(l => l.id === id);
}
