// productos.js - Con carrito integrado completo

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

  // NUEVO: Exponer lista completa sin cambiar tu lógica
  // La variable se llama "corrige" como pediste; también exponemos ALL_PRODUCTS por compatibilidad.
  try {
    window.corrige = Array.isArray(window.corrige) && window.corrige.length ? window.corrige : [...PRODUCTS];
    window.ALL_PRODUCTS = Array.isArray(window.ALL_PRODUCTS) && window.ALL_PRODUCTS.length ? window.ALL_PRODUCTS : [...PRODUCTS];
  } catch (e) {
    // Ignorar en entornos donde window no esté disponible
  }

  const productsGrid = document.getElementById("products-grid");
  const miniCart = document.getElementById("mini-cart");
  const miniCartItems = document.getElementById("mini-cart-items");
  const miniCartCount = document.getElementById("mini-cart-count");
  const miniCartTotal = document.getElementById("mini-cart-total");
  const cartCountElement = document.getElementById("cart-count");

  // Crear botón flotante del carrito
  createCartToggle();

  // Función para crear el botón flotante del carrito
  function createCartToggle() {
    const cartToggle = document.createElement('button');
    cartToggle.className = 'cart-toggle';
    cartToggle.innerHTML = '🛒<span class="cart-badge" id="cart-badge">0</span>';
    cartToggle.onclick = toggleMiniCart;
    document.body.appendChild(cartToggle);
  }

  // Función para mostrar/ocultar el mini carrito
  function toggleMiniCart() {
    miniCart.classList.toggle('show');
    updateMiniCart();
  }

  // Función para agregar producto al carrito
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    updateMiniCart();
    
    // Mostrar feedback
    showAddToCartFeedback(product.name);
    
    // Mostrar automáticamente el mini carrito
    miniCart.classList.add('show');
  }

  // Función para mostrar feedback visual
  function showAddToCartFeedback(productName) {
    // Crear elemento de feedback
    const feedback = document.createElement('div');
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
    feedback.textContent = `✅ ${productName} agregado al carrito`;
    document.body.appendChild(feedback);

    // Agregar animación CSS
    const style = document.createElement('style');
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

  // Función para actualizar el mini carrito
  function updateMiniCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    miniCartCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    
    // Actualizar items
    miniCartItems.innerHTML = '';
    
    if (cart.length === 0) {
      miniCartItems.innerHTML = '<p style="color: #a8b5c7; text-align: center; padding: 1rem;">Tu carrito está vacío</p>';
      miniCartTotal.textContent = '$0.00';
      return;
    }
    
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'mini-cart-item';
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="mini-cart-item-details">
          <p class="mini-cart-item-name">${item.name}</p>
          <p class="mini-cart-item-quantity">Cantidad: ${item.quantity}</p>
        </div>
        <div class="mini-cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      `;
      miniCartItems.appendChild(itemElement);
    });
    
    // Actualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    miniCartTotal.textContent = `$${total.toFixed(2)}`;
  }

  // Función para actualizar contador del carrito
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) cartCountElement.textContent = totalItems;
    
    // Actualizar badge del botón flotante
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  // Renderizar productos (original, no se toca)
  function renderProducts() {
    productsGrid.innerHTML = PRODUCTS.map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3>${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn-primary" data-id="${product.id}">Agregar al Carrito</button>
      </div>
    `
    ).join("");

    // Agregar event listeners a los botones
    productsGrid.querySelectorAll('.btn-primary').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
          addToCart(product);
        }
      });
    });
  }

  // Renderizar lista filtrada sin modificar renderProducts()
  function renderFilteredProducts(list) {
    if (!list || list.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-results" style="text-align:center;color:#a8b5c7;padding:1rem;">
          <p>No se encontraron productos para tu búsqueda.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = list.map(
      (product) => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3>${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="btn-primary" data-id="${product.id}">Agregar al Carrito</button>
      </div>
    `
    ).join("");

    productsGrid.querySelectorAll('.btn-primary').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.getAttribute('data-id'));
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
          addToCart(product);
        }
      });
    });
  }

  // Búsqueda en cliente usando PRODUCTS, sin tocar la API
  function buscarProductos(term) {
    const t = (term || "").trim().toLowerCase();
    if (!t) {
      renderProducts(); // back to full list
      return;
    }
    const filtrados = PRODUCTS.filter(p =>
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
    const cartButton = document.getElementById('btn-cart');
    if (cartButton) {
      cartButton.addEventListener('click', function() {
        window.location.href = 'carrito.html';
      });
    }

    // Botón de checkout en mini carrito
    const checkoutButton = document.getElementById('btn-checkout-mini');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
          alert('Tu carrito está vacío');
          return;
        }
        window.location.href = 'carrito.html';
      });
    }

    // Botón de login
    const loginButton = document.getElementById('btn-login');
    if (loginButton) {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const user = JSON.parse(localStorage.getItem("currentUser"));
      
      if (isLoggedIn && user) {
        const userNameSpan = loginButton.querySelector("#user-name");
        if (userNameSpan) {
          userNameSpan.textContent = user.name.split(" ")[0];
        }
        loginButton.onclick = () => {
          if (confirm("¿Deseas cerrar sesión?")) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            window.location.reload();
          }
        };
      } else {
        loginButton.onclick = () => {
          window.location.href = 'auth.html';
        };
      }
    }
  }

  // Inicializar
  function init() {
    renderProducts();
    updateCartCount();
    updateMiniCart();
    setupHeaderButtons();
  }

  // Cerrar mini carrito al hacer clic fuera de él
  document.addEventListener('click', function(event) {
    if (!miniCart.contains(event.target) && 
        !event.target.closest('.cart-toggle') && 
        miniCart.classList.contains('show')) {
      miniCart.classList.remove('show');
    }
  });

  init();
});