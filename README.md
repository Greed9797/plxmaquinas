# PLX Brasil — rebranding utilitário industrial

Protótipo do site [plxbrasil.com.br](https://plxbrasil.com.br) depois da auditoria de 01/09/2026: **transparência industrial** no lugar de glow, glass e gradiente.

Posicionamento: *máquina compacta com preço na tela, ficha na mesa e gente do outro lado do telefone.*

## O que este recorte entrega

- **Onda 1** — tokens ancorados no vermelho do logo (`#E52C28`), aresta viva (raio ≤ 4px), profundidade por borda, zero `backdrop-filter`, zero `filter: blur`, um único gradiente (scrim de hero).
- **Onda 2 (parcial)** — CSS em dois arquivos, fontes auto-hospedadas, hero em WebP 128–258 KB, vitrine de modelos no HTML (sem “Carregando produtos…”).
- **Onda 3** — condições legais em modal, barra fixa de PDP, comparador da linha, simulador de parcela referencial, funil de orçamento em 3 passos, `schema.org/Product` + `Offer`.
- **Onda 4 (parcial)** — Empresa sem cards 01/02/03 de missão/visão/valores; Suporte com chamado, SLA e peças; tom de voz com número antes do adjetivo.

O item nº 1 da auditoria — **fotografia real de máquina em operação** — continua em aberto. Os recortes PNG de catálogo ficam sobre fundo chapado, com legenda honesta na galeria.

## Páginas

| Rota | Função |
|---|---|
| `/` | Home |
| `/mini-escavadeira/` | Categoria + filtro por peso + comparador |
| `/mini-escavadeira-x65-pro/` (e demais modelos) | PDP |
| `/comparar/` | Tabela da linha |
| `/sobre/` | Empresa |
| `/suporte/` | Pós-venda |
| `/contato/` | Endereço, mapa, orçamento |

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://127.0.0.1:43147/`.

```bash
npm run build
npm run preview
```

`npm run data` relê `src/data/modelos.xml`. `npm run render` regenera o HTML.

## Stack

HTML estático gerado a partir do XML de produção, CSS próprio (`src/css/tokens.css` + `src/css/app.css`), JavaScript de hidratação. Sem CMS, sem checkout, sem widget Elfsight. O lead local monta a mensagem e cai no WhatsApp — o POST para o Lambda de produção não entra neste recorte.

## Governança

As oito regras inegociáveis estão em [`GOVERNANCE.md`](GOVERNANCE.md).
