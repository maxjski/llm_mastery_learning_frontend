import axios from 'axios'
import { API_URL } from './config'

export async function registerUser(email: string, password: string) {
  const response = await axios.post(
    `${API_URL}/register`,
    { email, password },
    { headers: { 'Content-Type': 'application/json' } },
  )
  return response.data
}

export async function loginUser(email: string, password: string) {
  const response = await axios.post(
    `${API_URL}/login`,
    new URLSearchParams({ username: email, password }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  )
  return response.data
}
