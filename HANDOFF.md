# Handoff — PLX Brasil (rebrand industrial)

Documento para continuar em **outro chat**. Copie o bloco **Prompt para o próximo agente** no final.

Dono: **Vitor**, software engineer. Tom: trabalhar direto no código. Idioma do produto: **pt-BR**.

Último commit desta sessão: ver `git log -1` — *Fotos reais do X20 Pro + cobertura do canal fechada*. Branch: `cursor/industrial-rebrand-ed8a` (main continua o clone estático `e8f028b`). Clone no Mac: `~/dev/plx-brasil-rebrand`. Não abrir PR a menos que Vitor peça.

---

## 1. O que este projeto é

Rebrand do site **plxbrasil.com.br** a partir da auditoria de **01/09/2026**. Não é clone pixel-perfect do site antigo (aquele visual “AI / template / iOS”). É **transparência técnica**: máquina compacta com preço na tela, ficha na mesa e gente do outro lado do telefone.

Antagonista de mercado: o “consulte-nos” do importado. A PLX **publica** preço (escavadeiras) e ficha.

Sede: Tubarão/SC. WhatsApp: `5548988728340` · `(48) 98872-8340`. E-mail: `contato@plxbrasil.com.br`. Endereço: R. Mário Mendonça, 20, São João Margem Direita, CEP 88702-802.

---

## 2. O que Vitor quer (produto + visual + próxima onda)

### Já pedido e em grande parte entregue

- Home, categoria, PDP, empresa, suporte, contato, comparador, funil de orçamento.
- Estética **industrial**, não iOS: menos caixa, mais ar, tipografia maior, alinhamento mobile.
- Carrossel da linha (não grade de quatro cards iguais).
- Cards sem chrome: PNG no paper, métricas, preço, link texto **Ver ficha** (sem botão primário no card).
- PDP: H1 = nome do modelo; **uma** foto de catálogo — **não** fingir galeria de 8 ângulos com o mesmo PNG.
- Foto real de obra ainda **não existe**. Não inventar ensaio. Legenda honesta.

### Onda GSAP — implementada (02/09/2026), sprites e drone ainda sem asset

Vitor disse “Gflow / flowkta”. **Neste repo isso é GSAP** (`gsap` + `ScrollTrigger`), no Vite MPA atual. **Não** migrar para Webflow, Framer ou Flowkit. Não segundo design system.

Objetivo da onda:

1. **Drone view atrás da hero** — o pátio se move (vídeo aéreo curto ou ken-burns/parallax no still atual) enquanto o copy fica parado e legível.
2. **Hover nos produtos** — ao passar o mouse, a máquina **mostra o que faz** (concha, caçamba, tombamento, vibração do rolo), não um scale 1.05 de e-commerce.
3. **Animação em frames (sprites)** — filmstrip WebP de 8–12 frames, `steps()`, peso baixo. Sem MP4 por card, sem Lottie pesado, sem blur/glow.
4. **Customização industrial** — movimento útil, curto, cortado. Preferência: transform/opacity. Zero `backdrop-filter`, zero `filter: blur`.

---

## 3. Stack e como o site nasce

Não é Next, não é Tailwind, não é shadcn. É **Vite 7 MPA** + HTML gerado + CSS próprio.

| Peça | Caminho |
|---|---|
| Catálogo XML (fonte) | `src/data/modelos.xml` |
| JSON gerado | `src/data/catalog.json` (`npm run data` → `scripts/parse-catalog.mjs`) |
| Tokens | `src/css/tokens.css` — **único** lugar de hex |
| Layout CSS | `src/css/app.css` |
| Fontes | `src/css/fonts.css` + `public/fonts/` (Archivo, Archivo Narrow, IBM Plex Sans, IBM Plex Mono) |
| Bundle CSS | `npm run css` → `scripts/bundle-css.mjs` → **`public/css/app.css`** |
| HTML | `npm run render` → `scripts/render-pages.mjs` (escreve `index.html` e pastas na raiz) |
| JS | `src/js/app.js` (hidratação: nav, busca, orçamento, legal, tabs, sticky PDP, finance, vídeo lite, filtros, carrossel) |
| Vite | `vite.config.js` — `host: "0.0.0.0"`, **porta `43147`**, `strictPort`, `allowedHosts: true` |

**Armadilha já sofrida:** as páginas devem linkar `/css/app.css` (arquivo estático). Se linkar `/src/css/app.css`, o Vite trata como JS e o site **sai sem estilo**. Preview Desktop recusou conexão quando o server bindava só `127.0.0.1` — precisa `0.0.0.0`.

Scripts: `predev` / `prebuild` = data + css + render.

```bash
npm install
npm run dev          # http://127.0.0.1:43147/  (bind 0.0.0.0)
npm run data && npm run css && npm run render
```

Após mudar `render-pages.mjs` ou CSS: **sempre** bundle + render antes de julgar o browser.

---

## 4. Governança visual (inegociável)

Arquivo: `GOVERNANCE.md`.

1. Nenhum hex fora de `tokens.css`.
2. **Um** gradiente no site: scrim da hero (preto → transparente). Condições: legibilidade, imperceptível como “gradient look”, um matiz.
3. Zero `backdrop-filter`. Zero `filter: blur` decorativo. GSAP **não** pode reintroduzir isso.
4. Raio ≤ 4px. Tabela/faixa/contêiner: 0. Botão/input: 2px.
5. Máximo **duas** `.section--invert` por página (vídeo + CTA final).
6. PNG ≤ 300 KB. Hero WebP responsivo (já: ~128–258 KB).
7. Foto de produto = foto real. PNG recortado **só** em listagem, fundo chapado. Não fingir galeria.
8. Contraste 4,5:1. Botão preenchido = `--plx-red-600` `#C21F1C` + branco.

Marca: logo `#E52C28`. Interativo `#C21F1C`. Proporção **70% paper / 25% ink / 5% red**.

Header é **ink-900** porque o logo é branco + quadrado vermelho em fundo preto (`public/images/brand/logo.png`).

Vitor já rejeitou: visual iOS, cards muito quadrados, textos apertados, tiles brancos atrás da máquina, família em 4 caixas, galeria falsa, padding demais no WhatsApp (~140px). Passadas seguintes **afrouxaram** caixa e chrome — não voltar atrás.

---

## 5. O que já está no ar (páginas e features)

| Rota | Função |
|---|---|
| `/` | Hero, famílias em texto, carrossel X10→X65, vídeos lite, empresa, FAQ, reviews |
| `/mini-escavadeira/` | Filtro por peso (tabs texto), carrossel, comparador, editorial, FAQ |
| `/mini-carregadeira/`, `/mini-dumper/`, `/mini-rolo-compactador/` | Categoria (preço sob consulta) |
| `/mini-escavadeira-x10-plus/` … `x65-pro/` | PDP |
| `/mini-carregadeira-xc750/`, `xd500/`, `/mini-dumper-xd500/`, `/mini-rolo-compactador-xr12/` | PDP |
| `/comparar/` | Tabela da linha |
| `/sobre/` | Stats reais, não missão/visão/valores 01/02/03 |
| `/suporte/` | Chamado, SLA 24h úteis, peça em Tubarão |
| `/contato/` | Endereço, mapa, orçamento |
| `/404.html` | 404 |

Features: modal de condições legais (`*`), barra sticky de PDP, comparador, simulador CDC referencial, funil 3 passos (aplicação → prazo → contato) + WhatsApp, `schema.org/Product`+`Offer`, busca de modelo, YouTube só após clique.

Nav curta: Escavadeira, Carregadeira, Dumper, Rolo, Empresa, Suporte, Contato. Logo = home.

Hero home: **“De 1 a 6 toneladas. Preço na tela.”**

Cards: sem kicker, badge mono absoluto, métricas com label curto (Prof. / Peso / Motor), `a.text-link` “Ver ficha”, imagem ~88% + linha de chão `::after`.

PDP: `.gallery-one` uma figura; `.pdp-siblings` prev/next.

---

## 6. Catálogo

11 modelos. Preço **público só em mini escavadeira**. Demais: **Sob consulta**.

| Modelo | Preço publicado |
|---|---|
| X10 PLUS | sim (faixa a partir de ~R$ 44.900 no XML) |
| X10 Pro, X15 Pro, X20 Pro, X30 Pro, X35 Pro, X65 Pro | sim (X65 Pro R$ 304.900) |
| XC750, XD500 (carregadeira), XD500 (dumper), XR12 | não |

Imagens atuais: `public/images/models/*.webp` (recortes). Hero: `public/images/hero/yard-{768,1280,1920}.webp` + `shopfloor.webp`. Thumbs de vídeo: `public/images/video/thumb-01…`. **Não há footage de drone no repo.**

Vídeos YouTube já mapeados em `VIDEOS` dentro de `scripts/render-pages.mjs` (fonte possível para extrair frames).

---

## 7. Arquitetura de código que o próximo chat deve respeitar

- **Não editar HTML gerado na raiz à mão.** Edite `scripts/render-pages.mjs` e rode `npm run render`.
- CSS: edite `src/css/*`, depois `npm run css`.
- JS novo: módulos em `src/js/` importados por `app.js` (já é `type="module"`).
- Não adicionar auth, DB, CMS, segundo component library.
- Lead **não** posta no Lambda de produção neste recorte — monta texto e abre WhatsApp.
- Carrossel é scroll-snap nativo (`data-carousel`). GSAP não deve lutar contra `scrollLeft` no hover (animar o PNG **dentro** do card, não o track).

Arquivos-chave da última passada:

- `scripts/render-pages.mjs` — nav, `shortLabel`, cards, hero copy, gallery-one, siblings
- `src/css/app.css` — `.text-link`, `.gallery-one`, `.pdp-siblings`, cards 328px, filtros/tabela/finance sem caixa, vídeos sem tile
- `src/js/app.js` — importa `./motion.js` (últimas 3 chamadas)
- `src/js/motion.js` — `initHeroMotion` (ken-burns/parallax/vídeo), `initProductSprites` (filmstrip por xPercent + steps, lazy no hover, fallback lift 3px), `initReducedMotion`
- `package.json` — `vite` + `gsap` 3.15

---

## 8. Onda GSAP — o que está no código (e o que falta de asset)

**Estado:** código pronto e verificado com Playwright (desktop 1440, mobile 390 touch, `reducedMotion: reduce`, PDP). O que falta é **asset**, não código:

- **Drone:** o gerador só emite `<video class="hero__drone">` se existir `public/images/hero/drone.webm` ou `drone.mp4`. Sem arquivo, `motion.js` faz ken-burns (scale 1→1.08, 28s, yoyo) + parallax de 10px no scroll, pausado fora da viewport. Copy e scrim ficam parados. Mobile ≤720px nunca baixa o vídeo.
- **Sprites:** o gerador só emite `data-sprite="/images/sprites/{slug|categorySlug}.webp" data-frames="n"` se o arquivo existir (JSON irmão `{ "frames": n }` opcional; padrão 8). Filmstrip horizontal, frame 0 = o PNG do card. Sem arquivo, hover = lift de 3px no PNG. Touch e reduced-motion: estático, nada baixa. Se `.webp` falhar, tenta `.png` com o mesmo nome.
- Ramo de vídeo testado com um `drone.webm` sintético (ffmpeg testsrc, removido antes do commit): desktop 1 request e toca com opacidade 1 sobre o still; mobile 390 e reduced-motion zero requests, `<video hidden>` sem `<source>`; 404 na fonte deixa o still visível. Pausa/retoma fora e dentro da viewport via IntersectionObserver (o trigger `top top` do parallax não serve: em scroll 0 a hero está abaixo do header e ele considera "antes do início").
- Testado com um sprite sintético (removido antes do commit): 0 requests antes do hover, 1 depois; frames avançam em steps; `pointerleave` volta ao frame 0 e opacidade 0; `will-change` limpo. Uma timeline por card.

Para produzir os assets: seção 8.5. Dropar o arquivo na pasta e `npm run render` — nenhuma edição de código.

Plano original (mantido como referência):

### 8.1 Dependência

```bash
npm install gsap
```

Usar `gsap` + `ScrollTrigger`. Respeitar `prefers-reduced-motion` com `gsap.matchMedia()` / `gsap.matchMedia("(prefers-reduced-motion: reduce)", …)`: hero vira still; sprites ficam no frame 0.

Só **transform** e **opacity**. Sem `filter`, sem `box-shadow` animado, sem scale elástico.

### 8.2 Hero — drone view

**Agora (sem arquivo de drone):** Ken Burns lento no `<picture class="hero__media">` — `gsap.to(img, { scale: 1.08, xPercent: -2, yPercent: 2, duration: 28, ease: "none", repeat: -1, yoyo: true })`. Copy e plate **não** se mexem. Scrim permanece (único gradiente). Pause quando a hero sai da viewport (`ScrollTrigger` + `video.pause` no futuro).

**Quando existir footage:** `public/images/hero/drone.webm` + `drone.mp4` (H.264), muted, loop, `playsinline`, `preload="none"` no mobile, `poster` = `yard-1280.webp`. Desktop autoplay; mobile ≤720px **não** baixa o vídeo (custo). Alvo: ≤ ~1,5 MB o corte. Não full-bleed 4K.

Estrutura sugerida:

```html
<div class="hero__media" data-hero-motion>
  <video class="hero__drone" hidden until src exists>…</video>
  <picture>…stills atuais…</picture>
</div>
<div class="hero-scrim"></div>
```

Parallax máximo ~8–12px no eixo Y no scroll — industrial, não Apple.

### 8.3 Produtos — hover + sprite de “o que a máquina faz”

Não animar o recorte PNG com bounce. Trocar/overlay um **filmstrip**:

| Família | Loop de frames (ideia) |
|---|---|
| Mini escavadeira | 8–12 frames: lança desce, concha fecha, sobe |
| Carregadeira | caçamba levanta / bascula |
| Dumper | caçamba tomba |
| Rolo | passagem curta / tambor |

Especificação de asset (gerar na produção; no código já deixar o hook):

- 1 WebP por **família** (não 11 arquivos iguais se o recorte for genérico), ou 1 por modelo se o PNG for distinto.
- Largura frame ~480–640 CSS px; 8–12 colunas horizontais **ou** `sprite.webp` + JSON `{ frames, fps }`.
- Peso alvo **40–80 KB** por sprite. Teto 120 KB.
- Animar com `background-position` + `ease: "steps(n-1)"` **ou** `gsap.to(..., { duration: 0.6, ease: "steps(8)" })` no hover / `pointerenter`.
- `pointerleave`: voltar ao frame 0 (0,15s), `kill()` tweens.
- **Lazy:** `IntersectionObserver` ou hover pré-carrega `new Image()`. Home não baixa 11 sprites no load.
- Mobile: sem hover. Opção A — não anima. Opção B — play **uma vez** quando o card entra 60% na viewport, depois para. Preferir A até ter sprites reais; não autoplay 7 loops no carrossel.

Hook no HTML do card (em `modelCard()`):

```html
<a class="model-card__media" href="…" data-sprite="/images/sprites/{slug}.webp" data-frames="8">
```

CSS: o sprite é `position:absolute; inset; opacity:0` até hover; o PNG estático continua o default (honestidade do recorte).

**Sem sprites ainda:** hover mínimo aceitável = `y: -3` no `img` (120ms, none/power1), linha de chão inalterada. Sem sombra, sem tile branco.

### 8.4 Onde viver o JS

Criar `src/js/motion.js`:

- `initHeroMotion()`
- `initProductSprites()`
- `initReducedMotion()`

Importar no fim de `app.js`. Não misturar com o carrossel `scrollBy`.

### 8.5 Extração de frames (quando for produzir assets)

Fonte: MP4/YouTube já listados (`eNNBFilJYUY`, `3G0iIE2m5Sk`, …). Cortar 0,6–1,0s do gesto, 8–12 frames, fundo removido **ou** manter obra se for foto real. Script sugerido (ffmpeg), **não** commitar vídeo bruto:

```bash
ffmpeg -ss 00:00:04 -t 1 -i take.mp4 -vf "fps=10,scale=640:-1" frame-%02d.png
# montar filmstrip horizontal → webp
```

Até os sprites existirem, o código deve degradar para o PNG atual. Não usar placeholder Lorem / máquina fake.

### 8.6 Performance e QA

- `will-change` só durante o tween, remover no `onComplete`.
- Uma timeline ativa por card.
- Verificar home + `/mini-escavadeira/` + uma PDP + mobile 390px.
- Confirmar **um** `linear-gradient` no CSS depois das edições.
- Dev server: `0.0.0.0:43147`. Emitir preview se o ambiente for Cloud Agent.

---

## 9. Lacunas conhecidas (não “bugs”)

- Ensaio fotográfico real (obra, cabine, esteira, estoque) — **parcialmente fechado (02/09) com frames 1080p dos vídeos da própria PLX**, só nos modelos em que o rótulo da máquina aparece no frame: X35 Pro (obra no PR `Wo0IgXnJnLI` t=4,0; carregando caminhão `d_taJyvV7VM` t=5,0; painel/joystick da cabine `rVtgn3qgzCg` t=43,5), X10 PLUS (`eNNBFilJYUY` t=19,0 e 21,2), X65 Pro (`d_taJyvV7VM` t=9,0 e 21,5; identidade confirmada pelo rótulo `X65 PRO` no mesmo corpo em `sjEDwlYuIDQ` t=21). X20 Pro (depoimento vertical `ZBUDnZVCuIM` t=221, 416 e 354; rótulo `X20 PRO` no corpo, crop 16:9 nativo 1080×608 sem upscale). Ficam em `public/images/obra/{slug}.json` + `.webp` 1600×900 ou 1080×608 (50–190 KB), legenda mono honesta ("Frame de vídeo da PLX"), entram no schema.org `image`. O PDP só mostra o bloco se o JSON existir; os outros 8 modelos seguem com o recorte de catálogo. Marca d'água, lower-third e legenda queimada foram recortados (crop, sem retoque). **Continua aberto**: ensaio dedicado com fotógrafo, e qualquer foto de X10 Pro, X15/X30 Pro, carregadeira, dumper e rolo. Cobertura do canal fechada em 02/09 (os 15 vídeos inteiros em 1080p, duração conferida contra o YouTube): nenhum desses modelos aparece com rótulo legível. O que existe e **não entrou**, por honestidade: a mini amarela do `LYiFB-DBpIM` é rotulada `X18` (não está no catálogo); o rolo `R7` do showroom idem; o vídeo de engate rápido `IsYHmmCuUSI` não mostra rótulo; o tour institucional `LxoVyLavBLs` tem showroom, estoque, engenharia, linha de produção e área de teste (bom material para a página Sobre se o Vitor quiser — não há slot no gerador para foto institucional hoje).
- Footage de drone — **fechado (02/09)**: `public/images/hero/drone.{webm,mp4}` + `drone-poster-1280.webp`. Fonte: vídeo do canal PLX `d_taJyvV7VM` (título "X65 Pro"; a máquina na aérea não é identificável, por isso o alt é genérico), duas tomadas aéreas reais de um pomar em SC (t=0,05–1,70 s e 11,70–13,35 s), em 0,5x (fonte 60 fps → 30, sem interpolação), marca d'água recortada, crossfade e seam de loop (5,5 s). 960×540, webm 1,22 MB / mp4 0,86 MB / poster 132 KB. **Não é o pátio de Tubarão** — é obra real (o institucional `LxoVyLavBLs` tem drone do pátio, mas só 0,6 s antes do pin e do texto queimados; inviável como loop); por isso o still desktop da home virou o frame do drone (`drone-poster-1280`) e o mobile continua `yard-768`. Só a home carrega o vídeo; categorias seguem com ken-burns no still do pátio.
- Sprites de operação — **fechado só para o X35 Pro (02/09)**: `public/images/sprites/mini-escavadeira-x35-pro.webp` (+ `.json`), 8 frames 320×240 do vídeo `d_taJyvV7VM` (t=4,25–7,2 s: lança sobe do fosso e gira pro caminhão), fundo real de obra mantido, 118 KB (teto 120; o alvo de 40–80 KB é para recorte em fundo chapado, footage real não cabe). **Cuidado com o título do vídeo**: diz "X65 Pro", mas o rótulo da máquina nessa tomada é `X 35 PRO` (conferido em zoom no frame) — por isso o sprite é por slug, não por família: colocar máquina de outro porte no card do X10 seria mentir. Os outros 10 cards ficam no fallback (lift 3 px). Carregadeira, dumper e rolo **não aparecem em operação em nenhum vídeo do canal** — cobertura fechada em 02/09: os 15 vídeos (~37 min) baixados inteiros em 1080p (yt-dlp com `--extractor-args youtube:player_client=android_vr`, ou `web_embedded` quando aquele dá 403; `web` dava 403 no meio). `Wo0IgXnJnLI` (75 s) é obra no PR + depoimento estático, só X35 Pro. Os longos do X35 Pro (`0S-kAzlzVL8` detalhes, `rVtgn3qgzCg` cabine) são showroom com apresentador; o depoimento do X20 Pro (`ZBUDnZVCuIM`) é obra urbana e virou foto, não sprite (vídeo vertical: o sprite 4:3 ficaria com a máquina minúscula). O X10 (`eNNBFilJYUY`) só tem close de concha no barro, ilegível a 300 px.
- POST do orçamento — **código pronto e desligado (02/09)**. `render-pages.mjs` só emite `<meta name="plx-lead-endpoint">` quando o build recebe `LEAD_ENDPOINT=https://… npm run build`; com a meta presente, `postLead()` em `app.js` faz `fetch` POST JSON (`keepalive`, falha em silêncio) com os campos do funil + `origem`, `pagina`, `enviado_em`, e o WhatsApp continua sendo o caminho principal. Sem a env, nada muda no HTML nem no JS. Testado com Playwright interceptando o endpoint: 1 POST `application/json`, sucesso exibido, link do WhatsApp montado. A URL do Lambda de produção **não está no repo nem no clone do site antigo** (form com `action="#"`, JS de envio removido no recon) — ligar é decisão do Vitor: definir a env no ambiente de build.
- Carregadeira/dumper/rolo sem preço público — correto.

Vídeos brutos **não** estão no repo (baixados com `yt-dlp` no scratchpad da sessão). Para refazer: `ffmpeg -ss <t> -t 1.65 -i src.mp4 -vf "crop=1560:878:40:0,scale=1280:720,setpts=2*PTS,fps=30"` por tomada, `xfade` entre elas, `xfade` da cauda com a cabeça (0,6 s) e `trim=0.6` para o seam; VP9 crf 44 / H.264 crf 31 em 960×540 com `hqdn3d=3:2:4:3`.

---

## 10. Histórico recente (não desfazer)

0. (02/09) — onda GSAP: `src/js/motion.js`, hooks de vídeo/sprite no gerador condicionados a arquivo existir, CSS só transform/opacity. Um `linear-gradient` no bundle, zero `filter`.

1. `87b8910` — rebrand industrial (tokens, páginas, funil, schema).
2. `8899d1e` — CSS via `/css/app.css`, header ink, funil.
3. `dedcf49` — Vite em `0.0.0.0`.
4. `9ba08a5` — carrossel, type, ar, mobile.
5. `9a3a0fa` — strip de chrome dos cards.
6. `e4c1503` — Ver ficha texto, uma foto no PDP, cards 328px, filtros/finance/tabela quietos, nav curta, H1 novo.

Feedback de Vitor no meio: gostou **menos iOS**; pediu menos caixa, carrossel, mais mínimo, textos menos apertados, alinhamento mobile.

---

## 11. Prompt para o próximo agente

Cole isto no chat novo:

```
Continue o rebrand da PLX Brasil neste repo Vite MPA (não Next, não Tailwind, não Webflow).

Leia HANDOFF.md e GOVERNANCE.md primeiro.

Estado: site industrial estático, HTML gerado por scripts/render-pages.mjs, CSS em src/css → public/css/app.css. JS em src/js/app.js. Porta 43147 bind 0.0.0.0. Último commit e4c1503.

NÃO desfazer o chrome quieto (sem tiles brancos, sem botão no card, uma foto no PDP, nav curta).

Próxima onda — GSAP (gsap + ScrollTrigger), não Flowkit/Webflow:
1) Hero: drone view atrás do copy. Sem footage ainda → ken-burns/parallax leve no still yard-*.webp; deixar hook para video muted loop com poster. Um só gradiente (scrim).
2) Produtos: hover mostra o que a máquina faz via sprite WebP 8–12 frames (steps), lazy, 40–80KB, degrada para PNG. Mobile sem loop eterno. prefers-reduced-motion = estático.
3) Só transform/opacity. Zero blur, zero glass, zero iOS bounce.

Edite o gerador, não o HTML solto. npm run css && npm run render. Commite e suba. Verifique home, categoria, PDP, mobile.
```
