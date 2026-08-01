<template>
  <div class="sc-page sc-flex" style="min-height: 100vh; flex-direction: column;">
    <header class="sc-topbar">
      <router-link to="/" class="sc-topbar-logo">
        <img :src="logo" alt="SportCourt" />
        <span>SportCourt</span>
      </router-link>
      <router-link to="/login" class="sc-btn sc-btn-ghost sc-btn-sm">
        Já tenho conta
      </router-link>
    </header>

    <main class="sc-container-sm sc-flex" style="flex: 1; align-items: center; justify-content: center; padding: 32px 16px;">
      <div class="sc-card" style="width: 100%; padding: 32px;">
        <h1 class="sc-h2" style="text-align: center; margin-bottom: 8px;">Como você deseja usar?</h1>
        <p class="sc-muted" style="text-align: center; margin-bottom: 24px;">Escolha o seu perfil para continuar</p>

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <router-link to="/cadastro-jogador" class="sc-card-elevated sc-flex-between" style="padding: 20px; text-decoration: none; color: inherit; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--sc-primary)'" onmouseout="this.style.borderColor='var(--sc-border)'">
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 48px; height: 48px; background: var(--sc-primary-subtle); color: var(--sc-primary);">
                👤
              </div>
              <div>
                <div style="font-weight: 800; font-size: 16px;">Sou Jogador</div>
                <div class="sc-muted" style="font-size: 13px;">Encontre quadras e faça reservas online</div>
              </div>
            </div>
            <span style="color: var(--sc-primary); font-weight: 700;">→</span>
          </router-link>

          <router-link to="/cadastro-dono" class="sc-card-elevated sc-flex-between" style="padding: 20px; text-decoration: none; color: inherit; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--sc-primary)'" onmouseout="this.style.borderColor='var(--sc-border)'">
            <div class="sc-flex sc-gap-3">
              <div class="sc-avatar" style="width: 48px; height: 48px; background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
                🏟️
              </div>
              <div>
                <div style="font-weight: 800; font-size: 16px;">Sou Dono de Quadra</div>
                <div class="sc-muted" style="font-size: 13px;">Cadastre e gerencie sua arena esportiva</div>
              </div>
            </div>
            <span style="color: #60a5fa; font-weight: 700;">→</span>
          </router-link>
        </div>

        <div style="text-align: center; margin-top: 24px;" class="sc-muted">
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
import logo from "@/assets/logosite.png";

export default {
  name: "EscolherPerfil",
  data() {
    return { logo };
  }
};
</script>
