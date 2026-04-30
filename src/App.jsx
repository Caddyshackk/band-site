import { useState, useEffect, useRef } from "react";
import { C, GP, GC, GG, FONTS, FONT_URL, buildCSS } from "./theme";

// ─────────────────────────────────────────────
//  CONTENT — swap with real band data
// ─────────────────────────────────────────────

const BAND_NAME = "The Hollow Pines";
const TAGLINE   = "Somewhere between dusk and a long drive home.";
const NEXT_SHOW = new Date("2026-04-12T20:00:00");

const TRACKS = [
  { id:1, title:"Golden Hours",    duration:"3:42", album:"Somewhere Between", totalSec:222 },
  { id:2, title:"Paper Walls",     duration:"4:11", album:"Somewhere Between", totalSec:251 },
  { id:3, title:"January Light",   duration:"3:28", album:"Somewhere Between", totalSec:208 },
  { id:4, title:"Drift",           duration:"5:02", album:"B-Sides",           totalSec:302 },
  { id:5, title:"Colour of Rain",  duration:"3:55", album:"B-Sides",           totalSec:235 },
];

const SHOWS = [
  { date:"APR 12", venue:"The Foundry",    city:"Philadelphia, PA" },
  { date:"APR 19", venue:"Schubas Tavern", city:"Chicago, IL" },
  { date:"MAY 3",  venue:"Troubadour",     city:"Los Angeles, CA" },
  { date:"MAY 17", venue:"Rough Trade",    city:"Brooklyn, NY" },
  { date:"JUN 7",  venue:"The Echo",       city:"Los Angeles, CA" },
];

const MERCH = [
  { id:1, name:"Somewhere Between Tee",  type:"Apparel",   price:"$28", tag:"New",    url:"#" },
  { id:2, name:"Drift Hoodie",           type:"Apparel",   price:"$58", tag:"",       url:"#" },
  { id:3, name:"Somewhere Between LP",   type:"Vinyl",     price:"$24", tag:"Ltd.",   url:"#" },
  { id:4, name:'B-Sides 7"',             type:"Vinyl",     price:"$14", tag:"",       url:"#" },
  { id:5, name:"Wave Dad Hat",           type:"Accessory", price:"$32", tag:"",       url:"#" },
  { id:6, name:"Tour Poster 18x24",      type:"Print",     price:"$18", tag:"Signed", url:"#" },
];

const STATS = [
  { label:"Monthly Listeners", value:142000, suffix:"+" },
  { label:"Shows Played",      value:312,    suffix:""  },
  { label:"Cities",            value:48,     suffix:""  },
  { label:"Countries",         value:11,     suffix:""  },
];

const GALLERY = [
  { id:1, label:"On Stage — Chicago",  grad:"linear-gradient(135deg,#1C1208,#3D2010)" },
  { id:2, label:"Studio Session",      grad:"linear-gradient(135deg,#0A1020,#1A2840)" },
  { id:3, label:"Soundcheck — LA",     grad:"linear-gradient(135deg,#1A0A20,#2A1535)" },
  { id:4, label:"After Show",          grad:"linear-gradient(135deg,#0A1A10,#152A1A)" },
  { id:5, label:"Tour Bus Life",       grad:"linear-gradient(135deg,#200A0A,#3A1515)" },
  { id:6, label:"Brooklyn Night",      grad:"linear-gradient(135deg,#0A0A1A,#15152A)" },
];

// ─────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = target / 60;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [active, target]);
  return val;
}

function useCountdown(target) {
  const [time, setTime] = useState({ d:0,h:0,m:0,s:0 });
  useEffect(() => {
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setTime({ d:0,h:0,m:0,s:0 });
      setTime({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    calc(); const t = setInterval(calc,1000); return ()=>clearInterval(t);
  }, [target]);
  return time;
}

function fmtTime(s) { return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`; }

// ─────────────────────────────────────────────
//  SMALL COMPONENTS
// ─────────────────────────────────────────────

function WaveBars({ active }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:2,height:20,flex:1}}>
      {Array.from({length:16}).map((_,i)=>(
        <div key={i} style={{width:2,borderRadius:1,background:C.neonCyan,height:active?undefined:3,
          boxShadow:active?`0 0 6px rgba(0,212,204,0.9),0 0 12px rgba(0,212,204,0.4)`:"none",
          animation:active?`wavebar ${0.38+(i%5)*0.11}s ease-in-out infinite alternate`:"none"}}/>
      ))}
    </div>
  );
}

function MarqueeDots({ center=false }) {
  const pat = ["gold","pink","gold","cyan","gold","pink","gold","cyan","gold","gold","pink","gold","cyan","gold","pink","gold","cyan","gold"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:center?"center":"flex-start",gap:9,margin:"1.8rem 0"}}>
      {pat.map((t,i)=>{
        const bg   = t==="pink"?C.neonPink:t==="cyan"?C.neonCyan:i%3===0?C.gold:C.goldDim;
        const glow = t==="pink"?`0 0 6px rgba(255,62,138,0.95)`:t==="cyan"?`0 0 6px rgba(0,212,204,0.95)`:"none";
        return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:bg,opacity:t==="gold"&&i%3!==0?0.45:1,boxShadow:glow,flexShrink:0}}/>;
      })}
    </div>
  );
}

function Divider({ color="gold" }) {
  const col = color==="pink"?C.neonPink:color==="cyan"?C.neonCyan:C.gold;
  return <div style={{height:1,background:`linear-gradient(90deg,transparent,${col},transparent)`,margin:"0 2.5rem",opacity:0.3}}/>;
}

// ─────────────────────────────────────────────
//  INTRO SCREEN
// ─────────────────────────────────────────────

function IntroScreen({ onDone }) {
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(()=>setFade(true), 1800);
    const t2 = setTimeout(()=>onDone(), 2500);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",opacity:fade?0:1,transition:"opacity .7s ease",pointerEvents:fade?"none":"all"}}>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 60% 60% at 50% 50%,#2A1A08,${C.bg})`}}/>
      <p style={{fontFamily:FONTS.ui,fontSize:"0.65rem",letterSpacing:"0.35em",textTransform:"uppercase",
        color:C.neonPink,textShadow:GP(0.9),marginBottom:"1.5rem",position:"relative",
        animation:"pulseP 2.8s ease-in-out infinite"}}>✦ &nbsp; Now Presenting &nbsp; ✦</p>
      <h1 style={{fontFamily:FONTS.display,fontSize:"clamp(2.5rem,8vw,6rem)",fontWeight:900,
        color:C.ivory,textTransform:"uppercase",letterSpacing:"0.06em",lineHeight:1,
        position:"relative",textAlign:"center"}}>{BAND_NAME}</h1>
      <div style={{width:120,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"2rem auto",opacity:0.6}}/>
      <div style={{display:"flex",gap:6,position:"relative"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.gold,
            animation:`introFade 1.2s ease-in-out ${i*0.2}s infinite alternate`}}/>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CUSTOM CURSOR
// ─────────────────────────────────────────────

function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef  = useRef(null);
  const pos     = useRef({x:0,y:0});
  const cur     = useRef({x:0,y:0});

  useEffect(() => {
    const onMove = e => { pos.current = {x:e.clientX,y:e.clientY}; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.12;
      cur.current.y += (pos.current.y - cur.current.y) * 0.12;
      if (ringRef.current) ringRef.current.style.transform = `translate(${cur.current.x-16}px,${cur.current.y-16}px)`;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${pos.current.x-3}px,${pos.current.y-3}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{position:"fixed",top:0,left:0,width:32,height:32,borderRadius:"50%",
        border:`1px solid ${C.neonPink}`,boxShadow:GP(0.4),pointerEvents:"none",zIndex:9999}}/>
      <div ref={dotRef} style={{position:"fixed",top:0,left:0,width:6,height:6,borderRadius:"50%",
        background:C.neonPink,boxShadow:GP(0.9),pointerEvents:"none",zIndex:9999}}/>
    </>
  );
}

// ─────────────────────────────────────────────
//  STICKY AUDIO PLAYER
// ─────────────────────────────────────────────

function StickyPlayer({ track, playing, onToggle, onPrev, onNext, progress, onSeek }) {
  if (!track) return null;
  const btnStyle = {width:32,height:32,borderRadius:"50%",border:`1px solid ${C.border}`,
    background:"transparent",color:C.gold,cursor:"pointer",display:"flex",
    alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontFamily:FONTS.ui};
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(10,7,5,0.97)",
      backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,padding:"0.75rem 2.5rem",
      display:"flex",alignItems:"center",gap:"1.5rem",
      boxShadow:`0 -4px 40px rgba(0,0,0,0.6),0 -1px 0 rgba(255,62,138,0.15)`}}>
      <div style={{minWidth:180}}>
        <p style={{fontFamily:FONTS.body,fontSize:"0.95rem",color:C.ivory,marginBottom:2}}>{track.title}</p>
        <p style={{fontSize:"0.68rem",color:C.sepia,letterSpacing:"0.06em"}}>{track.album}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.8rem"}}>
        <button onClick={onPrev} style={btnStyle}>⏮</button>
        <button onClick={onToggle} style={{...btnStyle,width:38,height:38,
          background:"rgba(255,62,138,0.12)",border:`1px solid ${C.neonPink}`,
          color:C.neonPink,fontSize:"0.9rem",boxShadow:GP(0.5)}}>
          {playing?"⏸":"▶"}
        </button>
        <button onClick={onNext} style={btnStyle}>⏭</button>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:"0.75rem"}}>
        <span style={{fontSize:"0.68rem",color:C.sepia,flexShrink:0,minWidth:32}}>
          {fmtTime(Math.floor(progress*track.totalSec))}
        </span>
        <div style={{flex:1,height:3,background:"rgba(201,168,76,0.15)",borderRadius:2,cursor:"pointer",position:"relative"}}
          onClick={e=>{const r=e.currentTarget.getBoundingClientRect();onSeek((e.clientX-r.left)/r.width);}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",borderRadius:2,
            background:`linear-gradient(90deg,${C.neonPink},${C.neonCyan})`,
            width:`${progress*100}%`,boxShadow:`0 0 6px rgba(255,62,138,0.6)`}}/>
          <div style={{position:"absolute",top:"50%",transform:"translate(-50%,-50%)",width:10,height:10,
            borderRadius:"50%",background:C.neonPink,boxShadow:GP(0.8),left:`${progress*100}%`}}/>
        </div>
        <span style={{fontSize:"0.68rem",color:C.sepia,flexShrink:0,minWidth:32}}>{track.duration}</span>
      </div>
      <WaveBars active={playing}/>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MOBILE NAV
// ─────────────────────────────────────────────

function MobileNav({ open, onClose, go }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:150,background:"rgba(10,7,5,0.98)",
      backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",gap:"2.5rem"}}>
      <button onClick={onClose} style={{position:"absolute",top:"1.5rem",right:"2rem",
        background:"none",border:"none",color:C.neonPink,fontSize:"1.5rem",
        cursor:"pointer",textShadow:GP(0.7)}}>✕</button>
      {["About","Music","Shows","Gallery","Merch","Contact"].map(l=>(
        <span key={l} style={{fontFamily:FONTS.display,fontSize:"2.2rem",fontWeight:700,
          color:C.ivory,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",
          transition:"color .2s,text-shadow .2s"}}
          onClick={()=>{go(l.toLowerCase());onClose();}}
          onMouseEnter={e=>{e.target.style.color=C.neonPink;e.target.style.textShadow=GP(0.7);}}
          onMouseLeave={e=>{e.target.style.color=C.ivory;e.target.style.textShadow="none";}}>
          {l}
        </span>
      ))}
      <MarqueeDots center/>
    </div>
  );
}

// ─────────────────────────────────────────────
//  STAT COUNTER
// ─────────────────────────────────────────────

function StatCounter({ stat, active }) {
  const val = useCountUp(stat.value, active);
  return (
    <div style={{textAlign:"center",padding:"0 2rem"}}>
      <p style={{fontFamily:FONTS.display,fontSize:"clamp(2rem,4vw,3.5rem)",fontWeight:900,
        color:C.neonPink,textShadow:GP(0.6),lineHeight:1,marginBottom:"0.5rem"}}>
        {val.toLocaleString()}{stat.suffix}
      </p>
      <p style={{fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase",color:C.sepia}}>{stat.label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  LIGHTBOX
// ─────────────────────────────────────────────

function Lightbox({ photo, onClose }) {
  useEffect(()=>{
    const esc = e=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",esc);
    return ()=>window.removeEventListener("keydown",esc);
  },[onClose]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.92)",
      backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center"}}
      onClick={onClose}>
      <div style={{maxWidth:"80vw",maxHeight:"80vh",aspectRatio:"16/9",background:photo.grad,
        border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",
        position:"relative",boxShadow:`0 0 60px rgba(255,62,138,0.2),0 0 120px rgba(0,212,204,0.1)`}}
        onClick={e=>e.stopPropagation()}>
        <div style={{position:"absolute",inset:16,border:`1px solid rgba(201,168,76,0.15)`}}/>
        <div style={{textAlign:"center",position:"relative",zIndex:1}}>
          <p style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:"0.5rem"}}>Photo Placeholder</p>
          <p style={{fontFamily:FONTS.body,fontStyle:"italic",fontSize:"1.1rem",color:C.dimText}}>{photo.label}</p>
        </div>
        <button onClick={onClose} style={{position:"absolute",top:12,right:12,background:"none",
          border:"none",color:C.neonPink,fontSize:"1.2rem",cursor:"pointer",textShadow:GP(0.7)}}>✕</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COUNTDOWN
// ─────────────────────────────────────────────

function CountdownUnit({ val, label }) {
  return (
    <div style={{textAlign:"center",minWidth:70}}>
      <div style={{fontFamily:FONTS.display,fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,
        color:C.neonCyan,textShadow:GC(0.7),lineHeight:1,
        border:`1px solid rgba(0,212,204,0.2)`,padding:"0.5rem 1rem",
        background:"rgba(0,212,204,0.05)",marginBottom:"0.5rem"}}>
        {String(val).padStart(2,"0")}
      </div>
      <p style={{fontSize:"0.6rem",letterSpacing:"0.18em",textTransform:"uppercase",color:C.sepia}}>{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────

export default function App() {
  const [intro,       setIntro]       = useState(true);
  const [playing,     setPlaying]     = useState(false);
  const [trackIdx,    setTrackIdx]    = useState(null);
  const [progress,    setProgress]    = useState(0);
  const [sent,        setSent]        = useState(false);
  const [subSent,     setSubSent]     = useState(false);
  const [hovShow,     setHovShow]     = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [lightbox,    setLightbox]    = useState(null);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef     = useRef(null);
  const timerRef     = useRef(null);
  const countdown    = useCountdown(NEXT_SHOW);

  useScrollReveal();

  // inject fonts + CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_URL;
    document.head.appendChild(link);
    const st = document.createElement("style");
    st.textContent = buildCSS() + `
      @keyframes introFade { from{opacity:0.2} to{opacity:1} }
      @keyframes pulseP    { 0%,100%{text-shadow:${GP(0.9)}} 50%{text-shadow:${GP(0.35)}} }
      .reveal        { opacity:0; transform:translateY(32px); transition:opacity .75s ease,transform .75s ease; }
      .reveal-left   { opacity:0; transform:translateX(-32px); transition:opacity .75s ease,transform .75s ease; }
      .reveal-right  { opacity:0; transform:translateX(32px);  transition:opacity .75s ease,transform .75s ease; }
      .revealed      { opacity:1 !important; transform:translate(0,0) !important; }
      * { cursor: none !important; }
    `;
    document.head.appendChild(st);
  }, []);

  // stats observer
  useEffect(() => {
    if (!statsRef.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, {threshold:0.3});
    io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  // simulated playback progress
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!playing || trackIdx === null) return;
    const total = TRACKS[trackIdx].totalSec;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 1) {
          clearInterval(timerRef.current);
          setTrackIdx(i => (i + 1) % TRACKS.length);
          return 0;
        }
        return p + 1 / total;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [playing, trackIdx]);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const handlePlay = idx => {
    if (trackIdx === idx) setPlaying(p => !p);
    else { setTrackIdx(idx); setProgress(0); setPlaying(true); }
  };
  const handlePrev = () => { setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };
  const handleNext = () => { setTrackIdx(i => (i + 1) % TRACKS.length); setProgress(0); };

  const track = trackIdx !== null ? TRACKS[trackIdx] : null;

  return (
    <>
      <CustomCursor/>
      {intro && <IntroScreen onDone={() => setIntro(false)}/>}
      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)}/>}
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} go={go}/>
      <StickyPlayer track={track} playing={playing}
        onToggle={() => setPlaying(p => !p)}
        onPrev={handlePrev} onNext={handleNext}
        progress={progress} onSeek={setProgress}/>

      <div style={{background:C.bg,color:C.cream,fontFamily:FONTS.ui,minHeight:"100vh",
        overflowX:"hidden",paddingBottom:track?"80px":"0"}}>

        {/* ── NAV ── */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",
          justifyContent:"space-between",padding:"1rem 2.5rem",backdropFilter:"blur(18px)",
          background:"rgba(10,7,5,0.92)",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontFamily:FONTS.display,fontSize:"1.1rem",fontWeight:700,letterSpacing:"0.1em",
            color:C.gold,textTransform:"uppercase",textShadow:GG(0.5),position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
  {BAND_NAME}
</span>
          <div style={{display:"flex",gap:"2rem"}}>
            {["About","Music","Shows","Gallery","Merch","Contact"].map(l => (
              <span key={l} className="nav-link" style={{fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase",color:C.sepia}} onClick={() => go(l.toLowerCase())}>{l}</span>
            ))}
          </div>
          <button onClick={() => setMenuOpen(true)} style={{background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",gap:5,padding:4}}>
            {[0,1,2].map(i => <div key={i} style={{width:22,height:1.5,background:C.gold,boxShadow:GG(0.4)}}/>)}
          </button>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",
          alignItems:"center",padding:"6rem 2.5rem 5rem",position:"relative",overflow:"hidden",textAlign:"center"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 65% at 50% 40%,#2A1A08,${C.bg} 72%)`}}/>
          <div style={{position:"absolute",top:"15%",left:"8%",width:300,height:300,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"20%",right:"6%",width:260,height:260,borderRadius:"50%",background:C.neonCyan,opacity:0.05,filter:"blur(70px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
            <div style={{position:"absolute",left:0,right:0,height:"3px",background:"rgba(0,212,204,0.018)",animation:"scanline 9s linear infinite"}}/>
          </div>
          <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",backgroundSize:"180px"}}/>
          <div style={{position:"absolute",inset:"3rem",border:`1px solid ${C.border}`,pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:"3.4rem",border:`1px solid rgba(201,168,76,0.07)`,pointerEvents:"none"}}/>
          {[
            {t:"3rem",l:"3rem",rot:"",             col:C.neonPink,cls:"pulse-p"},
            {t:"3rem",r:"3rem",rot:"scaleX(-1)",   col:C.neonCyan,cls:"pulse-c"},
            {b:"3rem",l:"3rem",rot:"scaleY(-1)",   col:C.neonCyan,cls:"pulse-c"},
            {b:"3rem",r:"3rem",rot:"scale(-1,-1)", col:C.neonPink,cls:"pulse-p"},
          ].map((o,i) => {
            const p = {position:"absolute"};
            if(o.t) p.top=o.t; if(o.b) p.bottom=o.b;
            if(o.l) p.left=o.l; if(o.r) p.right=o.r;
            if(o.rot) p.transform=o.rot;
            return (<svg key={i} className={o.cls} style={{...p,width:32,height:32,filter:`drop-shadow(0 0 5px ${o.col})`}} viewBox="0 0 28 28">
              <path d="M2 2 L2 14 M2 2 L14 2" fill="none" stroke={o.col} strokeWidth="1.8"/>
            </svg>);
          })}
          <div style={{position:"relative",zIndex:2,maxWidth:820}}>
            <p className="curtain d1 pulse-p" style={{fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.3em",textTransform:"uppercase",color:C.neonPink,marginBottom:"1.6rem"}}>✦ &nbsp; Now Presenting &nbsp; ✦</p>
            <h1 className="curtain d2 title-flicker" style={{fontFamily:FONTS.display,fontSize:"clamp(3.5rem,10vw,9rem)",fontWeight:900,lineHeight:0.9,marginBottom:"1.4rem",color:C.ivory,letterSpacing:"0.02em",textTransform:"uppercase"}}>
              The<br/><span style={{color:C.gold,textShadow:GG(0.7)}}>Hollow</span><br/>Pines
            </h1>
            <MarqueeDots center/>
            <p className="curtain d3" style={{fontFamily:FONTS.body,fontSize:"1.25rem",fontStyle:"italic",color:C.dimText,maxWidth:440,lineHeight:1.75,margin:"0 auto 2.5rem"}}>{TAGLINE}</p>
            <div className="curtain d4" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
              <button className="submit-btn" onClick={() => go("music")} style={{padding:"0.9rem 2.6rem",background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,fontFamily:FONTS.ui,textShadow:GG(0.5)}}>Listen Now</button>
              <button className="border-glow-p" onClick={() => go("shows")} style={{padding:"0.9rem 2.6rem",background:"rgba(255,62,138,0.08)",color:C.neonPink,border:`1px solid ${C.neonPink}`,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,fontFamily:FONTS.ui,textShadow:GP(0.7)}}>See Shows</button>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} style={{background:C.surface,padding:"4rem 2.5rem",borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`}}>
          <div style={{maxWidth:1060,margin:"0 auto",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:"2rem"}}>
            {STATS.map((s,i) => <StatCounter key={i} stat={s} active={statsActive}/>)}
          </div>
        </section>

        <Divider/>

        {/* ── ABOUT ── */}
        <section id="about" style={{padding:"7rem 2.5rem",maxWidth:1060,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center"}}>
            <div className="reveal reveal-left">
              <div style={{aspectRatio:"3/4",background:`linear-gradient(160deg,#1C1208,#2A1A08 60%,#0F0B06)`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:12,border:`1px solid rgba(201,168,76,0.12)`}}/>
                <div style={{position:"absolute",bottom:0,right:0,width:120,height:120,borderRadius:"50%",background:C.neonPink,opacity:0.06,filter:"blur(30px)"}}/>
                <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.14em",textTransform:"uppercase",position:"relative",zIndex:1}}>Band Photo</span>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:`linear-gradient(to top,${C.bg},transparent)`}}/>
              </div>
              <p style={{textAlign:"center",marginTop:"0.8rem",fontFamily:FONTS.body,fontStyle:"italic",fontSize:"0.85rem",color:C.sepia}}>Est. 2021</p>
            </div>
            <div className="reveal reveal-right">
              <p className="pulse-c" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonCyan,marginBottom:"0.8rem"}}>About the Band</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,lineHeight:1.15,marginBottom:"1.8rem",color:C.ivory}}>Songs for the <em>in-between.</em></h2>
              <p style={{fontFamily:FONTS.body,fontSize:"1.1rem",lineHeight:1.9,color:C.dimText,marginBottom:"1.2rem"}}>The Hollow Pines formed in 2021 when four friends started writing songs in a rented garage on the outskirts of town. What started as late-night sessions became a full band — built on shared playlists, borrowed instruments, and a love of storytelling.</p>
              <blockquote style={{fontFamily:FONTS.display,fontSize:"1.35rem",fontStyle:"italic",fontWeight:400,color:C.gold,lineHeight:1.5,margin:"2rem 0",paddingLeft:"1.4rem",borderLeft:`2px solid ${C.neonPink}`}}>
                "We make the kind of music you listen to when you don't have the words."
              </blockquote>
              <p style={{fontFamily:FONTS.body,fontSize:"1.1rem",lineHeight:1.9,color:C.dimText}}>Influences ranging from Phoebe Bridgers to Bon Iver. Their debut EP <em style={{color:C.ivory}}>Somewhere Between</em> is out now on all platforms.</p>
              <MarqueeDots/>
            </div>
          </div>
        </section>

        <Divider/>

        {/* ── MUSIC ── */}
        <section id="music" style={{background:C.surface,padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"20%",right:"-5%",width:400,height:400,borderRadius:"50%",background:C.neonCyan,opacity:0.035,filter:"blur(90px)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"10%",left:"-3%",width:300,height:300,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            <div className="reveal">
              <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem",textAlign:"center"}}>Discography</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory,marginBottom:"0.5rem",textAlign:"center"}}>Latest Tracks</h2>
              <p style={{fontFamily:FONTS.body,fontStyle:"italic",fontSize:"1rem",textAlign:"center",marginBottom:"3rem",color:C.neonCyan,textShadow:GC(0.5)}}>— Now Spinning —</p>
            </div>
            <ul style={{listStyle:"none"}}>
              {TRACKS.map((t,i) => (
                <li key={t.id} className="reveal track-row" style={{display:"flex",alignItems:"center",padding:"1rem 0.75rem",
                  borderBottom:`1px solid ${C.border}`,gap:"1.2rem",cursor:"pointer",borderRadius:3,transitionDelay:`${i*0.06}s`}}
                  onClick={() => handlePlay(i)}>
                  <span style={{width:22,fontFamily:FONTS.display,fontSize:"0.8rem",color:C.goldDim,textAlign:"center",flexShrink:0}}>{i+1}</span>
                  <button style={{width:32,height:32,borderRadius:"50%",
                    border:`1px solid ${trackIdx===i?C.neonCyan:C.border}`,
                    background:trackIdx===i?`rgba(0,212,204,0.12)`:"transparent",
                    color:trackIdx===i?C.neonCyan:C.gold,
                    boxShadow:trackIdx===i?GC(0.65):"none",
                    display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"0.65rem",flexShrink:0,transition:"all .25s"}}
                    onClick={e => {e.stopPropagation(); handlePlay(i);}}>
                    {trackIdx===i&&playing?"⏸":"▶"}
                  </button>
                  <span style={{flex:1,fontFamily:FONTS.body,fontSize:"1.05rem",color:trackIdx===i?C.neonCyan:C.ivory,textShadow:trackIdx===i?GC(0.6):"none",transition:"color .25s,text-shadow .25s"}}>{t.title}</span>
                  {trackIdx===i&&playing && <WaveBars active/>}
                  {trackIdx===i && (
                    <div style={{width:80,height:2,background:"rgba(201,168,76,0.15)",borderRadius:1,flexShrink:0}}>
                      <div style={{height:"100%",borderRadius:1,background:`linear-gradient(90deg,${C.neonPink},${C.neonCyan})`,width:`${progress*100}%`}}/>
                    </div>
                  )}
                  <span style={{fontSize:"0.72rem",color:C.sepia,flexShrink:0,letterSpacing:"0.06em"}}>{t.album}</span>
                  <span style={{fontSize:"0.72rem",color:C.sepia,flexShrink:0}}>{t.duration}</span>
                </li>
              ))}
            </ul>
            <div className="reveal" style={{display:"flex",gap:"0.8rem",marginTop:"2.5rem",justifyContent:"center"}}>
              {["Spotify","Apple Music","YouTube"].map(p => (
                <button key={p} className="stream-btn" style={{padding:"0.55rem 1.3rem",border:`1px solid ${C.border}`,background:"transparent",color:C.sepia,fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:FONTS.ui}}>{p}</button>
              ))}
            </div>
          </div>
        </section>

        <Divider color="pink"/>

        {/* ── VIDEO ── */}
        <section id="video" style={{padding:"7rem 2.5rem",maxWidth:1060,margin:"0 auto"}}>
          <div className="reveal" style={{textAlign:"center",marginBottom:"3rem"}}>
            <p className="pulse-c" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonCyan,marginBottom:"0.8rem"}}>Watch</p>
            <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory}}>Latest Video</h2>
          </div>
          {/* Replace this div with: <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameBorder="0" allowFullScreen/> */}
          <div className="reveal" style={{position:"relative",aspectRatio:"16/9",background:`linear-gradient(145deg,#1C1208,#2A1A08)`,
            border:`1px solid ${C.border}`,overflow:"hidden",
            boxShadow:`0 0 60px rgba(0,0,0,0.5),0 0 1px ${C.border}`}}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1.5rem"}}>
              <div style={{width:64,height:64,borderRadius:"50%",border:`1px solid ${C.neonPink}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:GP(0.6),background:"rgba(255,62,138,0.08)"}}>
                <span style={{color:C.neonPink,fontSize:"1.4rem",textShadow:GP(0.8)}}>▶</span>
              </div>
              <p style={{fontFamily:FONTS.body,fontStyle:"italic",color:C.dimText,fontSize:"0.9rem"}}>"Golden Hours" — Official Music Video</p>
              <p style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.12em",textTransform:"uppercase"}}>Replace with YouTube iframe</p>
            </div>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.neonPink},transparent)`,opacity:0.4}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${C.neonCyan},transparent)`,opacity:0.4}}/>
          </div>
        </section>

        <Divider/>

        {/* ── SHOWS ── */}
        <section id="shows" style={{padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:"10%",width:350,height:350,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            {/* countdown */}
            <div className="reveal" style={{marginBottom:"4rem",padding:"2rem",background:C.surface,border:`1px solid ${C.border}`,textAlign:"center"}}>
              <p style={{fontSize:"0.62rem",letterSpacing:"0.26em",textTransform:"uppercase",color:C.sepia,marginBottom:"1.2rem"}}>Next Show Countdown</p>
              <div style={{display:"flex",justifyContent:"center",gap:"1.5rem",flexWrap:"wrap"}}>
                <CountdownUnit val={countdown.d} label="Days"/>
                <CountdownUnit val={countdown.h} label="Hours"/>
                <CountdownUnit val={countdown.m} label="Minutes"/>
                <CountdownUnit val={countdown.s} label="Seconds"/>
              </div>
              <p style={{marginTop:"1.2rem",fontFamily:FONTS.body,fontStyle:"italic",fontSize:"0.85rem",color:C.dimText}}>{SHOWS[0].venue} · {SHOWS[0].city}</p>
            </div>
            <div className="reveal">
              <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>On Tour</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,marginBottom:"2.5rem",color:C.ivory}}>Upcoming Engagements</h2>
            </div>
            {SHOWS.map((s,i) => (
              <div key={s.date+s.venue} className="reveal" style={{transitionDelay:`${i*0.08}s`}}
                onMouseEnter={() => setHovShow(i)} onMouseLeave={() => setHovShow(null)}>
                <div style={{display:"flex",alignItems:"center",padding:"1.5rem 0.5rem",
                  borderBottom:`1px solid ${hovShow===i?"rgba(255,62,138,0.3)":C.border}`,
                  gap:"1.5rem",transition:"border-color .25s"}}>
                  <span style={{fontFamily:FONTS.display,fontSize:"0.88rem",fontWeight:700,color:hovShow===i?C.neonPink:C.gold,textShadow:hovShow===i?GP(0.7):GG(0.3),width:68,flexShrink:0,transition:"color .25s,text-shadow .25s"}}>{s.date}</span>
                  <div style={{width:1,height:28,background:hovShow===i?"rgba(255,62,138,0.5)":C.border,transition:"background .25s",flexShrink:0}}/>
                  <span style={{flex:1,fontFamily:FONTS.body,fontSize:"1.1rem",fontWeight:600,color:C.ivory}}>{s.venue}</span>
                  <span style={{fontSize:"0.82rem",color:C.sepia,flex:1,fontFamily:FONTS.body,fontStyle:"italic"}}>{s.city}</span>
                  <button className="ticket-btn" style={{padding:"0.48rem 1.2rem",border:`1px solid ${C.wine}`,background:"transparent",fontSize:"0.65rem",letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",fontFamily:FONTS.ui,color:C.wine}}>Tickets</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider color="cyan"/>

        {/* ── GALLERY ── */}
        <section id="gallery" style={{padding:"7rem 2.5rem",background:C.surface,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"30%",left:"-5%",width:400,height:400,borderRadius:"50%",background:C.neonPink,opacity:0.03,filter:"blur(100px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            <div className="reveal" style={{textAlign:"center",marginBottom:"3rem"}}>
              <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>Gallery</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory}}>Behind the Lens</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.8rem"}}>
              {GALLERY.map((photo,i) => (
                <div key={photo.id} className="reveal" style={{transitionDelay:`${i*0.07}s`}} onClick={() => setLightbox(photo)}>
                  <div style={{aspectRatio:"4/3",background:photo.grad,border:`1px solid ${C.border}`,
                    display:"flex",alignItems:"flex-end",padding:"0.8rem",position:"relative",overflow:"hidden",
                    transition:"border-color .25s,box-shadow .25s",cursor:"pointer"}}
                    onMouseEnter={e => {e.currentTarget.style.borderColor=C.neonPink;e.currentTarget.style.boxShadow=`0 0 20px rgba(255,62,138,0.15)`;}}
                    onMouseLeave={e => {e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)"}}/>
                    <p style={{position:"relative",fontFamily:FONTS.body,fontStyle:"italic",fontSize:"0.78rem",color:"rgba(242,232,213,0.7)"}}>{photo.label}</p>
                    <div style={{position:"absolute",top:8,right:8,width:24,height:24,borderRadius:"50%",border:`1px solid ${C.neonPink}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",color:C.neonPink,opacity:0.7}}>⊕</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider color="pink"/>

        {/* ── MERCH ── */}
        <section id="merch" style={{padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:"5%",right:"5%",width:380,height:380,borderRadius:"50%",background:C.neonCyan,opacity:0.04,filter:"blur(90px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
            <div className="reveal">
              <p className="pulse-c" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonCyan,marginBottom:"0.8rem"}}>Store</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory,marginBottom:"2.5rem"}}>Official Merch</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1.2rem"}}>
              {MERCH.map((item,i) => (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="reveal merch-card"
                  style={{textDecoration:"none",display:"block",background:C.bg,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer",transitionDelay:`${i*0.07}s`}}>
                  <div style={{aspectRatio:"4/3",background:`linear-gradient(145deg,#1C1208,#2A1A08)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",bottom:0,left:0,width:"100%",height:"40%",background:`linear-gradient(to top,rgba(255,62,138,0.06),transparent)`}}/>
                    <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:FONTS.ui,position:"relative",zIndex:1}}>{item.type}</span>
                    {item.tag && <span style={{position:"absolute",top:10,right:10,fontSize:"0.58rem",fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px",border:`1px solid ${C.neonPink}`,color:C.neonPink,textShadow:GP(0.8),zIndex:1}}>{item.tag}</span>}
                  </div>
                  <div style={{padding:"1rem 1.1rem",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <p style={{fontFamily:FONTS.body,fontSize:"1rem",color:C.ivory,marginBottom:2}}>{item.name}</p>
                      <p style={{fontSize:"0.68rem",color:C.sepia,letterSpacing:"0.08em",textTransform:"uppercase"}}>{item.type}</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                      <span style={{fontFamily:FONTS.display,fontSize:"1rem",color:C.gold,fontWeight:700,textShadow:GG(0.4)}}>{item.price}</span>
                      <span style={{fontSize:"0.6rem",color:C.neonPink,letterSpacing:"0.12em",textTransform:"uppercase",textShadow:GP(0.7)}}>Shop →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <p style={{marginTop:"2rem",fontFamily:FONTS.body,fontStyle:"italic",fontSize:"0.9rem",color:C.sepia}}>
              All orders fulfilled via{" "}
              <a href="#" style={{color:C.neonCyan,textDecoration:"none",textShadow:GC(0.6)}}>Bandcamp</a>{" · "}
              <a href="#" style={{color:C.neonCyan,textDecoration:"none",textShadow:GC(0.6)}}>Shopify</a>
            </p>
          </div>
        </section>

        <Divider/>

        {/* ── NEWSLETTER ── */}
        <section style={{background:C.surface,padding:"5rem 2.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 50% 80% at 50% 50%,rgba(255,62,138,0.04),transparent)`}}/>
          <div className="reveal" style={{maxWidth:560,margin:"0 auto",textAlign:"center",position:"relative"}}>
            <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>Stay in the Loop</p>
            <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.6rem,3vw,2.4rem)",fontWeight:700,color:C.ivory,marginBottom:"1rem"}}>Join the Mailing List</h2>
            <p style={{fontFamily:FONTS.body,fontSize:"1rem",color:C.dimText,marginBottom:"2rem",lineHeight:1.75}}>New music, tour dates, and exclusive offers — straight to your inbox. No noise.</p>
            {subSent ? (
              <p style={{fontFamily:FONTS.display,fontSize:"1.5rem",fontWeight:700,color:C.neonPink,textShadow:GP(0.7)}}>You're on the list. ✦</p>
            ) : (
              <form onSubmit={e=>{e.preventDefault();setSubSent(true);}} style={{display:"flex",gap:"0.8rem",flexWrap:"wrap",justifyContent:"center"}}>
                <input type="email" placeholder="your@email.com" required
                  style={{flex:1,minWidth:220,padding:"0.85rem 1.2rem",border:`1px solid ${C.border}`,background:"rgba(201,168,76,0.04)",fontFamily:FONTS.body,fontSize:"1rem",color:C.cream,outline:"none"}}/>
                <button type="submit" className="submit-btn"
                  style={{padding:"0.85rem 2rem",background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,fontFamily:FONTS.ui,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",textShadow:GG(0.5),whiteSpace:"nowrap"}}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

        <Divider color="cyan"/>

        {/* ── CONTACT ── */}
        <section id="contact" style={{padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:0,left:"5%",width:350,height:350,borderRadius:"50%",background:C.neonCyan,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
          <div style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start",position:"relative"}}>
            <div className="reveal reveal-left">
              <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>Get in Touch</p>
              <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,marginBottom:"1.5rem",color:C.ivory}}>Booking &<br/>Inquiries</h2>
              <p style={{fontFamily:FONTS.body,fontSize:"1.05rem",color:C.sepia,lineHeight:1.85,marginBottom:"2rem"}}>For booking, press inquiries, or just to say hello — reach out and we'll respond within 48 hours.</p>
              <MarqueeDots/>
              {[["Booking","booking@thehollowpines.com"],["Press","press@thehollowpines.com"],["Management","mgmt@thehollowpines.com"]].map(([lbl,val]) => (
                <p key={lbl} style={{fontSize:"0.88rem",marginBottom:"0.6rem",fontFamily:FONTS.body}}>
                  <span style={{fontWeight:600,color:C.neonCyan,marginRight:10,fontSize:"0.62rem",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:FONTS.ui,textShadow:GC(0.5)}}>{lbl}</span>
                  <span style={{color:C.dimText}}>{val}</span>
                </p>
              ))}
            </div>
            <div className="reveal reveal-right">
              {sent ? (
                <div style={{paddingTop:"2.5rem",textAlign:"center"}}>
                  <p style={{fontFamily:FONTS.display,fontSize:"2.2rem",fontWeight:700,color:C.neonPink,textShadow:GP(0.8)}}>Thank you.</p>
                  <p style={{fontFamily:FONTS.body,fontStyle:"italic",color:C.sepia,marginTop:"0.6rem",fontSize:"1.05rem"}}>We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={e=>{e.preventDefault();setSent(true);}}>
                  {[["Name","text","Your name"],["Email","email","your@email.com"],["Inquiry Type","text","Booking / Press / General"]].map(([lbl,type,ph]) => (
                    <div key={lbl} style={{marginBottom:"1.4rem"}}>
                      <label style={{display:"block",fontSize:"0.62rem",letterSpacing:"0.16em",textTransform:"uppercase",fontWeight:500,color:C.neonCyan,marginBottom:"0.45rem",fontFamily:FONTS.ui,textShadow:GC(0.4)}}>{lbl}</label>
                      <input type={type} placeholder={ph} style={{width:"100%",padding:"0.7rem 0",border:"none",borderBottom:`1px solid rgba(201,168,76,0.25)`,background:"transparent",fontFamily:FONTS.body,fontSize:"1rem",color:C.cream,transition:"border-color .2s"}}/>
                    </div>
                  ))}
                  <div style={{marginBottom:"1.4rem"}}>
                    <label style={{display:"block",fontSize:"0.62rem",letterSpacing:"0.16em",textTransform:"uppercase",fontWeight:500,color:C.neonCyan,marginBottom:"0.45rem",fontFamily:FONTS.ui,textShadow:GC(0.4)}}>Message</label>
                    <textarea placeholder="Tell us more..." rows={4} style={{width:"100%",padding:"0.7rem 0",border:"none",borderBottom:`1px solid rgba(201,168,76,0.25)`,background:"transparent",fontFamily:FONTS.body,fontSize:"1rem",color:C.cream,resize:"none",transition:"border-color .2s"}}/>
                  </div>
                  <button type="submit" className="submit-btn" style={{marginTop:"0.8rem",padding:"0.85rem 2.4rem",background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,fontFamily:FONTS.ui,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",textShadow:GG(0.5)}}>
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{background:C.surface,padding:"2.5rem 2.5rem",borderTop:`1px solid rgba(255,62,138,0.2)`}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem"}}>
              <span style={{fontFamily:FONTS.display,color:C.gold,fontSize:"0.95rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",textShadow:GG(0.5)}}>{BAND_NAME}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {[C.neonPink,C.goldDim,C.neonCyan,C.neonPink,C.neonCyan,C.goldDim,C.neonPink].map((col,i) => (
                  <div key={i} style={{width:5,height:5,borderRadius:"50%",background:col,boxShadow:col===C.goldDim?"none":`0 0 6px ${col}`,opacity:col===C.goldDim?0.4:0.9}}/>
                ))}
              </div>
              <div style={{display:"flex",gap:"1.3rem"}}>
                {["Instagram","Spotify","TikTok","YouTube"].map(s => (
                  <a key={s} href="#" className="social-link" style={{color:C.sepia,textDecoration:"none",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>{s}</a>
                ))}
              </div>
            </div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:"1.2rem",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
              <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.08em"}}>© 2026 · All rights reserved</span>
              <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.08em"}}>Designed with ✦ and neon</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
