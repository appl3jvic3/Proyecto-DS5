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
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Inicio de sesión exitoso (simulado). En una implementación real, esto conectaría con el backend en C#.");
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            alert("Registro exitoso (simulado). En una implementación real, esto conectaría con el backend en C#.");
        });
    }
});