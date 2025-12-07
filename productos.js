// productos.js - Complete

document.addEventListener("DOMContentLoaded", function () {
  const PRODUCTS = [
    {
      id: 1,
      name: "Charizard VMAX",
      price: 120.0,
      image: "img/productos/charizard.png",
    },
    {
      id: 2,
      name: "Gundam Astray Red Frame",
      price: 75.5,
      image: "img/productos/gundam-astray.jpg",
    },
    {
      id: 3,
      name: "Black Lotus Alpha",
      price: 511100.0,
      image: "img/productos/black-lotus.jpg",
    },
    {
      id: 4,
      name: "Blue-Eyes White Dragon",
      price: 85.99,
      image: "img/productos/blue-eyes.jpg",
    },
    {
      id: 5,
      name: "Mewtwo GX Shiny",
      price: 350.0,
      image: "img/productos/mewtwo.jpg",
    },
    {
      id: 6,
      name: "Hot Toys Iron Man Mark 85",
      price: 425.0,
      image: "img/productos/iron-man-hot-toys.jpg",
    },
    {
      id: 7,
      name: "Funko Pop Batman Exclusivo",
      price: 25.0,
      image: "img/productos/funko-batman.jpg",
    },
    {
      id: 8,
      name: "Gear 5 Luffy Figure",
      price: 89.0,
      image: "img/productos/one-piece-luffy.jpg",
    },
    {
      id: 9,
      name: "Spider-Man Premium Statue",
      price: 599.0,
      image: "img/productos/spiderman-statue.jpg",
    },
    {
      id: 10,
      name: "Marvel Legends X-Men Set",
      price: 149.0,
      image: "img/productos/marvel-legends.jpg",
    },
    {
      id: 11,
      name: "Gamecube Console Platinum",
      price: 267.0,
      image: "img/productos/gamecube.jpg",
    },
    {
      id: 12,
      name: "Nintendo 64",
      price: 129.95,
      image: "img/productos/nintendo64.jpg",
    },
  ];

  // La variable se llama "corrige" como pediste; también exponemos ALL_PRODUCTS por compatibilidad.
  try {
    window.corrige =
      Array.isArray(window.corrige) && window.corrige.length
        ? window.corrige
        : [...PRODUCTS];
    window.ALL_PRODUCTS =
      Array.isArray(window.ALL_PRODUCTS) && window.ALL_PRODUCTS.length
        ? window.ALL_PRODUCTS
        : [...PRODUCTS];
  } catch (e) {
    // Ignorar en entornos donde window no esté disponible
  }

  const productsGrid = document.getElementById("products-grid");
  const cartCountElement = document.getElementById("cart-count");

  // Función para agregar producto al carrito
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productoId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Mostrar feedback
    showAddToCartFeedback(product.name);
  }

  // Función para mostrar feedback visual
  function showAddToCartFeedback(productName) {
    // Crear elemento de feedback
    const feedback = document.createElement("div");
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 107, 53, 0.9);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: bold;
      z-index: 10000;
      animation: fadeInOut 2s ease-in-out;
    `;
    feedback.textContent = `${productName} agregado al carrito`;
    document.body.appendChild(feedback);

    // Agregar animación CSS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);

    // Remover después de la animación
    setTimeout(() => {
      document.body.removeChild(feedback);
      document.head.removeChild(style);
    }, 2000);
  }

  // Función para actualizar contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartCountElement) cartCountElement.textContent = totalItems;
  }

  // Cambios hechos por Luis: Cargar productos desde API con información de stock
  async function renderProducts() {
    // Validar que productsGrid exista para evitar errores en páginas como Home.html
    if (!productsGrid) return;

    try {
      // Obtener productos desde la API
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.GET_ALL)
      );

      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }

      const productosAPI = await response.json();

      // Cambios hechos por Luis: Debug para ver estructura del API
      console.log("Productos del API:", productosAPI);
      if (productosAPI.length > 0) {
        console.log("Primer producto:", productosAPI[0]);
      }

      // Cambios hechos por Luis: Generar HTML con información de stock
      // Solo mostrar productos que existan en el array local PRODUCTS
      productsGrid.innerHTML = productosAPI
        .filter((producto) => {
          const id = producto.productoId || producto.id || producto.ProductoId;
          return PRODUCTS.find((p) => p.id === id); // Solo incluir si existe localmente
        })
        .map((producto) => {
          // Mapear propiedades con múltiples posibles nombres
          const id = producto.productoId || producto.id || producto.ProductoId;
          const stock =
            producto.cantidadDisponible ||
            producto.stock ||
            producto.CantidadDisponible ||
            0;

          // Cambios hechos por Luis: Usar datos del array local PRODUCTS
          const productoLocal = PRODUCTS.find((p) => p.id === id);
          const nombre = productoLocal.name;
          const precio = productoLocal.price;
          const imagen = productoLocal.image;

          const isOutOfStock = stock === 0;
          const isLowStock = stock > 0 && stock <= 5;

          // Cambios hechos por Luis: Determinar badge de stock
          let stockBadge = "";
          if (isOutOfStock) {
            stockBadge =
              '<span class="stock-badge out-of-stock">AGOTADO</span>';
          } else if (isLowStock) {
            stockBadge =
              '<span class="stock-badge low-stock">ÚLTIMAS UNIDADES</span>';
          }

          return `
            <div class="product-card ${isOutOfStock ? "disabled" : ""}">
              ${stockBadge}
              <img src="${imagen}" 
                   alt="${nombre}" 
                   class="product-img">
              <h3>${nombre}</h3>
              <p class="product-price">$${Number(precio).toFixed(2)}</p>
              <p class="product-stock">Stock: ${stock} unidades</p>
              <button class="btn-primary" 
                      data-id="${id}" 
                      ${isOutOfStock ? "disabled" : ""}>
                ${isOutOfStock ? "Agotado" : "Agregar al Carrito"}
              </button>
            </div>
          `;
        })
        .join("");

      // Agregar event listeners a los botones
      productsGrid
        .querySelectorAll(".btn-primary:not([disabled])")
        .forEach((button) => {
          button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-id"));
            const producto = productosAPI.find((p) => {
              const id = p.productoId || p.id || p.ProductoId;
              return id === productId;
            });

            if (producto) {
              const stock =
                producto.cantidadDisponible ||
                producto.stock ||
                producto.CantidadDisponible ||
                0;
              if (stock > 0) {
                // Mapear propiedades con nombres alternativos
                const id =
                  producto.productoId || producto.id || producto.ProductoId;
                const nombre =
                  producto.nombreProducto ||
                  producto.name ||
                  producto.NombreProducto;
                const precio =
                  producto.precio || producto.price || producto.Precio;

                // Cambios hechos por Luis: Usar imagen del array local PRODUCTS
                const productoLocal = PRODUCTS.find((p) => p.id === id);
                const imagen =
                  productoLocal?.image || "img/productos/default.png";

                // Convertir al formato esperado por addToCart
                const product = {
                  id: id,
                  productoId: id,
                  name: nombre,
                  price: precio,
                  image: imagen,
                };
                addToCart(product);
              }
            }
          });
        });
    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Fallback a productos locales si falla la API
      productsGrid.innerHTML = PRODUCTS.map(
        (product) => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-img">
          <h3>${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="btn-primary" data-id="${
            product.id
          }">Agregar al Carrito</button>
        </div>
      `
      ).join("");

      productsGrid.querySelectorAll(".btn-primary").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          const product = PRODUCTS.find((p) => p.id === productId);
          if (product) addToCart(product);
        });
      });
    }
  }

  // Cambios hechos por Luis: Renderizar lista filtrada con información de stock
  async function renderFilteredProducts(list) {
    if (!list || list.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-results" style="text-align:center;color:#a8b5c7;padding:1rem;">
          <p>No se encontraron productos para tu búsqueda.</p>
        </div>
      `;
      return;
    }

    try {
      // Obtener datos actualizados del API
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.PRODUCTOS.GET_ALL)
      );
      const productosAPI = await response.json();

      productsGrid.innerHTML = list
        .map((product) => {
          // Cambios hechos por Luis: Buscar info de stock del API con mapeo flexible
          const productoAPI = productosAPI.find((p) => {
            const apiId = p.productoId || p.id || p.ProductoId;
            return apiId === product.id;
          });
          const stock =
            productoAPI?.cantidadDisponible ||
            productoAPI?.stock ||
            productoAPI?.CantidadDisponible ||
            0;
          const isOutOfStock = stock === 0;
          const isLowStock = stock > 0 && stock <= 5;

          let stockBadge = "";
          if (isOutOfStock) {
            stockBadge =
              '<span class="stock-badge out-of-stock">AGOTADO</span>';
          } else if (isLowStock) {
            stockBadge =
              '<span class="stock-badge low-stock">ÚLTIMAS UNIDADES</span>';
          }

          return `
            <div class="product-card ${isOutOfStock ? "disabled" : ""}">
              ${stockBadge}
              <img src="${product.image}" alt="${
            product.name
          }" class="product-img">
              <h3>${product.name}</h3>
              <p class="product-price">$${product.price.toFixed(2)}</p>
              <p class="product-stock">Stock: ${stock} unidades</p>
              <button class="btn-primary" 
                      data-id="${product.id}" 
                      ${isOutOfStock ? "disabled" : ""}>
                ${isOutOfStock ? "Agotado" : "Agregar al Carrito"}
              </button>
            </div>
          `;
        })
        .join("");

      productsGrid
        .querySelectorAll(".btn-primary:not([disabled])")
        .forEach((button) => {
          button.addEventListener("click", function () {
            const productId = parseInt(this.getAttribute("data-id"));
            const product = list.find((p) => p.id === productId);
            if (product) {
              addToCart(product);
            }
          });
        });
    } catch (error) {
      console.error("Error al cargar stock:", error);
      // Fallback sin información de stock
      productsGrid.innerHTML = list
        .map(
          (product) => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-img">
          <h3>${product.name}</h3>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <button class="btn-primary" data-id="${
            product.id
          }">Agregar al Carrito</button>
        </div>
      `
        )
        .join("");

      productsGrid.querySelectorAll(".btn-primary").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.getAttribute("data-id"));
          const product = list.find((p) => p.id === productId);
          if (product) addToCart(product);
        });
      });
    }
  }

  // Búsqueda en cliente usando PRODUCTS, sin tocar la API
  function buscarProductos(term) {
    const t = (term || "").trim().toLowerCase();
    if (!t) {
      renderProducts(); // back to full list
      return;
    }
    const filtrados = PRODUCTS.filter((p) =>
      (p.name || "").toLowerCase().includes(t)
    );
    renderFilteredProducts(filtrados);
  }

  // NUEVO: Conectar el input y el botón de búsqueda si existen en la página
  const searchInput = document.getElementById("search-input");
  const btnSearch = document.getElementById("btn-search");

  if (btnSearch && searchInput) {
    btnSearch.addEventListener("click", () => {
      buscarProductos(searchInput.value);
    });
  }
  if (searchInput) {
    // Buscar mientras escribe (opcional)
    searchInput.addEventListener("input", (e) => {
      buscarProductos(e.target.value);
    });
    // Buscar con Enter
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarProductos(searchInput.value);
      }
    });
  }

  // Configurar botones del header
  function setupHeaderButtons() {
    // Botón de carrito en el header
    const cartButton = document.getElementById("btn-cart");
    if (cartButton) {
      cartButton.addEventListener("click", function () {
        window.location.href = "carrito.html";
      });
    }

    // Botón de login
    const loginButton = document.getElementById("btn-login");
    const userProfileImg = document.getElementById("user-profile-img");

    if (loginButton) {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = JSON.parse(localStorage.getItem("currentUser"));

      if (isLoggedIn && user) {
        const userNameSpan = loginButton.querySelector("#user-name");
        if (userNameSpan) {
          userNameSpan.textContent =
            user.nombreUsuario || user.name || "Usuario";
        }

        // Mostrar foto de perfil si existe
        const savedPhoto = localStorage.getItem("userProfilePhoto");
        if (savedPhoto && userProfileImg) {
          userProfileImg.src = savedPhoto;
          userProfileImg.style.padding = "0";
          userProfileImg.style.border = "2px solid #ff6b35";
        }

        loginButton.onclick = () => {
          window.location.href = "perfil.html";
        };
      } else {
        loginButton.onclick = () => {
          window.location.href = "auth.html";
        };
      }
    }
  }

  // Inicializar
  function init() {
    renderProducts();
    updateCartCount();
    setupHeaderButtons();
  }

  init();
});
