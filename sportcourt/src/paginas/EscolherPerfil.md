# Escolher Perfil (`EscolherPerfil.vue`)

## 📝 Descrição Geral
Página intermediária no fluxo de onboarding. Permite ao usuário escolher o tipo de perfil desejado ("Jogador" ou "Dono de Quadra") para ser direcionado ao formulário de cadastro correspondente.

## 🎨 Layout e Elementos Visuais
- **Header / Navbar:** Logo no canto esquerdo (com link de retorno para `/`) e botão "Já tenho conta" no lado direito redirecionando para `/login`.
- **Cards de Seleção:** Dois grandes blocos interativos posicionados verticalmente, com micro-animação de elevação (`hover:-translate-y-0.5`) e transição de cores ao passar o mouse:
  - *Sou Jogador:* Borda verde (`hover:border-emerald-500/50`) e ícone de usuário. Aponta para `/cadastro-jogador`.
  - *Sou Dono de Quadra:* Borda azul (`hover:border-emerald-500/50` / comportamento similar com ícone azul) e ícone de pin/localização. Aponta para `/cadastro-dono`.
- **Links Adicionais:** Link textual centralizado no rodapé da página para "Entrar na conta" (`/login`).

## ⚙️ Estado Local (`data`)
- `logo`: Caminho para a imagem do logotipo do site (`@/assets/logosite1.png`).

## 📥 Propriedades Recebidas (`props`)
*Esta página não recebe propriedades.*

## 🛠️ Métodos e Ações (`methods`)
*Esta página é inteiramente estática em termos de lógica do Javascript, utilizando apenas diretivas nativas do `<router-link>` para a navegação.*

## 🌐 Integrações & API
- **Redirecionamento / Rotas:**
  - `/` (Retorno à Home via Logo)
  - `/login` (Página de autenticação)
  - `/cadastro-jogador` (Cadastro para o atleta)
  - `/cadastro-dono` (Cadastro para o proprietário)

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial da página. |
