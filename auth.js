// auth.js - Versión simplificada y corregida

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
        
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        
        try {
            const response = await fetch(getApiUrl(API_CONFIG. ENDPOINTS.AUTH.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage. setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(data. user));
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
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Registro exitoso (simulado). En una implementación real, esto conectaría con el backend en C#.");
        });
    }
});