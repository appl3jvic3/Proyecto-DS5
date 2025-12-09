// carrito.js - Funcionalidad del carrito de compras

document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCountElement = document.getElementById("cart-count");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("btn-checkout");

  // Cargar carrito desde localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Funcion para renderizar los productos en el carrito
  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-cart">Tu carrito esta vacio<br><small>Agrega algunos productos increibles</small></p>';
      updateCartSummary();
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${
        item.name
      }" onerror="this.src='img/productos/default-product.jpg'">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)} c/u</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-index="${index}" title="Eliminar producto">
                    <img src="img/iconos/eliminar.png" alt="Eliminar" style="width: 16px; height: 16px;">
                </button>
            `;
      cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
    updateCartCount();
  }

  // Funcion para actualizar el resumen del carrito
  function updateCartSummary() {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.07; // 7% de impuestos
    const shipping = subtotal > 0 ? 5.0 : 0; // Solo cobrar envio si hay productos
    const total = subtotal + tax + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Funcion para actualizar el contador del carrito
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }

    // Actualizar tambien en localStorage para que otras paginas puedan acceder
    localStorage.setItem("cartCount", totalItems);
  }

  // Funcion para eliminar un producto del carrito
  function removeFromCart(index) {
    if (
      confirm(
        "¿Estas seguro de que quieres eliminar este producto del carrito?"
      )
    ) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
    }
  }

  // Funcion para cambiar la cantidad de un producto
  function updateQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
    }
  }

  // Event listeners para los botones de cantidad y eliminar
  cartItemsContainer.addEventListener("click", function (e) {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.classList.contains("remove-btn")) {
      const index = parseInt(target.dataset.index);
      removeFromCart(index);
    } else if (target.classList.contains("minus")) {
      const index = parseInt(target.dataset.index);
      updateQuantity(index, -1);
    } else if (target.classList.contains("plus")) {
      const index = parseInt(target.dataset.index);
      updateQuantity(index, 1);
    }
  });

  // Event listener para el boton de pago
  // Cambiado para usar endpoint /Carrito/checkout con validacion de stock
  checkoutButton.addEventListener("click", async function () {
    if (cart.length === 0) {
      alert(
        "Tu carrito esta vacio.  Agrega productos antes de proceder al pago."
      );
      return;
    }

    // Verificar si el usuario esta logueado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Validacion mejorada
    if (!isLoggedIn || !currentUser) {
      if (
        confirm(
          "Para proceder al pago necesitas iniciar sesion. ¿Quieres ir a la pagina de login?"
        )
      ) {
        window.location.href = "auth.html";
      }
      return;
    }

    // Validar que el usuario tenga usuarioId
    if (!currentUser.usuarioId && !currentUser.id) {
      alert(
        "Error: No se pudo obtener tu ID de usuario. Por favor, cierra sesion e inicia sesion nuevamente."
      );
      console.error("currentUser sin ID:", currentUser);
      return;
    }

    try {
      // Deshabilitar boton para evitar doble clic
      checkoutButton.disabled = true;
      checkoutButton.textContent = "Procesando... ";

      // Este endpoint valida el stock disponible y lo reduce automaticamente
      for (const item of cart) {
        console.log("Procesando item:", item);

        // Obtener IDs con validacion
        const usuarioId = currentUser.usuarioId || currentUser.id;
        const productoId = item.productoId || item.id;

        // Validar que tengamos los IDs
        if (!usuarioId) {
          throw new Error("No se pudo obtener el ID del usuario");
        }
        if (!productoId) {
          throw new Error(
            `No se pudo obtener el ID del producto: ${item.name}`
          );
        }

        const carritoData = {
          usuarioId: usuarioId,
          productoId: productoId,
          cantidad: item.quantity,
          precioTotal: item.price * item.quantity,
        };

        console.log("Enviando a API checkout:", carritoData);

        // Usar endpoint de checkout en lugar de add
        const response = await fetch(
          getApiUrl(API_CONFIG.ENDPOINTS.CARRITO.CHECKOUT),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(carritoData),
          }
        );

        // Detecta especificamente el error de stock insuficiente (400)
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: await response.text() };
          }

          console.error("Error respuesta API:", errorData);

          // Si es error 400, probablemente es stock insuficiente
          if (response.status === 400) {
            throw new Error(
              `${item.name}: ${errorData.mensaje || errorData.message}\n\n` +
                `Stock disponible: ${
                  errorData.stockDisponible || "Desconocido"
                } unidades`
            );
          }

          throw new Error(
            `Error al procesar ${item.name}: ${
              errorData.mensaje || errorData.message || response.statusText
            }`
          );
        }

        // Mostrar informacion del stock restante
        const result = await response.json();
        console.log("Compra exitosa:", result);
        console.log(
          `Stock restante de ${item.name}: ${result.stockRestante} unidades`
        );
      }

      // Guardar tambien en localStorage para respaldo
      const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const tax = subtotal * 0.07;
      const shipping = 5.0;
      const total = subtotal + tax + shipping;

      const purchase = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: "Procesando",
      };

      let purchaseHistory =
        JSON.parse(localStorage.getItem("purchaseHistory")) || [];
      purchaseHistory.push(purchase);
      localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

      // Vaciar el carrito
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));

      // Incluye informacion sobre actualizacion de inventario
      alert(
        "Compra realizada con exito!\n\n" +
          "La compra se ha guardado en la base de datos.\n" +
          "El inventario se ha actualizado automaticamente."
      );
      window.location.href = "historial.html";
    } catch (error) {
      console.error("Error al procesar la compra:", error);

      // Muestra el mensaje de error completo y recarga la pagina si es necesario
      alert(
        `Hubo un error al procesar tu compra:\n\n${error.message}\n\n` +
          `La pagina se recargara para actualizar las cantidades disponibles.`
      );

      // Recargar la pagina para que el usuario vea los productos actualizados
      location.reload();
    } finally {
      // Rehabilitar el boton en caso de error
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Proceder al Pago";
    }
  });

  // Inicializar el carrito
  renderCartItems();

  // Actualizar contador en otras paginas
  updateCartCount();

  // Funcionalidad del botón de login y perfil
  const loginButton = document.getElementById("btn-login");
  const userNameSpan = document.getElementById("user-name");
  const userProfileImg = document.getElementById("user-profile-img");

  function updateLoginButton() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userPhoto = localStorage.getItem("userProfilePhoto");

    if (isLoggedIn && currentUser) {
      userNameSpan.textContent =
        currentUser.nombreUsuario ||
        currentUser.name ||
        currentUser.email ||
        "Usuario";

      // Si hay foto de perfil, se muestra
      if (userPhoto) {
        userProfileImg.src = userPhoto;
        userProfileImg.style.width = "28px";
        userProfileImg.style.height = "28px";
        userProfileImg.style.borderRadius = "50%";
        userProfileImg.style.objectFit = "cover";
        userProfileImg.style.padding = "0";
        userProfileImg.style.border = "2px solid #ff6b35";
        userProfileImg.style.filter = "none";
      }

      loginButton.onclick = () => {
        window.location.href = "perfil.html";
      };
    } else {
      userNameSpan.textContent = "Login";
      userProfileImg.src = "img/iconos/usuario.png";
      loginButton.onclick = () => {
        window.location.href = "auth.html";
      };
    }
  }

  updateLoginButton();
});
