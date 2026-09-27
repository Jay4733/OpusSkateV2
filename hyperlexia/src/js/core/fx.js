'use strict';
/* ============================ audio: sfx + piano synth ============================ */
const Sound = {
  ctx: null, master: null, comp: null, reverb: null,
  init() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.comp = this.ctx.createDynamicsCompressor();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.55;
        this.master.connect(this.comp); this.comp.connect(this.ctx.destination);
        // tiny synthetic reverb (feedback delay network) for warmth
        const d1 = this.ctx.createDelay(); d1.delayTime.value = 0.083;
        const d2 = this.ctx.createDelay(); d2.delayTime.value = 0.127;
        const fb = this.ctx.createGain(); fb.gain.value = 0.28;
        const wet = this.ctx.createGain(); wet.gain.value = 0.18;
        const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
        this.reverb = this.ctx.createGain();
        this.reverb.connect(d1); d1.connect(d2); d2.connect(lp); lp.connect(fb); fb.connect(d1); lp.connect(wet); wet.connect(this.master);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { /* no audio */ }
  },
  get on() { return Store.s.sound; },
  freq: m => 440 * Math.pow(2, (m - 69) / 12),
  tone(f, dur = 0.15, type = 'sine', vol = 0.18, when = 0, slideTo = null) {
    if (!this.on) return; this.init(); if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.master); g.connect(this.reverb);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },
  noise(dur = 0.2, vol = 0.2, when = 0, freq = 1200) {
    if (!this.on) return; this.init(); if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when, n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
    const g = this.ctx.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t0);
  },
  // Piano-like additive synth with hammer transient, inharmonic partials and decay.
  piano(midi, dur = 1.4, vol = 0.32, when = 0) {
    if (!this.on) return; this.init(); if (!this.ctx) return;
    const t0 = this.ctx.currentTime + when, f0 = this.freq(midi);
    const out = this.ctx.createGain(); out.gain.value = vol;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(Math.min(9000, f0 * 9), t0); lp.frequency.exponentialRampToValueAtTime(Math.max(600, f0 * 2.2), t0 + dur);
    out.connect(lp); lp.connect(this.master); lp.connect(this.reverb);
    const partials = [[1, 1], [2, 0.42], [3, 0.2], [4, 0.1], [5, 0.06], [6, 0.035]];
    const B = 0.0004;
    const decay = clamp(3.2 - (midi - 48) * 0.035, 0.7, 4);
    for (const [n, a] of partials) {
      const f = f0 * n * Math.sqrt(1 + B * n * n);
      if (f > 16000) continue;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const pd = decay / (1 + (n - 1) * 0.6);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(a, t0 + 0.004);
      g.gain.exponentialRampToValueAtTime(a * 0.35, t0 + Math.min(0.3, pd * 0.25));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.min(dur + 0.4, pd * 2));
      o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + Math.min(dur + 0.5, pd * 2 + 0.05));
    }
    this.noise(0.03, 0.05 * vol / 0.32, when, f0 * 4);
  },
  chord(midis, dur = 1.6, vol = 0.22, stagger = 0) { midis.forEach((m, i) => this.piano(m, dur, vol, i * stagger)); },
  sfx(name) {
    if (!this.on) return;
    const P = (m, w = 0, d = 0.5, v = 0.22) => this.piano(m, d, v, w);
    switch (name) {
      case 'click': this.tone(880, 0.05, 'triangle', 0.08); break;
      case 'key': this.tone(1200 + Math.random() * 300, 0.03, 'square', 0.03); break;
      case 'pop': this.tone(520, 0.09, 'sine', 0.15, 0, 900); break;
      case 'good': P(72, 0, 0.5); P(76, 0.07, 0.5); P(79, 0.14, 0.7); break;
      case 'great': P(72, 0, 0.5); P(76, 0.06); P(79, 0.12); P(84, 0.18, 0.9, 0.26); break;
      case 'bad': this.tone(196, 0.22, 'triangle', 0.16, 0, 147); break;
      case 'win': [60, 64, 67, 72, 76, 79, 84].forEach((m, i) => P(m, i * 0.07, 1.2, 0.2)); break;
      case 'level': [67, 72, 76, 79, 84, 88].forEach((m, i) => P(m, i * 0.09, 1.4, 0.2)); break;
      case 'lose': [67, 63, 60, 55].forEach((m, i) => P(m, i * 0.14, 0.9, 0.2)); break;
      case 'coin': this.tone(988, 0.08, 'square', 0.07); this.tone(1319, 0.2, 'square', 0.07, 0.08); break;
      case 'laser': this.tone(1400, 0.16, 'sawtooth', 0.06, 0, 220); break;
      case 'boom': this.noise(0.45, 0.35, 0, 300); this.tone(90, 0.3, 'sine', 0.25, 0, 40); break;
      case 'tick': this.tone(2000, 0.02, 'square', 0.04); break;
      case 'whoosh': this.noise(0.3, 0.12, 0, 900); break;
      case 'flip': this.tone(660, 0.05, 'triangle', 0.06); break;
      case 'type': this.tone(1500 + Math.random() * 400, 0.02, 'square', 0.02); break;
    }
  },
};
['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, () => Sound.init(), { once: true }));

/* ============================ background glyph field ============================ */
const BG = {
  cv: null, ctx: null, parts: [], raf: 0, w: 0, h: 0, paused: false,
  glyphs: 'AaBbÉéÇçŒœ∑∞πλΩψ♪♫♬♩𝄞12345678910³⁰⁶#@&?!éàèùâêîôûëïü§¶ßøæ'.match(/./gu),
  start() {
    this.cv = $('#bg'); this.ctx = this.cv.getContext('2d');
    const rs = () => { const d = Math.min(2, devicePixelRatio || 1); this.w = innerWidth; this.h = innerHeight; this.cv.width = this.w * d; this.cv.height = this.h * d; this.ctx.setTransform(d, 0, 0, d, 0, 0); };
    rs(); addEventListener('resize', rs);
    const N = Math.round(Math.min(90, (innerWidth * innerHeight) / 16000));
    const cols = ['#37e2ff', '#9b7bff', '#ff4fd8', '#ffc545', '#9dff5b', '#ffffff'];
    for (let i = 0; i < N; i++) this.parts.push({ x: Math.random() * this.w, y: Math.random() * this.h, z: 0.3 + Math.random() * 0.9, g: pick(this.glyphs, Math.random), c: pick(cols, Math.random), r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.004, tw: Math.random() * 6.28 });
    const loop = () => {
      this.raf = requestAnimationFrame(loop);
      if (this.paused || document.hidden) return;
      const c = this.ctx; c.clearRect(0, 0, this.w, this.h);
      for (const p of this.parts) {
        p.y -= 0.12 * p.z; p.x += Math.sin(p.tw) * 0.08; p.tw += 0.006; p.r += p.vr;
        if (p.y < -30) { p.y = this.h + 30; p.x = Math.random() * this.w; }
        c.save(); c.translate(p.x, p.y); c.rotate(p.r);
        c.globalAlpha = 0.06 + 0.1 * p.z * (0.6 + 0.4 * Math.sin(p.tw * 3));
        c.fillStyle = p.c; c.font = `${Math.round(12 + p.z * 22)}px Georgia, serif`; c.textAlign = 'center';
        c.fillText(p.g, 0, 0); c.restore();
      }
    };
    loop();
  },
};

/* ============================ confetti & floaties & toasts ============================ */
const FX = {
  cv: null, ctx: null, ps: [], running: false,
  init() { this.cv = $('#fx'); this.ctx = this.cv.getContext('2d'); const rs = () => { this.cv.width = innerWidth; this.cv.height = innerHeight; }; rs(); addEventListener('resize', rs); },
  confetti(n = 140, x = innerWidth / 2, y = innerHeight / 3) {
    const cols = ['#37e2ff', '#ff4fd8', '#ffc545', '#9dff5b', '#9b7bff', '#ffffff', '#ff6b6b'];
    const glyphs = ['★', '♪', 'A', 'é', '✦', '●', '■', '10³⁰'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
      this.ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, g: Math.random() < 0.3 ? pick(glyphs, Math.random) : null, c: pick(cols, Math.random), r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 90 + Math.random() * 60, sz: 5 + Math.random() * 7 });
    }
    if (!this.running) this.loop();
  },
  burst(x, y, color = '#37e2ff', n = 24) {
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 5; this.ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: color, r: 0, vr: 0, life: 30 + Math.random() * 25, sz: 3 + Math.random() * 3, dot: true }); }
    if (!this.running) this.loop();
  },
  loop() {
    this.running = true;
    const c = this.ctx; c.clearRect(0, 0, this.cv.width, this.cv.height);
    this.ps = this.ps.filter(p => p.life > 0);
    for (const p of this.ps) {
      p.x += p.vx; p.y += p.vy; p.vy += p.dot ? 0.05 : 0.22; p.vx *= 0.99; p.r += p.vr; p.life--;
      c.save(); c.globalAlpha = Math.min(1, p.life / 30); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c;
      if (p.g) { c.font = `bold ${p.sz * 2.4}px sans-serif`; c.fillText(p.g, 0, 0); }
      else if (p.dot) { c.beginPath(); c.arc(0, 0, p.sz, 0, 6.28); c.fill(); }
      else c.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2);
      c.restore();
    }
    if (this.ps.length) requestAnimationFrame(() => this.loop()); else { this.running = false; c.clearRect(0, 0, this.cv.width, this.cv.height); }
  },
  float(text, x, y, color = '#9dff5b', size = 22) {
    const e = h('div', { class: 'floaty', style: { left: x + 'px', top: y + 'px', color, fontSize: size + 'px' } }, text);
    document.body.appendChild(e); setTimeout(() => e.remove(), 1000);
  },
  floatAt(el, text, color) { const r = el.getBoundingClientRect(); this.float(text, r.left + r.width / 2 - 20, r.top, color); },
  toast(msg, icon = '✨') {
    let box = $('.toasts'); if (!box) { box = h('div', { class: 'toasts' }); document.body.appendChild(box); }
    const e = h('div', { class: 'toast' }, h('span', null, icon), h('span', null, msg));
    box.appendChild(e); setTimeout(() => e.remove(), 3100);
  },
};

/* ============================ modal ============================ */
function modal(content, { onClose, wide, noClose } = {}) {
  const box = h('div', { class: 'modal', style: wide ? { width: 'min(980px,100%)' } : null });
  const back = h('div', { class: 'modal-back' }, box);
  const close = () => { back.remove(); document.removeEventListener('keydown', esc); onClose && onClose(); };
  const esc = e => { if (e.key === 'Escape' && !noClose) close(); };
  if (!noClose) back.addEventListener('pointerdown', e => { if (e.target === back) close(); });
  document.addEventListener('keydown', esc);
  if (typeof content === 'function') content = content(close);
  box.append(...[].concat(content));
  document.body.appendChild(back);
  return close;
}
