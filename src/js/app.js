import catalog from "../data/catalog.json";

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function openDialog(el) {
  if (!el) return;
  if (typeof el.showModal === "function") el.showModal();
  document.body.classList.add("is-locked");
}

function closeDialog(el) {
  if (!el) return;
  el.close();
  document.body.classList.remove("is-locked");
}

function initNav() {
  const toggle = qs("[data-menu-toggle]");
  const nav = qs("[data-nav]");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function initSearch(catalog) {
  const input = qs("[data-search]");
  const box = qs("[data-search-results]");
  if (!input || !box) return;

  const render = (items) => {
    if (!items.length) {
      box.innerHTML = "<p>Nenhum modelo encontrado.</p>";
      box.classList.add("is-open");
      return;
    }
    box.innerHTML = items
      .slice(0, 8)
      .map(
        (m) =>
          `<a href="${m.href}">${m.product} ${m.name}</a>`
      )
      .join("");
    box.classList.add("is-open");
  };

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) {
      box.classList.remove("is-open");
      box.innerHTML = "";
      return;
    }
    render(
      catalog.models.filter((m) =>
        `${m.product} ${m.name}`.toLowerCase().includes(q)
      )
    );
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) box.classList.remove("is-open");
  });
}

function initQuote(catalog) {
  const modal = qs("#quote-modal");
  if (!modal) return;
  const form = qs("[data-quote-form]", modal);
  const steps = qsa("[data-step]", modal);
  const progress = qsa("[data-progress]", modal);
  let step = 1;

  const show = (n) => {
    step = n;
    steps.forEach((el) => {
      el.hidden = Number(el.dataset.step) !== n && el.dataset.step !== "success";
      if (el.dataset.step === "success") el.hidden = n !== "success";
    });
    progress.forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.progress) <= Number(n) || n === "success");
    });
  };

  qsa("[data-quote-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const model = btn.getAttribute("data-model") || "";
      const modelInput = qs("[name=modelo]", form);
      if (modelInput) modelInput.value = model;
      show(1);
      openDialog(modal);
    });
  });

  qs("[data-quote-close]", modal)?.addEventListener("click", () => closeDialog(modal));
  modal.addEventListener("close", () => document.body.classList.remove("is-locked"));

  qsa("[data-next]", modal).forEach((btn) => {
    btn.addEventListener("click", () => {
      if (step === 1 && !form.aplicacao.value) {
        form.aplicacao[0]?.focus();
        return;
      }
      if (step === 2 && !form.prazo.value) return;
      show(step + 1);
    });
  });

  qsa("[data-back]", modal).forEach((btn) => {
    btn.addEventListener("click", () => {
      if (step > 1) show(step - 1);
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const text = [
      `Olá, sou ${data.nome} de ${data.cidade}.`,
      `Aplicação: ${data.aplicacao}.`,
      `Prazo: ${data.prazo}.`,
      `Interesse: ${data.interesse}${data.modelo ? ` — ${data.modelo}` : ""}.`,
      data.telefone ? `Telefone: ${data.telefone}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const wa = `https://wa.me/${catalog.whatsapp}?text=${encodeURIComponent(text)}`;
    const success = qs("[data-step='success']", modal);
    const link = qs("[data-quote-wa]", modal);
    if (link) link.href = wa;
    steps.forEach((el) => {
      el.hidden = el.dataset.step !== "success";
    });
    progress.forEach((el) => el.classList.add("is-active"));
    step = "success";
    success?.removeAttribute("hidden");
  });
}

function initLegal() {
  const modal = qs("#legal-modal");
  if (!modal) return;
  qsa("[data-legal-open]").forEach((btn) =>
    btn.addEventListener("click", () => openDialog(modal))
  );
  qs("[data-legal-close]", modal)?.addEventListener("click", () => closeDialog(modal));
  modal.addEventListener("close", () => document.body.classList.remove("is-locked"));
}

function initTabs() {
  const tabs = qsa("[data-tab]");
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-tab");
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      qsa("[data-tab-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.getAttribute("data-tab-panel") === id);
      });
    });
  });
}

function initStickyBar() {
  const bar = qs("[data-pdp-bar]");
  const hero = qs("[data-pdp-hero]");
  if (!bar || !hero) return;
  document.body.classList.add("has-pdp-bar");
  const io = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  io.observe(hero);
}

function pmt(principal, monthlyRate, months) {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  const pow = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * pow) / (pow - 1);
}

function initFinance() {
  const form = qs("[data-finance]");
  if (!form) return;
  const price = Number(form.dataset.price || 0);
  const out = qs("[data-finance-result]", form);
  const update = () => {
    const down = Number(form.entrada.value || 0) / 100;
    const months = Number(form.prazo.value || 48);
    const rate = Number(form.taxa.value || 1.79) / 100;
    const financed = price * (1 - down);
    const value = pmt(financed, rate, months);
    out.textContent = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  };
  form.addEventListener("input", update);
  update();
}

function initVideo() {
  qsa("[data-yt]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-yt");
      const wrap = document.createElement("div");
      wrap.className = "video-lite";
      wrap.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="${btn.getAttribute("data-title") || "Vídeo PLX Brasil"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>`;
      btn.replaceWith(wrap);
    });
  });
}

function initFilters() {
  const buttons = qsa("[data-filter]");
  const cards = qsa("[data-model-card]");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter;
      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      cards.forEach((card) => {
        card.hidden = key !== "all" && card.dataset.range !== key;
      });
    });
  });
}

initNav();
initSearch(catalog);
initQuote(catalog);
initLegal();
initTabs();
initStickyBar();
initFinance();
initVideo();
initFilters();
