// src/models/UserModel.js
import httpService from '../services/httpService'
import API_CONFIG from '../config/api'

class UserModel {
  // GET - Obtener todos los usuarios (requiere token + rol admin/seller)
  static async getAllUsers() {
    try {
      console.log('📋 Obteniendo todos los usuarios desde API real')
      
      // GET a http://localhost:3000/api/users
      // Requiere token en header (Authorization: Bearer {token})
      const users = await httpService.get(API_CONFIG.ENDPOINTS.USERS, true)
      
      // La API devuelve: { success: true, message: "...", data: [...] }
      // httpService.handleResponse ya extrajo data, entonces users es el array
      console.log('✅ Usuarios obtenidos:', users?.length || 0)
      
      return {
        success: true,
        data: users
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      return {
        success: false,
        error: error.message || 'Error al cargar usuarios'
      }
    }
  }

  // GET - Obtener usuario por ID (requiere token + rol admin/seller)
  static async getUserById(id) {
    try {
      console.log(`🔍 Obteniendo usuario con ID: ${id}`)
      
      // GET a http://localhost:3000/api/users/:id
      const endpoint = API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':id', id)
      const user = await httpService.get(endpoint, true)
      
      return {
        success: true,
        data: user
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return {
        success: false,
        error: error.message || 'Usuario no encontrado'
      }
    }
  }

  // POST - Crear nuevo usuario (registro - público)
  static async createUser(userData) {
    try {
      console.log('➕ Creando nuevo usuario:', userData.email)
      
      // POST a http://localhost:3000/api/users/create
      // No requiere token (público)
      const newUser = {
        name: userData.name,
        lastname: userData.lastname || '',
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        image: userData.image || '',
        role: userData.role || 'user'
      }
      
      const response = await httpService.post(
        API_CONFIG.ENDPOINTS.REGISTER,  // '/users/create'
        newUser,
        false  // No requiere token
      )
      
      return {
        success: true,
        data: response,
        message: 'Usuario creado exitosamente'
      }
    } catch (error) {
      console.error('Error al crear usuario:', error)
      return {
        success: false,
        error: error.message || 'Error al crear usuario'
      }
    }
  }

  // PUT - Actualizar todos los datos del usuario (requiere token + rol admin/seller)
  static async updateUser(id, userData) {
    try {
      console.log(`✏️ Actualizando usuario ID: ${id}`)
      
      // PUT a http://localhost:3000/api/users/:id
      const endpoint = API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':id', id)
      
      // La API espera los campos a actualizar
      const updateData = {}
      if (userData.name !== undefined) updateData.name = userData.name
      if (userData.lastname !== undefined) updateData.lastname = userData.lastname
      if (userData.email !== undefined) updateData.email = userData.email
      if (userData.password && userData.password !== '') updateData.password = userData.password
      if (userData.phone !== undefined) updateData.phone = userData.phone
      if (userData.image !== undefined) updateData.image = userData.image
      if (userData.role !== undefined) updateData.role = userData.role
      
      const response = await httpService.put(endpoint, updateData, true)
      
      return {
        success: true,
        data: response,
        message: 'Usuario actualizado exitosamente'
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      return {
        success: false,
        error: error.message || 'Error al actualizar usuario'
      }
    }
  }

  // PATCH - Actualizar campo específico (usamos PUT ya que la API no tiene PATCH específico)
  static async patchUser(id, partialData) {
    try {
      console.log(`📝 Actualizando campo(s) de usuario ID: ${id}`, partialData)
      
      // La API no tiene endpoint PATCH específico, usamos PUT
      const endpoint = API_CONFIG.ENDPOINTS.USER_BY_ID.replace(':id', id)
      const response = await httpService.put(endpoint, partialData, true)
      
      return {
        success: true,
        data: response,
        message: 'Campo actualizado correctamente'
      }
    } catch (error) {
      console.error('Error al actualizar campo:', error)
      return {
        success: false,
        error: error.message || 'Error al actualizar campo'
      }
    }
  }

  // DELETE - Eliminar usuario (requiere token + rol admin)
  static async deleteUser(id) {
    try {
      console.log(`🗑️ Eliminando usuario ID: ${id}`)
      
      // DELETE a http://localhost:3000/api/users/delete/:id
      const endpoint = API_CONFIG.ENDPOINTS.USER_DELETE.replace(':id', id)
      const response = await httpService.delete(endpoint, true)
      
      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
        data: response
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      return {
        success: false,
        error: error.message || 'Error al eliminar usuario'
      }
    }
  }
}

export default UserModel