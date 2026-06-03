// src/services/httpService.js
import API_CONFIG from '../config/api'

class HttpService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        // IMPORTANTE: La API espera "Bearer {token}" sin JWT adelante?
        // Según tu userController.js, session_token: `JWT ${token}`
        // Pero el middleware espera "Bearer {token}"
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  async handleResponse(response) {
    console.log('📡 Response status:', response.status)
    
    // Obtener el cuerpo de la respuesta
    const data = await response.json().catch(() => ({}))
    
    if (!response.ok) {
      // La API real devuelve { success: false, message: "error" }
      const errorMessage = data.message || data.error || `Error HTTP: ${response.status}`
      throw new Error(errorMessage)
    }
    
    // La API real devuelve { success: true, message: "...", data: {...} }
    console.log('📡 Response data:', data)
    
    // Si la respuesta tiene la estructura { success, data }, extraemos data
    if (data.success === true && data.data !== undefined) {
      return data.data  // ← Retornamos solo los datos útiles
    }
    
    // Si no tiene esa estructura, retornamos todo
    return data
  }

  async post(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 POST a: ${url}`)
      console.log('📡 Datos enviados:', data)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data)
      })
      
      console.log('📡 Status:', response.status)
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`❌ POST ${endpoint} error:`, error)
      throw error
    }
  }

  async get(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 GET: ${url}`)
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(includeAuth)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error)
      throw error
    }
  }

  async put(endpoint, data, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 PUT a: ${url}`)
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: JSON.stringify(data)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error)
      throw error
    }
  }

  async delete(endpoint, includeAuth = true) {
    try {
      const url = `${this.baseURL}${endpoint}`
      console.log(`📡 DELETE a: ${url}`)
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth)
      })
      return await this.handleResponse(response)
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error)
      throw error
    }
  }
}

export default new HttpService()