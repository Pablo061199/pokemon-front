import axios, { type AxiosInstance } from 'axios'
import { apiServer } from '../globalVars'

function createAxios(): AxiosInstance {
  const instance: AxiosInstance = axios.create({
    baseURL: apiServer,
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  )

  return instance
}

export default createAxios
