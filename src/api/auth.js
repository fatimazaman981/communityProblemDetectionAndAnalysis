import api from './axiosInstance'

export const loginAdmin = (email, password) =>
  api.post('/api/auth/login/', { email, password }).then((r) => r.data)
