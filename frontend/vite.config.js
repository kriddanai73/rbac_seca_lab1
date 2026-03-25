import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rbac_seca_lab1/', // 🔥 ใส่อันนี้
})