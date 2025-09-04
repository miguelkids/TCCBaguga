<template>
  <div id="app">
    <!-- Conteúdo principal -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Estilos globais */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f7f7f7;
}

#app {
  min-height: 100vh;
}
</style>
