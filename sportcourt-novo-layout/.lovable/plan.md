# Landing Page SportCourt

Construir a home institucional em `src/routes/index.tsx` com tema escuro esportivo (grafite + verde neon), usando os assets enviados.

## Design tokens (src/styles.css)
- Tema dark por padrão na landing.
- Cores: `--background` grafite quase-preto, `--foreground` branco, `--primary` verde neon (#22c55e / oklch equivalente), `--primary-glow` verde claro, `--card` grafite levemente mais claro, `--border` sutil.
- Gradiente `--gradient-hero` (radial verde neon → grafite) e `--shadow-glow` para CTAs.
- Tipografia: Inter (já padrão) com pesos fortes em headings — sem alteração de fonte custom.

## Assets
- `logo sport.png`, `icon sport.png`, `Design sem nome (3).png` → registrados via `lovable-assets create` em `src/assets/*.asset.json`.
- Favicon: usar o `icon sport.png` (link rel="icon" no `__root.tsx` head).
- Logo no header + imagem hero (Design sem nome) com overlay grafite para legibilidade.

## Estrutura de componentes (`src/components/landing/`)
- `Header.tsx` — sticky, `backdrop-blur` + borda inferior que aparece no scroll (via state com listener). Logo à esquerda, botões "Entrar" (ghost) e "Cadastrar-se" (primary verde).
- `Hero.tsx` — background com imagem wireframe + overlay gradiente; título grande "SportCourt", subtítulo, dois CTAs ("Sou Jogador", "Sou Dono de Quadra") com âncoras para as seções abaixo.
- `BenefitsSection.tsx` — wrapper com duas colunas (grid responsivo `lg:grid-cols-2`): `AudienceCard` para Jogador (id="jogador") e Dono (id="dono"). Cada card tem ícone (Lucide), título, lista de features atuais (com ícone check), e bloco "Próximas atualizações" com badges "Em breve".
- `FAQSection.tsx` — usa `@/components/ui/accordion` com as 4 perguntas listadas.
- `Footer.tsx` — simples: logo, copyright, links rápidos.

Ícones (Lucide): `Search`, `Clock`, `Users`, `Star`, `Building2`, `LineChart`, `UserCheck`, `Rocket`, `MessageCircle`, `Wallet`, etc.

## Página
`src/routes/index.tsx` monta Header + Hero + BenefitsSection + FAQSection + Footer, atualiza `head()` com title/description/og em PT-BR mencionando SportCourt, e adiciona `className="dark"` na raiz da página para forçar tema escuro.

## Conteúdo (PT-BR)
Cópia direta do briefing — features atuais e badges "Em breve" para Jogador e Dono.

## FAQ
1. Como faço para cancelar um agendamento?
2. Como funciona o sistema de cobrança para os donos de quadra?
3. Posso agendar uma partida mensal recorrente?
4. O aplicativo cobra alguma taxa extra do jogador?

(Respostas curtas e claras, alinhadas ao produto descrito.)

## Responsividade
- Header colapsa botões em mobile mantendo ambos visíveis (compactos).
- Hero: título escala `text-4xl` → `md:text-6xl` → `lg:text-7xl`.
- Cards de benefícios empilham em mobile, lado-a-lado em `lg`.
- Padrão `grid-cols-[minmax(0,1fr)_auto]` onde houver texto + ícone fixo.

## Detalhes técnicos
- Sem backend nesta etapa (botões Entrar/Cadastrar e CTAs são `<a href="#...">` placeholders por enquanto).
- Nada de cores hardcoded — tudo via tokens semânticos.
- Smooth scroll para âncoras `#jogador` / `#dono` / `#faq`.