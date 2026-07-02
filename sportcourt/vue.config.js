const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require('@tailwindcss/postcss')({})
          ]
        }
      }
    }
  },
  devServer: {
    host: '0.0.0.0', // permite qualquer IP da rede
    port: 8080, // porta padrão
    allowedHosts: 'all', // permite acesso de qualquer host/IP
    headers: {
      'Access-Control-Allow-Origin': '*', // libera CORS para todas as origens
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
})
