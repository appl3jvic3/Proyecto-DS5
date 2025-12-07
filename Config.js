// Configuración de la API
// Cambios hechos por Luis:
// - Agregado GET_BY_ID en PRODUCTOS (línea 13) para obtener detalles de un producto específico
// - Agregado GET_BY_USER en CARRITO (línea 18) para obtener las compras de un usuario

const API_CONFIG = {
    BASE_URL: 'https://localhost:7293/api',  // PUERTO DE LA API
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/Auth/login',
            REGISTER: '/Auth/register'
        },
        PRODUCTOS: {
            GET_ALL: '/Productos',
            GET_BY_ID: (productId) => `/Productos/${productId}`  // ✅ Agregado por Luis
        },
        CARRITO: {
            GET: '/Carrito',
            ADD: '/Carrito',
            CHECKOUT: '/Carrito/checkout',
            GET_BY_USER: (userId) => `/Carrito/user/${userId}`  // ✅ Agregado por Luis
        },
        HISTORIAL: {
            // Get orders by user (page & filters opcionales)
            GET_BY_USER: (userId, page = 1, pageSize = 10, from = '', to = '') =>
                `/Historial/user/${userId}?page=${page}&pageSize=${pageSize}${from ? `&from=${encodeURIComponent(from)}` : ''}${to ? `&to=${encodeURIComponent(to)}` : ''}`,
            // Get items for a specific order
            GET_ORDER: (orderId) => `/Historial/${orderId}`
        }
    }
};

// Helper para construir URLs
const getApiUrl = (endpoint) => `${API_CONFIG. BASE_URL}${endpoint}`;