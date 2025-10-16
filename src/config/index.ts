const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  ALLOWED_ENVIRONMENTS: ['development', 'local'],
}

export default config
