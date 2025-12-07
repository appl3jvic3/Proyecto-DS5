(function () {
  "use strict";

  // Verificar si el usuario está logueado
  function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para ver tu perfil");
      window.location.href = "auth.html";
      return false;
    }
    return true;
  }

  // Cargar información del usuario
  async function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log("Usuario cargado del localStorage:", user);

    if (!user || !user.usuarioId) {
      console.log("No hay usuario válido, redirigiendo...");
      window.location.href = "auth.html";
      return;
    }

    // Si solo tenemos el usuarioId, obtener los datos completos de la API
    if (!user.nombreUsuario || !user.correo) {
      console.log("Faltan datos del usuario, obteniendo de la API...");
      try {
        const response = await fetch(
          `https://localhost:7293/api/Auth/user/${user.usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          // Actualizar localStorage con datos completos
          const fullUser = {
            usuarioId: userData.usuarioId,
            nombreUsuario: userData.nombreUsuario,
            correo: userData.correo,
          };
          localStorage.setItem("currentUser", JSON.stringify(fullUser));
          displayUserInfo(fullUser);
        } else {
          console.error("Error obteniendo datos del usuario");
          displayUserInfo(user); // Mostrar lo que tenemos
        }
      } catch (error) {
        console.error("Error:", error);
        displayUserInfo(user); // Mostrar lo que tenemos
      }
    } else {
      displayUserInfo(user);
    }
  }

  function displayUserInfo(user) {
    const userName = document.getElementById("user-name-display");
    const userEmail = document.getElementById("user-email");
    const headerUserName = document.getElementById("user-name");
    const userProfileImg = document.getElementById("user-profile-img");

    if (userName) userName.textContent = user.nombreUsuario || "Usuario";
    if (userEmail) userEmail.textContent = user.correo || "No disponible";
    if (headerUserName)
      headerUserName.textContent = user.nombreUsuario || "Usuario";

    // Cargar foto de perfil guardada
    const savedPhoto = localStorage.getItem("userProfilePhoto");
    if (savedPhoto) {
      const profilePhoto = document.getElementById("profile-photo");
      if (profilePhoto) profilePhoto.src = savedPhoto;

      // Mostrar foto en el header también
      if (userProfileImg) {
        userProfileImg.src = savedPhoto;
        userProfileImg.style.padding = "0";
        userProfileImg.style.border = "2px solid #ff6b35";
      }
    }

    console.log("Datos mostrados:", {
      nombre: user.nombreUsuario,
      correo: user.correo,
    });
  }

  // Manejar cambio de foto de perfil
  function handlePhotoUpload() {
    const photoInput = document.getElementById("photo-upload");
    const profilePhoto = document.getElementById("profile-photo");

    if (photoInput) {
      photoInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          // Validar que sea una imagen
          if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona un archivo de imagen válido");
            return;
          }

          // Validar tamaño (máximo 2MB)
          if (file.size > 2 * 1024 * 1024) {
            alert("La imagen es muy grande. El tamaño máximo es 2MB");
            return;
          }

          // Leer y mostrar la imagen
          const reader = new FileReader();
          reader.onload = function (event) {
            const imageUrl = event.target.result;
            if (profilePhoto) {
              profilePhoto.src = imageUrl;
              profilePhoto.style.padding = "0"; // Remover padding cuando hay imagen personalizada
            }
            // Guardar en localStorage
            localStorage.setItem("userProfilePhoto", imageUrl);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Actualizar contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  // Cerrar sesión
  function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      localStorage.removeItem("userProfilePhoto");
      window.location.href = "auth.html";
    }
  }

  // Inicializar
  function init() {
    // Verificar autenticación
    if (!checkAuth()) return;

    // Cargar información del usuario
    loadUserInfo();

    // Actualizar contador del carrito
    updateCartCount();

    // Manejar cambio de foto
    handlePhotoUpload();

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  }

  // Ejecutar cuando el DOM esté listo
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
