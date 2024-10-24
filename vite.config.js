import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

// node
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 設定別名 @ = src目錄
    alias: {
      "@":path.resolve(__dirname, "src")
    }
  },
  plugins: [
    vue(),
    WindiCSS()
  ],
  css: {

  },
  // 配置反向代理解決跨域問題
  server: {
    cors: true,
    proxy: {
      '/api': {
        // 正式api url ( vue頁面使用 -> import.meta.env.VITE_API_URL )
        // target: env.VITE_SIX_API_URL,
        target: 'http://ceshi13.dishait.cn',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
