

document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showLogin = document.getElementById("show-login");
    const showRegister = document.getElementById("show-register");
    
    // Mostrar formulario de login
    if (showLogin) {
        showLogin.addEventListener("click", function () {
            loginForm.style.display = "flex";
            registerForm.style.display = "none";
            showLogin.classList.add("active");
            showRegister.classList.remove("active");
        });
    }
    
    // Mostrar formulario de registro
    if (showRegister) {
        showRegister.addEventListener("click", function () {
            loginForm.style.display = "none";
            registerForm.style.display = "flex";
            showRegister.classList.add("active");
            showLogin.classList.remove("active");
        });
    }
    
    // Manejar envío de formularios
    if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e. preventDefault();
        
        const correo = document.getElementById("login-email").value;
        const contrasena = document.getElementById("login-password").value;
        
        try {
            const response = await fetch(getApiUrl(API_CONFIG. ENDPOINTS.AUTH.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, contrasena })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage. setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                usuarioId: data.user.usuarioId,
                nombreUsuario: data.user.nombreUsuario,
                correo: data.user.correo
        }));
                window.location. href = 'Home.html';
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor.  Verifica que la API esté corriendo en https://localhost:7293');
        }
    });
}
    
    if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const nombreUsuario = document.getElementById("register-name").value;
        const correo = document.getElementById("register-email"). value;
        const contrasena = document.getElementById("register-password").value;
        
        try {
            const response = await fetch(getApiUrl(API_CONFIG. ENDPOINTS.AUTH.REGISTER), {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify({ nombreUsuario, correo, contrasena })
            });
            
            if (response.ok) {
                const data = await response.json();
                alert('Registro exitoso.  Ahora puedes iniciar sesión.');
                showLogin. click(); // Cambiar a formulario de login
            } else {
                const error = await response.json();
                alert(error.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });
    }
});