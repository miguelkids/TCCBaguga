import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import './assets/global.css'
import './assets/design-system.css'

const app = createApp(App);

// O controle de sessão agora é feito via localStorage (token, user)
// gerenciado diretamente pelo src/api.js e pelas páginas de login/logout.

app.use(router);
app.mount("#app");