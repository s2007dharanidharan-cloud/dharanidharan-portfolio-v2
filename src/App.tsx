import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Download, Mail, Github, Linkedin, Cog, Code2, Cpu, Wrench,
  GraduationCap, Trophy, Briefcase, Award, MapPin, Send,
  Layers, Boxes, Hammer, Database, Globe, Sparkles, ChevronRight,
  Menu, X, ArrowUp, Sun, Moon, ArrowRight, Zap,
} from 'lucide-react'
import Engine3D from './components/Engine3D'

/* ── TYPING TEXT ── */
const PHRASES = ['Mechanical Engineer', 'CAD Designer', 'Full Stack Developer', 'Problem Solver']
function TypingText() {
  const [idx, setIdx] = useState(0); const [sub, setSub] = useState(''); const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = PHRASES[idx]
    if (!del && sub === cur) { const t = setTimeout(() => setDel(true), 1800); return () => clearTimeout(t) }
    if (del && sub === '') { setDel(false); setIdx(i => (i + 1) % PHRASES.length); return }
    const t = setTimeout(() => setSub(s => del ? s.slice(0,-1) : cur.slice(0,s.length+1)), del ? 40 : 80)
    return () => clearTimeout(t)
  }, [sub, del, idx])
  return (
    <span style={{ fontFamily:'var(--ff-mono)', color:'var(--purple)' }}>
      {sub}<span style={{ display:'inline-block', width:2, height:'1em', background:'var(--purple)', marginLeft:2, verticalAlign:'middle', animation:'blink 1s steps(2) infinite' }}/>
    </span>
  )
}

/* ── COUNTER ── */
function Counter({ to, suffix='' }) {
  const ref = useRef(null); const [val, setVal] = useState(0); const started = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now) => {
            const p = Math.min(1, (now-start)/1600)
            setVal(Number((to*(1-Math.pow(1-p,3))).toFixed(to<10?2:0)))
            if (p<1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      })
    }, { threshold:0.4 })
    obs.observe(el); return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ── REVEAL ── */
function Reveal({ children, delay=0, style={} }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          el.style.animationDelay = `${delay}ms`; el.classList.add('fade-up'); el.style.opacity='1'; obs.unobserve(el)
        }
      })
    }, { threshold:0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return <div ref={ref} style={{ opacity:0, ...style }}>{children}</div>
}

/* ── PARTICLES ── */
function Particles() {
  const pts = Array.from({length:12}, (_,i) => ({
    id:i, size:Math.random()*3+1.5,
    left:Math.random()*100, top:Math.random()*100,
    delay:Math.random()*8, dur:Math.random()*6+6,
    color: i%3===0?'rgba(124,58,237,0.5)':i%3===1?'rgba(8,145,178,0.5)':'rgba(217,119,6,0.5)',
  }))
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      {pts.map(p=>(
        <div key={p.id} style={{ position:'absolute', borderRadius:'50%', width:p.size, height:p.size, left:`${p.left}%`, top:`${p.top}%`, background:p.color, animation:`particle ${p.dur}s ${p.delay}s linear infinite` }}/>
      ))}
    </div>
  )
}

/* ── ROTATING ROLE (splash only) ── */
const ROLES = ['Mechanical Engineer', 'CAD Designer', 'Java Developer']
function RotatingRole() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i+1) % ROLES.length); setVisible(true) }, 350)
    }, 2400)
    return () => clearInterval(cycle)
  }, [])
  const colors = ['#A78BFA','#22D3EE','#FCD34D']
  return (
    <span style={{
      display:'inline-block', fontFamily:'var(--ff-mono)',
      fontSize:'clamp(.75rem,1.5vw,.9rem)', fontWeight:700, letterSpacing:'.06em',
      color:colors[idx],
      transition:'opacity .35s ease, transform .35s ease',
      opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(-6px)',
      minWidth:220,
    }}>
      {ROLES[idx]}
    </span>
  )
}

/* ── SPLASH ── */
function Splash({ onDone }) {
  const [phase, setPhase] = useState('in')
  const [prog, setProg] = useState(0)
  const done = useCallback(onDone, [onDone])

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('load')
      let p = 0
      const iv = setInterval(() => {
        p += Math.random() * 14 + 5
        if (p >= 100) { p = 100; clearInterval(iv) }
        setProg(Math.min(p, 100))
      }, 70)
    }, 200)
    const t2 = setTimeout(() => setPhase('out'), 2700)
    const t3 = setTimeout(() => done(), 3100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [done])

  const pct = Math.round(prog)

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'linear-gradient(135deg,#0D0820 0%,#07050F 55%,#0A0618 100%)',
      display:'grid', gridTemplateColumns:'50fr 50fr',
      height:'100dvh', width:'100vw',
      animation: phase==='out' ? 'splashOut .4s ease forwards' : 'splashIn .3s ease forwards',
      overflow:'hidden',
    }}>
      <div style={{ position:'absolute', width:520, height:520, borderRadius:'50%', background:'rgba(124,58,237,0.14)', filter:'blur(110px)', top:'-18%', left:'-8%', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:'rgba(8,145,178,0.09)', filter:'blur(90px)', bottom:'-15%', right:'-5%', pointerEvents:'none' }}/>

      <div className="splash-photo" style={{ position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,transparent 50%,#07050F 100%)', zIndex:2, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(to top,#07050F,transparent)', zIndex:2, pointerEvents:'none' }}/>
        <img
          src="/images/dharanidharan.jpg"
          alt="Dharanidharan R S"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}
          onError={e => {
            const img = e.target
            img.style.display = 'none'
            img.parentElement.style.background = 'linear-gradient(145deg,rgba(124,58,237,.22),rgba(8,145,178,.14))'
            img.parentElement.innerHTML += `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.75rem;color:rgba(255,255,255,.3)"><span style="font-size:6rem">👤</span><span style="font-size:.68rem;font-family:monospace;letter-spacing:.1em;text-align:center;padding:0 2rem">Upload dharanidharan.jpg<br/>to /public/images/</span></div>`
          }}
        />
        <div style={{ position:'absolute', bottom:0, left:0, zIndex:3, padding:'2rem 2rem 1.75rem' }}>
          <h2 style={{ fontSize:'clamp(1.6rem,3.4vw,2.6rem)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.03em', textShadow:'0 2px 40px rgba(0,0,0,.75)', margin:0 }}>
            Dharanidharan{' '}
            <span style={{ background:'linear-gradient(135deg,#A78BFA,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>R S</span>
          </h2>
        </div>
      </div>

      <div className="splash-panel" style={{
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start',
        padding:'clamp(1rem,3vh,2rem) clamp(1.25rem,3vw,2.4rem)',
        position:'relative', zIndex:3, gap:'clamp(.6rem,1.6vh,1.25rem)',
        height:'100%', overflow:'hidden',
      }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(124,58,237,0.14)', border:'1px solid rgba(124,58,237,0.4)', borderRadius:9999, padding:'.36rem .9rem' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#22D3EE', boxShadow:'0 0 8px #22D3EE', display:'inline-block' }}/>
          <span style={{ fontSize:'.66rem', fontFamily:'var(--ff-mono)', color:'#22D3EE', letterSpacing:'.22em', fontWeight:700 }}>PORTFOLIO</span>
        </div>

        <div>
          <p style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, lineHeight:1.18, letterSpacing:'-0.025em', margin:0 }}>
            <span style={{ background:'linear-gradient(135deg,#A78BFA,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Turning Ideas</span>
            {' '}
            <span style={{ color:'rgba(255,255,255,.95)' }}>into Reality</span>
            <br/>
            <span style={{ color:'rgba(255,255,255,.92)' }}>Through </span>
            <span style={{ background:'linear-gradient(135deg,#22D3EE,#FCD34D)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Design &amp; Code</span>
            <span style={{ display:'inline-block', marginLeft:'.3rem' }}>🚀</span>
          </p>
          <p style={{ marginTop:'.6rem', fontSize:'clamp(1rem,1.6vw,1.2rem)', color:'rgba(255,255,255,.55)', lineHeight:1.55, fontWeight:400, maxWidth:360 }}>
            Mechanical Engineering student passionate about CAD Design, Product Development &amp; Software Technology.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'.45rem', width:'100%', maxWidth:320 }}>
          {[
            { icon:'⚙️', label:'Mechanical Engineer', bg:'rgba(124,58,237,0.18)', border:'rgba(124,58,237,0.45)', text:'#A78BFA' },
            { icon:'💻', label:'Full Stack Developer', bg:'rgba(8,145,178,0.18)',   border:'rgba(8,145,178,0.45)',  text:'#22D3EE' },
            { icon:'✏️', label:'CAD Designer',         bg:'rgba(217,119,6,0.18)',   border:'rgba(217,119,6,0.45)',  text:'#FCD34D' },
          ].map(t => (
            <div key={t.label} style={{ display:'flex', alignItems:'center', gap:'.6rem', background:t.bg, border:`1px solid ${t.border}`, borderRadius:'.6rem', padding:'.7rem 1rem' }}>
              <span style={{ fontSize:'.88rem' }}>{t.icon}</span>
              <span style={{ fontSize:'1rem', fontFamily:'var(--ff-mono)', color:t.text, fontWeight:700, letterSpacing:'.04em' }}>{t.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1.1rem', marginTop:'.1rem' }}>
          <div className="gear-rig">
            <svg className="gear gear-big" viewBox="0 0 100 100" width="56" height="56">
              <defs>
                <linearGradient id="gearGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED"/>
                  <stop offset="100%" stopColor="#22D3EE"/>
                </linearGradient>
              </defs>
              <path fill="url(#gearGradA)" d="M50 6c2.2 0 4.4.1 6.5.4l2 9.3c3.4.8 6.6 2.1 9.5 3.8l8.2-5c3.5 2.7 6.6 5.8 9.3 9.3l-5 8.2c1.7 2.9 3 6.1 3.8 9.5l9.3 2c.3 2.1.4 4.3.4 6.5s-.1 4.4-.4 6.5l-9.3 2c-.8 3.4-2.1 6.6-3.8 9.5l5 8.2c-2.7 3.5-5.8 6.6-9.3 9.3l-8.2-5c-2.9 1.7-6.1 3-9.5 3.8l-2 9.3c-2.1.3-4.3.4-6.5.4s-4.4-.1-6.5-.4l-2-9.3c-3.4-.8-6.6-2.1-9.5-3.8l-8.2 5c-3.5-2.7-6.6-5.8-9.3-9.3l5-8.2c-1.7-2.9-3-6.1-3.8-9.5l-9.3-2c-.3-2.1-.4-4.3-.4-6.5s.1-4.4.4-6.5l9.3-2c.8-3.4 2.1-6.6 3.8-9.5l-5-8.2c2.7-3.5 5.8-6.6 9.3-9.3l8.2 5c2.9-1.7 6.1-3 9.5-3.8l2-9.3C45.6 6.1 47.8 6 50 6z"/>
              <circle cx="50" cy="50" r="19" fill="#0D0820"/>
            </svg>
            <svg className="gear gear-small" viewBox="0 0 100 100" width="30" height="30">
              <defs>
                <linearGradient id="gearGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D97706"/>
                  <stop offset="100%" stopColor="#FCD34D"/>
                </linearGradient>
              </defs>
              <path fill="url(#gearGradB)" d="M50 6c2.2 0 4.4.1 6.5.4l2 9.3c3.4.8 6.6 2.1 9.5 3.8l8.2-5c3.5 2.7 6.6 5.8 9.3 9.3l-5 8.2c1.7 2.9 3 6.1 3.8 9.5l9.3 2c.3 2.1.4 4.3.4 6.5s-.1 4.4-.4 6.5l-9.3 2c-.8 3.4-2.1 6.6-3.8 9.5l5 8.2c-2.7 3.5-5.8 6.6-9.3 9.3l-8.2-5c-2.9 1.7-6.1 3-9.5 3.8l-2 9.3c-2.1.3-4.3.4-6.5.4s-4.4-.1-6.5-.4l-2-9.3c-3.4-.8-6.6-2.1-9.5-3.8l-8.2 5c-3.5-2.7-6.6-5.8-9.3-9.3l5-8.2c-1.7-2.9-3-6.1-3.8-9.5l-9.3-2c-.3-2.1-.4-4.3-.4-6.5s.1-4.4.4-6.5l9.3-2c.8-3.4 2.1-6.6 3.8-9.5l-5-8.2c2.7-3.5 5.8-6.6 9.3-9.3l8.2 5c2.9-1.7 6.1-3 9.5-3.8l2-9.3C45.6 6.1 47.8 6 50 6z"/>
              <circle cx="50" cy="50" r="19" fill="#0D0820"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:'clamp(1.3rem,2.6vw,1.9rem)', fontWeight:900, fontFamily:'var(--ff-mono)', background:'linear-gradient(135deg,#A78BFA,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>{pct}%</div>
            <div style={{ fontSize:'.66rem', color:'rgba(255,255,255,.35)', fontFamily:'var(--ff-mono)', marginTop:'.22rem', letterSpacing:'.1em' }}>Loading portfolio…</div>
          </div>
        </div>
      </div>

      <style>{`
        .gear-rig{ position:relative; width:56px; height:56px; flex-shrink:0; }
        .gear{ position:absolute; filter: drop-shadow(0 2px 10px rgba(124,58,237,0.35)); transform-origin: 50% 50%; }
        .gear-big{ top:0; left:0; animation: spinCW 2.6s linear infinite; }
        .gear-small{ top:30px; left:30px; animation: spinCCW 1.7s linear infinite; }
        @keyframes spinCW{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes spinCCW{ from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        .splash-photo{ display:block; }
        @media(max-width:640px){
          div[style*="gridTemplateColumns"]{ grid-template-columns:1fr!important; }
          .splash-photo{ display:none; }
          .splash-panel{ padding:1.25rem 1.5rem!important; justify-content:center!important; }
        }
        @media(max-height:680px){ .splash-panel{ gap:.5rem!important; } }
        @media(max-height:560px){
          .splash-photo{ display:none; }
          div[style*="gridTemplateColumns"]{ grid-template-columns:1fr!important; }
          .splash-panel{ justify-content:center!important; gap:.4rem!important; }
        }
      `}</style>
    </div>
  )
}

/* ── NAVBAR ── */
const NAV = [{href:'#about',label:'About'},{href:'#mechanical',label:'Mechanical'},{href:'#software',label:'Software'},{href:'#timeline',label:'Journey'},{href:'#education',label:'Education'},{href:'#achievements',label:'Awards'},{href:'#contact',label:'Contact'}]
function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false)
  useEffect(() => { const fn=()=>setScrolled(window.scrollY>32); fn(); window.addEventListener('scroll',fn); return()=>window.removeEventListener('scroll',fn) },[])
  return (
    <header style={{ position:'fixed', inset:'0 0 auto', zIndex:50, transition:'all .3s', padding:scrolled?'0.5rem 0':'0.9rem 0' }} className={scrolled?'nav-scroll':''}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="#" style={{ display:'flex', alignItems:'center', gap:'.6rem', fontFamily:'var(--ff-display)', fontWeight:800, fontSize:'1.1rem' }}>
          <span style={{ width:38, height:38, borderRadius:'.75rem', background:'var(--grad)', display:'grid', placeItems:'center', color:'#fff', fontWeight:900, fontSize:'1.1rem', boxShadow:'0 4px 16px rgba(124,58,237,0.35)' }}>D</span>
          <span className="tgpc">Dharanidharan.</span>
        </a>
        <nav style={{ display:'flex', alignItems:'center', gap:'.1rem' }} className="desktop-nav">
          {NAV.map(l=>(
            <a key={l.href} href={l.href} style={{ padding:'.45rem .9rem', borderRadius:'.5rem', fontSize:'.85rem', color:'var(--text-2)', fontWeight:500, transition:'all .2s' }}
              onMouseEnter={e=>{e.target.style.background='var(--surface2)';e.target.style.color='var(--purple)'}}
              onMouseLeave={e=>{e.target.style.background='';e.target.style.color='var(--text-2)'}}
            >{l.label}</a>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
          <button onClick={()=>setDark(!dark)} style={{ width:40, height:40, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--purple)', transition:'all .25s' }}>
            {dark?<Sun size={17}/>:<Moon size={17}/>}
          </button>
          <a href="#contact" className="btn btn-main" style={{ fontSize:'.82rem', padding:'.55rem 1.25rem' }}>Let's Connect</a>
          <button onClick={()=>setOpen(v=>!v)} style={{ width:40, height:40, borderRadius:'50%', background:'var(--surface2)', border:'1px solid var(--border)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--purple)' }} id="menu-btn">
            {open?<X size={18}/>:<Menu size={18}/>}
          </button>
        </div>
      </div>
      {open&&(
        <div className="container" style={{ marginTop:'.5rem' }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'1rem', padding:'1rem', display:'grid', gap:'.2rem', boxShadow:'var(--shadow-xl)' }}>
            {NAV.map(l=>(
              <a key={l.href} href={l.href} onClick={()=>setOpen(false)} style={{ padding:'.7rem 1rem', borderRadius:'.5rem', fontSize:'.9rem', color:'var(--text-2)', transition:'all .2s', fontWeight:500 }}
                onMouseEnter={e=>{e.target.style.background='var(--surface2)';e.target.style.color='var(--purple)'}}
                onMouseLeave={e=>{e.target.style.background='';e.target.style.color='var(--text-2)'}}
              >{l.label}</a>
            ))}
          </div>
        </div>
      )}
      <style>{`@media(min-width:1024px){#menu-btn{display:none!important}.desktop-nav{display:flex!important}}@media(max-width:1023px){.desktop-nav{display:none!important}}`}</style>
    </header>
  )
}

/* ── BACK TO TOP ── */
function BackToTop() {
  const [show,setShow]=useState(false)
  useEffect(()=>{const fn=()=>setShow(window.scrollY>600);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn)},[])
  if(!show)return null
  return(
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} style={{ position:'fixed', bottom:24, right:24, zIndex:40, width:48, height:48, borderRadius:'50%', background:'var(--grad)', border:'none', cursor:'pointer', display:'grid', placeItems:'center', color:'#fff', boxShadow:'0 4px 20px rgba(124,58,237,0.4)', transition:'transform .25s' }}
      onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.1) translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}
    ><ArrowUp size={20}/></button>
  )
}

/* ── SECTION HEADER ── */
function SH({ eyebrow, title, sub, grad='tgpc' }) {
  return (
    <Reveal>
      <div style={{ textAlign:'center', maxWidth:580, margin:'0 auto 3.5rem' }}>
        <div className="section-badge"><span style={{ width:6, height:6, borderRadius:'50%', background:'var(--purple)', display:'inline-block' }}/>{eyebrow}</div>
        <h2 className={grad} style={{ fontSize:'clamp(2rem,4.5vw,3rem)', fontWeight:800, lineHeight:1.1 }}>{title}</h2>
        {sub&&<p style={{ marginTop:'1rem', color:'var(--text-2)', lineHeight:1.75, fontSize:'1rem' }}>{sub}</p>}
      </div>
    </Reveal>
  )
}

/* ── PROJECT IMAGE ── */
function PImg({ src, ph, title }) {
  const [err,setErr]=useState(false)
  return(
    <div className="pimg">
      {!err?<><img src={src} alt={title} onError={()=>setErr(true)}/><div className="pimg-overlay"/></>
      :<div className="pimg-ph"><span style={{fontSize:'2.5rem'}}>{ph}</span><span style={{fontSize:'.65rem',color:'var(--text-3)',fontFamily:'var(--ff-mono)',textAlign:'center',padding:'0 1rem'}}>Upload to /public/images/</span></div>}
    </div>
  )
}

/* ── PROJECT CARD ── */
const AC = {
  purple:{border:'rgba(124,58,237,.35)',glow:'rgba(124,58,237,.12)',tag:'rgba(124,58,237,.08)',tagBg:'rgba(124,58,237,.1)',text:'var(--purple)'},
  cyan:  {border:'rgba(8,145,178,.35)', glow:'rgba(8,145,178,.12)', tag:'rgba(8,145,178,.08)', tagBg:'rgba(8,145,178,.1)', text:'var(--cyan)'},
  gold:  {border:'rgba(217,119,6,.35)', glow:'rgba(217,119,6,.12)', tag:'rgba(217,119,6,.08)', tagBg:'rgba(217,119,6,.1)', text:'var(--gold)'},
}
function PCard({ p, i }) {
  const c = AC[p.accent]??AC.purple
  return(
    <Reveal delay={i*60}>
      <article className="card" style={{ height:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}
        onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor=c.border;el.style.boxShadow=`0 12px 40px ${c.glow}, var(--shadow-lg)`}}
        onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.boxShadow='var(--shadow-sm)'}}
      >
        <div style={{padding:'1rem 1rem 0'}}><PImg src={p.image} ph={p.ph} title={p.title}/></div>
        <div style={{padding:'1.25rem 1.5rem 1.5rem',flex:1,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.75rem'}}>
            <span className="pill" style={{background:c.tagBg,border:`1px solid ${c.border}`,color:c.text}}>{p.tag}</span>
            <span style={{width:30,height:30,borderRadius:'50%',background:'var(--surface2)',display:'grid',placeItems:'center',color:c.text}}><ArrowRight size={14}/></span>
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.08rem',lineHeight:1.35,marginBottom:'.5rem',color:'var(--text)'}}>{p.title}</h3>
          <p style={{fontSize:'.86rem',color:'var(--text-2)',lineHeight:1.75,marginBottom:'1rem',flex:1}}>{p.desc}</p>
          <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:'.4rem'}}>
            {p.points.map((pt)=>(
              <li key={pt} style={{display:'flex',alignItems:'flex-start',gap:'.5rem',fontSize:'.82rem'}}>
                <ChevronRight size={13} style={{color:c.text,flexShrink:0,marginTop:3}}/>
                <span style={{color:'var(--text-2)'}}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

/* ── SKILL BAR ── */
function SBar({ name, level, delay=0 }) {
  return(
    <Reveal delay={delay}>
      <div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'.4rem'}}>
          <span style={{fontSize:'.86rem',fontWeight:500,color:'var(--text)'}}>{name}</span>
          <span style={{fontSize:'.72rem',fontFamily:'var(--ff-mono)',color:'var(--purple)',fontWeight:700}}>{level}%</span>
        </div>
        <div className="sbar-track"><div className="sbar-fill" style={{width:`${level}%`}}/></div>
      </div>
    </Reveal>
  )
}

/* ── SKILL GROUP ── */
function SGroup({ g }) {
  const Icon=g.icon
  return(
    <div className="card" style={{padding:'1.5rem'}}>
      <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1.25rem'}}>
        <span style={{width:42,height:42,borderRadius:'.75rem',background:'var(--surface2)',border:'1px solid var(--border)',display:'grid',placeItems:'center',color:'var(--purple)'}}><Icon size={19}/></span>
        <span style={{fontWeight:700,fontSize:'.95rem',color:'var(--text)'}}>{g.group}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {g.items.map((it,i)=><SBar key={it.name} {...it} delay={i*40}/>)}
      </div>
    </div>
  )
}

/* ════ DATA ════ */
const MECH = [
  {tag:'Innovation · Railway Safety',title:'PTI Zero Fall Initiative',desc:'Sensor-based railway safety system with a retractable safety plate mechanism preventing passenger falls at the Platform-Train Interface.',points:['Sensor-driven retractable plate','Improved passenger safety','Winner — Ideathon & EKNA 2025'],accent:'purple',image:'/images/pti-zero-fall.jpg',ph:'🚉',cat:'hardware'},
  {tag:'Automation · Food Tech',title:'Automatic Chapathi Making Machine',desc:'Automated chapathi production combining conveyors, sensors and rack-and-pinion pressing for consistent, uniform output.',points:['Conveyor + rack-and-pinion','Dough detection sensors','Winner — Mini Hackathon'],accent:'cyan',image:'/images/chapathi-machine.jpg',ph:'⚙️',cat:'hardware'},
  {tag:'Machine Design · Agriculture',title:'Grain Cleaning Machine',desc:'Agricultural grain cleaner with feeding, screening and impurity-separation mechanisms focused on efficiency and reduced manual effort.',points:['Feeding & screening modules','Impurity separation system','DFM principles applied'],accent:'gold',image:'/images/grain-cleaning.jpg',ph:'🌾',cat:'hardware'},
  {tag:'CAD · PTC Creo · Automotive',title:'Twin-Turbo V6 Engine Assembly',desc:'Detailed 3D modeling and full assembly of a Twin-Turbo V6 — block, pistons, crankshaft, connecting rods and turbochargers.',points:['Complete assembly integration','Advanced part modeling','Precision tolerancing'],accent:'purple',image:'/images/v6-engine.jpg',ph:'🔧',cat:'cad'},
  {tag:'CAD · PTC Creo · Aerospace',title:'Jet Engine Design & Assembly',desc:'Full 3D jet engine — compressor, combustion chamber, turbine and exhaust assembled with aerospace-grade modeling techniques.',points:['Compressor → turbine stages','Aerospace assembly methods','Complex surface modeling'],accent:'cyan',image:'/images/jet-engine.jpg',ph:'✈️',cat:'cad'},
]
const SOFT = [
  {tag:'Full Stack · MERN',title:'Series House',desc:'Platform for discovering, rating and reviewing TV series. Secure auth, REST APIs and a polished React frontend with optimised MongoDB queries.',points:['JWT auth & authorization','Dynamic ratings & reviews','Optimised MongoDB queries'],accent:'purple',image:'/images/series-house.jpg',ph:'🎬'},
  {tag:'Full Stack · MERN',title:'ATM Application',desc:'Banking transaction simulator with deposits, withdrawals, balance inquiry and complete transaction history management.',points:['Secure Node + Mongo backend','Responsive React UI','Account lifecycle handling'],accent:'cyan',image:'/images/atm-app.jpg',ph:'🏦'},
]
const MSKILLS = [
  {group:'CAD & Design',icon:Layers,items:[{name:'PTC Creo',level:92},{name:'CATIA',level:90},{name:'SolidWorks',level:85},{name:'AutoCAD',level:88}]},
  {group:'Simulation & Analysis',icon:Cpu,items:[{name:'ANSYS',level:78},{name:'MATLAB',level:80}]},
  {group:'Manufacturing & Automation',icon:Hammer,items:[{name:'CNC Programming',level:82},{name:'Product Design',level:88},{name:'Automation Systems',level:80},{name:'Mechanical Design',level:90}]},
  {group:'Engineering Soft Skills',icon:Wrench,items:[{name:'Problem Solving',level:92},{name:'Team Leadership',level:88},{name:'Communication',level:86},{name:'Project Management',level:84}]},
]
const SSKILLS = [
  {group:'Programming',icon:Code2,items:[{name:'Java',level:88},{name:'Python',level:82},{name:'C',level:80}]},
  {group:'Frontend',icon:Globe,items:[{name:'HTML',level:95},{name:'CSS',level:92},{name:'JavaScript',level:88},{name:'React.js',level:86}]},
  {group:'Backend',icon:Boxes,items:[{name:'Node.js',level:84},{name:'Express.js',level:82}]},
  {group:'Database',icon:Database,items:[{name:'MongoDB',level:82},{name:'MySQL',level:80}]},
  {group:'Tools & Platforms',icon:Wrench,items:[{name:'Git / GitHub',level:90},{name:'VS Code',level:95},{name:'Vercel / Render',level:80}]},
  {group:'CS Fundamentals',icon:Cpu,items:[{name:'DSA',level:80},{name:'OOP',level:86},{name:'DBMS',level:82},{name:'OS',level:78}]},
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
const ACHV_C = {
  gold:  {bg:'rgba(217,119,6,.08)',  border:'rgba(217,119,6,.3)',  text:'var(--gold)',   glow:'rgba(217,119,6,.15)'},
  purple:{bg:'rgba(124,58,237,.08)', border:'rgba(124,58,237,.3)', text:'var(--purple)', glow:'rgba(124,58,237,.15)'},
  cyan:  {bg:'rgba(8,145,178,.08)',  border:'rgba(8,145,178,.3)',  text:'var(--cyan)',   glow:'rgba(8,145,178,.15)'},
}

/* ════ APP ════ */
export default function App() {
  const [splash,setSplash]=useState(true)
  const [dark,setDark]=useState(true)
  const [mechF,setMechF]=useState('all')
  const [projF,setProjF]=useState('all')

  useEffect(()=>{
    if(dark) document.body.classList.add('dark')
    else document.body.classList.remove('dark')
  },[dark])

  const allProj=[...MECH.map(p=>({...p,kind:'mech'})),...SOFT.map(p=>({...p,kind:'software'}))]
  const filtProj=allProj.filter(p=>projF==='all'||p.kind===projF)
  const filtMech=MECH.filter(p=>mechF==='all'||p.cat===mechF)

  return(
    <>
      {splash&&<Splash onDone={()=>setSplash(false)}/>}
      <div style={{minHeight:'100vh',overflowX:'hidden',background:'var(--bg)'}}>
        <Navbar dark={dark} setDark={setDark}/>
        <BackToTop/>

        {/* ═══ HERO ═══ */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '63fr 37fr',
          alignItems: 'stretch',
          paddingTop: 0,
          overflow: 'hidden',
        }}>
          <div className="grid-bg" style={{position:'absolute',inset:0,opacity:.5,maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)',WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)'}}/>
          <Particles/>
          <div className="orb" style={{width:700,height:700,background:'rgba(124,58,237,0.1)',top:'-25%',left:'-15%'}}/>
          <div className="orb" style={{width:500,height:500,background:'rgba(8,145,178,0.08)',bottom:'-15%',right:'-10%'}}/>

          {/* LEFT — text */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,4vw,3rem) clamp(3rem,6vh,5rem)',
          }}>
            <Reveal>
              <div style={{display:'inline-flex',alignItems:'center',gap:'.5rem',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:9999,padding:'.4rem 1rem',marginBottom:'1.5rem'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:'#10B981',boxShadow:'0 0 8px #10B981',display:'inline-block'}}/>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.2em',color:'#10B981',fontWeight:700}}>OPEN FOR INTERNSHIPS · 2026</span>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 style={{fontSize:'clamp(2.8rem,5.5vw,5rem)',fontWeight:900,lineHeight:1.0,letterSpacing:'-.03em',marginBottom:'1.25rem',color:'var(--text)'}}>
                Dharanidharan<br/><span className="tg">R S</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div style={{fontSize:'1.15rem',marginBottom:'1.25rem',minHeight:'1.8rem'}}><TypingText/></div>
            </Reveal>
            <Reveal delay={240}>
              <p style={{fontSize:'1rem',color:'var(--text-2)',lineHeight:1.8,maxWidth:500,marginBottom:'2.5rem'}}>
                Bridging <span style={{color:'var(--purple)',fontWeight:600}}>mechanical innovation</span> and{' '}
                <span style={{color:'var(--cyan)',fontWeight:600}}>software engineering</span> to build the future — from CAD-modelled turbines to MERN-stack platforms.
              </p>
            </Reveal>
            <Reveal delay={320}>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',marginBottom:'2.5rem'}}>
                <a href="#mechanical" className="btn btn-main"><Cog size={16}/> Mechanical Work</a>
                <a href="#software" className="btn btn-out"><Code2 size={16}/> Software Work</a>
                <a href="/CV-core.pdf" download className="btn btn-ghost"><Download size={16}/> Core CV</a>
                <a href="/CV-Software.pdf" download className="btn btn-ghost"><Download size={16}/> Software CV</a>
                <a href="#contact" className="btn btn-ghost"><Mail size={16}/> Contact</a>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',maxWidth:360}}>
                {[{n:8.78,s:'CGPA',sfx:'',color:'var(--purple)'},{n:7,s:'Projects',sfx:'+',color:'var(--cyan)'},{n:5,s:'Awards',sfx:'',color:'var(--gold)'}].map(m=>(
                  <div key={m.s} className="stat-card">
                    <div style={{fontSize:'1.8rem',fontWeight:800,fontFamily:'var(--ff-mono)',color:m.color}}><Counter to={m.n} suffix={m.sfx}/></div>
                    <div style={{fontSize:'.65rem',textTransform:'uppercase',letterSpacing:'.15em',color:'var(--text-3)',marginTop:'.3rem',fontWeight:600}}>{m.s}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Engine fills the entire right half, full height */}
          <div style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'stretch',
          }}>
            {/* Subtle left-edge glow separator */}
            <div style={{
              position: 'absolute', left: 0, top: '8%', bottom: '8%', width: 1,
              background: 'linear-gradient(to bottom, transparent, rgba(124,58,237,0.5), rgba(8,145,178,0.4), transparent)',
              pointerEvents: 'none', zIndex: 2,
            }}/>
            <div style={{ flex: 1, position: 'relative' }}>
              <Engine3D />
            </div>
          </div>
        </section>

        {/* ═══ ABOUT ═══ */}
        <section id="about" className="section">
          <div className="container">
            <SH eyebrow="About Me" title="Engineer × Developer" grad="tgpc"/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              <Reveal>
                <div className="card" style={{padding:'2rem'}}>
                  <p style={{fontSize:'1.05rem',lineHeight:1.85,color:'var(--text-2)',marginBottom:'1rem'}}>
                    I'm a Mechanical Engineering student at <span style={{color:'var(--text)',fontWeight:700}}>Kongu Engineering College</span> with a CGPA of{' '}
                    <span className="tgcg" style={{fontWeight:800}}>8.78</span>. I bridge two worlds: the precision of mechanical systems and the elegance of software development.
                  </p>
                  <p style={{fontSize:'1rem',lineHeight:1.85,color:'var(--text-2)'}}>
                    From designing a jet engine in PTC Creo to shipping a full-stack MERN application — I believe the best engineers are also builders who can code.
                  </p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'.5rem',marginTop:'1.5rem'}}>
                    {['CAD Design','Automation','Product Dev','MERN Stack','Problem Solving','PTC Creo','React.js','Node.js'].map(t=>(
                      <span key={t} style={{padding:'.3rem .8rem',borderRadius:9999,border:'1px solid var(--border)',background:'var(--surface2)',fontSize:'.75rem',fontFamily:'var(--ff-mono)',color:'var(--purple)',fontWeight:600}}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="card" style={{padding:'2rem',display:'flex',alignItems:'flex-start',gap:'1.25rem'}}>
                  <span style={{width:52,height:52,borderRadius:'.875rem',background:'var(--surface2)',border:'1px solid var(--border)',display:'grid',placeItems:'center',color:'var(--cyan)',flexShrink:0}}><Briefcase size={24}/></span>
                  <div>
                    <h4 style={{fontWeight:700,fontSize:'1.05rem',color:'var(--text)'}}>In-Plant Training</h4>
                    <p style={{fontSize:'.82rem',color:'var(--purple)',fontFamily:'var(--ff-mono)',marginBottom:'.5rem',fontWeight:600}}>JK Fenner (India) Limited</p>
                    <p style={{fontSize:'.95rem',color:'var(--text-2)',lineHeight:1.7}}>Hands-on exposure to industrial manufacturing workflows, mechanical systems, production processes and quality practices — bridging theory with real-world engineering.</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ ALL PROJECTS ═══ */}
        <section id="projects" style={{padding:'4rem 0',background:'var(--bg2)'}}>
          <div className="container">
            <Reveal>
              <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'1rem',marginBottom:'2rem'}}>
                <div style={{display:'inline-flex',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:9999,padding:'.3rem',boxShadow:'var(--shadow-sm)'}}>
                  {[['all','All Work'],['mech','Mechanical'],['software','Software']].map(([k,label])=>(
                    <button key={k} onClick={()=>setProjF(k)} style={{padding:'.5rem 1.2rem',borderRadius:9999,border:'none',cursor:'pointer',fontSize:'.85rem',fontWeight:700,fontFamily:'var(--ff-display)',transition:'all .25s',
                      background:projF===k?'var(--grad)':'transparent',color:projF===k?'#fff':'var(--text-2)',
                      boxShadow:projF===k?'0 4px 16px rgba(124,58,237,0.3)':'none'}}>{label}</button>
                  ))}
                </div>
                <span style={{fontSize:'.75rem',fontFamily:'var(--ff-mono)',color:'var(--text-3)',fontWeight:600}}>{filtProj.length} project{filtProj.length!==1?'s':''}</span>
              </div>
            </Reveal>
            <div className="grid-2">{filtProj.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>
          </div>
        </section>

        {/* ═══ MECHANICAL ═══ */}
        <section id="mechanical" className="section">
          <div className="divider" style={{position:'absolute',top:0,left:0,right:0}}/>
          <div className="orb" style={{width:600,height:600,background:'rgba(124,58,237,0.07)',top:'5%',left:'-15%'}}/>
          <div className="container" style={{position:'relative',zIndex:1}}>
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
                <span style={{width:56,height:56,borderRadius:'1rem',background:'var(--surface2)',border:'1px solid var(--border)',display:'grid',placeItems:'center',color:'var(--purple)',boxShadow:'var(--shadow-sm)'}}><Cog size={26}/></span>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--purple)',fontWeight:700}}>Division 01</span>
              </div>
            </Reveal>
            <SH eyebrow="Core Mechanical Engineering" title="Design · Build · Innovate" grad="tgpg" sub="Engineering innovation, product development and advanced CAD — from railway safety systems to aerospace engines."/>
            <Reveal>
              <div style={{display:'flex',gap:'.75rem',marginBottom:'2rem',flexWrap:'wrap'}}>
                {[['all','All Projects'],['hardware','🔧 Hardware & Innovation'],['cad','💻 Advanced CAD']].map(([k,label])=>(
                  <button key={k} onClick={()=>setMechF(k)} style={{padding:'.55rem 1.25rem',borderRadius:9999,border:'1.5px solid',
                    borderColor:mechF===k?'var(--purple)':'var(--border)',
                    background:mechF===k?'var(--surface2)':'transparent',
                    color:mechF===k?'var(--purple)':'var(--text-2)',
                    cursor:'pointer',fontSize:'.84rem',fontWeight:600,fontFamily:'var(--ff-display)',transition:'all .25s'}}>{label}</button>
                ))}
              </div>
            </Reveal>
            {mechF!=='all'&&(
              <Reveal>
                <div className="highlight" style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontWeight:700,fontSize:'1rem',color:mechF==='hardware'?'var(--gold)':'var(--cyan)'}}>
                    {mechF==='hardware'?'Engineering Innovation & Product Development':'Advanced CAD Modeling & Digital Engineering'}
                  </h3>
                </div>
              </Reveal>
            )}
            <div className="grid-2" style={{marginBottom:'4rem'}}>{filtMech.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>
            <Reveal><h3 className="tgpg" style={{fontWeight:800,fontSize:'1.6rem',marginBottom:'1.5rem'}}>Mechanical Skills</h3></Reveal>
            <div className="grid-skills" style={{marginBottom:'3rem'}}>{MSKILLS.map(g=><SGroup key={g.group} g={g}/>)}</div>
            <Reveal><h3 className="tgcg" style={{fontWeight:800,fontSize:'1.6rem',marginBottom:'1.5rem'}}>Certifications</h3></Reveal>
            <div className="grid-3">
              {CERTS.map((c,i)=>(
                <Reveal key={c.title} delay={i*50}>
                  <div className="cert">
                    <Award size={18} style={{color:'var(--gold)',flexShrink:0,marginTop:2}}/>
                    <div>
                      <div style={{fontSize:'.86rem',fontWeight:600,lineHeight:1.4,color:'var(--text)'}}>{c.title}</div>
                      <div style={{fontSize:'.72rem',color:'var(--gold)',fontFamily:'var(--ff-mono)',marginTop:'.25rem',fontWeight:700}}>{c.org}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SOFTWARE ═══ */}
        <section id="software" className="section" style={{background:'var(--bg2)'}}>
          <div className="divider" style={{position:'absolute',top:0,left:0,right:0}}/>
          <div className="orb" style={{width:600,height:600,background:'rgba(8,145,178,0.07)',top:'5%',right:'-15%'}}/>
          <div className="container" style={{position:'relative',zIndex:1}}>
            <Reveal>
              <div style={{display:'flex',alignItems:'center',gap:'.75rem',marginBottom:'1rem'}}>
                <span style={{width:56,height:56,borderRadius:'1rem',background:'var(--surface2)',border:'1px solid var(--border)',display:'grid',placeItems:'center',color:'var(--cyan)',boxShadow:'var(--shadow-sm)'}}><Code2 size={26}/></span>
                <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',letterSpacing:'.3em',textTransform:'uppercase',color:'var(--cyan)',fontWeight:700}}>Division 02</span>
              </div>
            </Reveal>
            <SH eyebrow="Software Development" title="Create • Innovate • Inspire" grad="tgpc" sub="Full stack MERN applications, clean REST APIs and modern frontends — from idea to deployed product."/>
            <div className="grid-2" style={{marginBottom:'4rem'}}>{SOFT.map((p,i)=><PCard key={p.title} p={p} i={i}/>)}</div>
            <Reveal><h3 className="tgpc" style={{fontWeight:800,fontSize:'1.6rem',marginBottom:'1.5rem'}}>Software Skills</h3></Reveal>
            <div className="grid-skills">{SSKILLS.map(g=><SGroup key={g.group} g={g}/>)}</div>
          </div>
        </section>

        {/* ═══ TIMELINE ═══ */}
        <section id="timeline" className="section">
          <div className="container">
            <SH eyebrow="Coding Journey" title="From Hello World to Full Stack" grad="tgcg"/>
            <div style={{position:'relative',maxWidth:720,margin:'0 auto'}}>
              <div style={{position:'absolute',left:'1.1rem',top:0,bottom:0,width:2,background:'linear-gradient(to bottom,var(--purple),var(--cyan),var(--gold))',borderRadius:999,opacity:.4}}/>
              <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                {JOURNEY.map((s,i)=>(
                  <Reveal key={s.title} delay={i*60}>
                    <div style={{display:'flex',gap:'2rem',alignItems:'flex-start'}}>
                      <div className="t-dot" style={{marginLeft:'.45rem'}}/>
                      <div className="card" style={{padding:'1.25rem 1.5rem',flex:1}}>
                        <span style={{fontSize:'.68rem',fontFamily:'var(--ff-mono)',color:'var(--cyan)',letterSpacing:'.15em',fontWeight:700}}>{s.step}</span>
                        <h4 style={{fontWeight:700,fontSize:'1rem',marginTop:'.2rem',color:'var(--text)'}}>{s.title}</h4>
                        <p style={{fontSize:'.86rem',color:'var(--text-2)',marginTop:'.35rem',lineHeight:1.65}}>{s.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ EDUCATION ═══ */}
        <section id="education" className="section" style={{background:'var(--bg2)'}}>
          <div className="container">
            <SH eyebrow="Education" title="Academic Journey" grad="tgpg"/>
            <div className="grid-3">
              {EDU.map((e,i)=>(
                <Reveal key={e.school+i} delay={i*80}>
                  <div className="card" style={{padding:'2rem',height:'100%'}}
                    onMouseEnter={el=>{el.currentTarget.style.borderColor='var(--border-h)'}}
                    onMouseLeave={el=>{el.currentTarget.style.borderColor='var(--border)'}}
                  >
                    <span style={{fontSize:'2.2rem'}}>{e.icon}</span>
                    <p style={{fontFamily:'var(--ff-mono)',fontSize:'.75rem',color:'var(--cyan)',marginTop:'1rem',fontWeight:700}}>{e.period}</p>
                    <h4 style={{fontWeight:700,fontSize:'1rem',lineHeight:1.35,marginTop:'.25rem',color:'var(--text)'}}>{e.school}</h4>
                    <p style={{fontSize:'.86rem',color:'var(--text-2)',marginTop:'.25rem'}}>{e.degree}</p>
                    <div style={{marginTop:'1.25rem',display:'inline-flex',alignItems:'center',gap:'.5rem',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'.5rem',padding:'.45rem 1rem'}}>
                      <Sparkles size={13} style={{color:'var(--purple)'}}/>
                      <span style={{fontFamily:'var(--ff-mono)',fontSize:'.86rem',color:'var(--purple)',fontWeight:700}}>{e.score}</span>
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
                const c = ACHV_C[a.color as keyof typeof ACHV_C]; const Icon = a.icon
                return(
                  <Reveal key={a.title} delay={i*60}>
                    <div className="card" style={{padding:'1.75rem',height:'100%',position:'relative',overflow:'hidden'}}
                      onMouseEnter={el=>{const e=el.currentTarget;e.style.borderColor=c.border;e.style.boxShadow=`0 12px 40px ${c.glow}, var(--shadow-lg)`}}
                      onMouseLeave={el=>{const e=el.currentTarget;e.style.borderColor='var(--border)';e.style.boxShadow='var(--shadow-sm)'}}
                    >
                      <div style={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:c.bg,filter:'blur(20px)'}}/>
                      <span style={{width:50,height:50,borderRadius:'.875rem',background:c.bg,border:`1px solid ${c.border}`,display:'grid',placeItems:'center',color:c.text,marginBottom:'1rem',position:'relative'}}>
                        <Icon size={22}/>
                      </span>
                      <div style={{fontSize:'.64rem',fontFamily:'var(--ff-mono)',letterSpacing:'.2em',textTransform:'uppercase',color:c.text,marginBottom:'.4rem',fontWeight:700}}>{a.tag}</div>
                      <h4 style={{fontWeight:700,fontSize:'.96rem',lineHeight:1.45,color:'var(--text)'}}>{a.title}</h4>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="section" style={{background:'var(--bg2)'}}>
          <div className="container">
            <SH eyebrow="Contact" title="Let's Build Something" grad="tg" sub="Open to internships, collaborations and great conversations about engineering or code."/>
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              <Reveal>
                <div className="card" style={{padding:'2rem'}}>
                  <h3 style={{fontWeight:800,fontSize:'1.4rem',marginBottom:'.25rem',color:'var(--text)'}}>Dharanidharan R S</h3>
                  <p style={{fontSize:'.86rem',color:'var(--text-3)',marginBottom:'1.5rem'}}>Mechanical Engineer · CAD Designer · Full Stack Developer</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'.75rem',marginBottom:'1.5rem'}}>
                    {[
                      {href:'mailto:s2007dharanidharan@gmail.com',icon:Mail,label:'Email',value:'s2007dharanidharan@gmail.com',color:'var(--purple)'},
                      {href:'https://www.linkedin.com/in/dharanidharan-r-s-a92612337',icon:Linkedin,label:'LinkedIn',value:'dharanidharan-r-s',color:'var(--cyan)'},
                      {href:'https://github.com/s2007dharanidharan-cloud',icon:Github,label:'GitHub',value:'s2007dharanidharan-cloud',color:'var(--gold)'},
                    ].map(l=>(
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                        style={{display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1rem',borderRadius:'.75rem',border:'1px solid var(--border)',background:'var(--surface2)',transition:'all .25s',minWidth:0,overflow:'hidden'}}
                        onMouseEnter={e=>{const el=e.currentTarget;el.style.borderColor='var(--border-h)';el.style.boxShadow='var(--shadow-md)'}}
                        onMouseLeave={e=>{const el=e.currentTarget;el.style.borderColor='var(--border)';el.style.boxShadow='none'}}
                      >
                        <span style={{width:42,height:42,borderRadius:'.625rem',background:'var(--surface)',border:'1px solid var(--border)',display:'grid',placeItems:'center',color:l.color,flexShrink:0}}><l.icon size={17}/></span>
                        <div style={{minWidth:0,overflow:'hidden'}}>
                          <div style={{fontSize:'.68rem',color:'var(--text-3)',fontFamily:'var(--ff-mono)',fontWeight:600}}>{l.label}</div>
                          <div style={{fontSize:'.82rem',fontFamily:'var(--ff-mono)',color:'var(--text)',fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.value}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBottom:'1rem'}}>
                    <a href="/CV-core.pdf" download className="btn btn-main" style={{fontSize:'.82rem'}}><Download size={14}/> Core CV</a>
                    <a href="/CV-Software.pdf" download className="btn btn-out" style={{fontSize:'.82rem'}}><Download size={14}/> Software CV</a>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'.5rem',fontSize:'.82rem',color:'var(--text-3)'}}>
                    <MapPin size={14} style={{color:'var(--purple)'}}/> Erode, Tamil Nadu · India
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <form onSubmit={e=>{e.preventDefault();alert("Thanks! I'll get back to you soon.")}} className="card" style={{padding:'2rem',display:'grid',gap:'1rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                    {['Name','Email'].map(f=>(
                      <label key={f} style={{display:'grid',gap:'.4rem'}}>
                        <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'var(--text-3)',fontWeight:600}}>{f}</span>
                        <input type={f==='Email'?'email':'text'} required placeholder={f==='Email'?'you@example.com':'Your name'} className="inp"/>
                      </label>
                    ))}
                  </div>
                  <label style={{display:'grid',gap:'.4rem'}}>
                    <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'var(--text-3)',fontWeight:600}}>Subject</span>
                    <input placeholder="Internship opportunity / Collaboration" className="inp"/>
                  </label>
                  <label style={{display:'grid',gap:'.4rem'}}>
                    <span style={{fontFamily:'var(--ff-mono)',fontSize:'.63rem',textTransform:'uppercase',letterSpacing:'.15em',color:'var(--text-3)',fontWeight:600}}>Message</span>
                    <textarea required rows={5} placeholder="Tell me about your project or opportunity…" className="inp" style={{resize:'none'}}/>
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
        <footer style={{borderTop:'1px solid var(--border)',background:'var(--surface)'}}>
          <div className="container" style={{padding:'2.5rem 1.25rem',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'1.5rem'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'.625rem',fontFamily:'var(--ff-display)',fontWeight:800,fontSize:'1.1rem'}}>
                <span style={{width:36,height:36,borderRadius:'.625rem',background:'var(--grad)',display:'grid',placeItems:'center',color:'#fff',fontWeight:900,fontSize:'1rem',boxShadow:'0 4px 16px rgba(124,58,237,0.3)'}}>D</span>
                <span className="tg">Dharanidharan R S</span>
              </div>
              <p style={{marginTop:'.5rem',fontSize:'.8rem',color:'var(--text-3)'}}>Built with React + Vite · Designed with precision.</p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'.625rem'}}>
              {[
                {href:'mailto:s2007dharanidharan@gmail.com',icon:Mail,label:'Email'},
                {href:'https://github.com/s2007dharanidharan-cloud',icon:Github,label:'GitHub'},
                {href:'https://www.linkedin.com/in/dharanidharan-r-s-a92612337',icon:Linkedin,label:'LinkedIn'},
              ].map(l=>(
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} style={{width:42,height:42,borderRadius:'50%',border:'1px solid var(--border)',background:'var(--surface2)',display:'grid',placeItems:'center',color:'var(--text-2)',transition:'all .25s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-h)';e.currentTarget.style.color='var(--purple)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-2)'}}
                ><l.icon size={17}/></a>
              ))}
              <a href="/CV-core.pdf" download className="btn btn-main" style={{fontSize:'.82rem',padding:'.55rem 1.25rem'}}><Download size={15}/> Resume</a>
            </div>
          </div>
          <div style={{borderTop:'1px solid var(--border)'}}>
            <div className="container" style={{padding:'1rem 1.25rem',display:'flex',flexWrap:'wrap',justifyContent:'space-between',fontSize:'.76rem',color:'var(--text-3)'}}>
              <span>© {new Date().getFullYear()} Dharanidharan R S. All rights reserved.</span>
              <span style={{fontFamily:'var(--ff-mono)',color:'var(--purple)',fontWeight:600}}>// built with precision</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
