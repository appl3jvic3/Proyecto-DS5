// Configuración de la API
const API_CONFIG = {
    BASE_URL: 'https://localhost:7293/api',  // PUERTO DE LA API
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/Auth/login',
            REGISTER: '/Auth/register'
        },
        PRODUCTOS: {
            GET_ALL: '/Productos'
        },
        CARRITO: {
            GET: '/Carrito',
            ADD: '/Carrito/agregar',
            CHECKOUT: '/Carrito/checkout'
        },
        HISTORIAL: {
            GET_ALL: '/Historial'
        }
    }
};

// Helper para construir URLs
const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;