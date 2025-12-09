// Home.js - La Esquina Geek (CORREGIDO)

(function () {
  "use strict";

  // Productos de ejemplo
  const products = [
    {
      id: 1,
      name: "Charizard VMAX",
      price: 120.99,
      image: "img/productos/charizard.png",
    },
    {
      id: 2,
      name: "Gundam Astray",
      price: 75.5,
      image: "img/productos/gundam-astray.jpg",
    },
    {
      id: 3,
      name: "Blue-Eyes Dragon",
      price: 85.99,
      image: "img/productos/blue-eyes.jpg",
    },
    {
      id: 4,
      name: "Iron Man Hot Toys",
      price: 425.0,
      image: "img/productos/iron-man-hot-toys.jpg",
    },
  ];

  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Feedback visual
    alert(`${product.name} agregado al carrito`);
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  function updateUserDisplay() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const loginBtn = document.getElementById("btn-login");
    const userProfileImg = document.getElementById("user-profile-img");

    if (isLoggedIn && user && loginBtn) {
      const userNameSpan = loginBtn.querySelector("span") || loginBtn;
      // Mostrar el nombre de usuario
      userNameSpan.textContent = user.nombreUsuario || user.name || "Usuario";

      // Mostrar foto de perfil si existe
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

      // Al hacer clic, ir a la página de perfil
      loginBtn.onclick = () => (window.location.href = "perfil.html");
    }
  }

  function init() {
    updateCartCount();
    updateUserDisplay();

    // Agregar eventos a botones "Ver más"
    const productButtons = document.querySelectorAll(".btn-primary");
    productButtons.forEach((btn, index) => {
      btn.textContent = "Agregar al Carrito";
      btn.onclick = () => addToCart(index + 1);
    });

    // Botón de carrito
    const cartBtn = document.querySelector(".cart-btn");
    if (cartBtn) {
      cartBtn.onclick = () => (window.location.href = "carrito.html");
    }

    // Botón de login
    const loginBtn = document.getElementById("btn-login");
    if (loginBtn && localStorage.getItem("isLoggedIn") !== "true") {
      loginBtn.onclick = () => (window.location.href = "auth.html");
    }
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();

  // Usa la lista global expuesta por productos.js si existe; si no, usa los 4 del Home.
  const ALL = Array.isArray(window.ALL_PRODUCTS)
    ? window.ALL_PRODUCTS
    : products;

  const homeGrid = document.getElementById("home-products-grid");
  const searchInput = document.getElementById("search-input");
  const btnSearch = document.getElementById("btn-search");

  function renderHome(list) {
    if (!homeGrid) return;
    if (!list || list.length === 0) {
      homeGrid.innerHTML = `
        <div class="empty-results" style="text-align:center;color:#a8b5c7;padding:1rem;">
          <p>No se encontraron productos para tu búsqueda.</p>
        </div>
      `;
      return;
    }
    homeGrid.innerHTML = list
      .map(
        (p) => `
      <div class="product-card">
        <img src="${p.image}" alt="${
          p.name
        }" class="product-img" onerror="this.src='img/productos/default-product.jpg'">
        <h3>${p.name}</h3>
        <p class="product-price">$${Number(p.price).toFixed(2)}</p>
        <a class="btn-primary" href="productos.html#${p.id}">Ver producto</a>
      </div>
    `
      )
      .join("");
  }

  function buscarEnHome(term) {
    const t = (term || "").trim().toLowerCase();
    if (!t) {
      // Si el término está vacío, vuelve a mostrar el contenido inicial del Home (los 4 destacados ya presentes)
      renderHome(ALL.slice(0, Math.max(4, ALL.length ? 4 : 0)));
      return;
    }
    const filtrados = ALL.filter((p) =>
      (p.name || "").toLowerCase().includes(t)
    );
    renderHome(filtrados);
  }

  // Conecta la búsqueda del Home
  if (btnSearch && searchInput) {
    btnSearch.addEventListener("click", () => {
      const q = (searchInput.value || "").trim();
      // Si hay término, ir a productos con query; si está vacío, ir a productos (lista completa)
      if (q) {
        window.location.href = `productos.html?search=${encodeURIComponent(q)}`;
      } else {
        window.location.href = "productos.html";
      }
    });
  }

  // Render inicial para Home basado en ALL (mantiene solo algunos en Home)
  if (homeGrid) {
    renderHome(ALL.slice(0, 4));
  }
})();
