import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const xmlPath =
  process.env.PLX_XML ||
  "/tmp/plxmaquinas/RECON/network/fixtures/src-data-modelos.xml-1fd25b1251.txt";

const xml = readFileSync(xmlPath, "utf8");

function slugifyName(product, name) {
  const map = {
    "Mini Escavadeira": "mini-escavadeira",
    "Mini Carregadeira": "mini-carregadeira",
    "Mini Dumper": "mini-dumper",
    "Mini Rolo Compactador": "mini-rolo-compactador",
  };
  const base = map[product] || product.toLowerCase().replace(/\s+/g, "-");
  const model = name.toLowerCase().replace(/\s+/g, "-");
  return `${base}-${model}`;
}

function categorySlug(product) {
  return {
    "Mini Escavadeira": "mini-escavadeira",
    "Mini Carregadeira": "mini-carregadeira",
    "Mini Dumper": "mini-dumper",
    "Mini Rolo Compactador": "mini-rolo-compactador",
  }[product];
}

function text(block, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i");
  const m = block.match(re);
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/\s+/g, " ").trim();
}

function collectSpecs(block) {
  const specs = [];
  for (let i = 1; i <= 40; i++) {
    const name = text(block, `especificacao_nome${i}`);
    if (!name) continue;
    specs.push({
      name,
      value: text(block, `especificacao_desc${i}`),
      category: text(block, `especificacao_cat${i}`) || "geral",
    });
  }
  return specs;
}

function collectHighlights(block) {
  const out = [];
  for (let i = 1; i <= 12; i++) {
    const v = text(block, `destaque_${i}`);
    if (v) out.push(v);
  }
  return out;
}

function specOf(specs, ...needles) {
  const lower = needles.map((n) => n.toLowerCase());
  return (
    specs.find((s) => lower.some((n) => s.name.toLowerCase().includes(n))) ||
    null
  );
}

const blocks = [...xml.matchAll(/<modelo>([\s\S]*?)<\/modelo>/g)].map((m) => m[1]);

const models = blocks.map((block) => {
  const product = text(block, "produto");
  const name = text(block, "nome");
  const specs = collectSpecs(block);
  const price = Number(text(block, "valor") || 0);
  const published = text(block, "preco_publicado") === "true";
  const image = text(block, "imagem").replace(/\.png$/i, "");
  const slug = slugifyName(product, name);

  return {
    id: Number(text(block, "id")),
    product,
    name,
    slug,
    href: `/${slug}/`,
    categorySlug: categorySlug(product),
    price,
    pricePublished: published,
    badge: text(block, "badge"),
    description: text(block, "descricao"),
    metaTitle: text(block, "meta-title"),
    metaDesc: text(block, "meta-desc"),
    image: `/images/models/${image}.webp`,
    imagePng: `/images/models/${image}.png`,
    highlights: collectHighlights(block),
    specs,
    keySpecs: pickKeySpecs(product, specs),
  };
});

function pickKeySpecs(product, specs) {
  if (product === "Mini Escavadeira") {
    return [
      specOf(specs, "prof. escavação", "profundidade máxima de escavação", "profundidade máxima de escavação") || specOf(specs, "escavação"),
      specOf(specs, "peso operacional"),
      specOf(specs, "marca (modelo)", "motor/marca", "motor"),
    ].filter(Boolean).slice(0, 3);
  }
  if (product === "Mini Carregadeira" || product === "Mini Dumper") {
    return [
      specOf(specs, "capacidade de carga"),
      specOf(specs, "volume da caçamba", "capacidade da caçamba"),
      specOf(specs, "peso operacional"),
    ].filter(Boolean).slice(0, 3);
  }
  return [
    specOf(specs, "peso operacional"),
    specOf(specs, "largura do rolo"),
    specOf(specs, "modelo/marca", "motor"),
  ].filter(Boolean).slice(0, 3);
}

const catalog = {
  generatedAt: "2026-09-01",
  whatsapp: "5548988728340",
  phoneDisplay: "(48) 98872-8340",
  phoneTel: "+5548988728340",
  email: "contato@plxbrasil.com.br",
  address: "R. Mário Mendonça, nº 20. São João Margem Direita — CEP 88702-802 — Tubarão/SC",
  categories: [
    {
      slug: "mini-escavadeira",
      name: "Mini escavadeira",
      product: "Mini Escavadeira",
      range: "1 a 6 toneladas",
      blurb: "De 1.650 mm a 4.159 mm de profundidade. Preço na tela. Ficha na mesa.",
    },
    {
      slug: "mini-carregadeira",
      name: "Mini carregadeira",
      product: "Mini Carregadeira",
      range: "até 790 kg de carga",
      blurb: "Movimentação de material em pátio, obra e propriedade rural.",
    },
    {
      slug: "mini-dumper",
      name: "Mini dumper",
      product: "Mini Dumper",
      range: "590 kg",
      blurb: "Transporte de terra, entulho e insumo em acesso estreito.",
    },
    {
      slug: "mini-rolo-compactador",
      name: "Mini rolo compactador",
      product: "Mini Rolo Compactador",
      range: "1.200 kg",
      blurb: "Compactação de base, reparo e pavimentação leve.",
    },
  ],
  models,
};

const outDir = join(root, "src/data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "catalog.json"), JSON.stringify(catalog, null, 2));
console.log(`Wrote ${models.length} models to src/data/catalog.json`);
