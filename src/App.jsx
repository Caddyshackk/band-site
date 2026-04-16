import { useState, useEffect } from "react";
import { C, GP, GC, GG, FONTS, FONT_URL, buildCSS } from "./theme";

// ─────────────────────────────────────────────
//  CONTENT — swap these out with real band data
// ─────────────────────────────────────────────

const TRACKS = [
  { id:1, title:"Golden Hours",    duration:"3:42", album:"Somewhere Between" },
  { id:2, title:"Paper Walls",     duration:"4:11", album:"Somewhere Between" },
  { id:3, title:"January Light",   duration:"3:28", album:"Somewhere Between" },
  { id:4, title:"Drift",           duration:"5:02", album:"B-Sides" },
  { id:5, title:"Colour of Rain",  duration:"3:55", album:"B-Sides" },
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

// ─────────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────────

function WaveBars({ active }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:2,height:20,flex:1}}>
      {Array.from({length:16}).map((_,i)=>(
        <div key={i} style={{
          width:2, borderRadius:1, background:C.neonCyan,
          height:active?undefined:3,
          boxShadow:active?`0 0 6px rgba(0,212,204,0.9), 0 0 12px rgba(0,212,204,0.4)`:"none",
          animation:active?`wavebar ${0.38+(i%5)*0.11}s ease-in-out infinite alternate`:"none",
        }}/>
      ))}
    </div>
  );
}

function MarqueeDots({ center=false }) {
  const pattern = ["gold","pink","gold","cyan","gold","pink","gold","cyan","gold","gold","pink","gold","cyan","gold","pink","gold","cyan","gold"];
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:center?"center":"flex-start",gap:9,margin:"1.8rem 0"}}>
      {pattern.map((type,i)=>{
        const bg      = type==="pink"?C.neonPink:type==="cyan"?C.neonCyan:i%3===0?C.gold:C.goldDim;
        const glow    = type==="pink"?`0 0 6px rgba(255,62,138,0.95)`:type==="cyan"?`0 0 6px rgba(0,212,204,0.95)`:"none";
        const opacity = type==="gold"&&i%3!==0?0.45:1;
        return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:bg,opacity,boxShadow:glow,flexShrink:0}}/>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────

export default function App() {
  const [playing, setPlaying] = useState(null);
  const [sent,    setSent]    = useState(false);
  const [hovShow, setHovShow] = useState(null);

  useEffect(()=>{
    // Load Google Fonts
    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = FONT_URL;
    document.head.appendChild(link);

    // Inject CSS from theme.js
    const style = document.createElement("style");
    style.textContent = buildCSS();
    document.head.appendChild(style);
  },[]);

  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <div style={{background:C.bg,color:C.cream,fontFamily:FONTS.ui,minHeight:"100vh",overflowX:"hidden"}}>

      {/* ── NAV ── */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 2.5rem",backdropFilter:"blur(18px)",background:"rgba(10,7,5,0.92)",borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontFamily:FONTS.display,fontSize:"1.1rem",fontWeight:700,letterSpacing:"0.1em",color:C.gold,textTransform:"uppercase",textShadow:GG(0.5),cursor:"default"}}>The Hollow Pines</span>
        <div style={{display:"flex",gap:"2rem"}}>
          {["About","Music","Shows","Merch","Contact"].map(l=>(
            <span key={l} className="nav-link" style={{fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase",color:C.sepia}} onClick={()=>go(l.toLowerCase())}>{l}</span>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"6rem 2.5rem 5rem",position:"relative",overflow:"hidden",textAlign:"center"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 70% 65% at 50% 40%, #2A1A08 0%, ${C.bg} 72%)`}}/>
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
        ].map((o,i)=>{
          const pos={position:"absolute"};
          if(o.t) pos.top=o.t; if(o.b) pos.bottom=o.b;
          if(o.l) pos.left=o.l; if(o.r) pos.right=o.r;
          if(o.rot) pos.transform=o.rot;
          return (
            <svg key={i} className={o.cls} style={{...pos,width:32,height:32,filter:`drop-shadow(0 0 5px ${o.col})`}} viewBox="0 0 28 28">
              <path d="M2 2 L2 14 M2 2 L14 2" fill="none" stroke={o.col} strokeWidth="1.8"/>
            </svg>
          );
        })}
        <div style={{position:"relative",zIndex:2,maxWidth:820}}>
          <p className="curtain d1 pulse-p" style={{fontSize:"0.68rem",fontWeight:500,letterSpacing:"0.3em",textTransform:"uppercase",color:C.neonPink,marginBottom:"1.6rem"}}>
            ✦ &nbsp; Now Presenting &nbsp; ✦
          </p>
          <h1 className="curtain d2 title-flicker" style={{fontFamily:FONTS.display,fontSize:"clamp(3.5rem,10vw,9rem)",fontWeight:900,lineHeight:0.9,marginBottom:"1.4rem",color:C.ivory,letterSpacing:"0.02em",textTransform:"uppercase"}}>
            The<br/>
            <span style={{color:C.gold,textShadow:GG(0.7)}}>Hollow</span><br/>
            Pines
          </h1>
          <MarqueeDots center/>
          <p className="curtain d3" style={{fontFamily:FONTS.body,fontSize:"1.25rem",fontStyle:"italic",color:C.dimText,maxWidth:440,lineHeight:1.75,margin:"0 auto 2.5rem"}}>
            Somewhere between dusk and a long drive home — music for the in-between moments.
          </p>
          <div className="curtain d4" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
            <button className="submit-btn" onClick={()=>go("music")} style={{padding:"0.9rem 2.6rem",background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",fontFamily:FONTS.ui,textShadow:GG(0.5)}}>
              Listen Now
            </button>
            <button className="border-glow-p" onClick={()=>go("shows")} style={{padding:"0.9rem 2.6rem",background:"rgba(255,62,138,0.08)",color:C.neonPink,border:`1px solid ${C.neonPink}`,fontSize:"0.7rem",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",fontFamily:FONTS.ui,textShadow:GP(0.7)}}>
              See Shows
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{padding:"7rem 2.5rem",maxWidth:1060,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"center"}}>
          <div>
            <div style={{aspectRatio:"3/4",background:`linear-gradient(160deg,#1C1208 0%,#2A1A08 60%,#0F0B06 100%)`,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:12,border:`1px solid rgba(201,168,76,0.12)`}}/>
              <div style={{position:"absolute",bottom:0,right:0,width:120,height:120,borderRadius:"50%",background:C.neonPink,opacity:0.06,filter:"blur(30px)"}}/>
              <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.14em",textTransform:"uppercase",position:"relative",zIndex:1}}>Band Photo</span>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:`linear-gradient(to top,${C.bg},transparent)`}}/>
            </div>
            <p style={{textAlign:"center",marginTop:"0.8rem",fontFamily:FONTS.body,fontStyle:"italic",fontSize:"0.85rem",color:C.sepia,letterSpacing:"0.06em"}}>Est. 2021</p>
          </div>
          <div>
            <p className="pulse-c" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonCyan,marginBottom:"0.8rem"}}>About the Band</p>
            <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,lineHeight:1.15,marginBottom:"1.8rem",color:C.ivory}}>Songs for the <em>in-between.</em></h2>
            <p style={{fontFamily:FONTS.body,fontSize:"1.1rem",lineHeight:1.9,color:C.dimText,marginBottom:"1.2rem"}}>
              The Hollow Pines formed in 2021 when four friends started writing songs in a rented garage on the outskirts of town. What started as late-night sessions became a full band — built on shared playlists, borrowed instruments, and a love of storytelling.
            </p>
            <blockquote style={{fontFamily:FONTS.display,fontSize:"1.35rem",fontStyle:"italic",fontWeight:400,color:C.gold,lineHeight:1.5,margin:"2rem 0",paddingLeft:"1.4rem",borderLeft:`2px solid ${C.neonPink}`}}>
              "We make the kind of music you listen to when you don't have the words."
            </blockquote>
            <p style={{fontFamily:FONTS.body,fontSize:"1.1rem",lineHeight:1.9,color:C.dimText}}>
              Influences ranging from Phoebe Bridgers to Bon Iver. Their debut EP <em style={{color:C.ivory}}>Somewhere Between</em> is out now on all platforms.
            </p>
            <MarqueeDots/>
          </div>
        </div>
      </section>

      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"0 2.5rem",opacity:0.35}}/>

      {/* ── MUSIC ── */}
      <section id="music" style={{background:C.surface,padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"20%",right:"-5%",width:400,height:400,borderRadius:"50%",background:C.neonCyan,opacity:0.035,filter:"blur(90px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-3%",width:300,height:300,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
          <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem",textAlign:"center"}}>Discography</p>
          <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory,marginBottom:"0.5rem",textAlign:"center"}}>Latest Tracks</h2>
          <p style={{fontFamily:FONTS.body,fontStyle:"italic",fontSize:"1rem",textAlign:"center",marginBottom:"3rem",color:C.neonCyan,textShadow:GC(0.5)}}>— Now Spinning —</p>
          <ul style={{listStyle:"none"}}>
            {TRACKS.map((t,i)=>(
              <li key={t.id} className="track-row" style={{display:"flex",alignItems:"center",padding:"1rem 0.75rem",borderBottom:`1px solid ${C.border}`,gap:"1.2rem",cursor:"pointer",borderRadius:3}} onClick={()=>setPlaying(playing===t.id?null:t.id)}>
                <span style={{width:22,fontFamily:FONTS.display,fontSize:"0.8rem",color:C.goldDim,textAlign:"center",flexShrink:0}}>{i+1}</span>
                <button style={{width:32,height:32,borderRadius:"50%",
                  border:`1px solid ${playing===t.id?C.neonCyan:C.border}`,
                  background:playing===t.id?`rgba(0,212,204,0.12)`:"transparent",
                  color:playing===t.id?C.neonCyan:C.gold,
                  boxShadow:playing===t.id?GC(0.65):"none",
                  display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:"0.65rem",flexShrink:0,transition:"all .25s"}}
                  onClick={e=>{e.stopPropagation();setPlaying(playing===t.id?null:t.id);}}>
                  {playing===t.id?"■":"▶"}
                </button>
                <span style={{flex:1,fontFamily:FONTS.body,fontSize:"1.05rem",color:playing===t.id?C.neonCyan:C.ivory,textShadow:playing===t.id?GC(0.6):"none",transition:"color .25s,text-shadow .25s"}}>{t.title}</span>
                {playing===t.id && <WaveBars active/>}
                <span style={{fontSize:"0.72rem",color:C.sepia,flexShrink:0,letterSpacing:"0.06em"}}>{t.album}</span>
                <span style={{fontSize:"0.72rem",color:C.sepia,flexShrink:0}}>{t.duration}</span>
              </li>
            ))}
          </ul>
          <div style={{display:"flex",gap:"0.8rem",marginTop:"2.5rem",justifyContent:"center"}}>
            {["Spotify","Apple Music","YouTube"].map(p=>(
              <button key={p} className="stream-btn" style={{padding:"0.55rem 1.3rem",border:`1px solid ${C.border}`,background:"transparent",color:C.sepia,fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",fontFamily:FONTS.ui}}>{p}</button>
            ))}
          </div>
        </div>
      </section>

      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.neonPink},transparent)`,margin:"0 2.5rem",opacity:0.25}}/>

      {/* ── SHOWS ── */}
      <section id="shows" style={{padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:"10%",width:350,height:350,borderRadius:"50%",background:C.neonPink,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
          <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>On Tour</p>
          <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,marginBottom:"2.5rem",color:C.ivory}}>Upcoming Engagements</h2>
          {SHOWS.map((s,i)=>(
            <div key={s.date+s.venue}
              onMouseEnter={()=>setHovShow(i)}
              onMouseLeave={()=>setHovShow(null)}
              style={{display:"flex",alignItems:"center",padding:"1.5rem 0.5rem",borderBottom:`1px solid ${hovShow===i?"rgba(255,62,138,0.3)":C.border}`,gap:"1.5rem",transition:"border-color .25s",borderRadius:3}}>
              <span style={{fontFamily:FONTS.display,fontSize:"0.88rem",fontWeight:700,color:hovShow===i?C.neonPink:C.gold,textShadow:hovShow===i?GP(0.7):GG(0.3),width:68,flexShrink:0,letterSpacing:"0.04em",transition:"color .25s,text-shadow .25s"}}>{s.date}</span>
              <div style={{width:1,height:28,background:hovShow===i?"rgba(255,62,138,0.5)":C.border,transition:"background .25s",flexShrink:0}}/>
              <span style={{flex:1,fontFamily:FONTS.body,fontSize:"1.1rem",fontWeight:600,color:C.ivory}}>{s.venue}</span>
              <span style={{fontSize:"0.82rem",color:C.sepia,flex:1,fontFamily:FONTS.body,fontStyle:"italic"}}>{s.city}</span>
              <button className="ticket-btn" style={{padding:"0.48rem 1.2rem",border:`1px solid ${C.wine}`,background:"transparent",fontSize:"0.65rem",letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",fontFamily:FONTS.ui,color:C.wine}}>Tickets</button>
            </div>
          ))}
        </div>
      </section>

      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.neonCyan},transparent)`,margin:"0 2.5rem",opacity:0.2}}/>

      {/* ── MERCH ── */}
      <section id="merch" style={{padding:"7rem 2.5rem",background:C.surface,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:"5%",right:"5%",width:380,height:380,borderRadius:"50%",background:C.neonCyan,opacity:0.04,filter:"blur(90px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1060,margin:"0 auto",position:"relative"}}>
          <p className="pulse-c" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonCyan,marginBottom:"0.8rem"}}>Store</p>
          <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,color:C.ivory,marginBottom:"2.5rem"}}>Official Merch</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1.2rem"}}>
            {MERCH.map(item=>(
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="merch-card" style={{textDecoration:"none",display:"block",background:C.bg,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer"}}>
                <div style={{aspectRatio:"4/3",background:`linear-gradient(145deg,#1C1208 0%,#2A1A08 100%)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",bottom:0,left:0,width:"100%",height:"40%",background:`linear-gradient(to top,rgba(255,62,138,0.06),transparent)`}}/>
                  <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:FONTS.ui,position:"relative",zIndex:1}}>{item.type}</span>
                  {item.tag && (
                    <span style={{position:"absolute",top:10,right:10,fontSize:"0.58rem",fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px",border:`1px solid ${C.neonPink}`,color:C.neonPink,textShadow:GP(0.8),zIndex:1}}>
                      {item.tag}
                    </span>
                  )}
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
            <a href="#" style={{color:C.neonCyan,textDecoration:"none",textShadow:GC(0.6)}}>Bandcamp</a>
            {" · "}
            <a href="#" style={{color:C.neonCyan,textDecoration:"none",textShadow:GC(0.6)}}>Shopify</a>
          </p>
        </div>
      </section>

      <div style={{height:1,background:`linear-gradient(90deg,transparent,${C.neonPink},transparent)`,margin:"0 2.5rem",opacity:0.22}}/>

      {/* ── CONTACT ── */}
      <section id="contact" style={{padding:"7rem 2.5rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",bottom:0,left:"5%",width:350,height:350,borderRadius:"50%",background:C.neonCyan,opacity:0.04,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1060,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start",position:"relative"}}>
          <div>
            <p className="pulse-p" style={{fontSize:"0.62rem",fontWeight:500,letterSpacing:"0.26em",textTransform:"uppercase",color:C.neonPink,marginBottom:"0.8rem"}}>Get in Touch</p>
            <h2 style={{fontFamily:FONTS.display,fontSize:"clamp(1.8rem,3.2vw,2.8rem)",fontWeight:700,marginBottom:"1.5rem",color:C.ivory}}>Booking &<br/>Inquiries</h2>
            <p style={{fontFamily:FONTS.body,fontSize:"1.05rem",color:C.sepia,lineHeight:1.85,marginBottom:"2rem"}}>
              For booking, press inquiries, or just to say hello — reach out and we'll respond within 48 hours.
            </p>
            <MarqueeDots/>
            {[["Booking","booking@thehollowpines.com"],["Press","press@thehollowpines.com"],["Management","mgmt@thehollowpines.com"]].map(([lbl,val])=>(
              <p key={lbl} style={{fontSize:"0.88rem",marginBottom:"0.6rem",fontFamily:FONTS.body}}>
                <span style={{fontWeight:600,color:C.neonCyan,marginRight:10,fontSize:"0.62rem",letterSpacing:"0.14em",textTransform:"uppercase",fontFamily:FONTS.ui,textShadow:GC(0.5)}}>{lbl}</span>
                <span style={{color:C.dimText}}>{val}</span>
              </p>
            ))}
          </div>
          <div>
            {sent ? (
              <div style={{paddingTop:"2.5rem",textAlign:"center"}}>
                <p style={{fontFamily:FONTS.display,fontSize:"2.2rem",fontWeight:700,color:C.neonPink,textShadow:GP(0.8)}}>Thank you.</p>
                <p style={{fontFamily:FONTS.body,fontStyle:"italic",color:C.sepia,marginTop:"0.6rem",fontSize:"1.05rem"}}>We'll be in touch shortly.</p>
              </div>
            ):(
              <form onSubmit={e=>{e.preventDefault();setSent(true);}}>
                {[["Name","text","Your name"],["Email","email","your@email.com"],["Inquiry Type","text","Booking / Press / General"]].map(([lbl,type,ph])=>(
                  <div key={lbl} style={{marginBottom:"1.4rem"}}>
                    <label style={{display:"block",fontSize:"0.62rem",letterSpacing:"0.16em",textTransform:"uppercase",fontWeight:500,color:C.neonCyan,marginBottom:"0.45rem",fontFamily:FONTS.ui,textShadow:GC(0.4)}}>{lbl}</label>
                    <input type={type} placeholder={ph} style={{width:"100%",padding:"0.7rem 0",border:"none",borderBottom:`1px solid rgba(201,168,76,0.25)`,background:"transparent",fontFamily:FONTS.body,fontSize:"1rem",color:C.cream,transition:"border-color .2s,box-shadow .2s"}}/>
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
      <footer style={{background:C.surface,padding:"2rem 2.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:`1px solid rgba(255,62,138,0.2)`}}>
        <span style={{fontFamily:FONTS.display,color:C.gold,fontSize:"0.95rem",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",textShadow:GG(0.5)}}>The Hollow Pines</span>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {[C.neonPink,C.goldDim,C.neonCyan,C.neonPink,C.neonCyan,C.goldDim,C.neonPink].map((col,i)=>(
            <div key={i} style={{width:5,height:5,borderRadius:"50%",background:col,boxShadow:col===C.goldDim?"none":`0 0 6px ${col}`,opacity:col===C.goldDim?0.4:0.9}}/>
          ))}
        </div>
        <span style={{fontSize:"0.65rem",color:C.sepia,letterSpacing:"0.08em"}}>© 2026 · All rights reserved</span>
        <div style={{display:"flex",gap:"1.3rem"}}>
          {["Instagram","Spotify","TikTok"].map(s=>(
            <a key={s} href="#" className="social-link" style={{color:C.sepia,textDecoration:"none",fontSize:"0.65rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>{s}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}
