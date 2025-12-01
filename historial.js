// historial.js CORREGIDO

(function () {
  "use strict";

  function displayOrderHistory() {
    const container = document.getElementById("order-history-container");
    // CORREGIDO: usar purchaseHistory en lugar de orderHistory
    const orderHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      container.innerHTML = `
        <div class="empty-history">
          <h3>🔒 Debes iniciar sesión</h3>
          <p>Inicia sesión para ver tu historial de compras</p>
          <a href="auth.html" class="btn-primary" style="display: inline-block;">Iniciar Sesión</a>
        </div>
      `;
      return;
    }

    if (orderHistory.length === 0) {
      container.innerHTML = `
        <div class="empty-history">
          <h3>📦 No tienes compras aún</h3>
          <p>¡Explora nuestro catálogo y encuentra tus productos favoritos!</p>
          <a href="Home.html" class="btn-primary" style="display: inline-block;">Ver Productos</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orderHistory
      .map(
        (order) => `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">Orden #${order.id}</div>
            <div class="order-date">${new Date(order.date).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</div>
          </div>
          <div class="order-status status-entregado">Entregado</div>
        </div>

        <div class="order-items">
          ${order.items
            .map(
              (item) => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" class="order-item-img">
              <div class="order-item-details">
                <h4>${item.name}</h4>
                <p class="order-item-quantity">Cantidad: ${item.quantity}</p>
              </div>
              <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="order-summary">
          <div class="summary-item">
            <div class="summary-label">Subtotal</div>
            <div class="summary-value">$${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Envío</div>
            <div class="summary-value">$5.00</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Impuestos</div>
            <div class="summary-value">$${(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.07).toFixed(2)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total</div>
            <div class="summary-value total">$${order.total.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  function updateUserName() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userNameElement = document.getElementById("user-name");
    if (user && userNameElement) {
      userNameElement.textContent = user.name.split(" ")[0];
    }
  }

  function init() {
    displayOrderHistory();
    updateCartCount();
    updateUserName();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();