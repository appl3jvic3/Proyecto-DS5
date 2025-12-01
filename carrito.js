// carrito.js - Funcionalidad del carrito de compras CORREGIDA

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.getElementById('btn-checkout');
    
    // Cargar carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Función para renderizar los productos en el carrito
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">🛒 Tu carrito está vacío<br><small>Agrega algunos productos increíbles</small></p>';
            updateCartSummary();
            updateCartCount();
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='img/productos/default-product.jpg'">
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
    
    // Función para actualizar el resumen del carrito CORREGIDA
    function updateCartSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.07; // 7% de impuestos
        const shipping = subtotal > 0 ? 5.00 : 0; // Solo cobrar envío si hay productos
        const total = subtotal + tax + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Función para actualizar el contador del carrito
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        
        // Actualizar también en localStorage para que otras páginas puedan acceder
        localStorage.setItem('cartCount', totalItems);
    }
    
    // Función para eliminar un producto del carrito
    function removeFromCart(index) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    }
    
    // Función para cambiar la cantidad de un producto
    function updateQuantity(index, change) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    }
    
    // Event listeners para los botones de cantidad y eliminar
    cartItemsContainer.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        if (target.classList.contains('remove-btn')) {
            const index = parseInt(target.dataset.index);
            removeFromCart(index);
        } else if (target.classList.contains('minus')) {
            const index = parseInt(target.dataset.index);
            updateQuantity(index, -1);
        } else if (target.classList.contains('plus')) {
            const index = parseInt(target.dataset.index);
            updateQuantity(index, 1);
        }
    });
    
    // Event listener para el botón de pago
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
            return;
        }
        
        // Verificar si el usuario está logueado
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            if (confirm('Para proceder al pago necesitas iniciar sesión. ¿Quieres ir a la página de login?')) {
                window.location.href = 'auth.html';
            }
            return;
        }
        
        // Guardar el carrito actual como una compra en el historial
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.07;
        const shipping = 5.00;
        const total = subtotal + tax + shipping;
        
        const purchase = {
            id: Date.now(),
            date: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            items: [...cart],
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total,
            status: 'Procesando'
        };
        
        // Obtener historial existente o crear uno nuevo
        let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        purchaseHistory.push(purchase);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        
        // Vaciar el carrito
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Redirigir a la página de confirmación o historial
        alert('¡Compra realizada con éxito! Serás redirigido al historial de compras.');
        window.location.href = 'historial.html';
    });
    
    // Inicializar el carrito
    renderCartItems();
    
    // Actualizar contador en otras páginas
    updateCartCount();
});