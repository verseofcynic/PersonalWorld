(() => {
  const D = window.DATA, P = D.profile;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cats = (a, k = "category") => [...new Set((a || []).map((x) => x[k]).filter(Boolean))];

  /* ---------- image system: local, remote, "placeholder:Label|hue", fallback ---------- */
  const ph = (spec) => {
    const [t, h] = String(spec).replace("placeholder:", "").split("|");
    const hue = +h || [...t].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    const label = t.replace(/[<>&'"]/g, "");
    return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${hue},28%,26%)'/><stop offset='1' stop-color='hsl(${(hue + 40) % 360},30%,12%)'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><text x='400' y='295' fill='rgba(255,255,255,.6)' font-family='sans-serif' font-size='30' text-anchor='middle'>${label}</text><text x='400' y='340' fill='rgba(255,255,255,.35)' font-family='sans-serif' font-size='17' text-anchor='middle'>PLACEHOLDER IMAGE</text></svg>`);
  };
  const src = (s) => (!s ? ph("No image") : s.startsWith("placeholder:") ? ph(s) : s);
  const img = (s, alt, eager) => `<img src="${esc(src(s))}" alt="${esc(alt)}" data-alt="${esc(alt)}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t.tagName === "IMG" && !t.dataset.f) { t.dataset.f = 1; t.src = ph(t.dataset.alt || "Image missing"); }
  }, true);
  const ext = (href, label, cls = "btn") => href ? `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : "";
  const badges = (a) => a && a.length ? `<div class="badges">${a.map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>` : "";
  const bar = (id, list, cur) => list.length > 1 ? `<div class="filters" role="group" aria-label="Filter">${["All", ...list].map((c) => `<button data-f="${id}" data-v="${esc(c)}" aria-pressed="${c === cur}">${esc(c)}</button>`).join("")}</div>` : "";
  const head = (c) => `<header class="sh reveal">${c.kicker ? `<p class="k">${esc(c.kicker)}</p>` : ""}<h2 id="h-${esc(c.id)}">${esc(c.title)}</h2>${c.intro ? `<p class="mu">${esc(c.intro)}</p>` : ""}</header>`;
  const more = (id, shown, total) => shown < total ? `<button class="btn more" data-more="${id}">Show more (${total - shown})</button>` : "";

  /* ---------- state + lightbox ---------- */
  const S = { skills: { c: "All" }, projects: { c: "All", n: 6 }, photos: { c: "All", n: 12 }, travel: { c: "All", n: 6 } };
  const lb = $("#lb"); let L = { list: [], i: 0 };
  const lbShow = () => {
    const it = L.list[L.i]; if (!it) return;
    $("#lbImg").src = src(it.image); $("#lbImg").alt = it.title || "";
    $("#lbCap").innerHTML = [it.title && `<strong>${esc(it.title)}</strong>`, [it.location, it.date].filter(Boolean).map(esc).join(" · "), it.description && esc(it.description)].filter(Boolean).join("<br>");
  };
  const lbOpen = (list, i) => { L = { list, i }; lbShow(); lb.showModal(); };
  const lbStep = (d) => { L.i = (L.i + d + L.list.length) % L.list.length; lbShow(); };
  $(".lb-x").onclick = () => lb.close(); $(".lb-p").onclick = () => lbStep(-1); $(".lb-n").onclick = () => lbStep(1);
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") lbStep(-1); if (e.key === "ArrowRight") lbStep(1); });
  const gal = (arr, title) => arr && arr.length ? `<div class="mas" data-gal>${arr.map((g, i) => `<figure><button data-gi="${i}" aria-label="Open photo ${i + 1}">${img(g, `${title} photo ${i + 1}`)}</button></figure>`).join("")}</div>` : "";
  let galList = [];

  /* ---------- map (pins from data; coordinate grid, no map API needed) ---------- */
  const mapHtml = (items) => {
    const pts = items.filter((d) => d.coordinates); if (!pts.length) return "";
    const la = pts.map((d) => d.coordinates.latitude), lo = pts.map((d) => d.coordinates.longitude);
    let a0 = Math.min(...la), a1 = Math.max(...la), o0 = Math.min(...lo), o1 = Math.max(...lo);
    const pad = Math.max(3, (a1 - a0) * .25, (o1 - o0) * .25); a0 -= pad; a1 += pad; o0 -= pad; o1 += pad;
    const X = (o) => (o - o0) / (o1 - o0) * 100, Y = (a) => (a1 - a) / (a1 - a0) * 100;
    const step = Math.max(a1 - a0, o1 - o0) > 40 ? 10 : Math.max(a1 - a0, o1 - o0) > 14 ? 5 : 2;
    let g = ""; for (let o = Math.ceil(o0 / step) * step; o < o1; o += step) g += `<line x1="${X(o)}" y1="0" x2="${X(o)}" y2="100"/>`;
    for (let a = Math.ceil(a0 / step) * step; a < a1; a += step) g += `<line x1="0" y1="${Y(a)}" x2="100" y2="${Y(a)}"/>`;
    return `<div class="map reveal"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${g}</svg>${pts.map((d) => `<button class="pin" style="left:${X(d.coordinates.longitude)}%;top:${Y(d.coordinates.latitude)}%" data-pin="${esc(d.id)}" aria-pressed="false" aria-label="${esc(d.name)}"></button>`).join("")}</div><div class="mapcard" id="mapcard" aria-live="polite">Select a pin to preview a destination.</div>`;
  };

  /* ---------- section renderers: return "" when there is nothing to show ---------- */
  const R = {
    hero(c, i, all) {
      const next = all[i + 1]?.id || "";
      return `<section class="hero" id="home"><div class="hero-img" id="parallax">${img(P.heroImage || P.profileImage, P.name, true)}</div><div class="wrap hero-in">
        <p class="k">${esc(P.greeting)}</p><h1>${esc(P.name)}</h1><p class="roles">${esc((P.roles || []).join(" • "))}</p>
        <p class="tag">${(P.taglines || []).map(esc).join("<br>")}</p><p class="loc">${esc(P.location)}</p>
        <div class="cta">${(P.cta || []).map((b) => `<a class="btn ${b.primary ? "p" : ""}" href="#/s/${esc(b.target)}">${esc(b.label)}</a>`).join("")}</div></div>
        ${next ? `<a class="scroll" href="#/s/${esc(next)}" aria-label="Scroll down">↓</a>` : ""}</section>`;
    },
    who(c) {
      if (!P.whoami?.length) return "";
      return `${head({ ...c, intro: c.intro ?? P.introduction })}<div class="who">${P.whoami.map((w) => `<article class="card reveal"><span class="ic" aria-hidden="true">${esc(w.icon)}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p>${w.image ? img(w.image, w.title) : ""}</article>`).join("")}</div>`;
    },
    skills(c) {
      const all = D.skills || []; if (!all.length) return "";
      const list = S.skills.c === "All" ? all : all.filter((s) => s.category === S.skills.c);
      return `${head(c)}${bar("skills", cats(all), S.skills.c)}<div class="grid">${list.map((s) => `<a class="card sk reveal" href="#/skills/${esc(s.id)}"><div class="im">${img(s.image, s.title)}</div><div class="b"><span class="ic" aria-hidden="true">${esc(s.icon || "")}</span> <span class="mu">${esc(s.category)}</span><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></div></a>`).join("")}</div>`;
    },
    stats(c) {
      const src2 = { skills: D.skills, travel: D.travel, photos: D.photography, projects: D.projects };
      return `<div class="stats reveal">${(c.items || []).map((x) => { const n = x.count ? (src2[x.count] || []).length : x.value; return n ? `<div><b class="count" data-to="${+n}">0</b><span>${esc(x.label)}</span></div>` : ""; }).join("")}</div>`;
    },
    journey(c) {
      const t = D.timeline || []; if (!t.length) return "";
      return `${head(c)}<ol class="tl">${t.map((e) => `<li class="tli reveal"><div><div class="y">${esc(e.year)}</div><span class="k">${esc(e.category || "")}</span></div><div><h3>${esc(e.title)}</h3><p class="mu">${esc(e.description)}</p>${e.image ? img(e.image, e.title) : ""}</div></li>`).join("")}</ol>`;
    },
    projects(c) {
      const all = [...(D.projects || [])].sort((a, b) => !!b.featured - !!a.featured); if (!all.length) return "";
      const f = S.projects.c === "All" ? all : all.filter((p) => p.category === S.projects.c);
      const shown = f.slice(0, S.projects.n);
      return `${head(c)}${bar("projects", cats(all), S.projects.c)}<div class="grid">${shown.map((p) => `<article class="card reveal"><div class="im">${img(p.image, p.title)}</div><div class="b"><span class="mu">${esc(p.category)}${p.year ? " · " + esc(p.year) : ""}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><br>${badges(p.technologies)}<p style="margin-top:14px">${ext(p.github, "Source", "") }${p.github && p.liveUrl ? " · " : ""}${ext(p.liveUrl, "Live", "")}${!p.github && !p.liveUrl ? '<span class="mu">Private project</span>' : ""}</p></div></article>`).join("")}</div>${more("projects", shown.length, f.length)}`;
    },
    photos(c) {
      const all = D.photography || []; if (!all.length) return "";
      const f = S.photos.c === "All" ? all : all.filter((p) => p.category === S.photos.c);
      galList = f; const shown = f.slice(0, S.photos.n);
      return `${head(c)}${bar("photos", cats(all), S.photos.c)}<div class="mas" data-main>${shown.map((p, i) => `<figure class="reveal"><button data-pi="${i}" aria-label="Open ${esc(p.title || "photo " + (i + 1))}">${img(p.thumbnail || p.image, p.title || p.category)}</button></figure>`).join("")}</div>${more("photos", shown.length, f.length)}`;
    },
    travel(c) {
      const all = D.travel || []; if (!all.length) return "";
      const f = S.travel.c === "All" ? all : all.filter((d) => d.category === S.travel.c);
      const shown = f.slice(0, S.travel.n);
      return `${head(c)}${bar("travel", cats(all), S.travel.c)}${mapHtml(f)}<div class="grid">${shown.map((d) => `<a class="card tc reveal" href="#/travel/${esc(d.id)}"><div class="im">${img(d.coverImage, d.name)}</div><div class="b"><div class="meta"><span>${esc([d.state, d.country].filter(Boolean).join(", "))}</span><span>${esc(d.visitedDate || "")} · ${(d.gallery || []).length} photos</span></div><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p>${badges(d.tags)}</div></a>`).join("")}</div>${more("travel", shown.length, f.length)}`;
    },
    achievements(c) {
      const a = D.achievements || []; if (!a.length) return "";
      return `${head(c)}<div>${a.map((x) => `<div class="ach reveal"><span class="k">${esc(x.category)}${x.year ? " · " + esc(x.year) : ""}</span><div><strong>${esc(x.title)}</strong>${x.description ? `<p class="mu">${esc(x.description)}</p>` : ""}</div></div>`).join("")}</div>`;
    },
    currently(c) {
      if (!P.currently?.length) return "";
      return `${head(c)}<div class="cur">${P.currently.map((x) => `<div class="reveal"><span class="mu">${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join("")}</div>`;
    },
    cards(c) {
      if (!c.items?.length) return "";
      return `${head(c)}<div class="who">${c.items.map((w) => `<article class="card reveal"><span class="ic" aria-hidden="true">${esc(w.icon || "")}</span><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p>${w.image ? img(w.image, w.title) : ""}</article>`).join("")}</div>`;
    },
    contact(c) {
      const links = (P.social || []).filter((s) => s.href);
      return `<div class="contact reveal"><p class="k">${esc(c.kicker || "")}</p><h2 id="h-contact">${esc(c.title)}</h2><p class="mu" style="margin:16px 0 0">${esc(c.intro || "")}</p><div class="cta">${P.email ? `<a class="btn" href="mailto:${esc(P.email)}">Email</a>` : ""}${links.map((s) => ext(s.href, s.label)).join("")}${!P.email && !links.length ? '<span class="mu">Add your email and links in data/profile.js</span>' : ""}</div></div>`;
    }
  };

  /* ---------- home ---------- */
  const secs = (P.sections || []);
  const built = secs.map((c, i) => ({ c, i, html: R[c.type] ? R[c.type](c, i, secs) : "" })).filter((x) => x.html);
  $("#homeView").innerHTML = built.map(({ c, i, html }) => c.type === "hero" ? html : `<section class="sec wrap" id="${esc(c.id)}" data-i="${i}" aria-labelledby="h-${esc(c.id)}">${html}</section>`).join("");
  const rerender = (id) => {
    const el = $("#" + id); const c = secs[+el.dataset.i]; el.innerHTML = R[c.type](c, +el.dataset.i, secs);
    $$(".reveal", el).forEach((x) => x.classList.add("in")); $$(".count", el).forEach((n) => (n.textContent = n.dataset.to));
  };

  /* ---------- nav / footer / theme ---------- */
  $("#brand").textContent = P.name;
  $("#menu").innerHTML = built.filter((x) => x.c.nav).map((x) => `<a href="#/s/${esc(x.c.id)}" data-nav="${esc(x.c.id)}">${esc(x.c.nav)}</a>`).join("");
  $("#foot").innerHTML = `<div><strong>${esc(P.name)}</strong><br>© ${new Date().getFullYear()}</div><nav>${(P.social || []).filter((s) => s.href).map((s) => ext(s.href, s.label, "")).join("")}${P.email ? `<a href="mailto:${esc(P.email)}">Email</a>` : ""}</nav>`;
  $("#theme").onclick = () => { const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t); } catch (e) {} };
  const menu = $("#menu"), burger = $("#burger");
  const setMenu = (o) => { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); };
  burger.onclick = () => setMenu(!menu.classList.contains("open"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  const onScroll = () => { $("#nav").classList.toggle("s", scrollY > 10); const p = $("#parallax"); if (p && !reduce && scrollY < innerHeight) p.style.transform = `translateY(${scrollY * .15}px)`; };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- detail pages (dynamic from data) ---------- */
  const dhero = (t, im, sub) => `<div class="dhero">${img(im, t, true)}<div class="wrap"><p class="k" style="color:#bfe9dc">${esc(sub || "")}</p><h1>${esc(t)}</h1></div></div>`;
  const block = (title, html) => html ? `<h2>${esc(title)}</h2>${html}` : "";
  const list = (a) => a && a.length ? `<ul>${a.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  function skillDetail(s) {
    const prj = (D.projects || []).filter((p) => p.skill === s.id), tl = (D.timeline || []).filter((t) => t.skill === s.id), ac = (D.achievements || []).filter((a) => a.skill === s.id);
    galList = (s.gallery || []).map((g, i) => ({ image: g, title: `${s.title} ${i + 1}` }));
    return `${dhero(s.title, s.image, s.category)}<div class="wrap dv"><a class="back" href="#/s/skills">← All skills</a><div class="dcols"><div><h2>Overview</h2><p class="mu">${esc(s.description)}</p>
      ${block("Technologies & tools", badges(s.technologies))}${block("Highlights", list(s.highlights))}${block("Experience", tl.map((t) => `<p><strong>${esc(t.year)}</strong> · ${esc(t.title)}<br><span class="mu">${esc(t.description)}</span></p>`).join(""))}${block("Achievements", ac.map((a) => `<p>${esc(a.title)} <span class="mu">${esc(a.year || "")}</span></p>`).join(""))}</div>
      <div>${block("Projects", prj.map((p) => `<p><strong>${esc(p.title)}</strong><br><span class="mu">${esc(p.description)}</span></p>`).join(""))}</div></div>${block("Gallery", gal(s.gallery, s.title))}</div>`;
  }
  function travelDetail(d) {
    const all = D.travel, i = all.indexOf(d), prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
    galList = (d.gallery || []).map((g, k) => ({ image: g, title: `${d.name} ${k + 1}`, location: d.name, date: d.visitedDate }));
    const det = Object.entries({ Date: d.visitedDate, ...(d.details || {}) }).filter(([, v]) => v);
    return `${dhero(d.name, d.coverImage, [d.country, d.category].filter(Boolean).join(" • "))}<div class="wrap dv"><a class="back" href="#/s/travel">← All destinations</a><div class="dcols"><div>
      <h2>About the trip</h2><p class="mu">${esc(d.description)}</p>${block("Memories", list(d.memories))}</div><div>${block("Places visited", list(d.placesVisited))}
      ${det.length ? `<h2>Trip details</h2><dl class="dl">${det.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""}${badges(d.tags)}</div></div>
      ${block("My photographs", gal(d.gallery, d.name))}<div class="dnav"><a href="#/travel/${esc(prev.id)}">← ${esc(prev.name)}</a><a href="#/travel/${esc(next.id)}">${esc(next.name)} →</a></div></div>`;
  }
  const setMeta = (title, desc) => {
    document.title = title ? `${title} · ${P.name}` : `${P.name} · ${P.title}`;
    $("meta[name=description]").content = desc || P.seo?.description || P.introduction;
  };

  /* ---------- router: #/  #/s/<section>  #/skills/<id>  #/travel/<id> ---------- */
  let homeY = 0;
  function route() {
    const m = (location.hash.slice(1) || "/").split("/").filter(Boolean), home = $("#homeView"), dv = $("#detailView");
    const item = m[0] === "skills" ? (D.skills || []).find((x) => x.id === m[1]) : m[0] === "travel" ? (D.travel || []).find((x) => x.id === m[1]) : null;
    if (item) {
      if (!home.hidden) homeY = scrollY;
      dv.innerHTML = m[0] === "skills" ? skillDetail(item) : travelDetail(item);
      home.hidden = true; dv.hidden = false; scrollTo(0, 0);
      $$("[data-gal] button", dv).forEach((b) => (b.onclick = () => lbOpen(galList, +b.dataset.gi)));
      setMeta(item.title || item.name, item.description); observe(dv);
      return;
    }
    const wasHidden = home.hidden; home.hidden = false; dv.hidden = true; dv.innerHTML = ""; setMeta();
    if (m[0] === "s" && $("#" + m[1])) setTimeout(() => $("#" + m[1]).scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), wasHidden ? 30 : 0);
    else if (wasHidden) scrollTo(0, homeY);
  }
  addEventListener("hashchange", route);

  /* ---------- delegated interactions ---------- */
  document.addEventListener("click", (e) => {
    const f = e.target.closest("[data-f]"), mo = e.target.closest("[data-more]"), pi = e.target.closest("[data-pi]"), pin = e.target.closest("[data-pin]");
    if (f) { const id = f.dataset.f; S[id].c = f.dataset.v; if (S[id].n) S[id].n = { projects: 6, photos: 12, travel: 6 }[id]; rerender(id === "photos" ? "photography" : id); }
    else if (mo) { const id = mo.dataset.more; S[id].n += { projects: 6, photos: 12, travel: 6 }[id]; rerender(id === "photos" ? "photography" : id); }
    else if (pi) lbOpen(galList, +pi.dataset.pi);
    else if (pin) {
      const d = D.travel.find((x) => x.id === pin.dataset.pin); if (!d) return;
      $$(".pin").forEach((p) => p.setAttribute("aria-pressed", p === pin));
      $("#mapcard").innerHTML = `${img(d.coverImage, d.name)}<div><h3>${esc(d.name)}</h3><span>${esc(d.visitedDate || "")}</span><p>${esc(d.description)}</p><a href="#/travel/${esc(d.id)}">View trip →</a></div>`;
    }
  });
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });

  /* ---------- reveal + counters ---------- */
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return; const t = en.target; io.unobserve(t); t.classList.add("in");
    $$(".count", t).forEach((n) => {
      const to = +n.dataset.to; if (reduce) return (n.textContent = to);
      const t0 = performance.now(); (function tick(now) { const p = Math.min(1, (now - t0) / 1000); n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }), { threshold: 0.12 });
  function observe(root) { $$(".reveal", root).forEach((el) => io.observe(el)); }
  observe(document);

  /* Person structured data from profile */
  const ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: P.name, jobTitle: P.title, url: P.seo?.siteUrl || undefined, sameAs: (P.social || []).map((s) => s.href).filter(Boolean) });
  document.head.appendChild(ld);

  route();
})();
