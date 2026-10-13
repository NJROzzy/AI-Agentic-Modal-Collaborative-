// Charts shared by index.html and progress.html. Plain DOM, no libraries.
// Every label comes from JSON or the GitHub API, so text is set with textContent.
(function () {
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // data-tip = the value (bold), data-tip-l = what it is, data-tip-x = extra lines (newline-separated)
  const tip = (n, value, label, extra) => {
    n.dataset.tip = value;
    if (label) n.dataset.tipL = label;
    if (extra && extra.length) n.dataset.tipX = extra.join("\n");
    n.tabIndex = 0;
    return n;
  };

  // ---------- tooltip (one for the page) ----------
  let tipBox = null;
  function bindTips() {
    if (tipBox) return;
    tipBox = el("div", "viz-tip");
    tipBox.hidden = true;
    tipBox.setAttribute("role", "status");
    document.body.appendChild(tipBox);
    const show = (target, x, y) => {
      tipBox.replaceChildren(el("b", null, target.dataset.tip));
      if (target.dataset.tipL) tipBox.appendChild(el("span", null, target.dataset.tipL));
      (target.dataset.tipX || "").split("\n").filter(Boolean).forEach((line) => tipBox.appendChild(el("span", null, "· " + line)));
      tipBox.hidden = false;
      const r = tipBox.getBoundingClientRect();
      const left = Math.min(Math.max(8, x + 14), window.innerWidth - r.width - 8);
      const top = y + 16 + r.height > window.innerHeight ? y - r.height - 12 : y + 16;
      tipBox.style.left = left + "px";
      tipBox.style.top = Math.max(8, top) + "px";
    };
    const hide = () => (tipBox.hidden = true);
    document.addEventListener("pointermove", (e) => {
      const t = e.target.closest && e.target.closest("[data-tip]");
      t ? show(t, e.clientX, e.clientY) : hide();
    });
    document.addEventListener("focusin", (e) => {
      const t = e.target.closest && e.target.closest("[data-tip]");
      if (!t) return hide();
      const r = t.getBoundingClientRect();
      show(t, r.left + r.width / 2, r.bottom);
    });
    document.addEventListener("focusout", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  const nowYear = () => { const d = new Date(); return d.getFullYear() + (d.getMonth() + d.getDate() / 31) / 12; };
  const yearOf = (iso) => { const [y, m = 1] = iso.split("-").map(Number); return y + (m - 0.5) / 12; };
  const fmtMonth = (iso) => new Date(iso + (iso.length === 7 ? "-15" : "") + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // ---------- evolution of agentic AI, drawn to scale ----------
  // Lays out event labels in lanes under a track so none overlap, at any width.
  function laneTrack(host, events, from, to, segs) {
    const track = el("div", "evo-track");
    const line = el("div", "evo-line");
    (segs || []).forEach((s) => {
      const seg = el("span", "seg");
      seg.style.left = ((s.from - from) / (to - from)) * 100 + "%";
      seg.style.width = ((s.to - s.from) / (to - from)) * 100 + "%";
      seg.style.background = `var(--v-o${s.step})`;
      line.appendChild(seg);
    });
    const labels = el("div", "evo-labels");
    const items = events.map((e) => {
      const pct = ((yearOf(e.date) - from) / (to - from)) * 100;
      const dot = tip(el("span", "evo-ev" + (e.ours ? " ours" : "")), e.label, fmtMonth(e.date), [e.text]);
      dot.appendChild(el("i"));
      dot.style.left = pct + "%";
      line.appendChild(dot);
      const lab = el("span", "evo-lab" + (e.ours ? " ours" : ""), e.label);
      lab.appendChild(el("small", null, fmtMonth(e.date)));
      const lead = el("span", "evo-lead");
      labels.append(lead, lab);
      return { pct, lab, lead };
    });
    track.append(line, labels);
    host.appendChild(track);

    const LANE = 36;
    const layout = () => {
      const W = labels.clientWidth;
      if (!W) return;
      const lanes = [];
      items.sort((a, b) => a.pct - b.pct).forEach((it) => {
        const w = it.lab.offsetWidth;
        const x = (it.pct / 100) * W;
        const left = Math.min(Math.max(0, x - w / 2), W - w);
        let i = lanes.findIndex((right) => right + 10 <= left);
        if (i === -1) { lanes.push(0); i = lanes.length - 1; }
        lanes[i] = left + w;
        it.lab.style.left = left + "px";
        it.lab.style.top = i * LANE + 10 + "px";
        it.lead.style.left = x + "px";
        it.lead.style.top = "0px";
        it.lead.style.height = i * LANE + 9 + "px";
      });
      labels.style.height = Math.max(1, lanes.length) * LANE + 8 + "px";
    };
    if ("ResizeObserver" in window) new ResizeObserver(layout).observe(labels);
    requestAnimationFrame(layout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  }

  function evolution(host, eras, events) {
    host.replaceChildren();
    const START = Math.min(...eras.map((e) => e.from));
    const END = nowYear();
    const ZOOM = 2020;
    const pct = (y) => ((y - START) / (END - START)) * 100;
    const wrap = el("div", "evo");

    const bands = el("div", "evo-bands");
    eras.forEach((e, i) => {
      const to = e.to ?? END;
      const b = tip(el("span", `evo-band o${i + 1}`, String(i + 1)), e.era, `${e.when} · about ${Math.round(to - e.from)} years`, e.note ? ["Our repo: " + e.note] : null);
      b.setAttribute("aria-label", `${i + 1}. ${e.era}, ${e.when}`);
      b.style.left = `calc(${pct(e.from)}% + ${i ? 1 : 0}px)`;
      b.style.width = `calc(${pct(to) - pct(e.from)}% - ${i ? 2 : 0}px)`;
      bands.appendChild(b);
    });
    const axis = el("div", "evo-axis");
    const ticks = [];
    for (let y = Math.ceil(START / 10) * 10; y < END - 3; y += 10) ticks.push(y);
    ticks.push(Math.floor(END));
    ticks.forEach((y, i) => {
      const t = el("span", "evo-tick" + (i === 0 && y === START ? " first" : i === ticks.length - 1 ? " last" : ""), String(y));
      t.style.left = (i === ticks.length - 1 ? 100 : pct(y)) + "%";
      axis.appendChild(t);
    });
    wrap.append(bands, axis);

    const early = events.filter((e) => yearOf(e.date) < ZOOM);
    if (early.length) laneTrack(wrap, early, START, END, []);

    // zoom connector: from [2020, now] on the main scale out to the full width
    const link = el("div", "evo-zoom-link");
    link.setAttribute("aria-hidden", "true");
    const z = pct(ZOOM);
    link.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M${z} 0 L100 0 L100 100 L0 100 Z"/></svg>`;
    wrap.appendChild(link);

    const zoom = el("div", "evo-zoom");
    zoom.appendChild(el("div", "zl", `Zoomed in: ${ZOOM}–now, where most of the change happened`));
    const segs = eras.map((e, i) => ({ from: Math.max(e.from, ZOOM), to: e.to ?? END, step: i + 1 })).filter((s) => s.to > s.from);
    laneTrack(zoom, events.filter((e) => yearOf(e.date) >= ZOOM), ZOOM, END, segs);
    const zaxis = el("div", "evo-zaxis");
    for (let y = ZOOM; y <= Math.floor(END); y++) {
      const t = el("span", "evo-tick" + (y === ZOOM ? " first" : "") + ((y - ZOOM) % 2 ? " odd" : ""), String(y));
      t.style.left = ((y - ZOOM) / (END - ZOOM)) * 100 + "%";
      zaxis.appendChild(t);
    }
    zoom.appendChild(zaxis);
    wrap.appendChild(zoom);
    host.appendChild(wrap);
  }

  // ---------- standards × phases heatmap ----------
  function heatmap(host, data) {
    host.replaceChildren();
    const phases = data.phases || [];
    const names = data.standards || {};
    const keys = Object.keys(names);
    const wrap = el("div", "hm-wrap");
    const table = el("table", "hm");
    const cap = el("caption", null, "Number of tasks in each phase that implement each standard");
    cap.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";
    table.appendChild(cap);
    const thead = el("thead"), hr = el("tr");
    hr.appendChild(el("th", null, "Standard"));
    hr.firstChild.style.textAlign = "left";
    phases.forEach((p, i) => { const th = el("th", null, "P" + (i + 1)); th.title = p.name; th.scope = "col"; hr.appendChild(th); });
    const tt = el("th", null, "Tasks"); tt.style.textAlign = "right"; hr.appendChild(tt);
    thead.appendChild(hr);
    const tbody = el("tbody");
    keys.forEach((k) => {
      const tr = el("tr");
      const th = el("th", "row"); th.scope = "row";
      const a = el("a", null, names[k]); a.href = "#std-" + k;
      th.appendChild(a); tr.appendChild(th);
      let total = 0;
      phases.forEach((p, i) => {
        const tasks = p.tasks.filter((t) => (t.std || []).includes(k));
        total += tasks.length;
        const td = el("td", tasks.length ? "c" + Math.min(3, tasks.length) : "", String(tasks.length));
        tip(td, `${tasks.length} task${tasks.length === 1 ? "" : "s"}`, `${names[k]} · P${i + 1} ${p.name}`, tasks.map((t) => t.title));
        tr.appendChild(td);
      });
      tr.appendChild(el("td", "tot", String(total)));
      tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    wrap.appendChild(table);
    const key = el("div", "hm-key");
    phases.forEach((p, i) => { const s = el("span"); s.append(el("b", null, "P" + (i + 1)), document.createTextNode(p.name)); key.appendChild(s); });
    const legend = el("div", "viz-legend");
    [["var(--v-track)", "0 tasks"], ["var(--v-o2)", "1"], ["var(--v-o3)", "2"], ["var(--v-o4)", "3+"]].forEach(([c, t]) => {
      const s = el("span"); const i = el("i"); i.style.background = c; s.append(i, document.createTextNode(t)); legend.appendChild(s);
    });
    host.append(legend, wrap, key);
  }

  // ---------- phase progress, stacked bars ----------
  function phaseBars(host, phases) {
    host.replaceChildren();
    const LABEL = { done: "Done", progress: "In progress", todo: "Not started" };
    const legend = el("div", "viz-legend");
    [["var(--v-done)", "Done"], ["var(--v-prog)", "In progress"], ["var(--v-track)", "Not started"]].forEach(([c, t]) => {
      const s = el("span"); const i = el("i"); i.style.background = c; s.append(i, document.createTextNode(t)); legend.appendChild(s);
    });
    const grid = el("div", "pb");
    phases.forEach((p, idx) => {
      const nm = el("div", "nm", `${idx + 1}. ${p.name}`);
      nm.appendChild(el("small", null, p.project));
      const bar = el("div", "bar");
      bar.setAttribute("role", "img");
      const counts = ["done", "progress", "todo"].map((s) => [s, p.tasks.filter((t) => t.status === s)]);
      bar.setAttribute("aria-label", `${p.name}: ` + counts.map(([s, ts]) => `${ts.length} ${LABEL[s].toLowerCase()}`).join(", "));
      counts.forEach(([s, ts]) => {
        if (!ts.length) return;
        const seg = tip(el("span", "s " + s), `${ts.length} ${LABEL[s].toLowerCase()}`, `Phase ${idx + 1} · ${p.name}`, ts.map((t) => t.title));
        seg.style.flex = String(ts.length);
        bar.appendChild(seg);
      });
      const done = counts[0][1].length;
      const row = el("div", "pb-row");
      row.append(nm, el("div", "val", `${done}/${p.tasks.length}`), bar);
      grid.appendChild(row);
    });
    host.append(legend, grid);
  }

  // ---------- commits per week ----------
  function commitWeeks(host, commits) {
    host.replaceChildren();
    if (!commits.length) { host.appendChild(el("p", "viz-empty", "No commits found on GitHub yet.")); return; }
    const monday = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
    const dates = commits.map((c) => new Date(c.commit.author.date));
    const first = monday(new Date(Math.min(...dates))), last = monday(new Date());
    const weeks = [];
    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 7)) weeks.push({ start: new Date(d), n: 0, msgs: [] });
    commits.forEach((c, i) => {
      const w = weeks.find((wk) => wk.start.getTime() === monday(dates[i]).getTime());
      if (w) { w.n++; if (w.msgs.length < 4) w.msgs.push(c.commit.message.split("\n")[0].trim() || "(no message)"); }
    });
    const visible = weeks.slice(-26);
    const max = Math.max(...visible.map((w) => w.n));
    const top = Math.max(2, max % 2 ? max + 1 : max);
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const cc = el("div", "cc");
    const y = el("div", "cc-y");
    const plot = el("div", "cc-plot");
    [0, top / 2, top].forEach((v) => {
      const s = el("span", null, String(v)); s.style.bottom = (v / top) * 100 + "%"; y.appendChild(s);
      if (v) { const g = el("div", "cc-grid"); g.style.bottom = (v / top) * 100 + "%"; plot.appendChild(g); }
    });
    const cols = el("div", "cc-cols");
    const labelEvery = Math.ceil(visible.length / 8);
    const x = el("div", "cc-x");
    let maxLabeled = false;
    visible.forEach((w, i) => {
      const col = tip(el("div", "cc-col"), `${w.n} commit${w.n === 1 ? "" : "s"}`, `Week of ${fmt(w.start)}`, w.msgs);
      if (w.n === max && max > 0 && !maxLabeled) { col.appendChild(el("span", "lab", String(w.n))); maxLabeled = true; }
      const b = el("span", "b");
      b.style.height = (w.n / top) * 100 + "%";
      if (!w.n) b.style.height = "0";
      col.appendChild(b);
      cols.appendChild(col);
      x.appendChild(el("span", null, i % labelEvery === 0 ? fmt(w.start) : ""));
    });
    plot.appendChild(cols);
    cc.append(y, plot, x);

    const det = el("details");
    det.appendChild(el("summary", null, "Show as table"));
    const tw = el("div", "viz-table-wrap"), tb = el("table", "viz-table");
    const hr = el("tr"); hr.append(el("th", null, "Week of"), el("th", null, "Commits"));
    tb.appendChild(hr);
    visible.forEach((w) => { const tr = el("tr"); tr.append(el("td", null, fmt(w.start)), el("td", null, String(w.n))); tb.appendChild(tr); });
    tw.appendChild(tb); det.appendChild(tw);
    host.append(cc, det);
  }


  // ---------- execution plan, Gantt-style ----------
  // stages: [{title, track, start, end, status, steps}], status: done | now | next | late
  function gantt(host, tracks, stages) {
    host.replaceChildren();
    const day = (iso) => new Date(iso + "T00:00:00").getTime();
    const t0 = Math.min(...stages.map((s) => day(s.start)));
    const t1 = Math.max(...stages.map((s) => day(s.end) + 864e5));
    const pct = (t) => ((t - t0) / (t1 - t0)) * 100;
    const LABEL = { done: "Done", now: "In progress", next: "Upcoming", late: "Behind schedule" };
    const fmt = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const legend = el("div", "viz-legend");
    [["var(--v-done)", "Done"], ["var(--v-prog)", "In progress"], ["var(--v-o2)", "Upcoming"], ["var(--v-late)", "Behind schedule"]].forEach(([c, t]) => {
      const s = el("span"); const i = el("i"); i.style.background = c; s.append(i, document.createTextNode(t)); legend.appendChild(s);
    });

    const months = [];
    const m = new Date(t0); m.setDate(1); m.setMonth(m.getMonth() + 1); m.setHours(0, 0, 0, 0);
    for (; m.getTime() < t1; m.setMonth(m.getMonth() + 1)) months.push(m.getTime());
    const now = Date.now();
    const showNow = now >= t0 && now <= t1;
    const grid = (track) => {
      months.forEach((t) => { const g = el("span", "gt-grid"); g.style.left = pct(t) + "%"; track.appendChild(g); });
      if (showNow) { const n = el("span", "gt-now"); n.style.left = pct(now) + "%"; track.appendChild(n); }
    };

    const wrap = el("div", "gt");
    const head = el("div", "gt-row gt-head");
    head.appendChild(el("span", "gt-l"));
    const ht = el("div", "gt-t");
    months.forEach((t) => {
      // year only where it changes, so labels stay short on phones
      const d = new Date(t), yearChange = d.getMonth() === 0 || t === months[0] && d.getFullYear() !== new Date().getFullYear();
      const lab = el("span", "gt-m", d.toLocaleDateString("en-US", yearChange ? { month: "short", year: "numeric" } : { month: "short" }));
      // a month near the right edge hangs its label to the left of its gridline
      if (pct(t) > 88) { lab.classList.add("end"); lab.style.right = 100 - pct(t) + "%"; } else lab.style.left = pct(t) + "%";
      ht.appendChild(lab);
    });
    if (showNow) { const n = el("span", "gt-today", "Today"); n.style.left = pct(now) + "%"; ht.appendChild(n); }
    head.appendChild(ht);
    wrap.appendChild(head);

    tracks.forEach((tr) => {
      const rows = stages.filter((s) => s.track === tr.id);
      if (!rows.length) return;
      wrap.appendChild(el("div", "gt-group", tr.name));
      rows.forEach((s) => {
        const row = el("div", "gt-row");
        const l = el("a", "gt-l", s.title);
        l.href = "#stage-" + s.id;
        l.appendChild(el("small", null, `${fmt(s.start)} – ${fmt(s.end)}`));
        const t = el("div", "gt-t");
        grid(t);
        const doneSteps = s.steps.filter((x) => x.done).length;
        const bar = tip(el("span", "gt-bar " + s.status), s.title, `${fmt(s.start)} – ${fmt(s.end)} · ${LABEL[s.status]}`, [`${s.steps.length} steps`, "Exit: " + s.exit]);
        bar.style.left = pct(day(s.start)) + "%";
        bar.style.width = `max(6px, calc(${pct(day(s.end) + 864e5) - pct(day(s.start))}% - 2px))`;
        bar.setAttribute("aria-label", `${s.title}, ${fmt(s.start)} to ${fmt(s.end)}, ${LABEL[s.status]}`);
        t.appendChild(bar);
        row.append(l, t);
        wrap.appendChild(row);
      });
    });
    host.append(legend, wrap);
  }

  window.Viz = { bindTips, evolution, heatmap, phaseBars, commitWeeks, gantt };
})();
