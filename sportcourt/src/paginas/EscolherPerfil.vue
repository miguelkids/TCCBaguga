<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; flex-direction: column;">
    <header class="sc-topbar" style="position: sticky; top: 0; z-index: 100; background: rgba(15, 17, 23, 0.95); backdrop-filter: blur(12px);">
      <router-link to="/" class="sc-topbar-logo">
        <img :src="logo" alt="SportCourt" style="height: 38px; width: auto;" />
      </router-link>
      <router-link to="/login" class="sc-btn sc-btn-ghost sc-btn-sm">
        Já tenho conta
      </router-link>
    </header>

    <main class="sc-container-sm sc-flex" style="flex: 1; align-items: center; justify-content: center; padding: 48px 16px 32px;">
      <div class="sc-card" style="width: 100%; padding: 32px;">
        <h1 class="sc-h2" style="text-align: center; margin-bottom: 8px;">Como você deseja usar?</h1>
        <p class="sc-muted" style="text-align: center; margin-bottom: 28px;">Escolha o seu perfil para continuar</p>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <router-link to="/cadastro-jogador" class="sc-card-elevated sc-flex-between" style="padding: 20px; text-decoration: none; color: inherit; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--sc-primary)'" onmouseout="this.style.borderColor='var(--sc-border)'">
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 48px; height: 48px; background: var(--sc-primary-subtle); color: var(--sc-primary); display: flex; align-items: center; justify-content: center; border-radius: var(--sc-radius);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 16px;">Sou Jogador</div>
                <div class="sc-muted" style="font-size: 13px;">Encontre quadras e faça reservas online</div>
              </div>
            </div>
          </router-link>

          <router-link to="/cadastro-dono" class="sc-card-elevated sc-flex-between" style="padding: 20px; text-decoration: none; color: inherit; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--sc-primary)'" onmouseout="this.style.borderColor='var(--sc-border)'">
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; display: flex; align-items: center; justify-content: center; border-radius: var(--sc-radius);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div style="font-weight: 800; font-size: 16px;">Sou Dono de Quadra</div>
                <div class="sc-muted" style="font-size: 13px;">Cadastre e gerencie sua arena esportiva</div>
              </div>
            </div>
          </router-link>
        </div>

        <div style="text-align: center; margin-top: 28px;" class="sc-muted">
          Já tem uma conta?
          <router-link to="/login" style="color: var(--sc-primary); font-weight: 700; text-decoration: none; margin-left: 4px;">
            Entrar
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import logo from "@/assets/logosite1.png";

export default {
  name: "EscolherPerfil",
  data() {
    return { logo };
  }
};
</script>
