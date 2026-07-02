# Design System Global (`global.css`)

## 📝 Descrição Geral
Arquivo central de estilos globais do SportCourt. Utiliza **Tailwind CSS v4** via `@import "tailwindcss"` e DaisyUI v5 via `@plugin "daisyui"`. Define variáveis de design (tokens), reset base, tipografia, animações e utilitários customizados.

## 🎨 Conteúdo e Responsabilidades

### 1. Tokens de Design (`:root`)
Variáveis CSS para cores, gradientes, sombras, raios e fontes:
- **Cores:** `--primary` (#22c55e turf-green), `--accent` (#3b82f6 sky-blue), `--destructive` (#ef4444), etc.
- **Gradientes:** `--gradient-hero`, `--gradient-primary`, `--gradient-accent`, `--gradient-card`
- **Sombras:** `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-soft`, `--shadow-card`, `--shadow-card-hover`, `--shadow-glow`
- **Tipografia:** `--font-heading` (Outfit), `--font-body` (Inter)

### 2. Reset & Base
- Reset universal: `margin: 0`, `padding: 0`, `box-sizing: border-box`
- `html`: `font-family: Inter`, `antialiased`, `scroll-behavior: smooth`
- `body`: `background-color: var(--background)`, `color: var(--foreground)`
- `h1-h5`: `font-family: Outfit`, `font-weight: 700`, `letter-spacing: -0.02em`
- `a`: `text-decoration: none`, `transition: color 0.2s`
- `p`: `font-size: 15px`, `line-height: 1.6`

### 3. Inputs — Reset Mínimo
> ⚠️ **Regra importante:** os inputs NÃO têm padding/margin/border fixos globalmente.
> Todos os estilos visuais (padding, border, border-radius, background) são aplicados via **classes Tailwind diretamente nos componentes**.
- Apenas `font-family` e `outline: none` são definidos globalmente.
- `placeholder` recebe `color: var(--muted-foreground)`.

### 4. Botões — Reset Mínimo
> ⚠️ **Regra importante:** os botões NÃO têm `width: 100%`, `padding`, `margin-top`, `background` ou `border-radius` fixos globalmente.
> Todos os estilos visuais são aplicados via **classes Tailwind diretamente nos componentes**.
- Apenas `cursor: pointer` e `font-family` são definidos globalmente.

### 5. Animações
- `fadeInUp`, `fadeIn`, `scaleIn`, `pulse-glow`, `spin`, `shimmer`
- Classes utilitárias: `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`
- Delay helpers: `.animate-delay-1` (0.1s), `.animate-delay-2` (0.2s), `.animate-delay-3` (0.3s)

### 6. Utilitários Customizados
- `.shadow-card`, `.shadow-soft`, `.shadow-card-hover`
- `.bg-gradient-hero`, `.bg-gradient-primary`
- `.sc-badge`, `.sc-badge-green`, `.sc-badge-orange`, `.sc-badge-blue`
- Scrollbar elegante customizada via `::-webkit-scrollbar`

## 📅 Histórico de Alterações
| Data | Autor | Descrição da Mudança |
| :--- | :--- | :--- |
| 22/06/2026 | Antigravity | Criação do mapeamento inicial. |
| 22/06/2026 | Antigravity | **Correção crítica:** Removidas as regras globais de `input`, `select`, `textarea` e `button` que sobrescreviam os utilitários Tailwind dos componentes (padding, margin-top, width, background, border). Os botões e inputs agora são estilizados 100% via classes Tailwind inline nos `.vue`. |
| 22/06/2026 | Antigravity | **Correção de pipeline Tailwind v4:** Alterado `@import "tailwindcss"` com `@source` explícito para `@import "tailwindcss" source("../..")` — sintaxe correta para o Tailwind v4 escanear os arquivos `.vue` a partir da raiz do projeto. Também adicionado `css.loaderOptions.postcss` no `vue.config.js` para garantir que o Webpack/postcss-loader processe o Tailwind corretamente no dev server e no build. |
