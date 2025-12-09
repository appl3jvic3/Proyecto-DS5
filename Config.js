// config.js - Configuracion centralizada de endpoints del API

const API_CONFIG = {
    BASE_URL: 'https://localhost:7293/api',
    ENDPOINTS: {
        // Endpoints de autenticacion
        AUTH: {
            LOGIN: '/Auth/login',
            REGISTER: '/Auth/register',

            // Endpoint para obtener informacion de un usuario especifico
            // Usado en perfil.js cuando faltan datos del usuario en localStorage
            // Uso: API_CONFIG.ENDPOINTS.AUTH. GET_USER(1) retorna "/Auth/user/1"
            GET_USER: (userId) => `/Auth/user/${userId}`
        },
        
        // Endpoints de productos
        PRODUCTOS: {
            GET_ALL: '/Productos',
            
            // Agregado por Luis: Obtener producto individual por ID
            // Usado en historial. js para obtener detalles del producto
            GET_BY_ID: (productId) => `/Productos/${productId}`
        },
        
        // Endpoints de carrito
        CARRITO: {
            GET: '/Carrito',
            ADD: '/Carrito',
            CHECKOUT: '/Carrito/checkout',
            
            // Obtener historial de compras por usuario
            // Usado en historial.js para mostrar las ordenes del usuario
            GET_BY_USER: (userId) => `/Carrito/user/${userId}`
        },
        
        // Endpoints de historial (si los necesitas en el futuro)
        HISTORIAL: {
            GET_BY_USER: (userId, page = 1, pageSize = 10, from = '', to = '') =>
                `/Historial/user/${userId}?page=${page}&pageSize=${pageSize}${from ? `&from=${encodeURIComponent(from)}` : ''}${to ? `&to=${encodeURIComponent(to)}` : ''}`,
            GET_ORDER: (orderId) => `/Historial/${orderId}`
        }
    }
};

// Funcion helper para construir URLs completas
// Concatena la BASE_URL con el endpoint especificado
// Ejemplo: getApiUrl('/Auth/login') retorna 'https://localhost:7293/api/Auth/login'
function getApiUrl(endpoint) {
    return `${API_CONFIG. BASE_URL}${endpoint}`;
}