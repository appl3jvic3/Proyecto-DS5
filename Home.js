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
    alert(`✅ ${product.name} agregado al carrito`);
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

    if (isLoggedIn && user && loginBtn) {
      const userNameSpan = loginBtn.querySelector("span") || loginBtn;
      userNameSpan.textContent = user.name.split(" ")[0];
      loginBtn.onclick = () => {
        if (confirm("¿Deseas cerrar sesión?")) {
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("currentUser");
          window.location.reload();
        }
      };
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
})();