//sobre-nosotros.js limpio: muestra los miembros del equipo de desarrollo
document.addEventListener("DOMContentLoaded", function () {
  const MEMBERS = [
    {
      id: 1,
      name: "Luis de Leon",
      image: "img/Miembros/Perfil_luisDeLeon.jpg",
      idNumber: "3-750-2425",
      career: "Desarrollo y Gestión de Software",
      description:
        "Creación de un juego en Java, diseños de front simples por medio de la clase de Desarrollo de Software V",
    },
    {
      id: 2,
      name: "Jeremy Rodríguez",
      image: "img/Miembros/Perfil_jeremyR.jpg",
      idNumber: "8-992-2180",
      career: "Desarrollo y Gestión de Software",
      description:
        "Conocimientos generales de Java, C#, y aprendiendo la creación de frontend por medio de las clases de Desarrollo de Software V",
    },
    {
      id: 3,
      name: "Daniel Comrie",
      image: "img/Miembros/Perfil_danielC.jpg",
      idNumber: "8-984-1565",
      career: "Desarrollo y Gestión de Software",
      description:
        "Desarrollador junior con conocimientos generales de Java, C#, html, css, y javascript",
    },
    {
      id: 4,
      name: "Carlos Concepción",
      image: "img/Miembros/Perfil_carlosC.jpg",
      idNumber: "8-1036-2347",
      career: "Desarrollo y Gestión de Software",
      description:
        "Conocimientos generales de Java, C#, y adquiriendo experiencia con diseños de frontend",
    },
    {
      id: 5,
      name: "Joseph Guerra",
      image: "img/Miembros/Perfil_josephG.jpg",
      idNumber: "8-1008-2260",
      career: "Desarrollo y Gestión de Software",
      description:
        "Conocimientos generales de la programación orientada a objetos en Java, C#, y en proceso con la parte de frontend",
    },
  ];
  const membersGrid = document.getElementById("miembros-grid");
  if (!membersGrid) return;
  membersGrid.innerHTML = MEMBERS.map(
    (member) => `
    <div class="member-card">
      <img src="${member.image}" alt="${member.name}" class="member-img">
      <h3>${member.name}</h3>
      <p>${member.idNumber}</p>
      <p>${member.career}</p>
      <p>${member.description}</p>
    </div>
  `
  ).join("");

  // Actualizar visualización del usuario y carrito
  updateUserDisplay();
  updateCartCount();
});

function updateUserDisplay() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const loginBtn = document.getElementById("btn-login");
  const userProfileImg = document.getElementById("user-profile-img");

  if (isLoggedIn && user && loginBtn) {
    const userNameSpan = loginBtn.querySelector("span") || loginBtn;
    userNameSpan.textContent = user.nombreUsuario || user.name || "Usuario";

    const savedPhoto = localStorage.getItem("userProfilePhoto");
    if (savedPhoto && userProfileImg) {
      userProfileImg.src = savedPhoto;
      userProfileImg.style.width = "28px";
      userProfileImg.style.height = "28px";
      userProfileImg.style.borderRadius = "50%";
      userProfileImg.style.objectFit = "cover";
      userProfileImg.style.padding = "0";
      userProfileImg.style.border = "2px solid #ff6b35";
      userProfileImg.style.filter = "none";
    }

    loginBtn.onclick = () => (window.location.href = "perfil.html");
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) cartCountElement.textContent = totalItems;
}
