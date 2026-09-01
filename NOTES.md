# PLX Brasil · notas do clone

## Origem

- URL original: https://plxbrasil.com.br/
- Busca por código público: nenhuma implementação pública utilizável encontrada para `plxbrasil`.
- Fonte de verdade usada: HTML, CSS, JavaScript, XML e assets entregues pelo site público durante a recon.
- Licença: não declarada no site; trate os assets e a marca como proprietários.
- Modo: clone visual fiel da homepage, mantendo a marca e os textos públicos observados.

## Tecnologia e predição

- Site original: HTML/CSS/JavaScript estático, sem React/Vue/Next, sem canvas e sem WebGL.
- Clone: arquivo HTML autocontido, CSS inline, JavaScript local e imagens/fontes colhidas em `assets/`.
- Complexidade: L2 para a homepage; o site original possui múltiplas rotas de catálogo, conteúdo e políticas.
- Alta fidelidade: header, hero, imagens de máquinas, catálogo, banda escura/clara, vídeos, sobre, FAQ, avaliações, CTA, rodapé e breakpoints.
- Aproximações: o widget Google Reviews virou uma composição local; o player YouTube usa thumbnails locais para não depender de embed externo.
- Não clonado: rotas internas, envio real de leads, CMS, analytics, widget terceirizado e backend.
- Risco principal: autorização de uso da marca, textos, fotos e thumbnails antes de publicar fora deste projeto.

## Executar

```bash
python3 -m http.server 8123
```

Abra `http://localhost:8123/`.

## Alterações frente ao original

- Removidos Google Analytics, Google Tag Manager, Elfsight e demais scripts de terceiros.
- Recriadas localmente as interações de menu mobile, busca, seleção de produto, FAQ, player de vídeos, modal de orçamento e consentimento de cookies.
- Mantidos links externos de contato e redes sociais como ações explícitas.
- Todos os caminhos de imagem usados no HTML apontam para arquivos relativos colhidos em `assets/images/`.

## Comparação

| Área | Original | Clone | Evidência |
|---|---|---|---|
| Entrada | Hero fotográfico com título, WhatsApp e orçamento | Igual, com imagem local e CTA funcional | `RECON/screenshots/original-1440.png`, `clone-1440.png` |
| Catálogo | Cards por categoria e modelos carregados por XML | Cards por categoria e modelos embutidos no HTML | `index.html:447-460` |
| Vídeos | Player YouTube e rail vertical | Player local com thumbnails colhidos | `index.html:462-483` |
| Conteúdo claro | Sobre, FAQ e widget de reviews | Sobre, FAQ e reviews locais | `index.html:488-522` |
| Contato | Modal lead e WhatsApp | Modal local e links WhatsApp | `index.html:563-590` |
| Mobile | Header colapsado, cards compactos e barra WhatsApp | Mesmo princípio, sem rolagem horizontal | `RECON/screenshots/clone-390.png` |

## Score suportado por evidências

- Fonte: 5/5 — recon, source CSS/JS/XML e asset manifest completos.
- Estrutura: 5/5 — ordem e regiões principais preservadas.
- Visual: 4/5 — screenshot próxima; diff automático 0,1907 e score visual 2/5 por diferenças de proporção e conteúdo terceirizado.
- Interação: 4/5 — 14/22 ações automatizadas alteraram DOM/scroll/overlay; console sem erros.
- Responsivo: 4/5 — recon em 1440, 768 e 390 sem overflow horizontal observado.
- Funcional: 4/5 — navegação âncora, busca, filtros, FAQ, player e formulário local funcionando.
- Substituição de conteúdo: 2/5 — o objetivo atual é fidelidade à marca original, não conteúdo proprietário novo.
- Risco de publicação: 2/5 — license e permissão de mídia não foram declaradas.
- Total qualitativo: clone local de alta fidelidade para estudo/prototipação; não pronto para publicação comercial.

## Mapa de substituição

- Textos e labels: `index.html`, seção semântica e constantes no script final.
- Imagens de máquinas, logo e reviews: `assets/images/`.
- Fonte: `assets/fonts/fonts.css` e arquivos `.woff2` locais.
- Tokens visuais: bloco `:root` no início de `index.html`.
- URLs de contato e redes: links `wa.me`, Instagram, Facebook, YouTube e e-mail no HTML.

## Evidências geradas

- Recon original: `RECON/original-recon.json` e `RECON/screenshots/original-*.png`.
- Recon clone: `RECON/clone-recon.json` e `RECON/screenshots/clone-*.png`.
- Assets: `RECON/asset-manifest.json` e `assets/`.
- Rotas: `RECON/routes/original-route-map.json` e `RECON/routes-clone/clone-route-map.json`.
- Interações: `RECON/interactions/original-interactions.json` e `RECON/interactions-clone/clone-interactions.json`.
- Diferença visual: `RECON/visual-diff-1440.json` e `RECON/screenshots/visual-diff-1440.png`.
- Auditoria: `CLONE_AUDIT.md`; os gates de fidelidade passaram sem hard failures.

## Limitações

- O servidor `127.0.0.1` foi interceptado pelo proxy do ambiente; a validação final foi executada via `localhost` e `file://`.
- O runtime empacotado do Open Design abortou; os scripts foram executados com Node local compatível.
- O widget externo de avaliações e o envio real de formulário não são reproduzidos.
