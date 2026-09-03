// Movimento industrial: só transform/opacity. Zero filter, zero blur, zero bounce.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCE = "(prefers-reduced-motion: reduce)";
const HOVER = "(hover: hover) and (pointer: fine)";
const PARALLAX_PX = 10; // teto 8–12px, industrial
const KEN_BURNS_S = 28;
const FALLBACK_LIFT_PX = -3;
const FRAME_S = 0.075; // 8 frames = 0,6s

function reducedMotion() {
  return window.matchMedia(REDUCE).matches;
}

// Hero: drone view atrás do copy. Vídeo se o gerador emitiu <video data-webm|data-mp4>;
// senão ken-burns lento no still. Copy e scrim não se mexem.
export function initHeroMotion() {
  const media = document.querySelector("[data-hero-motion]");
  if (!media) return;
  const hero = media.closest(".hero");
  const still = media.querySelector("img");
  const video = media.querySelector("video");

  const mm = gsap.matchMedia();
  mm.add(
    { reduce: REDUCE, wide: "(min-width: 721px)" },
    (ctx) => {
      const { reduce, wide } = ctx.conditions;
      if (reduce) return;

      let layer = still;
      if (video && wide) {
        // mobile ≤720px nunca baixa o vídeo (custo); poster é o still atual
        for (const [type, key] of [["video/webm", "webm"], ["video/mp4", "mp4"]]) {
          if (!video.dataset[key]) continue;
          const s = document.createElement("source");
          s.src = video.dataset[key];
          s.type = type;
          video.append(s);
        }
        video.hidden = false;
        video.addEventListener("playing", () => gsap.to(video, { opacity: 1, duration: 0.4, ease: "none" }), { once: true });
        video.play().catch(() => {});
        layer = video;
      }

      let drift = null;
      if (layer === still) {
        still.style.willChange = "transform";
        drift = gsap.to(still, {
          scale: 1.08,
          xPercent: -2,
          yPercent: 2,
          duration: KEN_BURNS_S,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

      // pausa tudo quando a hero sai da viewport (IO, não o trigger do parallax:
      // "top top" só fica ativo com a hero encostada no topo, e em scroll 0 ela está abaixo do header)
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          drift?.play();
          if (layer === video) video.play().catch(() => {});
        } else {
          drift?.pause();
          if (layer === video) video.pause();
        }
      });
      io.observe(hero);

      // parallax curto no scroll
      gsap.to(layer, {
        y: PARALLAX_PX,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        io.disconnect();
        still.style.willChange = "";
        if (video) video.pause();
      };
    }
  );
}

// Sprite: filmstrip horizontal de N frames, animado por xPercent + steps(N-1).
// Sem sprite (data-sprite ausente) o hover é um lift de 3px no PNG.
function loadStrip(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (img.src.endsWith(".webp")) img.src = src.replace(/\.webp$/, ".png"); // degrada pra PNG
      else reject(new Error(`sprite ${src}`));
    };
    img.src = src;
  });
}

export function initProductSprites() {
  const medias = [...document.querySelectorAll(".model-card__media, .pdp-hero__visual[data-sprite]")];
  if (!medias.length) return;
  // Mobile/touch: estático (opção A). Reduced-motion: frame 0 = o próprio PNG.
  if (!window.matchMedia(HOVER).matches || reducedMotion()) return;

  medias.forEach((media) => {
    const still = media.querySelector(":scope > img");
    const src = media.dataset.sprite;
    const frames = Math.max(2, parseInt(media.dataset.frames || "8", 10));
    let strip = null; // {box, img}
    let loading = null;
    let tween = null; // uma timeline ativa por card

    const mountStrip = () =>
      (loading ??= loadStrip(src).then((img) => {
        const box = document.createElement("span");
        box.className = "model-card__sprite";
        img.alt = "";
        img.style.width = `${frames * 100}%`;
        box.append(img);
        media.append(box);
        strip = { box, img };
        return strip;
      }));

    const play = () => {
      tween?.kill();
      if (!strip) return;
      strip.box.style.willChange = "transform, opacity";
      tween = gsap.timeline();
      tween
        .set(strip.img, { xPercent: 0 })
        .to(strip.box, { opacity: 1, duration: 0.1, ease: "none" }, 0)
        // o PNG some junto: o frame de IA não casa pixel a pixel com o recorte e a sobreposição dobra a imagem
        .to(still, { opacity: 0, duration: 0.1, ease: "none" }, 0)
        .to(strip.img, {
          xPercent: (-100 * (frames - 1)) / frames,
          duration: frames * FRAME_S,
          ease: `steps(${frames - 1})`,
          repeat: -1,
          repeatDelay: 0.4,
        }, 0);
    };

    const rest = () => {
      tween?.kill();
      tween = null;
      if (strip) {
        gsap.to(strip.box, { opacity: 0, duration: 0.15, ease: "none", onComplete: () => (strip.box.style.willChange = "") });
        gsap.set(strip.img, { xPercent: 0 });
      }
      gsap.to(still, { y: 0, opacity: 1, duration: 0.12, ease: "none", onComplete: () => (still.style.willChange = "") });
    };

    let hovering = false;
    media.addEventListener("pointerenter", () => {
      hovering = true;
      if (!src) {
        tween?.kill();
        still.style.willChange = "transform";
        tween = gsap.to(still, { y: FALLBACK_LIFT_PX, duration: 0.12, ease: "none" });
        return;
      }
      mountStrip().then(() => hovering && play()).catch(() => {});
    });
    media.addEventListener("pointerleave", () => {
      hovering = false;
      rest();
    });
  });
}

export function initReducedMotion() {
  // Troca de preferência em runtime: hero via gsap.matchMedia já reverte;
  // sprites só nascem no hover, então basta não montar novos.
  window.matchMedia(REDUCE).addEventListener("change", (e) => {
    if (e.matches) gsap.globalTimeline.getChildren().forEach((t) => t.kill());
  });
}
