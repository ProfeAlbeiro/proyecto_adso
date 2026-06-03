// src/models/AuthModel.js
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'  // Lo usaremos para decodificar, no para generar
import API_CONFIG from '../config/api'

class AuthModel {
  // Iniciar sesión con API real
  static async login(credentials) {
    try {
      console.log('🔐 Enviando login a API real:', credentials.email)
      
      // 1. Llamar al endpoint real de login
      // POST a http://localhost:3000/api/users/login
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,  // '/users/login'
        {
          email: credentials.email,
          password: credentials.password
        },
        false  // No necesita token porque es login
      )
      
      console.log('📦 Respuesta del login:', response)
      
      // 2. La API real devuelve:
      // {
      //   success: true,
      //   message: "Usuario autenticado",
      //   data: {
      //     id: 1,
      //     email: "admin@test.com",
      //     name: "Admin",
      //     lastname: "Sistema",
      //     role: "admin",
      //     session_token: "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      //   }
      // }
      
      // 3. Extraer el token de la respuesta (viene como "JWT {token}")
      const sessionToken = response.session_token  // "JWT eyJhbGc..."
      
      // 4. Limpiar el token (quitar "JWT " del inicio)
      let token = sessionToken
      if (sessionToken && sessionToken.startsWith('JWT ')) {
        token = sessionToken.substring(4)  // Quita "JWT "
      }
      
      console.log('✅ Token extraído:', token ? 'Token recibido' : 'No hay token')
      
      // 5. Guardar token en localStorage
      storageService.setToken(token)
      
      // 6. Guardar datos del usuario (sin el token)
      const userData = {
        id: response.id,
        email: response.email,
        name: response.name,
        lastname: response.lastname,
        role: response.role,
        phone: response.phone,
        image: response.image
      }
      storageService.setUser(userData)
      
      return {
        success: true,
        token: token,
        user: userData
      }
      
    } catch (error) {
      console.error('❌ Error en login API real:', error)
      return {
        success: false,
        error: error.message || 'Error de conexión con el servidor'
      }
    }
  }

  // Registrar nuevo usuario
  static async register(userData) {
    try {
      console.log('📝 Registrando usuario en API real:', userData.email)
      
      // La API espera: name, lastname, email, password, phone?, image?
      const userToCreate = {
        name: userData.name,
        lastname: userData.lastname || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        image: userData.image || '',
        role: userData.role || 'user'  // Por defecto 'user'
      }
      
      // POST a http://localhost:3000/api/users/create
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,  // '/users/create'
        userToCreate,
        false  // No necesita token
      )
      
      console.log('✅ Usuario creado:', response)
      
      return {
        success: true,
        user: response,
        message: 'Usuario registrado exitosamente'
      }
      
    } catch (error) {
      console.error('❌ Error en registro API real:', error)
      return {
        success: false,
        error: error.message || 'Error al registrar usuario'
      }
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      storageService.clearSession()
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    }
  }

  // Verificar si está autenticado (usando jwtService real)
  static isAuthenticated() {
    const token = storageService.getToken()
    if (!token) return false
    
    // Usamos jwtService para verificar expiración
    const isValid = jwtService.verifyToken(token)
    
    if (!isValid) {
      storageService.clearSession()
      return false
    }
    
    return true
  }

  // Obtener usuario actual
  static getCurrentUser() {
    return storageService.getUser()
  }

  // Obtener token actual
  static getCurrentToken() {
    return storageService.getToken()
  }
}

export default AuthModel