// historial.js - Conexión a la API y manejo de historial real
(function () {
  "use strict";

  const container = document.getElementById("order-history-container");
  const pageSize = 10;

  function getToken() {
    return localStorage.getItem("token");
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  }

  async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const resp = await fetch(getApiUrl(url), {
        ...options,
        headers
      });
      if (!resp.ok) {
        // intentar leer mensaje de error del body
        let errMsg = `Error ${resp.status}`;
        try {
          const errJson = await resp.json();
          if (errJson?.message) errMsg = errJson.message;
        } catch {}
        throw new Error(errMsg);
      }
      return await resp.json();
    } catch (err) {
      // rethrow para manejo arriba
      throw err;
    }
  }

  function renderEmptyNotLogged() {
    container.innerHTML = `
      <div class="empty-history">
        <h3>🔒 Debes iniciar sesión</h3>
        <p>Inicia sesión para ver tu historial de compras</p>
        <a href="auth.html" class="btn-primary">Iniciar Sesión</a>
      </div>
    `;
  }

  function renderEmptyNoOrders() {
    container.innerHTML = `
      <div class="empty-history">
        <h3>📦 No tienes compras aún</h3>
        <p>¡Explora nuestro catálogo y encuentra tus productos favoritos!</p>
        <a href="Home.html" class="btn-primary">Ver Productos</a>
      </div>
    `;
  }

  function renderError(message) {
    container.innerHTML = `
      <div class="empty-history">
        <h3>⚠️ Error</h3>
        <p>${message}</p>
      </div>
    `;
  }

  function createOrderCard(order) {
    // order: { numeroCompra, usuarioId, fechaCompra, totalAmount, itemsCount }
    const orderDate = new Date(order.fechaCompra).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
      <div class="order-card" data-order-id="${order.numeroCompra}">
        <div class="order-header">
          <div>
            <div class="order-id">Orden #${order.numeroCompra}</div>
            <div class="order-date">${orderDate}</div>
          </div>
          <div class="order-status status-entregado">Entregado</div>
        </div>

        <div class="order-summary">
          <div class="summary-item">
            <div class="summary-label">Items</div>
            <div class="summary-value">${order.itemsCount}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total</div>
            <div class="summary-value total">$${order.totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div class="order-actions">
          <button class="btn-primary btn-view-items" data-order-id="${order.numeroCompra}">
            Ver detalles
          </button>
        </div>

        <div class="order-items" id="items-${order.numeroCompra}" style="display:none;"></div>
      </div>
    `;
  }

  async function fetchOrdersForUser(usuarioId, page = 1) {
    // Llama al endpoint /api/Historial/user/{usuarioId}?page=... usando Config.js helper
    const url = API_CONFIG.ENDPOINTS.HISTORIAL.GET_BY_USER(usuarioId, page, pageSize);
    const data = await apiFetch(url, { method: "GET" });
    // data expected: array of OrderDto
    return data;
  }

  async function fetchOrderItems(orderId) {
    const url = API_CONFIG.ENDPOINTS.HISTORIAL.GET_ORDER(orderId);
    const data = await apiFetch(url, { method: "GET" });
    // data expected: array of OrderItemDto
    return data;
  }

  function renderOrderItems(orderId, items) {
    const itemsContainer = document.getElementById(`items-${orderId}`);
    if (!itemsContainer) return;
    if (!items || items.length === 0) {
      itemsContainer.innerHTML = `<p style="color:#a8b5c7">No hay items en este pedido.</p>`;
      itemsContainer.style.display = "block";
      return;
    }

    itemsContainer.innerHTML = items
      .map(
        (item) => `
      <div class="order-item">
        <img src="${item.productName ? `img/productos/${item.productName.toLowerCase().replace(/\\s+/g,'-')}.png` : 'img/productos/default.png'}" alt="${item.productName}" class="order-item-img">
        <div class="order-item-details">
          <h4>${item.productName}</h4>
          <p class="order-item-quantity">Cantidad: ${item.quantity}</p>
        </div>
        <div class="order-item-price">$${(item.unitPrice * item.quantity).toFixed(2)}</div>
      </div>
    `
      )
      .join("");
    itemsContainer.style.display = "block";
  }

  async function displayOrderHistory() {
    const container = document.getElementById("order-history-container");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!isLoggedIn || !currentUser) {
        container.innerHTML = `
            <div class="empty-history">
                <h3> Debes iniciar sesión</h3>
                <p>Inicia sesión para ver tu historial de compras</p>
                <a href="auth.html" class="btn-primary" style="display: inline-block;">Iniciar Sesión</a>
            </div>
        `;
        return;
    }

    try {
        // Obtener historial desde la API
        const usuarioId = currentUser.usuarioId;
        const url = getApiUrl(API_CONFIG. ENDPOINTS.HISTORIAL.GET_BY_USER(usuarioId));
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al obtener historial');
        }
        
        const orderHistory = await response.json();
        
        if (orderHistory. length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <h3>📦 No tienes compras aún</h3>
                    <p>¡Explora nuestro catálogo y encuentra tus productos favoritos!</p>
                    <a href="Home.html" class="btn-primary" style="display: inline-block;">Ver Productos</a>
                </div>
            `;
            return;
        }

        // Renderizar historial de órdenes
        container.innerHTML = orderHistory.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Orden #${order.numeroCompra}</div>
                        <div class="order-date">${new Date(order.fechaCompra).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</div>
                    </div>
                    <div class="order-status status-entregado">Entregado</div>
                </div>
                
                <div class="order-summary">
                    <div class="summary-item">
                        <div class="summary-label">Total de Items</div>
                        <div class="summary-value">${order.itemsCount}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total</div>
                        <div class="summary-value total">$${order.totalAmount.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `).join("");
        
    } catch (error) {
        console.error('Error al cargar historial:', error);
        container. innerHTML = `
            <div class="empty-history">
                <h3> Error al cargar historial</h3>
                <p>No se pudo conectar con el servidor. Intenta nuevamente. </p>
            </div>
        `;
    }
}

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  function updateUserName() {
    const user = getCurrentUser();
    const userNameElement = document.getElementById("user-name");
    if (user && userNameElement) {
      userNameElement.textContent = (user.name || user.nombreUsuario || "").split(" ")[0];
    }
  }

  function init() {
    // preferir API; si falla, historial local
    displayOrderHistoryFromApi();
    updateCartCount();
    updateUserName();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();