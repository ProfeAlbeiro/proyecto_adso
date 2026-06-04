// src/config/api.js
const API_CONFIG = {
  // Cambiar a la URL de tu API Node.js
  BASE_URL: 'http://192.168.230.1:3000/api',  // ← O usa 'http://localhost:3000/api'
  TIMEOUT: 10000,
  ENDPOINTS: {
    // Endpoints de autenticación
    LOGIN: '/users/login',      // POST
    REGISTER: '/users/create',   // POST
    
    // Endpoints de usuarios (requieren token)
    USERS: '/users',             // GET (todos) y POST (crear)
    USER_BY_ID: '/users/:id',    // GET, PUT
    USER_DELETE: '/users/delete/:id'  // DELETE
  }
}

export default API_CONFIG