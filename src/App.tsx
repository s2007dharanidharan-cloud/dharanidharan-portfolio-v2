import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Download, Mail, Github, Linkedin, ArrowRight, Cog, Code2, Cpu, Wrench,
  GraduationCap, Trophy, Briefcase, Award, MapPin, Send, ExternalLink,
  Layers, Boxes, Hammer, Database, Globe, Sparkles, ChevronRight,
  Menu, X, ArrowUp, Sun, Moon,
} from 'lucide-react'

/* ─── TYPING TEXT ─── */
const PHRASES = ['Mechanical Engineer', 'CAD Designer', 'Full Stack Developer', 'Problem Solver']
function TypingText() {
  const [idx, setIdx] = useState(0)
  const [sub, setSub] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = PHRASES[idx]
    if (!del && sub === cur) { const t = setTimeout(() => setDel(true), 1600); return () => clearTimeout(t) }
    if (del && sub === '') { setDel(false); setIdx(i => (i + 1) % PHRASES.length); return }
    const t = setTimeout(() => setSub(s => del ? s.slice(0,-1) : cur.slice(0,s.length+1)), del ? 45 : 85)
    return () => clearTimeout(t)
  }, [sub, del, idx])
  return (
    <span style={{ fontFamily:'var(--ff-mono)', color:'var(--cyan-l)' }}>
      {sub}
      <span style={{ display:'inline-block', width:2, height:'1em', background:'var(--cyan)', marginLeft:2, verticalAlign:'middle', animation:'blink 1s steps(2) infinite' }} />
    </span>
  )
}

/* ─── COUNTER ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / 1600)
            setVal(Number((to * (1 - Math.pow(1-p,3))).toFixed(to < 10 ? 2 : 0)))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      })
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── REVEAL ─── */
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.style.animationDelay = `${delay}ms`
          el.classList.add('fade-up')
          el.style.opacity = '1'
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return <div ref={ref} style={{ opacity: 0, ...style }}>{children}</div>
}

/* ─── PARTICLES ─── */
function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({
    id: i, size: Math.random() * 3 + 2,
    left: Math.random() * 100, top: Math.random() * 100,
    delay: Math.random() * 8, dur: Math.random() * 6 + 6,
    color: i%3===0 ? 'rgba(124,58,237,.6)' : i%3===1 ? 'rgba(6,182,212,.6)' : 'rgba(245,158,11,.6)',
  }))
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position:'absolute', borderRadius:'50%',
          width:p.size, height:p.size, left:`${p.left}%`, top:`${p.top}%`,
          background:p.color, animation:`particle ${p.dur}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  )
}

/* ─── ENGINEERING BACKDROP ─── */
function EngineeringBackdrop() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <div className="grid-bg" style={{ position:'absolute', inset:0, opacity:.55, maskImage:'radial-gradient(ellipse at center,black,transparent 75%)', WebkitMaskImage:'radial-gradient(ellipse at center,black,transparent 75%)' }} />
      <svg className="spin-slow" style={{ position:'absolute', right:32, top:96, width:160, height:160, color:'rgba(124,58,237,.3)' }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="50" cy="50" r="20" /><circle cx="50" cy="50" r="8" />
        {Array.from({length:12}).map((_,i)=>{const a=i*Math.PI*2/12;return <line key={i} x1={50+Math.cos(a)*22} y1={50+Math.sin(a)*22} x2={50+Math.cos(a)*32} y2={50+Math.sin(a)*32}/>})}
      </svg>
      <svg className="spin-r" style={{ position:'absolute', left:40, bottom:96, width:110, height:110, color:'rgba(6,182,212,.35)' }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="50" cy="50" r="16" />
        {Array.from({length:8}).map((_,i)=>{const a=i*Math.PI*2/8;return <circle key={i} cx={50+Math.cos(a)*26} cy={50+Math.sin(a)*26} r="3"/>})}
      </svg>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', color:'rgba(6,182,212,.18)' }} viewBox="0 0 800 600" fill="none" stroke="currentColor" strokeWidth=".6">
        <path d="M0 120 L180 120 L220 160 L420 160 L460 200 L800 200" />
        <path d="M0 420 L120 420 L160 380 L380 380 L420 420 L800 420" />
        <circle cx="220" cy="160" r="3" fill="currentColor" /><circle cx="460" cy="200" r="3" fill="currentColor" />
        <circle cx="160" cy="380" r="3" fill="currentColor" /><circle cx="420" cy="420" r="3" fill="currentColor" />
      </svg>
    </div>
  )
}

/* ─── NAVBAR ─── */
const NAV_LINKS = [
  {href:'#about',label:'About'},{href:'#mechanical',label:'Mechanical'},
  {href:'#software',label:'Software'},{href:'#timeline',label:'Journey'},
  {href:'#education',label:'Education'},{href:'#achievements',label:'Awards'},
  {href:'#contact',label:'Contact'},
]
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn(); window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => { document.body.style.background = light ? '#f8f6ff' : ''; document.body.style.color = light ? '#0a0514' : '' }, [light])
  return (
    <header style={{ position:'fixed', inset:'0 0 auto', zIndex:50, transition:'all .3s', padding: scrolled ? '0.6rem 0' : '1rem 0' }} className={scrolled ? 'nav-glass' : ''}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="#" style={{ display:'flex', alignItems:'center', gap:'.5rem', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'1.1rem' }}>
          <span style={{ width:36, height:36, borderRadius:'.625rem', background:'var(--grad)', display:'grid', placeItems:'center', fontWeight:900, fontSize:'1rem', boxShadow:'var(--shadow-p)' }}>D</span>
          <span className="tgpc" style={{ display:'none' }} id="nav-name">Dharanidharan.</span>
        </a>
        <nav style={{ display:'flex', alignItems:'center', gap:'.25rem' }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ padding:'.4rem 1rem', borderRadius:9999, fontSize:'.85rem', color:'rgba(255,255,255,.6)', transition:'all .25s' }}
              onMouseEnter={e=>{(e.target as HTMLElement).style.background='rgba(124,58,237,.12)';(e.target as HTMLElement).style.color='var(--purple-l)'}}
              onMouseLeave={e=>{(e.target as HTMLElement).style.background='';(e.target as HTMLElement).style.color='rgba(255,255,255,.6)'}}
            >{l.label}</a>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
          <button onClick={()=>setLight(v=>!v)} style={{ width:40, height:40, borderRadius:'50%', background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--purple-l)' }}>
            {light ? <Moon size={16}/> : <Sun size={16}/>}
          </button>
          <a href="#contact" className="btn btn-main" style={{ fontSize:'.82rem', padding:'.55rem 1.25rem', display:'none' }} id="hire-btn">Hire Me</a>
          <button onClick={()=>setOpen(v=>!v)} style={{ width:40, height:40, borderRadius:'50%', background:'rgba(124,58,237,.12)', border:'1px solid rgba(124,58,237,.25)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--purple-l)' }} id="menu-btn">
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>
      {open && (
        <div className="container" style={{ marginTop:'.75rem' }}>
          <div style={{ background:'rgba(20,10,45,.95)', border:'1px solid rgba(124,58,237,.25)', borderRadius:'1rem', padding:'1rem', display:'grid', gap:'.25rem' }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={()=>setOpen(false)} style={{ padding:'.75rem 1rem', borderRadius:'.5rem', fontSize:'.9rem', color:'rgba(255,255,255,.7)', transition:'all .2s' }}
                onMouseEnter={e=>{(e.target as HTMLElement).style.background='rgba(124,58,237,.15)';(e.target as HTMLElement).style.color='var(--purple-l)'}}
                onMouseLeave={e=>{(e.target as HTMLElement).style.background='';(e.target as HTMLElement).style.color='rgba(255,255,255,.7)'}}
              >{l.label}</a>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @media(min-width:768px){#nav-name{display:inline!important} #hire-btn{display:inline-flex!important}}
        @media(min-width:1024px){#menu-btn{display:none!important} .desktop-nav{display:flex!important}}
        @media(max-width:1023px){.desktop-nav{display:none!important}}
      `}</style>
    </header>
  )
}

/* ─── BACK TO TOP ─── */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!show) return null
  return (
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{ position:'fixed', bottom:24, right:24, zIndex:40, width:48, height:48, borderRadius:'50%', background:'var(--grad)', border:'none', cursor:'pointer', display:'grid', placeItems:'center', color:'#fff', boxShadow:'var(--shadow-p)', transition:'transform .25s' }}
      onMouseEnter={e=>{(e.currentTarget).style.transform='scale(1.1)'}}
      onMouseLeave={e=>{(e.currentTarget).style.transform='scale(1)'}}
    ><ArrowUp size={20}/></button>
  )
}

/* ─── SECTION HEADER ─── */
function SH({ eyebrow, title, sub, grad='tgpc' }: { eyebrow:string; title:string; sub?:string; grad?:string }) {
  return (
    <Reveal>
      <div style={{ textAlign:'center', maxWidth:560, margin:'0 auto 3.5rem' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(124,58,237,.1)', border:'1px solid rgba(124,58,237,.28)', borderRadius:9999, padding:'.35rem 1rem', marginBottom:'1rem' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--cyan)', boxShadow:'0 0 8px var(--cyan)', display:'inline-block' }}/>
          <span style={{ fontSize:'.65rem', fontFamily:'var(--ff-mono)', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--cyan-l)' }}>{eyebrow}</span>
        </div>
        <h2 className={grad} style={{ fontSize:'clamp(1.8rem,4.5vw,2.8rem)', fontWeight:800, lineHeight:1.1 }}>{title}</h2>
        {sub && <p style={{ marginTop:'1rem', color:'rgba(255,255,255,.5)', lineHeight:1.75, fontSize:'.95rem' }}>{sub}</p>}
      </div>
    </Reveal>
  )
}

/* ─── PROJECT IMAGE ─── */
function PImg({ src, ph, title }: { src:string; ph:string; title:string }) {
  const [err, setErr] = useState(false)
  return (
    <div className="pimg">
      {!err
        ? <><img src={src} alt={title} onError={()=>setErr(true)}/><div className="pimg-overlay"/></>
        : <div className="pimg-ph"><span style={{fontSize:'2.2rem'}}>{ph}</span><span style={{fontSize:'.6rem',color:'rgba(255,255,255,.3)',fontFamily:'var(--ff-mono)',textAlign:'center',padding:'0 1rem'}}>Add image to /public/images/</span></div>
      }
    </div>
  )
}

/* ─── PROJECT CARD ─── */
const AC: Record<string,{border:string;glow:string;tag:string;text:string}> = {
  purple: {border:'rgba(124,58,237,.5)',glow:'rgba(124,58,237,.18)',tag:'rgba(124,58,237,.18)',text:'#A78BFA'},
  cyan:   {border:'rgba(6,182,212,.5)',  glow:'rgba(6,182,212,.18)',  tag:'rgba(6,182,212,.14)',  text:'#67E8F9'},
  gold:   {border:'rgba(245,158,11,.5)', glow:'rgba(245,158,11,.18)', tag:'rgba(245,158,11,.14)', text:'#FCD34D'},
}
function PCard({ p, i }: { p:any; i:number }) {
  const c = AC[p.accent] ?? AC.purple
  return (
    <Reveal delay={i*60}>
      <article className="card" style={{ height:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}
        onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=c.border;el.style.boxShadow=`0 8px 40px ${c.glow}`}}
        onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.boxShadow='none'}}
      >
        <div style={{padding:'1rem 1rem 0'}}><PImg src={p.image} ph={p.ph} title={p.title}/></div>
        <div style={{padding:'1.25rem 1.5rem 1.5rem',flex:1,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.75rem'}}>
            <span className="pill" style={{background:c.tag,border:`1px solid ${c.border}`,color:c.text}}>{p.tag}</span>
            <ArrowRight size={13} style={{color:c.text,opacity:.7}}/>
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.05rem',lineHeight:1.35,marginBottom:'.5rem'}}>{p.title}</h3>
          <p style={{fontSize:'.84rem',color:'rgba(255,255,255,.52)',lineHeight:1.72,marginBottom:'1rem',flex:1}}>{p.desc}</p>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.4rem'}}>
            {p.points.map((pt:string)=>(
              <li key={pt} style={{display:'flex',alignItems:'flex-start',gap:'.5rem',fontSize:'.8rem'}}>
                <ChevronRight size={13} style={{color:c.text,flexShrink:0,marginTop:3}}/>
                <span style={{color:'rgba(255,255,255,.72)'}}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

/* ─── SKILL BAR ─── */
function SBar({ name, level, delay=0 }: { name:string; level:number; delay?:number }) {
  return (
    <Reveal delay={delay}>
      <div style={{marginBottom:'.1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem'}}>
          <span style={{fontSize:'.85rem',fontWeight:500}}>{name}</span>
          <span style={{fontSize:'.7rem',fontFamily:'var(--ff-mono)',color:'var(--cyan-l)'}}>{level}%</span>
        </div>
        <div className="sbar-track"><div className="sbar-fill" style={{width:`${level}%`}}/></div>
      </div>
    </Reveal>
  )
}

/* ─── SKILL GROUP ─── */
function SGroup({ g }: { g:{group:string;icon:any;items:{name:string;level:number}[]} }) {
  const Icon = g.icon
  return (
    <div className="card" style={{padding:'1.5rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
        <span style={{width:40,height:40,borderRadius:'.625rem',background:'rgba(124,58,237,.15)',display:'grid',placeItems:'center',color:'var(--purple-l)'}}>
          <Icon size={18}/>
        </span>
        <span style={{fontWeight:700,fontSize:'.95rem'}}>{g.group}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {g.items.map((it,i)=><SBar key={it.name} {...it} delay={i*40}/>)}
      </div>
    </div>
  )
}

/* ─── SPLASH SCREEN ─── */
function Splash({ onDone }: { onDone:()=>void }) {
  const [phase, setPhase] = useState<'in'|'load'|'out'>('in')
  const [prog, setProg] = useState(0)
  const done = useCallback(onDone,[onDone])
  useEffect(() => {
    const t1 = setTimeout(()=>{ setPhase('load'); let p=0; const iv=setInterval(()=>{ p+=Math.random()*12+4; if(p>=100){p=100;clearInterval(iv)} setProg(Math.min(p,100)) },80) },400)
    const t2 = setTimeout(()=>setPhase('out'),2800)
    const t3 = setTimeout(()=>done(),3250)
    return ()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3)}
  },[done])
  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,background:'var(--bg)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      animation: phase==='out' ? 'splashOut .45s ease forwards' : 'splashIn .4s ease forwards',
    }}>
      <Particles/>
      <div className="orb" style={{width:400,height:400,background:'rgba(124,58,237,.18)',top:'-10%',left:'-10%'}}/>
      <div className="orb" style={{width:300,height:300,background:'rgba(6,182,212,.13)',bottom:'-5%',right:'-5%'}}/>

      {/* Avatar */}
      <div style={{position:'relative',marginBottom:'2rem'}}>
        <div className="spin-slow" style={{position:'absolute',inset:-14,borderRadius:'50%',border:'2px solid transparent',background:'var(--grad) border-box',WebkitMask:'linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)',WebkitMaskComposite:'destination-out',maskComposite:'exclude'}}/>
        <div style={{position:'absolute',inset:-6,borderRadius:'50%',background:'rgba(124,58,237,.28)',animation:'pulse 2s ease-out infinite'}}/>
        {/* ── TO ADD YOUR PHOTO: replace the 👤 span below with:
            <img src="/images/dharanidharan.jpg" alt="Dharanidharan R S"
              style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}/>
            then upload your photo to /public/images/dharanidharan.jpg ── */}
        <div style={{width:136,height:136,borderRadius:'50%',background:'var(--grad-pc)',padding:3,boxShadow:'var(--shadow-p)'}}>
          <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'var(--bg)',display:'grid',placeItems:'center',fontSize:'3.2rem'}}>👤</div>
        </div>
      </div>

      <h1 className="shimmer-text" style={{fontSize:'clamp(1.7rem,5vw,2.6rem)',fontWeight:900,letterSpacing:'-.02em',textAlign:'center',marginBottom:'.4rem'}}>
        Dharanidharan R S
      </h1>
      <p style={{color:'rgba(255,255,255,.45)',fontSize:'.8rem',letterSpacing:'.2em',textTransform:'uppercase',fontFamily:'var(--ff-mono)',marginBottom:'1.25rem'}}>
        Mechanical Engineer · Full Stack Developer
      </p>

      <div style={{display:'flex',gap:'.5rem',marginBottom:'2rem',flexWrap:'wrap',justifyContent:'center'}}>
        {[['CAD Designer','rgba(124,58,237,.25)','rgba(124,58,237,.6)','#A78BFA'],
          ['MERN Dev','rgba(6,182,212,.18)','rgba(6,182,212,.6)','#67E8F9'],
          ['Innovator','rgba(245,158,11,.18)','rgba(245,158,11,.6)','#FCD34D']
        ].map(([label,bg,border,color])=>(
          <span key={label} className="pill" style={{background:bg,border:`1px solid ${border}`,color}}>{label}</span>
        ))}
      </div>

      <div style={{width:'min(280px,70vw)'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.35rem'}}>
          <span style={{fontSize:'.68rem',color:'rgba(255,255,255,.35)',fontFamily:'var(--ff-mono)'}}>Loading portfolio…</span>
          <span style={{fontSize:'.68rem',color:'var(--cyan-l)',fontFamily:'var(--ff-mono)'}}>{Math.round(prog)}%</span>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,.07)',borderRadius:999,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${prog}%`,background:'var(--grad)',borderRadius:999,transition:'width .1s ease',boxShadow:'0 0 10px rgba(6,182,212,.8)'}}/>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const MECH = [
  { tag:'Innovation · Railway Safety', title:'PTI Zero Fall Initiative', desc:'Sensor-based railway safety system with a retractable safety plate mechanism preventing passenger falls at the Platform-Train Interface.', points:['Sensor-driven retractable plate','Improved passenger safety','Winner — Ideathon & EKNA 2025'], accent:'purple', image:'/images/pti-zero-fall.jpg', ph:'🚉', cat:'hardware' },
  { tag:'Automation · Food Tech', title:'Automatic Chapathi Making Machine', desc:'Automated chapathi production combining conveyors, sensors and rack-and-pinion pressing for consistent, uniform output.', points:['Conveyor + rack-and-pinion','Dough detection sensors','Winner — Mini Hackathon'], accent:'cyan', image:'/images/chapathi-machine.jpg', ph:'⚙️', cat:'hardware' },
  { tag:'Machine Design · Agriculture', title:'Grain Cleaning Machine', desc:'Agricultural grain cleaner with feeding, screening and impurity-separation mechanisms focused on efficiency and reduced manual effort.', points:['Feeding & screening modules','Impurity separation system','DFM principles applied'], accent:'gold', image:'/images/grain-cleaning.jpg', ph:'🌾', cat:'hardware' },
  { tag:'CAD · PTC Creo · Automotive', title:'Twin-Turbo V6 Engine Assembly', desc:'Detailed 3D modeling and full assembly of a Twin-Turbo V6 — block, pistons, crankshaft, connecting rods and turbochargers.', points:['Complete assembly integration','Advanced part modeling','Precision tolerancing'], accent:'purple', image:'/images/v6-engine.jpg', ph:'🔧', cat:'cad' },
  { tag:'CAD · PTC Creo · Aerospace', title:'Jet Engine Design & Assembly', desc:'Full 3D jet engine — compressor, combustion chamber, turbine and exhaust assembled with aerospace-grade modeling techniques.', points:['Compressor → turbine stages','Aerospace assembly methods','Complex surface modeling'], accent:'cyan', image:'/images/jet-engine.jpg', ph:'✈️', cat:'cad' },
]
const SOFT = [
  { tag:'Full Stack · MERN', title:'Series House', desc:'Platform for discovering, rating and reviewing TV series. Secure auth, REST APIs and a polished React frontend with optimised MongoDB queries.', points:['JWT auth & authorization','Dynamic ratings & reviews','Optimised MongoDB queries'], accent:'purple', image:'/images/series-house.jpg', ph:'🎬' },
  { tag:'Full Stack · MERN', title:'ATM Application', desc:'Banking transaction simulator with deposits, withdrawals, balance inquiry and complete transaction history management.', points:['Secure Node + Mongo backend','Responsive React UI','Account lifecycle handling'], accent:'cyan', image:'/images/atm-app.jpg', ph:'🏦' },
]
const MECH_SKILLS = [
  { group:'CAD & Design', icon:Layers, items:[{name:'PTC Creo',level:92},{name:'CATIA',level:90},{name:'SolidWorks',level:85},{name:'AutoCAD',level:88}] },
  { group:'Simulation & Analysis', icon:Cpu, items:[{name:'ANSYS',level:78},{name:'MATLAB',level:80}] },
  { group:'Manufacturing & Automation', icon:Hammer, items:[{name:'CNC Programming',level:82},{name:'Product Design',level:88},{name:'Automation Systems',level:80},{name:'Mechanical Design',level:90}] },
  { group:'Engineering Soft Skills', icon:Wrench, items:[{name:'Problem Solving',level:92},{name:'Team Leadership',level:88},{name:'Communication',level:86},{name:'Project Management',level:84}] },
]
const SOFT_SKILLS = [
  { group:'Programming', icon:Code2, items:[{name:'Java',level:88},{name:'Python',level:82},{name:'C',level:80}] },
  { group:'Frontend', icon:Globe, items:[{name:'HTML',level:95},{name:'CSS',level:92},{name:'JavaScript',level:88},{name:'React.js',level:86}] },
  { group:'Backend', icon:Boxes, items:[{name:'Node.js',level:84},{name:'Express.js',level:82}] },
  { group:'Database', icon:Database, items:[{name:'MongoDB',level:82},{name:'MySQL',level:80}] },
  { group:'Tools & Platforms', icon:Wrench, items:[{name:'Git / GitHub',level:90},{name:'VS Code',level:95},{name:'Vercel / Render',level:80}] },
  { group:'CS Fundamentals', icon:Cpu, items:[{name:'DSA',level:80},{name:'OOP',level:86},{name:'DBMS',level:82},{name:'OS',level:78}] },
]
const CERTS = [
  {title:'NPTEL — Manufacturing Processes: Casting and Joining',org:'NPTEL'},
  {title:'NPTEL — Laser Based Manufacturing',org:'NPTEL'},
  {title:'EV Design and Simulation using MATLAB',org:'Coursera'},
  {title:'CNC Programming',org:'Industry'},
  {title:'ProSimulator Certification',org:'ProSim'},
]
const JOURNEY = [
  {step:'01',title:'Programming Fundamentals',desc:'Core logic, problem decomposition and algorithmic thinking.'},
  {step:'02',title:'Java & OOP',desc:'Built strong object-oriented foundations with Java.'},
  {step:'03',title:'Data Structures & Algorithms',desc:'Sharpened problem-solving with arrays, trees, graphs, DP.'},
  {step:'04',title:'Web Development',desc:'Mastered HTML, CSS and JavaScript fundamentals.'},
  {step:'05',title:'MERN Stack',desc:'Full stack: MongoDB, Express, React, Node end-to-end.'},
  {step:'06',title:'Full Stack Applications',desc:'Shipped Series House and ATM Application to production.'},
  {step:'Now',title:'Advanced Development',desc:'System design, modern tooling and open-source contributions.'},
]
const EDU = [
  {school:'Kongu Engineering College',degree:'B.E. — Mechanical Engineering',period:'2024 – 2028',score:'CGPA 8.78 / 10.0',icon:'🎓'},
  {school:'PM SHRI Kendriya Vidyalaya No.1, Madurai',degree:'Class XII — CBSE',period:'2024',score:'85.6%',icon:'📚'},
  {school:'PM SHRI Kendriya Vidyalaya No.1, Madurai',degree:'Class X — CBSE',period:'2022',score:'74.6%',icon:'📖'},
]
const ACHV = [
  {icon:Trophy,title:'Winner — Intercollege Mini Hackathon 2025',tag:'Hackathon',color:'gold'},
  {icon:Trophy,title:'Winner — Intercollege Ideathon 2025',tag:'Ideathon',color:'purple'},
  {icon:Trophy,title:'Winner — EKNA 2025 Paper Presentation & Project Expo',tag:'EKNA',color:'cyan'},
  {icon:Award,title:'Annual Day Award Recognition',tag:'Recognition',color:'gold'},
  {icon:Sparkles,title:'Top 5 Finalist — Proof of Concept Event',tag:'PoC',color:'purple'},
]
const ACHV_COLORS: Record<string,{bg:string;border:string;text:string;glow:string}> = {
  gold:  {bg:'rgba(245,158,11,.12)',border:'rgba(245,158,11,.4)',text:'#FCD34D',glow:'rgba(245,158,11,.25)'},
  purple:{bg:'rgba(124,58,237,.12)',border:'rgba(124,58,237,.4)',text:'#A78BFA',glow:'rgba(124,58,237,.25)'},
  cyan:  {bg:'rgba(6,182,212,.1)',  border:'rgba(6,182,212,.4)',  text:'#67E8F9',glow:'rgba(6,182,212,.25)'},
}

/* ════════════════════════════════════════════
   APP
════════════════════════════════════════════ */
export default function App() {
  const [splash, setSplash] = useState(true)
  const [mechF, setMechF] = useState<'all'|'hardware'|'cad'>('all')
  const [projF, setProjF] = useState<'all'|'mech'|'software'>('all')

  const allProj = [...MECH.map(p=>({...p,kind:'mech'})),...SOFT.map(p=>({...p,kind:'software'}))]
  const filtProj = allProj.filter(p=>projF==='all'||p.kind===projF)
  const filtMech = MECH.filter(p=>mechF==='all'||p.cat===mechF)

  return (
    <>
      {splash && <Splash onDone={()=>setSplash(false)}/>}
      <div style={{minHeight:'100vh',overflowX:'hidden'}}>
        <Navbar/>
        <BackToTop/>

        {/* ═══ HERO ═══ */}
        <section style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',paddingTop:112,paddingBottom:80}}>
          <EngineeringBackdrop/>
          <Particles/>
          <div className="orb" style={{width:600,height:600,background:'rgba(124,58,237,.11)',top:'-20%',left:'-15%'}}/>
          <div className="orb" style={{width:400,height:400,background:'rgba(6,182,212,.09)',bottom:'-10%',right:'-10%'}}/>

          <div className="container" style={{position:'relative',zIndex:1}}>
            <Reveal>
              <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:'rgba(6,182,212,.08)',border:'1px solid rgba(6,182,212,.22)',borderRadius:9999,padding:'.4rem 1rem',marginBottom:'1.5rem'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'var(--cyan)',boxShadow:'0 0 10px var(--cyan)',display:'inline-block',animation:'pulse 2s infinite'}}/>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.2em',color:'var(--cyan-l)'}}>OPEN FOR INTERNSHIPS · 2026 BATCH</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 style={{fontSize:'clamp(2.6rem,7vw,5.2rem)',fontWeight:900,lineHeight:1.0,letterSpacing:'-.03em',marginBottom:'1rem'}}>
                Dharanidharan<br/><span className="tg">R S</span>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <div style={{fontSize:'1.1rem',marginBottom:'1.25rem'}}><TypingText/></div>
            </Reveal>
            <Reveal delay={260}>
              <p style={{fontSize:'1rem',color:'rgba(255,255,255,.52)',lineHeight:1.8,maxWidth:560,marginBottom:'2rem'}}>
                Bridging <span style={{color:'var(--purple-l)',fontWeight:600}}>mechanical innovation</span> and{' '}
                <span style={{color:'var(--cyan-l)',fontWeight:600}}>software engineering</span> to build the future — from CAD-modelled turbines to MERN-stack platforms.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',marginBottom:'2.5rem'}}>
                <a href="#mechanical" className="btn btn-main"><Cog size={16}/> Mechanical Portfolio</a>
                <a href="#software" className="btn btn-out"><Code2 size={16}/> Software Portfolio</a>
                <a href="/CV core.pdf" download className="btn btn-gold"><Download size={16}/> Core CV</a>
                <a href="/CV Software.pdf" download className="btn btn-gold"><Download size={16}/> Software CV</a>
                <a href="#contact" className="btn btn-out" style={{borderColor:'rgba(255,255,255,.2)',color:'rgba(255,255,255,.55)'}}><Mail size={16}/> Contact</a>
              </div>
            </Reveal>
            <Reveal delay={420}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',maxWidth:360}}>
                {[{n:8.78,s:'CGPA',sfx:''},{n:7,s:'Projects',sfx:'+'},{n:5,s:'Awards',sfx:''}].map(m=>(
                  <div key={m.s} className="card" style={{padding:'1rem',textAlign:'center'}}>
                    <div className="tg" style={{fontSize:'1.6rem',fontWeight:800,fontFamily:'var(--ff-mono)'}}><Counter to={m.n} suffix={m.sfx}/></div>
                    <div style={{fontSize:'.62rem',textTransform:'uppercase',letterSpacing:'.15em',color:'rgba(255,255,255,.38)',marginTop:'.25rem'}}>{m.s}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="section">
          <div className="container">
            <SH eyebrow="About Me" title="Engineer × Developer" grad="tgpc"/>
            <div style={{display:'grid',gap:'1.25rem'}}>
              <Reveal>
                <div className="card" style={{padding:'2rem'}}>
                  <p style={{fontSize:'1rem',lineHeight:1.85,color:'rgba(255,255,255,.62)',marginBottom:'1rem'}}>
                    I'm a Mechanical Engineering student at <span style={{color:'#fff',fontWeight:600}}>Kongu Engineering College</span> with a CGPA of{' '}
                    <span className="tgcg" style={{fontWeight:700}}>8.78</span>. I bridge two worlds: the precision of mechanical systems and the logic of software development.
                  </p>
                  <p style={{fontSize:'1rem',lineHeight:1.85,color:'rgba(255,255,255,.52)'}}>
                    From designing a jet engine in PTC Creo to shipping a full-stack MERN application — I believe the best engineers are also builders who can code.
                  </p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',marginTop:'1.5rem'}}>
                    {['CAD Design','Automation','Product Dev','MERN Stack','Problem Solving','PTC Creo','React.js'].map(t=>(
                      <span key={t} style={{padding:'.3rem .8rem',borderRadius:9999,border:'1px solid rgba(124,58,237,.32)',background:'rgba(124,58,237,.08)',fontSize:'.74rem',fontFamily:'var(--ff-mono)',color:'var(--purple-l)'}}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="card" style={{padding:'2rem',display:'flex',alignItems:'flex-start',gap:'1rem'}}>
                  <span style={{width:48,height:48,borderRadius:'.75rem',background:'rgba(6,182,212,.12)',border:'1px solid rgba(6,182,212,.25)',display:'grid',placeItems:'center',color:'var(--cyan-l)',flexShrink:0}}>
                    <Briefcase size={22}/>
                  </span>
                  <div>
                    <h4 style={{fontWeight:700,fontSize:'1.05rem'}}>In-Plant Training</h4>
                    <p style={{fontSize:'.8rem',color:'var(--cyan-l)',fontFamily:'var(--ff-mono)',marginBottom:'.5rem'}}>JK Fenner (India) Limited</p>
                    <p style={{fontSize:'.9rem',color:'rgba(255,255,255,.52)',lineHeight:1.7}}>Hands-on exposure to industrial manufacturing workflows, mechanical systems, production processes and quality practices — bridging theory with real-world engineering.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ ALL PROJECTS FILTER ═══ */}
        <section id="projects" style={{padding:'4rem 0'}}>
          <div className="container">
            <Reveal>
              <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'1rem',marginBottom:'2rem'}}>
                <div style={{display:'inline-flex',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:9999,padding:'.3rem'}}>
                  {([['all','All Work'],['mech','Mechanical'],['software','Software']] as const).map(([k,label])=>(
                    <button key={k} onClick={()=>setProjF(k)} style={{padding:'.5rem 1.2rem',borderRadius:9999,border:'none',cursor:'pointer',fontSize:'.84rem',fontWeight:700,fontFamily:'var(--ff-display)',transition:'all .25s',
                      background:projF===k?'var(--grad)':'transparent',color:projF===k?'#fff':'rgba(255,255,255,.42)',
                      boxShadow:projF===k?'var(--shadow-p)':'none'}}>{label}</button>
                  ))}
                </div>
                <span style={{fontSize:'.74rem',fontFamily:'var(--ff-mono)',color:'rgba(255,255,255,.32)'}}>{filtProj.length} project{filtProj.length!==1?'s':''}</span>
              </div>
            </Reveal>
            <div className="grid-2">{filtProj.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>
          </div>
        </section>

        {/* ═══ MECHANICAL ═══ */}
        <section id="mechanical" className="section">
          <div className="divider" style={{position:'absolute',top:0,left:0,right:0}}/>
          <div className="orb" style={{width:500,height:500,background:'rgba(124,58,237,.07)',top:'10%',left:'-10%'}}/>
          <div className="container" style={{position:'relative',zIndex:1}}>
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
                <span style={{width:52,height:52,borderRadius:'.875rem',background:'rgba(124,58,237,.14)',border:'1px solid rgba(124,58,237,.28)',display:'grid',placeItems:'center',color:'var(--purple-l)'}}>
                  <Cog size={24}/>
                </span>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--purple-l)'}}>Division 01</span>
              </div>
            </Reveal>
            <SH eyebrow="Core Mechanical Engineering" title="Design · Build · Innovate" grad="tgpg" sub="Engineering innovation, product development and advanced CAD — from railway safety systems to aerospace engines."/>

            {/* Sub-filter */}
            <Reveal>
              <div style={{display:'flex',gap:'.75rem',marginBottom:'2rem',flexWrap:'wrap'}}>
                {([['all','All Projects'],['hardware','🔧 Hardware & Innovation'],['cad','💻 Advanced CAD']] as const).map(([k,label])=>(
                  <button key={k} onClick={()=>setMechF(k)} style={{padding:'.5rem 1.2rem',borderRadius:9999,border:'1px solid',
                    borderColor:mechF===k?'var(--purple)':'rgba(255,255,255,.1)',
                    background:mechF===k?'rgba(124,58,237,.18)':'transparent',
                    color:mechF===k?'var(--purple-l)':'rgba(255,255,255,.42)',
                    cursor:'pointer',fontSize:'.82rem',fontWeight:600,fontFamily:'var(--ff-display)',transition:'all .25s'}}>{label}</button>
                ))}
              </div>
            </Reveal>

            {mechF!=='all' && (
              <Reveal>
                <div style={{marginBottom:'1.5rem',padding:'.75rem 1.25rem',borderLeft:`3px solid ${mechF==='hardware'?'var(--gold)':'var(--cyan)'}`,background:mechF==='hardware'?'rgba(245,158,11,.05)':'rgba(6,182,212,.05)',borderRadius:'0 .5rem .5rem 0'}}>
                  <h3 style={{fontWeight:700,fontSize:'1rem',color:mechF==='hardware'?'var(--gold-l)':'var(--cyan-l)'}}>
                    {mechF==='hardware'?'Engineering Innovation & Product Development':'Advanced CAD Modeling & Digital Engineering'}
                  </h3>
                </div>
              </Reveal>
            )}

            <div className="grid-2" style={{marginBottom:'4rem'}}>{filtMech.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>

            <Reveal><h3 className="tgpg" style={{fontWeight:800,fontSize:'1.5rem',marginBottom:'1.5rem'}}>Mechanical Skills</h3></Reveal>
            <div className="grid-skills" style={{marginBottom:'3rem'}}>{MECH_SKILLS.map(g=><SGroup key={g.group} g={g}/>)}</div>

            <Reveal><h3 className="tgcg" style={{fontWeight:800,fontSize:'1.5rem',marginBottom:'1.5rem'}}>Certifications</h3></Reveal>
            <div className="grid-3">
              {CERTS.map((c,i)=>(
                <Reveal key={c.title} delay={i*50}>
                  <div className="cert">
                    <Award size={18} style={{color:'var(--gold-l)',flexShrink:0,marginTop:2}}/>
                    <div>
                      <div style={{fontSize:'.85rem',fontWeight:500,lineHeight:1.4}}>{c.title}</div>
                      <div style={{fontSize:'.7rem',color:'var(--gold)',fontFamily:'var(--ff-mono)',marginTop:'.25rem'}}>{c.org}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SOFTWARE ═══ */}
        <section id="software" className="section">
          <div className="divider" style={{position:'absolute',top:0,left:0,right:0}}/>
          <div className="orb" style={{width:500,height:500,background:'rgba(6,182,212,.07)',top:'10%',right:'-10%'}}/>
          <div className="container" style={{position:'relative',zIndex:1}}>
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
                <span style={{width:52,height:52,borderRadius:'.875rem',background:'rgba(6,182,212,.1)',border:'1px solid rgba(6,182,212,.28)',display:'grid',placeItems:'center',color:'var(--cyan-l)'}}>
                  <Code2 size={24}/>
                </span>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--cyan-l)'}}>Division 02</span>
              </div>
            </Reveal>
            <SH eyebrow="Software Development" title="Code · Ship · Iterate" grad="tgpc" sub="Full stack MERN applications, clean REST APIs and modern frontends — from idea to deployed product."/>
            <div className="grid-2" style={{marginBottom:'4rem'}}>{SOFT.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>
            <Reveal><h3 className="tgpc" style={{fontWeight:800,fontSize:'1.5rem',marginBottom:'1.5rem'}}>Software Skills</h3></Reveal>
            <div className="grid-skills">{SOFT_SKILLS.map(g=><SGroup key={g.group} g={g}/>)}</div>
          </div>
        </section>

        {/* ═══ TIMELINE ═══ */}
        <section id="timeline" className="section">
          <div className="container">
            <SH eyebrow="Coding Journey" title="From Hello World to Full Stack" grad="tgcg"/>
            <div style={{position:'relative',maxWidth:800,margin:'0 auto'}}>
              <div style={{position:'absolute',left:'1.25rem',top:0,bottom:0,width:2,background:'linear-gradient(to bottom,var(--purple),var(--cyan),var(--gold))',borderRadius:999}}/>
              <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
                {JOURNEY.map((s,i)=>(
                  <Reveal key={s.title} delay={i*60}>
                    <div style={{display:'flex',gap:'2.5rem',alignItems:'flex-start',paddingLeft:'.25rem'}}>
                      <div style={{position:'relative',flexShrink:0,marginTop:'1.5rem'}}>
                        <div style={{width:14,height:14,borderRadius:'50%',background:'var(--grad-pc)',boxShadow:'0 0 12px rgba(124,58,237,.6)',position:'relative',zIndex:1}}/>
                      </div>
                      <div className="card" style={{padding:'1.25rem 1.5rem',flex:1}}>
                        <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',color:'var(--cyan-l)',letterSpacing:'.15em'}}>{s.step}</span>
                        <h4 style={{fontWeight:700,fontSize:'1rem',marginTop:'.25rem'}}>{s.title}</h4>
                        <p style={{fontSize:'.84rem',color:'rgba(255,255,255,.48)',marginTop:'.4rem',lineHeight:1.65}}>{s.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EDUCATION ═══ */}
        <section id="education" className="section">
          <div className="container">
            <SH eyebrow="Education" title="Academic Journey" grad="tgpg"/>
            <div className="grid-3">
              {EDU.map((e,i)=>(
                <Reveal key={e.school+i} delay={i*80}>
                  <div className="card" style={{padding:'1.75rem',height:'100%'}}
                    onMouseEnter={el=>{(el.currentTarget as HTMLElement).style.borderColor='rgba(124,58,237,.5)'}}
                    onMouseLeave={el=>{(el.currentTarget as HTMLElement).style.borderColor='var(--border)'}}
                  >
                    <span style={{fontSize:'2rem'}}>{e.icon}</span>
                    <p style={{fontFamily:'var(--ff-mono)',fontSize:'.74rem',color:'var(--cyan-l)',marginTop:'1rem'}}>{e.period}</p>
                    <h4 style={{fontWeight:700,fontSize:'1rem',lineHeight:1.35,marginTop:'.25rem'}}>{e.school}</h4>
                    <p style={{fontSize:'.84rem',color:'rgba(255,255,255,.48)',marginTop:'.25rem'}}>{e.degree}</p>
                    <div style={{marginTop:'1.25rem',display:'inline-flex',alignItems:'center',gap:'.5rem',background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.28)',borderRadius:'.5rem',padding:'.4rem .9rem'}}>
                      <Sparkles size={13} style={{color:'var(--purple-l)'}}/>
                      <span style={{fontFamily:'var(--ff-mono)',fontSize:'.84rem',color:'var(--purple-l)',fontWeight:700}}>{e.score}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ACHIEVEMENTS ═══ */}
        <section id="achievements" className="section">
          <div className="container">
            <SH eyebrow="Achievements" title="Recognition & Wins" grad="tgcg"/>
            <div className="grid-3">
              {ACHV.map((a,i)=>{
                const c=ACHV_COLORS[a.color]
                const Icon=a.icon
                return (
                  <Reveal key={a.title} delay={i*60}>
                    <div className="card" style={{padding:'1.75rem',height:'100%',position:'relative',overflow:'hidden'}}
                      onMouseEnter={el=>{const e=el.currentTarget as HTMLElement;e.style.borderColor=c.border;e.style.boxShadow=`0 8px 40px ${c.glow}`}}
                      onMouseLeave={el=>{const e=el.currentTarget as HTMLElement;e.style.borderColor='var(--border)';e.style.boxShadow='none'}}
                    >
                      <div style={{position:'absolute',top:-30,right:-30,width:100,height:100,borderRadius:'50%',background:c.bg,filter:'blur(20px)'}}/>
                      <span style={{width:48,height:48,borderRadius:'.75rem',background:c.bg,border:`1px solid ${c.border}`,display:'grid',placeItems:'center',color:c.text,marginBottom:'1rem',position:'relative'}}>
                        <Icon size={20}/>
                      </span>
                      <div style={{fontSize:'.64rem',fontFamily:'var(--ff-mono)',letterSpacing:'.2em',textTransform:'uppercase',color:c.text,marginBottom:'.4rem'}}>{a.tag}</div>
                      <h4 style={{fontWeight:700,fontSize:'.95rem',lineHeight:1.45}}>{a.title}</h4>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="section">
          <div className="container">
            <SH eyebrow="Contact" title="Let's Build Something" grad="tg" sub="Open to internships, collaborations and great conversations about engineering or code."/>
            <div style={{display:'grid',gap:'1.5rem'}}>
              <Reveal>
                <div className="card" style={{padding:'2rem'}}>
                  <h3 style={{fontWeight:800,fontSize:'1.4rem',marginBottom:'.25rem'}}>Dharanidharan R S</h3>
                  <p style={{fontSize:'.84rem',color:'rgba(255,255,255,.42)',marginBottom:'1.5rem'}}>Mechanical Engineer · CAD Designer · Full Stack Developer</p>
                  <div style={{display:'flex',flexDirection:'column',gap:'.75rem'}}>
                    {[
                      {href:'mailto:s2007dharanidharan@gmail.com',icon:Mail,label:'Email',value:'s2007dharanidharan@gmail.com',color:'var(--purple)'},
                      {href:'https://www.linkedin.com/in/dharanidharan-R-S',icon:Linkedin,label:'LinkedIn',value:'dharanidharan-R-S',color:'var(--cyan)'},
                      {href:'https://github.com/s2007dharanidharan-cloud',icon:Github,label:'GitHub',value:'s2007dharanidharan-cloud',color:'var(--gold)'},
                    ].map(l=>(
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'.875rem',padding:'.75rem 1rem',borderRadius:'.75rem',border:'1px solid rgba(255,255,255,.06)',background:'rgba(255,255,255,.02)',transition:'all .25s'}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(124,58,237,.08)'}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.02)'}}
                      >
                        <span style={{width:40,height:40,borderRadius:'.625rem',background:'rgba(255,255,255,.05)',display:'grid',placeItems:'center',color:l.color,flexShrink:0}}>
                          <l.icon size={17}/>
                        </span>
                        <div>
                          <div style={{fontSize:'.68rem',color:'rgba(255,255,255,.38)',fontFamily:'var(--ff-mono)'}}>{l.label}</div>
                          <div style={{fontSize:'.88rem',fontFamily:'var(--ff-mono)'}}>{l.value}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div style={{marginTop:'1.5rem',display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                    <a href="/CV core.pdf" download className="btn btn-main" style={{fontSize:'.82rem'}}><Download size={14}/> Core CV</a>
                    <a href="/CV Software.pdf" download className="btn btn-out" style={{fontSize:'.82rem'}}><Download size={14}/> Software CV</a>
                  </div>
                  <div style={{marginTop:'1.25rem',display:'flex',alignItems:'center',gap:'.5rem',fontSize:'.82rem',color:'rgba(255,255,255,.32)'}}>
                    <MapPin size={14} style={{color:'var(--purple-l)'}}/> Erode, Tamil Nadu · India
                  </div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <form onSubmit={e=>{e.preventDefault();alert("Thanks! I'll get back to you soon.")}} className="card" style={{padding:'2rem',display:'grid',gap:'1rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    {['Name','Email'].map(f=>(
                      <label key={f} style={{display:'grid',gap:'.4rem',fontSize:'.82rem'}}>
                        <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'rgba(255,255,255,.38)'}}>{f}</span>
                        <input type={f==='Email'?'email':'text'} required placeholder={f==='Email'?'you@example.com':'Your name'}
                          style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'.625rem',padding:'.6rem .9rem',outline:'none',fontSize:'.9rem',transition:'all .25s'}}
                          onFocus={e=>{e.target.style.borderColor='var(--purple)';e.target.style.boxShadow='0 0 0 3px rgba(124,58,237,.15)'}}
                          onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.1)';e.target.style.boxShadow='none'}}
                        />
                      </label>
                    ))}
                  </div>
                  <label style={{display:'grid',gap:'.4rem'}}>
                    <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'rgba(255,255,255,.38)'}}>Subject</span>
                    <input placeholder="Internship opportunity / Collaboration" style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'.625rem',padding:'.6rem .9rem',outline:'none',fontSize:'.9rem'}}
                      onFocus={e=>{e.target.style.borderColor='var(--cyan)'}}
                      onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.1)'}}
                    />
                  </label>
                  <label style={{display:'grid',gap:'.4rem'}}>
                    <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'rgba(255,255,255,.38)'}}>Message</span>
                    <textarea required rows={5} placeholder="Tell me about your project or opportunity…" style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'.625rem',padding:'.75rem .9rem',outline:'none',fontSize:'.9rem',resize:'none'}}
                      onFocus={e=>{e.target.style.borderColor='var(--purple)'}}
                      onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.1)'}}
                    />
                  </label>
                  <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap'}}>
                    <button type="submit" className="btn btn-main"><Send size={15}/> Send Message</button>
                    <a href="mailto:s2007dharanidharan@gmail.com" className="btn btn-out"><Mail size={15}/> Email Directly</a>
                  </div>
                </form>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{borderTop:'1px solid rgba(255,255,255,.06)',marginTop:'2rem'}}>
          <div className="container" style={{padding:'2.5rem 1.25rem',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'1.5rem'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'.625rem',fontFamily:'var(--ff-display)',fontWeight:800,fontSize:'1.1rem'}}>
                <span style={{width:34,height:34,borderRadius:'.625rem',background:'var(--grad)',display:'grid',placeItems:'center',fontWeight:900}}>D</span>
                <span className="tg">Dharanidharan R S</span>
              </div>
              <p style={{marginTop:'.5rem',fontSize:'.78rem',color:'rgba(255,255,255,.28)'}}>Built with React + Vite · Designed with precision.</p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.625rem'}}>
              {[{href:'mailto:s2007dharanidharan@gmail.com',icon:Mail,label:'Email'},{href:'https://github.com/s2007dharanidharan-cloud',icon:Github,label:'GitHub'},{href:'https://www.linkedin.com/in/dharanidharan-R-S',icon:Linkedin,label:'LinkedIn'}].map(l=>(
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} style={{width:40,height:40,borderRadius:'50%',border:'1px solid rgba(255,255,255,.1)',display:'grid',placeItems:'center',color:'rgba(255,255,255,.48)',transition:'all .25s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--cyan)';(e.currentTarget as HTMLElement).style.color='var(--cyan-l)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,.1)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,.48)'}}
                ><l.icon size={16}/></a>
              ))}
              <a href="/CV core.pdf" download className="btn btn-main" style={{fontSize:'.8rem',padding:'.5rem 1rem'}}><Download size={14}/> Resume</a>
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,.04)'}}>
            <div className="container" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',justifyContent:'space-between',fontSize:'.74rem',color:'rgba(255,255,255,.22)'}}>
              <span>© {new Date().getFullYear()} Dharanidharan R S. All rights reserved.</span>
              <span style={{fontFamily:'var(--ff-mono)',color:'var(--cyan)'}}>// built with precision</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
