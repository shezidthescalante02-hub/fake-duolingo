// Sonidos discretos generados (sin archivos). Canales independientes: música, efectos.
let ctx: AudioContext | null = null;
let fx = 0.5, music = 0;
let musicNodes: { stop: () => void } | null = null;

function ac(): AudioContext | null {
  try {
    if (!ctx) { const AC = window.AudioContext || (window as any).webkitAudioContext; ctx = new AC(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}

export function setVolumes(v: { fx: number; music: number }) {
  fx = v.fx; const changed = music !== v.music; music = v.music;
  if (changed) { if (music > 0) startMusic(); else stopMusic(); }
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", gain = 0.08, delay = 0) {
  const c = ac(); if (!c || fx <= 0) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + delay;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain * fx, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  tap: () => tone(660, 0.05, "sine", 0.03),
  correct: () => { tone(784, 0.12, "sine", 0.07); tone(1175, 0.18, "sine", 0.05, 0.08); },
  wrong: () => { tone(220, 0.16, "triangle", 0.06); tone(196, 0.2, "triangle", 0.05, 0.1); },
  level: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "sine", 0.06, i * 0.09)); },
  xp: () => tone(988, 0.08, "sine", 0.04),
  tick: () => tone(1200, 0.03, "square", 0.015),
};

// Música ambiental muy suave (desactivada por defecto)
function startMusic() {
  const c = ac(); if (!c || musicNodes) return;
  const master = c.createGain(); master.gain.value = 0.025 * music; master.connect(c.destination);
  const chords = [[220, 261.6, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]];
  let i = 0; let stopped = false;
  const play = () => {
    if (stopped) return;
    const t = c.currentTime;
    for (const f of chords[i % chords.length]) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = "sine"; o.frequency.value = f / 2;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(1, t + 2); g.gain.linearRampToValueAtTime(0, t + 7.5);
      o.connect(g).connect(master); o.start(t); o.stop(t + 8);
    }
    i++;
    setTimeout(play, 7000);
  };
  play();
  musicNodes = { stop: () => { stopped = true; try { master.disconnect(); } catch {} } };
}
function stopMusic() { musicNodes?.stop(); musicNodes = null; }

export function vibrate(ms = 15) { try { navigator.vibrate?.(ms); } catch {} }
