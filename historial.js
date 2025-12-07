// historial.js - Versión corregida y simplificada

(function () {
  "use strict";

  async function displayOrderHistory() {
    const container = document.getElementById("order-history-container");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Verificar autenticación
    if (!isLoggedIn || !currentUser) {
        container.innerHTML = `
            <div class="empty-history">
                <h3>Debes iniciar sesión</h3>
                <p>Inicia sesión para ver tu historial de compras</p>
                <a href="auth.html" class="btn-primary" style="display: inline-block;">Iniciar Sesión</a>
            </div>
        `;
        return;
    }

    try {
        // Obtener ID del usuario (soportar ambos formatos)
        const usuarioId = currentUser.usuarioId || currentUser.id;
        
        if (! usuarioId) {
            throw new Error('No se pudo obtener el ID del usuario');
        }

        console.log('Obteniendo historial para usuario:', usuarioId);
        
        // Construir URL usando Config.js
        const url = getApiUrl(API_CONFIG. ENDPOINTS.HISTORIAL.GET_BY_USER(usuarioId));
        
        console.log('URL de historial:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de API:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const orderHistory = await response.json();
        
        console.log('Historial recibido:', orderHistory);
        
        // Verificar si hay órdenes
        if (! orderHistory || orderHistory.length === 0) {
            container. innerHTML = `
                <div class="empty-history">
                    <h3> No tienes compras aún</h3>
                    <p>¡Explora nuestro catálogo y encuentra tus productos favoritos!</p>
                    <a href="Home.html" class="btn-primary" style="display: inline-block;">Ver Productos</a>
                </div>
            `;
            return;
        }

    function createOrderCard(order, index) {
    const card = document. createElement("div");
    card. className = "order-card";

    const numeroCompra = order. numeroCompra || order.id || "N/A";
    const fechaCompra = order.fechaCompra || new Date().toISOString();
    const cantidad = order.cantidad || 0;
    const precioTotal = order.precioTotal || 0;

    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-id">Orden #${numeroCompra}</div>
                <div class="order-date">${new Date(fechaCompra).toLocaleDateString("es-ES", {
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
                <div class="summary-value total">$${Number(precioTotal).toFixed(2)}</div>
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
    // Cambio hecho por Luis: Evita errores de querySelectorAll con selectores invalidos
    const button = card. querySelector(`#btn-order-${index}`);
    button.addEventListener("click", () => toggleOrderDetails(order));

    return card;
  }

        // Agregar event listeners para botones "Ver Detalles"
        document.querySelectorAll('. btn-view-details').forEach(button => {
            button.addEventListener('click', async function() {
                const orderId = this.getAttribute('data-order-id');
                await toggleOrderDetails(orderId);
            });
        });
        
    } catch (error) {
        console.error('Error al cargar historial:', error);
        container.innerHTML = `
            <div class="empty-history">
                <h3> Error al cargar historial</h3>
                <p>${error.message || 'No se pudo conectar con el servidor'}</p>
                <p><small>Verifica que la API esté corriendo en https://localhost:7293</small></p>
                <button class="btn-primary" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
}

  async function toggleOrderDetails(orderId) {
    const itemsContainer = document.getElementById(`items-${orderId}`);
    
    if (! itemsContainer) return;

    // Si ya está visible, ocultarlo
    if (itemsContainer. style.display === 'block') {
        itemsContainer.style.display = 'none';
        return;
    }

    // Si está vacío, cargar los items
    if (itemsContainer.innerHTML. trim() === '' || itemsContainer.innerHTML.includes('Cargando')) {
        itemsContainer.innerHTML = '<p style="text-align:center; color:#a8b5c7;">Cargando detalles...</p>';
        itemsContainer.style.display = 'block';

        try {
            const url = getApiUrl(API_CONFIG.ENDPOINTS.HISTORIAL. GET_ORDER(orderId));
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Error al obtener detalles');
            }
            
            const items = await response.json();
            
            if (! items || items.length === 0) {
                itemsContainer. innerHTML = '<p style="text-align:center; color:#a8b5c7;">No hay items en esta orden</p>';
                return;
            }

            // Renderizar items
            itemsContainer. innerHTML = `
                <div class="order-items">
                    ${items.map(item => `
                        <div class="order-item">
                            <img src="img/productos/${item.nombreProducto. toLowerCase(). replace(/\s+/g, '-')}.png" 
                                 alt="${item.nombreProducto}" 
                                 class="order-item-img"
                                 onerror="this.src='img/productos/default. png'">
                            <div class="order-item-details">
                                <h4>${item.nombreProducto}</h4>
                                <p class="order-item-quantity">Cantidad: ${item.cantidad}</p>
                                <p class="order-item-price">Precio unitario: $${item.precioUnitario.toFixed(2)}</p>
                            </div>
                            <div class="order-item-total">
                                $${(item.precioUnitario * item.cantidad).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
        } catch (error) {
            console.error('Error al cargar items:', error);
            itemsContainer.innerHTML = '<p style="text-align:center; color:#ff6b35;">Error al cargar detalles</p>';
        }
    } else {
        // Simplemente mostrar
        itemsContainer.style.display = 'block';
    }
}

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item. quantity, 0);
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  function updateUserName() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const userNameElement = document.getElementById("user-name");
    if (user && userNameElement) {
      const name = user.name || user.nombreUsuario || "Usuario";
      userNameElement.textContent = name. split(" ")[0];
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