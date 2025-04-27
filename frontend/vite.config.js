import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api' : {target:"http://192.168.1.10:5000"} // enter your local ipv4 to host on local network
    }
  }
})
