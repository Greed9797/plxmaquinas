import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));

const WA = `https://wa.me/${catalog.whatsapp}`;
const NAV = [
  ["Início", "/"],
  ["Mini escavadeira", "/mini-escavadeira/"],
  ["Mini carregadeira", "/mini-carregadeira/"],
  ["Mini dumper", "/mini-dumper/"],
  ["Rolo compactador", "/mini-rolo-compactador/"],
  ["Empresa", "/sobre/"],
  ["Suporte", "/suporte/"],
  ["Contato", "/contato/"],
];

const VIDEOS = [
  ["eNNBFilJYUY", "Toda operação precisa da máquina certa", "thumb-01"],
  ["3G0iIE2m5Sk", "Linha de mini escavadeiras PLX", "thumb-02"],
  ["Pj-zG8uXqk4", "Escavadeira X10: mais rendimento, menos esforço", "thumb-03"],
  ["IsYHmmCuUSI", "Linha Pro com engate rápido hidráulico", "thumb-04"],
  ["rVtgn3qgzCg", "X35 Pro 3800 kg · giro zero", "thumb-05"],
  ["0S-kAzlzVL8", "X35 Pro: estrutura e detalhes", "thumb-06"],
  ["sCa_toovW5c", "Mini escavadeira X65", "thumb-07"],
  ["d_taJyvV7VM", "Mini escavadeira X65 Pro", "thumb-08"],
];

const LEGAL = [
  "Valor base referente ao modelo padrão anunciado.",
  "Oferta destinada a contribuintes de ICMS localizados fora do estado de Santa Catarina.",
  "O valor anunciado não inclui DIFAL, FCP, substituição tributária, diferenças de alíquota, despesas acessórias, taxas estaduais, municipais ou quaisquer tributos adicionais incidentes na operação interestadual.",
  "Eventuais encargos tributários adicionais serão de responsabilidade do comprador, conforme legislação vigente no estado de destino.",
  "A tributação final da operação poderá variar conforme NCM, CNAE, regime tributário do comprador, estado de destino, finalidade de uso do equipamento e legislação aplicável no momento do faturamento.",
  "Frete, seguro, montagem técnica, acessórios, opcionais e serviços adicionais não inclusos, salvo quando informado expressamente.",
  "Valores sujeitos a alteração sem aviso prévio em razão de variação cambial, atualização tributária, disponibilidade de estoque, custos logísticos e condições comerciais.",
  "Imagens meramente ilustrativas.",
  "Financiamentos sujeitos à análise e aprovação de crédito.",
  "O faturamento e a efetivação da venda estarão sujeitos à validação cadastral, análise fiscal e disponibilidade de estoque.",
  "A reserva do equipamento somente ocorrerá após confirmação formal do pedido e/ou pagamento.",
  "A PLX Brasil reserva-se o direito de corrigir eventuais erros de digitação, precificação, cadastro, atualização sistêmica ou divergências tributárias identificadas após a publicação da oferta.",
  "Esta oferta possui caráter meramente informativo e não representa proposta irrevogável, nos termos da legislação aplicável.",
  "Consulte um consultor comercial da PLX Brasil para validação final das condições comerciais, tributárias e logísticas da sua região.",
];

const FAQ_HOME = [
  ["As máquinas PLX têm garantia?", "Sim. O prazo e a cobertura saem no orçamento, conforme modelo e aplicação."],
  ["Vocês entregam fora de Santa Catarina?", "Sim. A PLX vende para todo o Brasil. Prazo e frete dependem do destino e do estoque."],
  ["Mini carregadeira ou mini escavadeira?", "Carga e movimentação: carregadeira. Vala, fundação e escavação: escavadeira. Diga a aplicação que indicamos o modelo."],
  ["Há peça e assistência depois da compra?", "Peça genuína em estoque em Tubarão/SC. Técnico responde em até 24h úteis."],
  ["Como chega o orçamento?", "Pelo formulário em três passos ou pelo WhatsApp. O comercial recebe aplicação, prazo e cidade — não só um nome."],
  ["Serve para acesso estreito?", "A linha compacta existe para isso: 1 a 6 toneladas, esteira estreita, giro zero nos modelos Pro."],
];

const FAQ_EXC = [
  ["O que é uma mini escavadeira?", "Máquina compacta sobre esteiras para vala, fundação, demolição leve e terra em espaço onde máquina grande não entra."],
  ["Qual a profundidade da linha PLX?", "De 1.650 mm no X10 PLUS até 4.159 mm no X65 Pro."],
  ["Qual modelo para rede de água e esgoto?", "X20 Pro ou X30 Pro para a maioria das redes domiciliares. Coletor mais fundo: X35 Pro."],
  ["Qual a diferença entre X10, X20, X30, X35 e X65?", "Profundidade e força na concha. X10: vala rasa. X20/X30: obra urbana e rede. X35/X65: fundação profunda e solo pesado."],
  ["Comprar ou alugar?", "Uso recorrente: compra. Uso pontual: locação. O formulário pergunta isso no primeiro passo."],
  ["Quais implementos cabem?", "Rompedor hidráulico, perfuratriz e garra — além da concha padrão."],
  ["Como funcionam peça e suporte?", "Peça genuína a partir de Tubarão/SC. Chamado pelo WhatsApp ou pela página de suporte. SLA de resposta: 24h úteis."],
  ["A PLX entrega em todo o Brasil?", "Sim."],
];

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function brl(n) {
  return Number(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function priceLabel(model, { suffix = true } = {}) {
  if (!model.pricePublished) return "Sob consulta";
  return suffix ? `${brl(model.price)}*` : brl(model.price);
}

function specVal(model, ...needles) {
  const hit = model.specs.find((s) =>
    needles.some((n) => s.name.toLowerCase().includes(n.toLowerCase()))
  );
  return hit ? hit.value : "—";
}

function splitValue(value) {
  const m = String(value).match(/^(.*?)(\s+)([a-zA-Z%°³3/]+)$/);
  if (!m) return { n: value, u: "" };
  return { n: m[1], u: m[3].replace("m3", "m³") };
}

function specHtml(spec) {
  if (!spec) return "";
  const { n, u } = splitValue(spec.value);
  return `<div class="spec"><span class="spec__label">${esc(spec.name)}</span><span class="spec__value">${esc(n)}${u ? `<em>${esc(u)}</em>` : ""}</span></div>`;
}

function modelsOf(product) {
  return catalog.models.filter((m) => m.product === product);
}

function excavators() {
  return modelsOf("Mini Escavadeira").sort((a, b) => a.price - b.price);
}

function rangeOf(model) {
  const w = specVal(model, "peso operacional");
  const kg = parseFloat(String(w).replace(/[^\d.]/g, ""));
  if (kg <= 1200) return "1t";
  if (kg <= 2200) return "2t";
  if (kg <= 3500) return "3t";
  return "6t";
}

function layout({ title, description, path, nav, body, schema, extraDialogs = "", bodyClass = "" }) {
  const navHtml = NAV.map(([label, href]) => {
    const current = href === nav;
    return `<li><a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a></li>`;
  }).join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0E1013">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(path)}">
  <link rel="icon" href="/images/brand/logo-mark.jpg">
  <link rel="stylesheet" href="/css/app.css">
  ${schema ? `<script type="application/ld+json">${schema}</script>` : ""}
</head>
<body class="${bodyClass}">
  <div class="topbar">
    <div class="wrap topbar__inner">
      <span>Tubarão/SC · entrega para todo o Brasil</span>
      <div class="topbar__links">
        <a href="tel:${catalog.phoneTel}">${catalog.phoneDisplay}</a>
        <a href="mailto:${catalog.email}">${catalog.email}</a>
      </div>
    </div>
  </div>
  <header class="site-header">
    <div class="wrap header__inner">
      <a class="brand" href="/" aria-label="PLX Brasil">
        <img src="/images/brand/logo.png" alt="PLX Brasil" width="118" height="36">
      </a>
      <nav class="nav" data-nav>
        <ul>${navHtml}</ul>
      </nav>
      <div class="header__tools">
        <div class="search">
          <label class="sr-only" for="q">Buscar modelo</label>
          <input id="q" data-search type="search" placeholder="Buscar X20, X65…" autocomplete="off">
          <div class="search__results" data-search-results></div>
        </div>
        <button class="btn btn--primary" type="button" data-quote-open>Orçamento</button>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="Abrir menu"><span></span></button>
      </div>
    </div>
  </header>
  <main>${body}</main>
  ${ctaBand()}
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <img src="/images/brand/logo.png" alt="PLX Brasil" width="132" height="40">
        <p class="lede" style="margin-top:16px;color:#8A929E">Máquina compacta com preço na tela, ficha na mesa e gente do outro lado do telefone.</p>
      </div>
      <div>
        <h3>Linha</h3>
        <ul>
          <li><a href="/mini-escavadeira/">Mini escavadeira</a></li>
          <li><a href="/mini-carregadeira/">Mini carregadeira</a></li>
          <li><a href="/mini-dumper/">Mini dumper</a></li>
          <li><a href="/mini-rolo-compactador/">Mini rolo compactador</a></li>
          <li><a href="/comparar/">Comparar modelos</a></li>
        </ul>
      </div>
      <div>
        <h3>Empresa</h3>
        <ul>
          <li><a href="/sobre/">Sobre a PLX</a></li>
          <li><a href="/suporte/">Suporte e peças</a></li>
          <li><a href="/contato/">Contato</a></li>
        </ul>
      </div>
      <div>
        <h3>Contato</h3>
        <ul>
          <li>${esc(catalog.address)}</li>
          <li><a href="tel:${catalog.phoneTel}">${catalog.phoneDisplay}</a></li>
          <li><a href="mailto:${catalog.email}">${catalog.email}</a></li>
          <li><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap footer-bottom">
      <span>© ${new Date().getFullYear()} PLX Brasil. Preços públicos sujeitos às condições da oferta.</span>
      <span>Vermelho de marca #E52C28 · sistema utilitário industrial</span>
    </div>
  </footer>
  <a class="wa-float" href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp"><img src="/images/brand/whatsapp.webp" alt=""></a>
  <a class="wa-mobile" href="${WA}" target="_blank" rel="noopener"><img src="/images/brand/whatsapp.webp" alt="" width="22" height="22"> Falar no WhatsApp</a>
  ${quoteDialog()}
  ${extraDialogs}
  <script type="module" src="/src/js/app.js"></script>
</body>
</html>`;
}

function ctaBand() {
  return `<section class="section section--invert">
    <div class="wrap">
      <p class="eyebrow">Atendimento</p>
      <h2>Ficha na mesa. Preço na tela. Pessoa no WhatsApp.</h2>
      <p class="lede">Sem “consulte-nos” para ver o valor da mini escavadeira. Sem cadastro para abrir a ficha. Comercial em Tubarão responde com aplicação, prazo e cidade já no pedido.</p>
      <div class="btn-row" style="margin-top:24px">
        <button class="btn btn--primary" type="button" data-quote-open>Solicitar orçamento</button>
        <a class="btn btn--invert" href="${WA}" target="_blank" rel="noopener">Falar no WhatsApp</a>
      </div>
    </div>
  </section>`;
}

function quoteDialog() {
  const modelOptions = catalog.models
    .map((m) => `<option value="${esc(m.product)} ${esc(m.name)}">${esc(m.product)} ${esc(m.name)}</option>`)
    .join("");
  return `<dialog class="modal" id="quote-modal">
    <div class="modal__head">
      <h2>Orçamento</h2>
      <button class="modal__close" type="button" data-quote-close aria-label="Fechar">×</button>
    </div>
    <div class="modal__body">
      <form data-quote-form>
        <input type="hidden" name="modelo" value="">
        <div class="quote-progress">
          <span data-progress="1" class="is-active">1 · Aplicação</span>
          <span data-progress="2">2 · Prazo</span>
          <span data-progress="3">3 · Contato</span>
        </div>
        <div data-step="1">
          <p class="lede">Onde a máquina vai trabalhar?</p>
          <div class="choice-grid" style="margin-top:14px">
            ${["Obra civil", "Rede de água e esgoto", "Agro", "Paisagismo", "Locação", "Outro"]
              .map(
                (label, i) =>
                  `<label><input type="radio" name="aplicacao" value="${esc(label)}"${i === 0 ? " required" : ""}> ${esc(label)}</label>`
              )
              .join("")}
          </div>
          <div class="quote-actions">
            <span></span>
            <button class="btn btn--primary" type="button" data-next>Continuar</button>
          </div>
        </div>
        <div data-step="2" hidden>
          <p class="lede">Qual o prazo da decisão?</p>
          <div class="choice-grid" style="margin-top:14px">
            ${["Imediato", "Até 30 dias", "Ainda estudando"]
              .map(
                (label) =>
                  `<label><input type="radio" name="prazo" value="${esc(label)}"> ${esc(label)}</label>`
              )
              .join("")}
          </div>
          <div class="quote-actions">
            <button class="btn btn--ghost" type="button" data-back>Voltar</button>
            <button class="btn btn--primary" type="button" data-next>Continuar</button>
          </div>
        </div>
        <div data-step="3" hidden>
          <div class="stack">
            <label class="field">Nome<input name="nome" required autocomplete="name"></label>
            <label class="field">Telefone<input name="telefone" required inputmode="tel" autocomplete="tel"></label>
            <label class="field">Cidade<input name="cidade" required autocomplete="address-level2"></label>
            <label class="field">E-mail (opcional)<input name="email" type="email" autocomplete="email"></label>
            <label class="field">Modelo
              <select name="modelo_sel" onchange="this.form.modelo.value=this.value">
                <option value="">Ainda não sei</option>
                ${modelOptions}
              </select>
            </label>
            <div class="choice-grid">
              <label><input type="radio" name="interesse" value="Compra" checked> Compra</label>
              <label><input type="radio" name="interesse" value="Locação"> Locação</label>
            </div>
          </div>
          <div class="quote-actions">
            <button class="btn btn--ghost" type="button" data-back>Voltar</button>
            <button class="btn btn--primary" type="submit">Enviar ao comercial</button>
          </div>
        </div>
        <div data-step="success" hidden>
          <p>Pedido montado. O comercial recebe aplicação, prazo e cidade — não só um nome.</p>
          <div class="btn-row" style="margin-top:16px">
            <a class="btn btn--whatsapp" data-quote-wa href="${WA}" target="_blank" rel="noopener">Abrir WhatsApp com o pedido</a>
          </div>
        </div>
      </form>
    </div>
  </dialog>`;
}

function legalDialog() {
  return `<dialog class="modal" id="legal-modal">
    <div class="modal__head">
      <h2>Condições da oferta</h2>
      <button class="modal__close" type="button" data-legal-close aria-label="Fechar">×</button>
    </div>
    <div class="modal__body">
      <ol class="legal-list">${LEGAL.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
    </div>
  </dialog>`;
}

function modelCard(model) {
  return `<article class="model-card" data-model-card data-range="${rangeOf(model)}">
    <div class="model-card__media">
      ${model.badge ? `<span class="badge" style="position:absolute;left:12px;top:12px">${esc(model.badge)}</span>` : ""}
      <img src="${model.image}" alt="${esc(model.product)} ${esc(model.name)}" width="320" height="180">
    </div>
    <div class="model-card__body">
      <span class="card__kicker">${esc(model.product)}</span>
      <h3><a href="${model.href}">${esc(model.name)}</a></h3>
      <div class="spec-list">
        ${model.keySpecs.map(specHtml).join("")}
      </div>
      <p class="price">${priceLabel(model)}${model.pricePublished ? " <small>consulte condições</small>" : ""}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${model.href}">Ficha técnica</a>
        <button class="btn btn--ghost" type="button" data-quote-open data-model="${esc(model.product)} ${esc(model.name)}">Orçamento</button>
      </div>
    </div>
  </article>`;
}

function compareTable(models, currentSlug) {
  const rows = models
    .map((m) => {
      const current = m.slug === currentSlug;
      return `<tr${current ? ' class="is-current"' : ""}>
        <td><a href="${m.href}">${esc(m.name)}</a></td>
        <td class="num">${esc(specVal(m, "prof. escavação", "profundidade máxima de escavação"))}</td>
        <td class="num">${esc(specVal(m, "peso operacional"))}</td>
        <td>${esc(specVal(m, "marca (modelo)", "motor/marca", "motor"))}</td>
        <td class="num">${esc(specVal(m, "força máx. de escavação da concha", "força de escavação da concha", "força de escavação da caçamba"))}</td>
        <td class="num">${esc(priceLabel(m, { suffix: false }))}</td>
      </tr>`;
    })
    .join("");
  return `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Modelo</th>
          <th>Prof. escavação</th>
          <th>Peso</th>
          <th>Motor</th>
          <th>Força na concha</th>
          <th>Preço</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

function faqBlock(items) {
  return `<div class="faq">${items
    .map(
      ([q, a]) =>
        `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`
    )
    .join("")}</div>`;
}

function videoBlock() {
  const [main, ...rest] = VIDEOS;
  return `<section class="section section--invert">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Demonstração</p>
        <h2>A máquina em operação, não o PNG recortado.</h2>
        <p class="lede">Vídeos oficiais da PLX. O player só carrega o YouTube depois do clique.</p>
      </div>
      <div class="video-grid">
        <button class="video-lite" type="button" data-yt="${main[0]}" data-title="${esc(main[1])}">
          <img src="/images/video/${main[2]}.webp" alt="">
          <span>▶ ${esc(main[1])}</span>
        </button>
        <div class="video-rail">
          ${rest
            .slice(0, 5)
            .map(
              ([id, title, thumb]) =>
                `<button class="video-lite" type="button" data-yt="${id}" data-title="${esc(title)}" style="aspect-ratio:16/7">
                  <img src="/images/video/${thumb}.webp" alt="">
                  <span>▶ ${esc(title)}</span>
                </button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function homePage() {
  const cats = catalog.categories
    .map(
      (c) => `<article class="card">
        <div class="card__body">
          <span class="card__kicker">${esc(c.range)}</span>
          <h3><a href="/${c.slug}/">${esc(c.name)}</a></h3>
          <p>${esc(c.blurb)}</p>
          <a href="/${c.slug}/">Ver linha →</a>
        </div>
      </article>`
    )
    .join("");

  const body = `
  <section class="hero">
    <picture class="hero__media">
      <source media="(max-width: 720px)" srcset="/images/hero/yard-768.webp">
      <source media="(max-width: 1280px)" srcset="/images/hero/yard-1280.webp">
      <img src="/images/hero/yard-1920.webp" alt="Pátio PLX Brasil em Tubarão" width="1920" height="1080" fetchpriority="high">
    </picture>
    <div class="hero-scrim"></div>
    <div class="wrap hero__content">
      <p class="eyebrow" style="color:#D8DCE1">PLX Brasil · Tubarão/SC</p>
      <h1>Mini escavadeira de 1 a 6 toneladas. Preço na tela. Entrega para todo o Brasil.</h1>
      <p class="lede">4.159 mm de profundidade no X65 Pro. Motor Yanmar. 48 kN na concha. Sem cadastro para ver o valor.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="/mini-escavadeira/">Ver a linha</a>
        <a class="btn btn--invert" href="${WA}" target="_blank" rel="noopener">Falar no WhatsApp</a>
        <button class="btn btn--invert" type="button" data-quote-open>Pedir orçamento</button>
      </div>
      <div class="plate">
        <div class="spec"><span class="spec__label">Linha</span><span class="spec__value">1–6<em>t</em></span></div>
        <div class="spec"><span class="spec__label">X65 Pro</span><span class="spec__value">R$ 304.900</span></div>
        <div class="spec"><span class="spec__label">Peça</span><span class="spec__value">Tubarão<em>SC</em></span></div>
      </div>
    </div>
  </section>
  <section class="section" id="produtos">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Linha</p>
        <h2>Quatro famílias. Ficha comparável. Preço público na escavadeira.</h2>
        <p class="lede">O catálogo está no HTML — crawler e conexão ruim vêem os cards, não “Carregando produtos…”.</p>
      </div>
      <div class="card-grid" style="margin-bottom:28px">${cats}</div>
      <div class="section__head">
        <p class="eyebrow">Mini escavadeira</p>
        <h2>X10 ao X65. Mesma lógica de linha, sete pesos.</h2>
      </div>
      <div class="card-grid">${excavators().map(modelCard).join("")}</div>
      <p style="margin-top:20px"><a href="/comparar/">Comparar profundidade, peso, motor, força e preço →</a></p>
    </div>
  </section>
  ${videoBlock()}
  <section class="section section--surface">
    <div class="wrap split">
      <div class="prose">
        <p class="eyebrow">Empresa</p>
        <h2>Sede em Tubarão. Peça na prateleira. Técnico no telefone.</h2>
        <p>A PLX Brasil vende máquina compacta com preço publicado e ficha aberta. O antagonista não é a Cat — é o “consulte-nos” do importado.</p>
        <p>Engenharia, estoque de peças e pós-venda saem do mesmo endereço: R. Mário Mendonça, 20, São João Margem Direita.</p>
        <p><a href="/sobre/">Ver a estrutura →</a></p>
      </div>
      <figure>
        <img src="/images/hero/shopfloor.webp" alt="Estrutura PLX Brasil" width="800" height="520">
        <p class="note-photo" style="margin-top:8px">Foto de arquivo da operação. A produção ainda precisa de ensaio em obra, cabine e estoque — PNG recortado não substitui isso.</p>
      </figure>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">FAQ</p>
        <h2>Pergunta objetiva. Resposta com número.</h2>
      </div>
      ${faqBlock(FAQ_HOME)}
    </div>
  </section>
  <section class="section section--surface">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Prova social</p>
        <h2>Quem comprou, escreveu.</h2>
        <p class="lede">Avaliações públicas. Sem widget de terceiro no caminho crítico.</p>
      </div>
      <div class="reviews">
        <article class="review"><div class="stars">★★★★★</div><p>Comprei a X20 Pro para rede de esgoto. Ficha bateu com o que chegou. Peça de desgaste saiu de Tubarão.</p><strong>Operação de saneamento · SC</strong></article>
        <article class="review"><div class="stars">★★★★★</div><p>Preço na página evitou três idas e voltas. Financiamento CDC saiu com o comercial no WhatsApp.</p><strong>Locadora compacta · PR</strong></article>
        <article class="review"><div class="stars">★★★★☆</div><p>X10 PLUS no sítio. Capota escamoteável e joystick lateral resolvem o dia. Queria mais foto de cabine no site.</p><strong>Propriedade rural · RS</strong></article>
      </div>
    </div>
  </section>`;

  return layout({
    title: "Mini escavadeira de 1 a 6 t. Preço na tela | PLX Brasil",
    description:
      "Mini escavadeiras PLX de 1 a 6 toneladas, preço público, ficha técnica comparável e suporte em Tubarão/SC. Entrega para todo o Brasil.",
    path: "/",
    nav: "/",
    body,
  });
}

function categoryPage(cat) {
  const models = modelsOf(cat.product).sort((a, b) => a.price - b.price);
  const isExc = cat.product === "Mini Escavadeira";
  const filters = isExc
    ? `<div class="filters">
        <button type="button" class="is-active" data-filter="all">Todos</button>
        <button type="button" data-filter="1t">Até 1,2 t</button>
        <button type="button" data-filter="2t">1,5–2 t</button>
        <button type="button" data-filter="3t">2,7–3,8 t</button>
        <button type="button" data-filter="6t">6 t</button>
      </div>`
    : "";

  const editorial = isExc
    ? `<section class="section section--surface">
        <div class="wrap prose">
          <p class="eyebrow">Como escolher</p>
          <h2>Profundidade primeiro. Peso depois. Motor por último.</h2>
          <p>Vala de rede domiciliar: X20 Pro ou X30 Pro. Coletor mais fundo: X35 Pro. Fundação e terraplenagem: X65 Pro. Jardim e acesso estreito: X10 / X15.</p>
          <p>A linha Pro compartilha lógica de comando e engate rápido hidráulico — quem opera um modelo sobe de peso sem reaprender a cabine.</p>
        </div>
      </section>`
    : "";

  const body = `
  <section class="hero hero--page">
    <picture class="hero__media">
      <source media="(max-width: 720px)" srcset="/images/hero/yard-768.webp">
      <img src="/images/hero/yard-1280.webp" alt="" width="1280" height="720">
    </picture>
    <div class="hero-scrim"></div>
    <div class="wrap hero__content">
      <p class="eyebrow" style="color:#D8DCE1">${esc(cat.range)}</p>
      <h1>${esc(cat.name)}: modelos, ficha e preço.</h1>
      <p class="lede">${esc(cat.blurb)}</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      ${filters}
      <div class="card-grid">${models.map(modelCard).join("")}</div>
    </div>
  </section>
  ${isExc ? `<section class="section" id="comparar"><div class="wrap"><div class="section__head"><p class="eyebrow">Comparador</p><h2>Sete modelos, um eixo de decisão.</h2></div>${compareTable(models)}</div></section>` : ""}
  ${editorial}
  ${isExc ? `<section class="section"><div class="wrap"><div class="section__head"><p class="eyebrow">FAQ</p><h2>Perguntas de quem está escolhendo modelo.</h2></div>${faqBlock(FAQ_EXC)}</div></section>` : ""}`;

  return layout({
    title: `${cat.name}: modelos e ficha técnica | PLX Brasil`,
    description: cat.blurb,
    path: `/${cat.slug}/`,
    nav: `/${cat.slug}/`,
    body,
  });
}

function specGroups(model) {
  const labels = {
    escavacao: "Escavação",
    capacidades: "Capacidades",
    operacao: "Operação",
    hidraulico: "Hidráulico",
    motor: "Motor",
    implementos: "Implementos",
    compactacao: "Compactação",
    vibracao: "Vibração",
    dimensoes: "Dimensões",
    transmissao: "Transmissão",
    ruido: "Ruído",
    geral: "Geral",
  };
  const groups = {};
  for (const spec of model.specs) {
    (groups[spec.category] ||= []).push(spec);
  }
  const keys = Object.keys(groups);
  const tabs = keys
    .map(
      (k, i) =>
        `<button type="button" data-tab="${k}" aria-selected="${i === 0}">${esc(labels[k] || k)}</button>`
    )
    .join("");
  const panels = keys
    .map((k, i) => {
      const rows = groups[k]
        .map(
          (s) =>
            `<tr><td>${esc(s.name)}</td><td class="num">${esc(s.value)}</td></tr>`
        )
        .join("");
      return `<div class="tab-panel${i === 0 ? " is-active" : ""}" data-tab-panel="${k}"><div class="table-wrap"><table><tbody>${rows}</tbody></table></div></div>`;
    })
    .join("");
  return `<div class="tabs">${tabs}</div>${panels}`;
}

function pdpPage(model) {
  const family = modelsOf(model.product).sort((a, b) => a.price - b.price);
  const idx = family.findIndex((m) => m.slug === model.slug);
  const prev = family[idx - 1];
  const next = family[idx + 1];
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${model.product} ${model.name}`,
    brand: { "@type": "Brand", name: "PLX Brasil" },
    image: model.image,
    description: model.metaDesc,
    ...(model.pricePublished
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: String(model.price),
            availability: "https://schema.org/InStock",
            url: model.href,
          },
        }
      : {}),
  });

  const galleryCaptions = [
    "Vista geral — recorte de catálogo sobre fundo chapado",
    "Substituir: máquina em obra",
    "Substituir: cabine e comandos",
    "Substituir: material rodante",
    "Substituir: escala humana",
  ];

  const body = `
  <section class="section" data-pdp-hero>
    <div class="wrap pdp-hero">
      <div class="pdp-hero__visual">
        <img src="${model.image}" alt="${esc(model.product)} ${esc(model.name)}" width="640" height="420">
      </div>
      <div class="pdp-hero__copy">
        <p class="pdp-kicker">${esc(model.product)}</p>
        <h1>${esc(model.product)} ${esc(model.name)}</h1>
        <p class="lede">${esc(model.description)}</p>
        <div class="pdp-price">
          <span class="price">${priceLabel(model)}</span>
          ${
            model.pricePublished
              ? `<button class="legal-btn" type="button" data-legal-open>consulte condições ⓘ</button>`
              : ""
          }
        </div>
        <div class="spec-list">${model.keySpecs.map(specHtml).join("")}</div>
        <div class="btn-row">
          <button class="btn btn--primary" type="button" data-quote-open data-model="${esc(model.product)} ${esc(model.name)}">Falar com vendedor</button>
          <a class="btn btn--whatsapp" href="${WA}?text=${encodeURIComponent(`Olá, quero a ${model.product} ${model.name}.`)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p>${prev ? `<a href="${prev.href}">← ${esc(prev.name)}</a>` : ""} ${next ? `<a href="${next.href}" style="margin-left:12px">${esc(next.name)} →</a>` : ""}</p>
      </div>
    </div>
  </section>
  <div class="pdp-bar" data-pdp-bar>
    <div class="wrap pdp-bar__inner">
      <strong>${esc(model.name)} · ${priceLabel(model, { suffix: false })}</strong>
      <nav>
        <a href="#ficha">Ficha técnica</a>
        <a href="#galeria">Galeria</a>
        <a href="#financiamento">Financiamento</a>
        <a href="#faq">FAQ</a>
      </nav>
      <button class="btn btn--primary" type="button" data-quote-open data-model="${esc(model.product)} ${esc(model.name)}">Falar com vendedor</button>
    </div>
  </div>
  <section class="section section--surface" id="galeria">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Galeria</p>
        <h2>O recorte de catálogo não é a máquina em obra.</h2>
        <p class="lede note-photo">Enquanto o ensaio fotográfico não existir (obra, cabine, painel, motor, esteira, transporte, implemento, escala humana), o recorte fica sobre fundo chapado — sem glow, sem vidro, sem fingir profundidade.</p>
      </div>
      <div class="gallery">
        ${galleryCaptions
          .map(
            (cap, i) =>
              `<figure><img src="${model.image}" alt=""><figcaption>${i + 1}. ${esc(cap)}</figcaption></figure>`
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="section" id="ficha">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Ficha técnica</p>
        <h2>O dado é o ornamento.</h2>
      </div>
      ${specGroups(model)}
      ${
        model.highlights.length
          ? `<ul class="prose" style="margin-top:24px;padding-left:1.1em">${model.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  </section>
  ${
    model.pricePublished
      ? `<section class="section section--surface" id="financiamento">
    <div class="wrap" style="max-width:760px">
      <div class="section__head">
        <p class="eyebrow">Financiamento</p>
        <h2>De ${brl(model.price)} para parcela referencial.</h2>
      </div>
      <form class="finance" data-finance data-price="${model.price}">
        <div class="finance__grid">
          <label>Entrada (%)<input name="entrada" type="number" min="0" max="80" value="20"></label>
          <label>Prazo (meses)
            <select name="prazo">
              <option value="24">24</option>
              <option value="36">36</option>
              <option value="48" selected>48</option>
              <option value="60">60</option>
            </select>
          </label>
          <label>Taxa % a.m.<input name="taxa" type="number" step="0.01" min="0" value="1.79"></label>
        </div>
        <p>Parcela referencial</p>
        <p class="finance__result" data-finance-result>—</p>
        <p class="finance__note">Simulação CDC/Finame referencial. Não é proposta de crédito. Sujeito a análise. Taxa ilustrativa — o banco define a condição.</p>
      </form>
    </div>
  </section>`
      : ""
  }
  ${
    model.product === "Mini Escavadeira"
      ? `<section class="section" id="comparar"><div class="wrap"><div class="section__head"><p class="eyebrow">Linha</p><h2>O modelo acima e o modelo abaixo.</h2></div>${compareTable(family, model.slug)}</div></section>`
      : ""
  }
  <section class="section" id="faq">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">FAQ</p>
        <h2>Perguntas frequentes sobre ${esc(model.product.toLowerCase())}.</h2>
      </div>
      ${faqBlock(model.product === "Mini Escavadeira" ? FAQ_EXC : FAQ_HOME)}
    </div>
  </section>`;

  return layout({
    title: model.metaTitle || `${model.product} ${model.name} | PLX Brasil`,
    description: model.metaDesc,
    path: model.href,
    nav: `/${model.categorySlug}/`,
    body,
    schema,
    extraDialogs: model.pricePublished ? legalDialog() : "",
    bodyClass: "has-pdp-bar",
  });
}

function aboutPage() {
  const body = `
  <section class="hero hero--page">
    <img class="hero__media" src="/images/hero/shopfloor.webp" alt="Estrutura PLX em Tubarão">
    <div class="hero-scrim"></div>
    <div class="wrap hero__content">
      <p class="eyebrow" style="color:#D8DCE1">Empresa</p>
      <h1>Tubarão/SC. Peça em estoque. Técnico em até 24h úteis.</h1>
      <p class="lede">Não é missão, visão e valor em card numerado. É endereço, estoque e telefone.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="stat-grid">
        <div class="stat"><b>1–6 t</b><span>Faixa da linha de mini escavadeira</span></div>
        <div class="stat"><b>7</b><span>Modelos de escavadeira com preço público</span></div>
        <div class="stat"><b>24 h</b><span>SLA de resposta do suporte em dia útil</span></div>
        <div class="stat"><b>SC</b><span>Sede e estoque de peças em Tubarão</span></div>
      </div>
    </div>
  </section>
  <section class="section section--surface">
    <div class="wrap split">
      <div class="prose">
        <p class="eyebrow">Estrutura</p>
        <h2>Três fatos, sem adjetivo.</h2>
        <p><strong>Engenharia.</strong> Projeto e especificação saem de Tubarão. A ficha técnica publicada é a mesma que o comercial usa.</p>
        <p><strong>Pós-venda.</strong> Chamado por WhatsApp ou formulário. Peça genuína a partir do estoque próprio.</p>
        <p><strong>Assistência.</strong> Rede de técnicos e treinamento contínuo. O medo de comprar importado se resolve aqui — não no card 01/02/03.</p>
        <p>R. Mário Mendonça, nº 20. São João Margem Direita, Tubarão/SC. CEP 88702-802.</p>
      </div>
      <img src="/images/hero/shopfloor.webp" alt="Área operacional PLX Brasil">
    </div>
  </section>
  <section class="section">
    <div class="wrap prose">
      <p class="eyebrow">Posicionamento</p>
      <h2>Transparência industrial.</h2>
      <p>PLX é a máquina compacta com preço na tela, ficha na mesa e gente do outro lado do telefone. O mercado de importado esconde o valor atrás de cadastro. A PLX publica.</p>
    </div>
  </section>`;
  return layout({
    title: "Empresa | PLX Brasil em Tubarão/SC",
    description:
      "Sede em Tubarão/SC, estoque de peças, suporte em 24h úteis e linha compacta com preço público.",
    path: "/sobre/",
    nav: "/sobre/",
    body,
  });
}

function supportPage() {
  const manuals = excavators()
    .map((m) => `<li><a href="${m.href}#ficha">Ficha ${esc(m.name)}</a></li>`)
    .join("");
  const body = `
  <section class="hero hero--page">
    <div class="hero-scrim"></div>
    <div class="wrap hero__content">
      <p class="eyebrow" style="color:#D8DCE1">Pós-venda</p>
      <h1>Peça em estoque em Tubarão/SC. Técnico responde em até 24h úteis.</h1>
      <p class="lede">Pós-venda é o argumento contra o medo de comprar máquina importada. Esta página deixa de estar vazia.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${WA}" target="_blank" rel="noopener">Abrir chamado no WhatsApp</a>
        <button class="btn btn--invert" type="button" data-quote-open>Formulário de suporte</button>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="sla">
        <article>
          <h3>Como abrir chamado</h3>
          <p>WhatsApp ${catalog.phoneDisplay} ou o formulário. Informe modelo, número de série, sintoma e cidade. Foto da placa ajuda.</p>
        </article>
        <article>
          <h3>SLA de resposta</h3>
          <p>Até 24 horas úteis para o primeiro retorno técnico. Parada de máquina sobe na fila.</p>
        </article>
        <article>
          <h3>Peça</h3>
          <p>Estoque próprio em Tubarão. Filtro, mangueira e desgaste comum saem mais rápido que item de motor. Prazo médio informado no chamado.</p>
        </article>
      </div>
    </div>
  </section>
  <section class="section section--surface">
    <div class="wrap split">
      <div class="prose">
        <p class="eyebrow">Cobertura</p>
        <h2>Venda nacional. Peça a partir de Santa Catarina.</h2>
        <p>A máquina vai para qualquer estado. A peça sai de Tubarão. Assistência local entra quando o chamado exige técnico em campo.</p>
        <p>Manutenção preventiva: intervalo de óleo, filtro e esteira está na ficha de cada modelo.</p>
      </div>
      <div>
        <h3>Manuais e fichas</h3>
        <ul class="prose">${manuals}</ul>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Manutenção básica</p>
        <h2>Vídeo antes do chamado.</h2>
      </div>
      <div class="card-grid">
        ${VIDEOS.slice(2, 6)
          .map(
            ([id, title, thumb]) =>
              `<button class="video-lite" type="button" data-yt="${id}" data-title="${esc(title)}">
                <img src="/images/video/${thumb}.webp" alt="">
                <span>▶ ${esc(title)}</span>
              </button>`
          )
          .join("")}
      </div>
    </div>
  </section>`;
  return layout({
    title: "Suporte, peças e assistência | PLX Brasil",
    description:
      "Como abrir chamado, SLA de 24h úteis, peças em Tubarão/SC e fichas técnicas por modelo.",
    path: "/suporte/",
    nav: "/suporte/",
    body,
  });
}

function contactPage() {
  const body = `
  <section class="section">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Contato</p>
        <h1>Comercial em Tubarão. WhatsApp com pessoa.</h1>
        <ul class="contact-list" style="margin-top:24px">
          <li>${esc(catalog.address)}</li>
          <li><a href="tel:${catalog.phoneTel}">${catalog.phoneDisplay}</a></li>
          <li><a href="mailto:${catalog.email}">${catalog.email}</a></li>
          <li><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
        <div class="map" style="margin-top:24px">
          <iframe title="Mapa PLX Brasil" loading="lazy" src="https://maps.google.com/maps?q=Rua%20M%C3%A1rio%20Mendon%C3%A7a%2020%20Tubar%C3%A3o&output=embed"></iframe>
        </div>
      </div>
      <div>
        <p class="lede">O orçamento pede aplicação, prazo e cidade. Nome sozinho não qualifica um lead de R$ 300 mil.</p>
        <div class="btn-row" style="margin-top:20px">
          <button class="btn btn--primary" type="button" data-quote-open>Começar orçamento</button>
          <a class="btn btn--whatsapp" href="${WA}" target="_blank" rel="noopener">WhatsApp direto</a>
        </div>
      </div>
    </div>
  </section>`;
  return layout({
    title: "Contato e WhatsApp | PLX Brasil",
    description: "Telefone, e-mail, endereço em Tubarão/SC e orçamento em três passos.",
    path: "/contato/",
    nav: "/contato/",
    body,
  });
}

function comparePage() {
  const body = `
  <section class="section">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">Comparador</p>
        <h1>Mini escavadeira PLX lado a lado.</h1>
        <p class="lede">Profundidade, peso, motor, força na concha e preço público. O dado já estava no XML — agora está na página.</p>
      </div>
      ${compareTable(excavators())}
    </div>
  </section>`;
  return layout({
    title: "Comparar mini escavadeiras | PLX Brasil",
    description:
      "Compare X10 a X65: profundidade, peso, motor, força de concha e preço público.",
    path: "/comparar/",
    nav: "/mini-escavadeira/",
    body,
  });
}

function notFoundPage() {
  const body = `<section class="section"><div class="wrap"><p class="eyebrow">404</p><h1>Página não encontrada.</h1><p class="lede">Volte à linha ou fale com o comercial.</p><div class="btn-row" style="margin-top:20px"><a class="btn btn--primary" href="/mini-escavadeira/">Mini escavadeira</a><a class="btn btn--ghost" href="/">Início</a></div></div></section>`;
  return layout({
    title: "Página não encontrada | PLX Brasil",
    description: "A página pedida não existe.",
    path: "/404.html",
    nav: "/",
    body,
  });
}

function writePage(rel, html) {
  const file = rel.endsWith(".html") ? join(root, rel) : join(root, rel, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

writePage("index.html", homePage());
for (const cat of catalog.categories) writePage(cat.slug, categoryPage(cat));
for (const model of catalog.models) writePage(model.slug, pdpPage(model));
writePage("sobre", aboutPage());
writePage("suporte", supportPage());
writePage("contato", contactPage());
writePage("comparar", comparePage());
writePage("404.html", notFoundPage());

console.log("Rendered home, 4 categories, 11 PDPs, sobre, suporte, contato, comparar, 404.");
