// Futuristic layer shared by every page:
//   FX.net(heroEl)            animated agent network behind a hero
//   FX.voice(host, opts)      the site's agent console; returns { run(lines), log(line) }
//   FX.speak(text) / FX.stop() browser text-to-speech (Web Speech API)
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  // ---------- agent network: nodes are agents, pulses are messages between them ----------
  function net(hero) {
    const canvas = el("canvas", "fx-net");
    canvas.setAttribute("aria-hidden", "true");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, nodes = [], pulses = [], raf = 0, visible = true;
    const accent = css("--accent") || "#93A0FF", done = css("--done") || "#5FD3A3", signal = css("--signal") || "#F0A857";

    function size() {
      const r = hero.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(46, Math.max(16, (W * H) / 26000)));
      nodes = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: i % 9 === 0 ? 3.2 : 1.8, hub: i % 9 === 0,
      }));
      if (reduce) draw();
    }
    const LINK = 150;
    function edges() {
      const out = [];
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) out.push([a, b, d]);
      }
      return out;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const es = edges();
      es.forEach(([a, b, d]) => {
        ctx.strokeStyle = accent; ctx.globalAlpha = (1 - d / LINK) * 0.35; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      nodes.forEach((n) => {
        ctx.fillStyle = n.hub ? signal : accent;
        ctx.globalAlpha = n.hub ? 0.95 : 0.7;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });
      pulses.forEach((p) => {
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.globalAlpha = 1; ctx.fillStyle = done;
        ctx.shadowColor = done; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1;
      return es;
    }
    function tick() {
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      const es = draw();
      if (es.length && Math.random() < 0.06 && pulses.length < 14) {
        const [a, b] = es[(Math.random() * es.length) | 0];
        pulses.push(Math.random() < 0.5 ? { a, b, t: 0 } : { a: b, b: a, t: 0 });
      }
      pulses.forEach((p) => (p.t += 0.018));
      pulses = pulses.filter((p) => p.t < 1);
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    }
    size();
    if (!reduce) {
      raf = requestAnimationFrame(tick);
      if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
      }).observe(hero);
      document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden && visible) raf = requestAnimationFrame(tick); });
    }
    let t;
    window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(size, 150); });
  }

  // ---------- speech ----------
  const canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voice = null;
  function pickVoice() {
    const vs = canSpeak ? speechSynthesis.getVoices() : [];
    const pref = ["Google US English", "Samantha", "Microsoft Aria Online (Natural) - English (United States)", "Alex", "Daniel"];
    voice = pref.map((n) => vs.find((v) => v.name === n)).find(Boolean) || vs.find((v) => /^en(-|_)/i.test(v.lang)) || null;
  }
  if (canSpeak) { pickVoice(); speechSynthesis.addEventListener?.("voiceschanged", pickVoice); }
  function speak(text, onEnd, onBoundary) {
    if (!canSpeak) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.rate = 1.02; u.pitch = 0.95;
    u.onend = u.onerror = () => onEnd && onEnd();
    speechSynthesis.speak(u);
    return true;
  }
  const stop = () => canSpeak && speechSynthesis.cancel();

  // ---------- the site's voice: a console that narrates in think/act/observe/review/say ----------
  const ICON_SPEAK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>';
  const ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>';
  const ICON_REPLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>';

  function voice_(host, opts) {
    opts = opts || {};
    const box = el("section", "console");
    box.setAttribute("aria-label", opts.label || "The site's agent explains itself");
    const bar = el("div", "console-bar");
    const id = el("span", "console-id");
    id.append(el("span", "pulse"), el("b", null, opts.name || "njr-agent"), document.createTextNode(opts.status || "online · reading the repo"));
    const actions = el("div", "console-actions");
    const replay = el("button", "fx-btn"); replay.type = "button"; replay.innerHTML = ICON_REPLAY + "Replay";
    const talk = el("button", "fx-btn primary"); talk.type = "button"; talk.innerHTML = ICON_SPEAK + "Speak";
    talk.setAttribute("aria-pressed", "false");
    if (!canSpeak) { talk.disabled = true; talk.title = "This browser has no text-to-speech"; }
    actions.append(replay, talk);
    bar.append(id, actions);
    const body = el("div", "console-body");
    body.setAttribute("aria-live", "polite");
    box.append(bar, body);
    host.appendChild(box);

    let lines = [], token = 0;
    const KIND = { think: "think", act: "act", observe: "observe", review: "review", say: "say" };
    function line(l) {
      const row = el("div", "cl " + (KIND[l.kind] || "say"));
      row.append(el("span", "k", l.kind === "say" ? "▸ say" : l.kind), el("span", "t"));
      body.appendChild(row);
      return row;
    }
    async function type(row, text, my) {
      const t = row.querySelector(".t");
      if (reduce || opts.instant) { t.textContent = text; return; }
      const caret = el("span", "caret");
      for (let i = 1; i <= text.length; i += 2) {
        if (my !== token) return;
        t.textContent = text.slice(0, i); t.appendChild(caret);
        await new Promise((r) => setTimeout(r, 9));
      }
      t.textContent = text;
    }
    async function run(ls) {
      lines = ls; const my = ++token;
      body.replaceChildren();
      for (const l of ls) {
        if (my !== token) return;
        await type(line(l), l.text, my);
        await new Promise((r) => setTimeout(r, reduce ? 0 : 140));
      }
    }
    // Speech reads the plain-language version of each line, not the raw tool syntax.
    function spoken() { return lines.map((l) => l.speech ?? (l.kind === "act" ? "" : l.text)).filter(Boolean).join(" "); }
    talk.addEventListener("click", () => {
      if (talk.getAttribute("aria-pressed") === "true") { stop(); return; }
      talk.setAttribute("aria-pressed", "true"); talk.innerHTML = ICON_STOP + "Stop";
      box.querySelectorAll(".cl.say").forEach((r) => r.classList.add("speaking"));
      const reset = () => { talk.setAttribute("aria-pressed", "false"); talk.innerHTML = ICON_SPEAK + "Speak"; box.querySelectorAll(".speaking").forEach((r) => r.classList.remove("speaking")); };
      if (!speak(spoken(), reset)) reset();
    });
    replay.addEventListener("click", () => { stop(); run(lines); });
    return { run, el: box, append: (l) => type(line(l), l.text, token) };
  }

  const relTime = (iso) => {
    const s = (Date.now() - new Date(iso)) / 1000;
    const ago = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;
    if (s < 3600) return ago(Math.max(1, Math.round(s / 60)), "minute");
    if (s < 86400) return ago(Math.round(s / 3600), "hour");
    return ago(Math.round(s / 86400), "day");
  };
  // Latest commit + exact total in two small requests (the Link header carries the page count).
  async function repoPulse(repo) {
    const r = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`);
    if (!r.ok) throw new Error("GitHub " + r.status);
    const [c] = await r.json();
    const m = (r.headers.get("Link") || "").match(/[?&]page=(\d+)>; rel="last"/);
    return { total: m ? +m[1] : c ? 1 : 0, last: c ? { msg: c.commit.message.split("\n")[0].trim(), when: relTime(c.commit.author.date) } : null };
  }

  window.FX = { net, voice: voice_, speak, stop, canSpeak, repoPulse, relTime };
})();
