// ─────────────────────────────────────────────
//  THEME — edit this file to restyle the site
// ─────────────────────────────────────────────

// ── Color palette ──────────────────────────────
export const C = {
  bg:          "#0A0705",   // page background
  surface:     "#130F0A",   // card / section background
  gold:        "#C9A84C",   // primary accent (marquee gold)
  goldDim:     "#8A6F2E",   // muted gold (dot fills, subtitles)
  cream:       "#F2E8D5",   // body text
  ivory:       "#EDE0C4",   // headings
  wine:        "#8B2635",   // ticket button default
  sepia:       "#6B5240",   // muted text, nav links
  dimText:     "rgba(242,232,213,0.45)", // faded body copy
  border:      "rgba(201,168,76,0.18)",  // default border
  neonPink:    "#FF3E8A",   // neon accent 1
  neonCyan:    "#00D4CC",   // neon accent 2
};

// ── Glow helpers ───────────────────────────────
// Call with an alpha 0–1 to control intensity
// e.g. GP(0.9) = strong pink glow, GP(0.3) = faint
export const GP = (a = 0.7) =>
  `0 0 8px rgba(255,62,138,${a}), 0 0 24px rgba(255,62,138,${a * 0.45}), 0 0 48px rgba(255,62,138,${a * 0.2})`;

export const GC = (a = 0.7) =>
  `0 0 8px rgba(0,212,204,${a}), 0 0 24px rgba(0,212,204,${a * 0.45}), 0 0 48px rgba(0,212,204,${a * 0.2})`;

export const GG = (a = 0.6) =>
  `0 0 10px rgba(201,168,76,${a}), 0 0 28px rgba(201,168,76,${a * 0.4})`;

// ── Font stack ─────────────────────────────────
export const FONTS = {
  display: "'Playfair Display', serif",   // headings / marquee
  body:    "'Crimson Text', serif",        // paragraphs / track titles
  ui:      "'Karla', sans-serif",          // nav / labels / buttons
};

export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Karla:wght@300;400;500&display=swap";

// ── Animation durations ────────────────────────
export const TIMING = {
  pulseP:      "2.8s",   // pink neon pulse
  pulseC:      "3.2s",   // cyan neon pulse
  borderGlow:  "2.5s",   // hero button border breathe
  flicker:     "11s",    // title flicker
  scanline:    "9s",     // CRT scanline
};

// ── CSS class styles ───────────────────────────
// All hover states, animations, and global rules live here.
// C, GP, GC, TIMING are interpolated so changing the values
// above automatically updates every class that uses them.
export function buildCSS() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes wavebar {
      from { height: 3px; }
      to   { height: 17px; }
    }
    @keyframes curtainUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes flicker {
      0%, 89%, 91%, 93%, 100% { opacity: 1; }
      90%  { opacity: 0.6; }
      92%  { opacity: 0.85; }
    }
    @keyframes neonPulseP {
      0%, 100% { text-shadow: ${GP(0.9)}; }
      50%      { text-shadow: ${GP(0.35)}; }
    }
    @keyframes neonPulseC {
      0%, 100% { text-shadow: ${GC(0.9)}; }
      50%      { text-shadow: ${GC(0.35)}; }
    }
    @keyframes borderGlowP {
      0%, 100% { box-shadow: inset 0 0 0 1px ${C.neonPink}, 0 0 12px rgba(255,62,138,0.4); }
      50%      { box-shadow: inset 0 0 0 1px ${C.neonPink}, 0 0 4px  rgba(255,62,138,0.15); }
    }
    @keyframes scanline {
      from { top: -4px; }
      to   { top: 100%; }
    }

    /* Entry animations */
    .curtain   { animation: curtainUp .9s cubic-bezier(.22,.68,0,1.2) forwards; opacity: 0; }
    .d1        { animation-delay: .15s; }
    .d2        { animation-delay: .35s; }
    .d3        { animation-delay: .55s; }
    .d4        { animation-delay: .75s; }

    /* Persistent animations */
    .title-flicker  { animation: flicker ${TIMING.flicker} infinite; }
    .pulse-p        { animation: neonPulseP ${TIMING.pulseP} ease-in-out infinite; }
    .pulse-c        { animation: neonPulseC ${TIMING.pulseC} ease-in-out infinite; }
    .border-glow-p  { animation: borderGlowP ${TIMING.borderGlow} ease-in-out infinite; }

    /* Nav */
    .nav-link { transition: color .2s, text-shadow .2s; }
    .nav-link:hover { color: ${C.neonCyan} !important; text-shadow: ${GC(0.8)}; cursor: pointer; }

    /* Track list */
    .track-row { transition: background .18s; }
    .track-row:hover { background: rgba(255,62,138,0.05); }

    /* Buttons */
    .ticket-btn { transition: all .25s; }
    .ticket-btn:hover {
      background: transparent !important;
      border-color: ${C.neonPink} !important;
      color: ${C.neonPink} !important;
      text-shadow: ${GP(0.7)};
      box-shadow: 0 0 18px rgba(255,62,138,0.18) !important;
    }
    .stream-btn { transition: all .2s; }
    .stream-btn:hover {
      border-color: ${C.neonCyan} !important;
      color: ${C.neonCyan} !important;
      text-shadow: ${GC(0.6)};
    }
    .submit-btn { transition: all .25s; }
    .submit-btn:hover {
      border-color: ${C.neonPink} !important;
      color: ${C.neonPink} !important;
      text-shadow: ${GP(0.7)};
      box-shadow: 0 0 22px rgba(255,62,138,0.18) !important;
    }

    /* Merch cards */
    .merch-card { transition: border-color .25s, box-shadow .25s; }
    .merch-card:hover {
      border-color: ${C.neonPink} !important;
      box-shadow: 0 0 24px rgba(255,62,138,0.14) !important;
    }

    /* Footer social links */
    .social-link { transition: color .2s, text-shadow .2s; }
    .social-link:hover { color: ${C.neonPink} !important; text-shadow: ${GP(0.7)}; }

    /* Form inputs */
    input::placeholder, textarea::placeholder { color: ${C.sepia}; }
    input:focus, textarea:focus {
      border-color: ${C.neonCyan} !important;
      outline: none;
      box-shadow: 0 2px 0 rgba(0,212,204,0.35);
    }
  `;
}
