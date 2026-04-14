// Simulación de usuarios con localStorage
const USERS_KEY = 'booknest_users';
const CURRENT_USER_KEY = 'currentUser';

export function getUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(email, password, nombre) {
    const users = getUsers();
    if (users.find(u => u.email === email)) throw new Error('Usuario ya existe');
    const newUser = { email, password, nombre, premium: false, compras: [] };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Credenciales inválidas');
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, password: undefined }));
    return user;
}

export function getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
    return !!getCurrentUser();
}

export function isPremiumUser(user) {
    return user?.premium === true;
}

export function makeUserPremium(email) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        users[idx].premium = true;
        saveUsers(users);
        const current = getCurrentUser();
        if (current?.email === email) {
            current.premium = true;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
        }
    }
}

// Componentes de login/register
export async function renderLogin() {
    return `
        <style>
            .auth-form {
                max-width: 400px;
                margin: 3rem auto;
                background: white;
                padding: 2rem;
                border-radius: 2rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
            .auth-form input {
                width: 100%;
                padding: 0.8rem;
                margin: 0.5rem 0;
                border: 1px solid #cbd5e1;
                border-radius: 12px;
            }
            .auth-form button {
                width: 100%;
                margin-top: 1rem;
            }
        </style>
        <div class="auth-form">
            <h2>Iniciar sesión</h2>
            <input type="email" id="login-email" placeholder="Email">
            <input type="password" id="login-password" placeholder="Contraseña">
            <button id="do-login" class="btn-primary">Entrar</button>
            <p style="margin-top:1rem;">¿Nuevo? <a href="/register" data-link>Regístrate</a></p>
        </div>
        <script>
            document.getElementById('do-login')?.addEventListener('click', () => {
                const email = document.getElementById('login-email').value;
                const pwd = document.getElementById('login-password').value;
                try {
                    loginUser(email, pwd);
                    window.navigateTo('/');
                } catch(e) { alert(e.message); }
            });
        </script>
    `;
}

export async function renderRegister() {
    return `
        <div class="auth-form">
            <h2>Crear cuenta</h2>
            <input type="text" id="reg-nombre" placeholder="Nombre">
            <input type="email" id="reg-email" placeholder="Email">
            <input type="password" id="reg-password" placeholder="Contraseña">
            <button id="do-register" class="btn-primary">Registrarse</button>
            <p><a href="/login" data-link>Ya tengo cuenta</a></p>
        </div>
        <script>
            document.getElementById('do-register')?.addEventListener('click', () => {
                const nombre = document.getElementById('reg-nombre').value;
                const email = document.getElementById('reg-email').value;
                const pwd = document.getElementById('reg-password').value;
                try {
                    registerUser(email, pwd, nombre);
                    alert('Registro exitoso, ahora inicia sesión');
                    window.navigateTo('/login');
                } catch(e) { alert(e.message); }
            });
        </script>
    `;
}
