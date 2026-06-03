// src/models/AuthModel.js
import httpService from '../services/httpService'
import storageService from '../services/storageService'
import jwtService from '../services/jwtService'
import API_CONFIG from '../config/api'

class AuthModel {
  // Iniciar sesión con API real
  static async login(credentials) {
    try {
      console.log('🔐 Enviando login a API real:', credentials.email)
      
      // 1. Llamar al endpoint real de login
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.LOGIN,  // '/users/login'
        {
          email: credentials.email,
          password: credentials.password
        },
        false  // No necesita token porque es login
      )
      
      console.log('📦 Respuesta completa del login:', response)
      
      // 2. Verificar si la respuesta es exitosa
      if (!response.success) {
        return {
          success: false,
          error: response.message || 'Error en el servidor'
        }
      }
      
      // 3. Los datos del usuario están en response.data
      const userDataFromApi = response.data
      
      if (!userDataFromApi) {
        console.error('❌ No se encontraron datos de usuario en la respuesta')
        return {
          success: false,
          error: 'Error en la respuesta del servidor'
        }
      }
      
      console.log('👤 Datos del usuario:', userDataFromApi)
      
      // 4. Extraer el token de session_token (viene como "JWT {token}")
      const sessionToken = userDataFromApi.session_token
      
      if (!sessionToken) {
        console.error('❌ No se encontró session_token en la respuesta')
        return {
          success: false,
          error: 'Error al obtener token de autenticación'
        }
      }
      
      // 5. Limpiar el token (quitar "JWT " del inicio)
      let token = sessionToken
      if (sessionToken && sessionToken.startsWith('JWT ')) {
        token = sessionToken.substring(4)  // Quita "JWT "
      }
      
      console.log('✅ Token extraído:', token ? 'Token recibido' : 'No hay token')
      
      // 6. Guardar token en localStorage
      storageService.setToken(token)
      
      // 7. Guardar datos del usuario
      const userData = {
        id: userDataFromApi.id,
        email: userDataFromApi.email,
        name: userDataFromApi.name || userDataFromApi.email.split('@')[0],
        lastname: userDataFromApi.lastname || '',
        role: userDataFromApi.role || 'user',
        phone: userDataFromApi.phone || '',
        image: userDataFromApi.image || ''
      }
      
      storageService.setUser(userData)
      
      // 8. Guardar el rol por separado para acceso rápido
      if (userData.role) {
        storageService.setUserRole(userData.role)
      }
      
      console.log('✅ Usuario guardado en storage:', userData)
      
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
        role: userData.role || 'user'
      }
      
      console.log('📤 Enviando datos de registro:', userToCreate)
      
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,  // '/users/create'
        userToCreate,
        false  // No necesita token
      )
      
      console.log('✅ Respuesta del registro:', response)
      
      // Verificar si la respuesta es exitosa
      if (!response.success) {
        return {
          success: false,
          error: response.message || 'Error al registrar usuario'
        }
      }
      
      // La respuesta puede ser directa o estar en response.data
      const createdUser = response.data || response
      
      return {
        success: true,
        user: createdUser,
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

  // Verificar si está autenticado
  static isAuthenticated() {
    const token = storageService.getToken()
    if (!token) return false
    
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