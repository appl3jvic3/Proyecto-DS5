// historial.js - Versión corregida y simplificada

(function () {
  "use strict";

  let allOrders = []; // Guardar todas las ordenes globalmente

  async function displayOrderHistory() {
    const container = document.getElementById("order-history-container");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Verificar autenticacion
    if (!isLoggedIn || !currentUser) {
      container.innerHTML = `
            <div class="empty-history">
                <h3>Debes iniciar sesion</h3>
                <p>Inicia sesion para ver tu historial de compras</p>
                <a href="auth.html" class="btn-primary" style="display: inline-block;">Iniciar Sesion</a>
            </div>
        `;
      return;
    }

    try {
      const usuarioId = currentUser.usuarioId || currentUser.id;

      if (!usuarioId) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      console.log("Obteniendo historial para usuario:", usuarioId);

      const url = getApiUrl(
        API_CONFIG.ENDPOINTS.CARRITO.GET_BY_USER(usuarioId)
      );
      console.log("URL de historial:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error de API:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      allOrders = await response.json();

      console.log("Historial recibido:", allOrders);

      if (!allOrders || allOrders.length === 0) {
        container.innerHTML = `
                <div class="empty-history">
                    <h3>No tienes compras aun</h3>
                    <p>Explora nuestro catalogo y encuentra tus productos favoritos!</p>
                    <a href="productos.html" class="btn-primary" style="display: inline-block;">Ver Productos</a>
                </div>
            `;
        return;
      }

      // Renderizar historial
      container.innerHTML = "";

      allOrders.forEach((order, index) => {
        const orderCard = createOrderCard(order, index);
        container.appendChild(orderCard);
      });
    } catch (error) {
      console.error("Error al cargar historial:", error);
      container.innerHTML = `
            <div class="empty-history">
                <h3>Error al cargar historial</h3>
                <p>${error.message || "No se pudo conectar con el servidor"}</p>
                <p><small>Verifica que la API este corriendo en https://localhost:7293</small></p>
                <button class="btn-primary" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
  }

  function createOrderCard(order, index) {
    const card = document.createElement("div");
    card.className = "order-card";

    const numeroCompra = order.numeroCompra || order.id || "N/A";
    const fechaCompra =
      order.fechaCompra || order.date || new Date().toISOString();
    const cantidad = order.itemsCount || order.cantidad || 0;
    const precioTotal = order.total || order.precioTotal || 0;

    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Orden #${numeroCompra}</div>
                <div class="order-date">${new Date(
                  fechaCompra
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</div>
            </div>
            <div class="order-status status-entregado">Completado</div>
        </div>
        
        <div class="order-summary">
            <div class="summary-item">
                <div class="summary-label">Cantidad</div>
                <div class="summary-value">${cantidad}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total</div>
                <div class="summary-value total">$${Number(precioTotal).toFixed(
                  2
                )}</div>
            </div>
        </div>

        <div class="order-actions">
            <button class="btn-view-details" id="btn-order-${index}">
                Ver Detalles
            </button>
        </div>

        <div class="order-items-container" id="items-${numeroCompra}" style="display: none;">
            <!-- Los items se cargaran aqui -->
        </div>
    `;

    // Agregar event listener directamente al boton creado
    // Evita errores de querySelectorAll con selectores invalidos
    const button = card.querySelector(`#btn-order-${index}`);
    button.addEventListener("click", () => toggleOrderDetails(order));

    return card;
  }

  async function toggleOrderDetails(order) {
    const numeroCompra = order.numeroCompra || order.id;
    const itemsContainer = document.getElementById(`items-${numeroCompra}`);

    if (!itemsContainer) {
      console.error("No se encontro el contenedor:", `items-${numeroCompra}`);
      return;
    }

    // Si ya esta visible, ocultarlo
    if (itemsContainer.style.display === "block") {
      itemsContainer.style.display = "none";
      return;
    }

    itemsContainer.innerHTML =
      '<p style="text-align:center; color:#a8b5c7;">Cargando detalles...</p>';
    itemsContainer.style.display = "block";

    try {
      const productoId = order.productoId || order.productId;

      if (!productoId) {
        throw new Error("No se encontro el ID del producto");
      }

      const productUrl = getApiUrl(
        API_CONFIG.ENDPOINTS.PRODUCTOS.GET_BY_ID(productoId)
      );
      console.log("Obteniendo producto:", productUrl);

      const productResponse = await fetch(productUrl);

      if (!productResponse.ok) {
        throw new Error("Error al obtener producto");
      }

      const producto = await productResponse.json();
      console.log("Producto obtenido:", producto);

      const cantidad = order.cantidad || 1;
      const precioTotal = order.precioTotal || 0;
      const precioUnitario = precioTotal / cantidad;

      // Mapeo de IDs a imágenes
      const imageMap = {
        1: "img/productos/charizard.png",
        2: "img/productos/gundam-astray.jpg",
        3: "img/productos/black-lotus.jpg",
        4: "img/productos/blue-eyes.jpg",
        5: "img/productos/mewtwo.jpg",
        6: "img/productos/iron-man-hot-toys.jpg",
        7: "img/productos/funko-batman.jpg",
        8: "img/productos/luffy-gear5.jpg",
        9: "img/productos/mjolnir-replica.jpg",
        10: "img/productos/master-chief-helmet.jpg",
      };

      const nombreProducto =
        producto.nombreProducto || producto.name || "default";
      const imagenUrl = imageMap[productoId] || "img/productos/default.png";

      console.log(
        "Buscando imagen para producto ID",
        productoId,
        ":",
        imagenUrl
      );

      itemsContainer.innerHTML = `
                <div class="order-items">
                    <div class="order-item">
                        <img src="${imagenUrl}" 
                             alt="${nombreProducto}" 
                             class="order-item-img"
                             onerror="this.src='img/productos/default.png'; console.error('No se encontro imagen:', '${imagenUrl}')">
                        <div class="order-item-details">
                            <h4>${nombreProducto}</h4>
                            <p class="order-item-quantity">Cantidad: ${cantidad}</p>
                            <p class="order-item-price">Precio unitario: $${precioUnitario.toFixed(
                              2
                            )}</p>
                        </div>
                        <div class="order-item-total">
                            $${Number(precioTotal).toFixed(2)}
                        </div>
                    </div>
                </div>
            `;
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      itemsContainer.innerHTML = `<p style="text-align:center; color:#ff6b35;">Error: ${error.message}</p>`;
    }
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

  function init() {
    displayOrderHistory();
    updateCartCount();
    updateUserDisplay();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
