/* ── QA Lab Carousel Primitives v2 — More visual variety ── */
const BG    = '#111110';
const AMBER = '#C8962A';
const CREAM = '#F3EDD8';
const DIM   = '#1E1E1A';
const MID   = '#2C2C24';
const RED   = '#AA5050';
const S     = 360;
const px    = n => Math.round(n * S / 1080);

/* ─── Brand stamps ───────────────────────────────────── */
function Stamp({ dark }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(36), letterSpacing:'0.07em', color: dark ? BG : AMBER, lineHeight:1 }}>QA LAB</span>
      <span style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:px(20), letterSpacing:'0.18em', textTransform:'uppercase', color: dark ? BG : CREAM, opacity:0.28 }}>qalab.io</span>
    </div>
  );
}

/* ─── Base shell ─────────────────────────────────────── */
function Sl({ children, bg=BG, pad=true }) {
  return (
    <div style={{ width:S, height:S, background:bg, display:'flex', flexDirection:'column', padding: pad ? `${px(58)}px ${px(62)}px` : 0, overflow:'hidden', position:'relative' }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COVERS — 3 styles
   ═══════════════════════════════════════════════════════ */

/* Cover A: classic bottom-aligned */
function Cov({ eyebrow, headline, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:px(16) }}>
        {eyebrow && <div style={{ color:AMBER, fontSize:px(20), letterSpacing:'0.24em', textTransform:'uppercase', fontWeight:500 }}>{eyebrow}</div>}
        <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(96), lineHeight:0.87 }}>{headline}</div>
        {sub && <div style={{ color:CREAM, fontSize:px(28), opacity:0.45, lineHeight:1.5 }}>{sub}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:px(16), marginTop:px(4) }}>
          <div style={{ width:px(40), height:px(3), background:AMBER }}></div>
          <div style={{ color:CREAM, fontSize:px(18), opacity:0.3, letterSpacing:'0.1em' }}>Arraste para ver →</div>
        </div>
      </div>
    </Sl>
  );
}

/* Cover B: split amber top / dark bottom */
function CovSplit({ eyebrow, headline, sub }) {
  return (
    <Sl pad={false}>
      <div style={{ background:AMBER, padding:`${px(48)}px ${px(58)}px ${px(32)}px`, display:'flex', flexDirection:'column', gap:px(12) }}>
        <Stamp dark/>
        {eyebrow && <div style={{ color:BG, fontSize:px(17), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:600, opacity:0.55, marginTop:px(8) }}>{eyebrow}</div>}
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(88), lineHeight:0.85 }}>{headline}</div>
      </div>
      <div style={{ flex:1, padding:`${px(24)}px ${px(58)}px ${px(40)}px`, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        {sub && <div style={{ color:CREAM, fontSize:px(28), lineHeight:1.6, opacity:0.55 }}>{sub}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(40), height:px(3), background:AMBER }}></div>
          <div style={{ color:CREAM, fontSize:px(18), opacity:0.3, letterSpacing:'0.1em' }}>Arraste para ver →</div>
        </div>
      </div>
    </Sl>
  );
}

/* Cover C: centered cream */
function CovLight({ eyebrow, headline, sub }) {
  return (
    <Sl bg={CREAM}>
      <Stamp dark/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        {eyebrow && <div style={{ color:AMBER, fontSize:px(18), letterSpacing:'0.26em', textTransform:'uppercase', fontWeight:500 }}>{eyebrow}</div>}
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(96), lineHeight:0.87 }}>{headline}</div>
        {sub && <div style={{ color:BG, fontSize:px(28), opacity:0.5, lineHeight:1.5 }}>{sub}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:px(16), marginTop:px(4) }}>
          <div style={{ width:px(40), height:px(3), background:AMBER }}></div>
          <div style={{ color:BG, fontSize:px(18), opacity:0.3, letterSpacing:'0.1em' }}>Arraste para ver →</div>
        </div>
      </div>
    </Sl>
  );
}

/* ═══════════════════════════════════════════════════════
   CTAs — 3 styles
   ═══════════════════════════════════════════════════════ */

function CTA({ lines }) {
  return (
    <Sl bg={AMBER}>
      <Stamp dark/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(24) }}>
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(92), lineHeight:0.88 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(36), height:px(4), background:BG, opacity:0.28 }}></div>
          <span style={{ color:BG, fontWeight:600, fontSize:px(21), letterSpacing:'0.16em', textTransform:'uppercase' }}>qalab.io</span>
        </div>
      </div>
    </Sl>
  );
}

function CTADark({ lines }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(24) }}>
        <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(86), lineHeight:0.88 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div style={{ display:'inline-flex', padding:`${px(14)}px ${px(24)}px`, background:AMBER, color:BG, fontWeight:700, fontSize:px(18), letterSpacing:'0.14em', textTransform:'uppercase', alignSelf:'flex-start' }}>qalab.io →</div>
      </div>
    </Sl>
  );
}

function CTALight({ lines }) {
  return (
    <Sl bg={CREAM}>
      <Stamp dark/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(24) }}>
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(86), lineHeight:0.88 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div style={{ display:'inline-flex', padding:`${px(14)}px ${px(24)}px`, background:AMBER, color:BG, fontWeight:700, fontSize:px(18), letterSpacing:'0.14em', textTransform:'uppercase', alignSelf:'flex-start' }}>qalab.io →</div>
      </div>
    </Sl>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTENT SLIDES — Many varied styles
   ═══════════════════════════════════════════════════════ */

/* ── Versus: wrong vs right ────────────────────────── */
function Versus({ topic, wrong, right }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:AMBER, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:500, marginTop:px(16), marginBottom:px(12) }}>{topic}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:px(10) }}>
        <div style={{ flex:1, background:DIM, padding:`${px(14)}px ${px(16)}px`, display:'flex', flexDirection:'column', gap:px(8) }}>
          <div style={{ color:RED, fontSize:px(15), fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>✕  O que você diz</div>
          <div style={{ color:CREAM, fontSize:px(24), lineHeight:1.5, opacity:0.55, flex:1 }}>{wrong}</div>
        </div>
        <div style={{ flex:1, border:`${px(2)}px solid ${AMBER}`, padding:`${px(14)}px ${px(16)}px`, display:'flex', flexDirection:'column', gap:px(8) }}>
          <div style={{ color:AMBER, fontSize:px(15), fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>✓  O que deveria dizer</div>
          <div style={{ color:CREAM, fontSize:px(24), lineHeight:1.5, flex:1 }}>{right}</div>
        </div>
      </div>
    </Sl>
  );
}

/* ── Versus Split: horizontal split layout ─────────── */
function VersusSplit({ wrong, right }) {
  return (
    <Sl pad={false}>
      <div style={{ display:'flex', height:'100%' }}>
        <div style={{ flex:1, background:'#1A1208', padding:`${px(48)}px ${px(36)}px`, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(14) }}>
          <div style={{ color:RED, fontSize:px(16), fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase' }}>✕ Sem QA</div>
          {wrong.map((t,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:px(10) }}>
              <div style={{ width:px(4), height:px(4), background:RED, borderRadius:'50%', flexShrink:0 }}></div>
              <span style={{ color:CREAM, fontSize:px(19), opacity:0.5 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ width:px(3), background:AMBER, flexShrink:0 }}></div>
        <div style={{ flex:1, background:BG, padding:`${px(48)}px ${px(36)}px`, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(14) }}>
          <div style={{ color:AMBER, fontSize:px(16), fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase' }}>✓ Com QA</div>
          {right.map((t,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:px(10) }}>
              <div style={{ width:px(4), height:px(4), background:AMBER, borderRadius:'50%', flexShrink:0 }}></div>
              <span style={{ color:CREAM, fontSize:px(19), fontWeight:500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </Sl>
  );
}

/* ── Checklist: dark ──────────────────────────────── */
function Checklist({ heading, items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:AMBER, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:500, marginTop:px(16), marginBottom:px(14) }}>{heading}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(11) }}>
        {items.map((item,i) => (
          <div key={i} style={{ display:'flex', gap:px(14), alignItems:'flex-start' }}>
            <div style={{ width:px(20), height:px(20), border:`${px(2)}px solid ${AMBER}`, flexShrink:0, marginTop:px(2) }}></div>
            <div style={{ color:CREAM, fontSize:px(24), lineHeight:1.45, opacity:0.62 }}>{item}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Checklist Amber: amber bg ────────────────────── */
function ChecklistAmber({ heading, items }) {
  return (
    <Sl bg={AMBER}>
      <Stamp dark/>
      <div style={{ color:BG, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:600, marginTop:px(16), marginBottom:px(14), opacity:0.6 }}>{heading}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(11) }}>
        {items.map((item,i) => (
          <div key={i} style={{ display:'flex', gap:px(14), alignItems:'flex-start' }}>
            <div style={{ width:px(20), height:px(20), border:`${px(2)}px solid ${BG}`, flexShrink:0, marginTop:px(2), opacity:0.35 }}></div>
            <div style={{ color:BG, fontSize:px(24), lineHeight:1.45, fontWeight:500 }}>{item}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Checklist Light: cream bg ────────────────────── */
function ChecklistLight({ heading, items }) {
  return (
    <Sl bg={CREAM}>
      <Stamp dark/>
      <div style={{ color:AMBER, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:500, marginTop:px(16), marginBottom:px(14) }}>{heading}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(11) }}>
        {items.map((item,i) => (
          <div key={i} style={{ display:'flex', gap:px(14), alignItems:'flex-start' }}>
            <div style={{ width:px(20), height:px(20), border:`${px(2)}px solid ${BG}`, flexShrink:0, marginTop:px(2), opacity:0.25 }}></div>
            <div style={{ color:BG, fontSize:px(24), lineHeight:1.45, opacity:0.75 }}>{item}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── ListItem: numbered with watermark ───────────── */
function ListItem({ num, title, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ position:'absolute', right:px(28), bottom:px(30), fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(260), lineHeight:1, color:AMBER, opacity:0.06, letterSpacing:'-0.04em', userSelect:'none' }}>{String(num).padStart(2,'0')}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(44), height:px(44), border:`${px(2)}px solid ${AMBER}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:AMBER, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(26) }}>{String(num).padStart(2,'0')}</span>
          </div>
          <div style={{ flex:1, height:px(2), background:MID }}></div>
        </div>
        <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(68), lineHeight:0.9 }}>{title}</div>
        <div style={{ color:CREAM, fontSize:px(26), lineHeight:1.6, opacity:0.55 }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── ListItem Amber: amber background ────────────── */
function ListItemAmber({ num, title, body }) {
  return (
    <Sl bg={AMBER}>
      <Stamp dark/>
      <div style={{ position:'absolute', right:px(28), bottom:px(30), fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(260), lineHeight:1, color:BG, opacity:0.08, letterSpacing:'-0.04em', userSelect:'none' }}>{String(num).padStart(2,'0')}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(44), height:px(44), border:`${px(2)}px solid ${BG}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity:0.45 }}>
            <span style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(26) }}>{String(num).padStart(2,'0')}</span>
          </div>
          <div style={{ flex:1, height:px(2), background:BG, opacity:0.15 }}></div>
        </div>
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(68), lineHeight:0.9 }}>{title}</div>
        <div style={{ color:BG, fontSize:px(26), lineHeight:1.6, opacity:0.65 }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── Quote: vertical amber bar ───────────────────── */
function Quote({ text, attribution }) {
  return (
    <Sl>
      <div style={{ position:'absolute', left:0, top:0, width:px(7), height:'100%', background:AMBER }}></div>
      <div style={{ paddingLeft:px(16), display:'flex', flexDirection:'column', height:'100%' }}>
        <Stamp/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(20) }}>
          <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(64), lineHeight:0.88 }}>"{text}"</div>
          {attribution && <div style={{ display:'flex', alignItems:'center', gap:px(14) }}>
            <div style={{ width:px(32), height:px(3), background:AMBER }}></div>
            <div style={{ color:AMBER, fontSize:px(19), fontWeight:500, letterSpacing:'0.1em' }}>{attribution}</div>
          </div>}
        </div>
      </div>
    </Sl>
  );
}

/* ── Quote Cream: light bg ───────────────────────── */
function QuoteLight({ text, attribution }) {
  return (
    <Sl bg={CREAM}>
      <div style={{ position:'absolute', left:0, top:0, width:px(7), height:'100%', background:AMBER }}></div>
      <div style={{ paddingLeft:px(16), display:'flex', flexDirection:'column', height:'100%' }}>
        <Stamp dark/>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(20) }}>
          <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(64), lineHeight:0.88 }}>"{text}"</div>
          {attribution && <div style={{ display:'flex', alignItems:'center', gap:px(14) }}>
            <div style={{ width:px(32), height:px(3), background:AMBER }}></div>
            <div style={{ color:AMBER, fontSize:px(19), fontWeight:500, letterSpacing:'0.1em' }}>{attribution}</div>
          </div>}
        </div>
      </div>
    </Sl>
  );
}

/* ── Insight: big statement ──────────────────────── */
function Insight({ statement, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(72), lineHeight:0.9 }}>{statement}</div>
        {sub && <div style={{ borderLeft:`${px(3)}px solid ${AMBER}`, paddingLeft:px(18), color:CREAM, fontSize:px(22), lineHeight:1.6, opacity:0.52 }}>{sub}</div>}
      </div>
    </Sl>
  );
}

/* ── AmberPoint: amber headline + body ───────────── */
function AmberPoint({ headline, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ color:AMBER, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(68), lineHeight:0.88 }}>{headline}</div>
        <div style={{ height:px(2), background:MID }}><div style={{ width:'100%', height:'100%', background:AMBER, opacity:0.3 }}></div></div>
        <div style={{ color:CREAM, fontSize:px(28), lineHeight:1.6, opacity:0.58 }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── AmberPoint Light: cream bg ──────────────────── */
function AmberPointLight({ headline, body }) {
  return (
    <Sl bg={CREAM}>
      <Stamp dark/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(68), lineHeight:0.88 }}>{headline}</div>
        <div style={{ height:px(2), background:BG, opacity:0.12 }}></div>
        <div style={{ color:BG, fontSize:px(28), lineHeight:1.6, opacity:0.55 }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── BigStat: giant number takes the slide ───────── */
function BigStat({ number, unit, caption }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(6) }}>
        <div style={{ display:'flex', alignItems:'flex-start' }}>
          <span style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(260), lineHeight:0.78, letterSpacing:'-0.05em' }}>{number}</span>
          {unit && <span style={{ color:AMBER, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(80), lineHeight:1, marginTop:px(24) }}>{unit}</span>}
        </div>
        <div style={{ height:px(3), background:MID, marginBottom:px(8) }}>
          <div style={{ width:'100%', height:'100%', background:AMBER, opacity:0.4 }}></div>
        </div>
        <div style={{ color:CREAM, fontSize:px(24), lineHeight:1.4, opacity:0.52 }}>{caption}</div>
      </div>
    </Sl>
  );
}

/* ── Split Horizontal: left amber block, right dark ─ */
function SplitH({ left, right }) {
  return (
    <Sl pad={false}>
      <div style={{ display:'flex', height:'100%' }}>
        <div style={{ width:'42%', background:AMBER, display:'flex', flexDirection:'column', justifyContent:'center', padding:`${px(36)}px ${px(32)}px` }}>
          <div style={{ color:BG, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(64), lineHeight:0.88 }}>{left}</div>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:`${px(36)}px ${px(32)}px`, gap:px(16) }}>
          {typeof right === 'string' ? (
            <div style={{ color:CREAM, fontSize:px(23), lineHeight:1.6, opacity:0.6 }}>{right}</div>
          ) : right}
        </div>
      </div>
    </Sl>
  );
}

/* ── Grid Cards: 2×N grid of items ──────────────── */
function GridCards({ heading, items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:AMBER, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:500, marginTop:px(14), marginBottom:px(12) }}>{heading}</div>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:px(8) }}>
        {items.map((item, i) => (
          <div key={i} style={{ border:`${px(1)}px solid ${MID}`, padding:`${px(12)}px ${px(14)}px`, display:'flex', alignItems:'center', gap:px(10) }}>
            <span style={{ color:AMBER, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(22), lineHeight:1, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</span>
            <span style={{ color:CREAM, fontSize:px(18), fontWeight:500, lineHeight:1.2 }}>{item}</span>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Stacked: 2–3 boxes stacked ─────────────────── */
function Stacked({ heading, boxes }) {
  return (
    <Sl>
      <Stamp/>
      {heading && <div style={{ color:AMBER, fontSize:px(16), letterSpacing:'0.22em', textTransform:'uppercase', fontWeight:500, marginTop:px(14), marginBottom:px(10) }}>{heading}</div>}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(10) }}>
        {boxes.map((box, i) => (
          <div key={i} style={{
            flex:1, padding:`${px(14)}px ${px(16)}px`, display:'flex', flexDirection:'column', gap:px(6),
            background: box.amber ? AMBER : (box.outline ? 'transparent' : DIM),
            border: box.outline ? `${px(2)}px solid ${AMBER}` : 'none',
          }}>
            <div style={{ color: box.amber ? BG : AMBER, fontSize:px(14), fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' }}>{box.label}</div>
            <div style={{ color: box.amber ? BG : CREAM, fontSize:px(24), lineHeight:1.45, flex:1, fontWeight: box.outline ? 600 : 400, opacity: box.amber ? 1 : (box.outline ? 1 : 0.6) }}>{box.text}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── CompareTable: tester vs qa side-by-side rows ── */
function CompareTable({ rows }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(10) }}>
        {rows.map(([left, right], i) => (
          <div key={i} style={{ display:'flex', gap:px(8) }}>
            <div style={{ flex:1, background:DIM, padding:`${px(12)}px ${px(14)}px`, color:CREAM, fontSize:px(19), lineHeight:1.35, opacity:0.45 }}>{left}</div>
            <div style={{ flex:1, border:`${px(2)}px solid ${AMBER}`, padding:`${px(12)}px ${px(14)}px`, color:CREAM, fontSize:px(19), lineHeight:1.35, fontWeight:600 }}>{right}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Roadmap Double: two items stacked with numbers ── */
function RoadmapDouble({ items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        {items.map(({ n, t, d }) => (
          <div key={n} style={{ display:'flex', gap:px(16), alignItems:'flex-start' }}>
            <div style={{ width:px(44), height:px(44), border:`${px(2)}px solid ${AMBER}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:AMBER, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(24) }}>{n}</span>
            </div>
            <div>
              <div style={{ color:CREAM, fontFamily:'Barlow Condensed, sans-serif', fontWeight:900, fontSize:px(36), lineHeight:0.95, marginBottom:px(6) }}>{t}</div>
              <div style={{ color:CREAM, fontSize:px(20), lineHeight:1.5, opacity:0.5 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* Export everything */
Object.assign(window, {
  BG, AMBER, CREAM, DIM, MID, RED, S, px,
  Stamp, Sl,
  Cov, CovSplit, CovLight,
  CTA, CTADark, CTALight,
  Versus, VersusSplit, Checklist, ChecklistAmber, ChecklistLight,
  ListItem, ListItemAmber, Quote, QuoteLight,
  Insight, AmberPoint, AmberPointLight,
  BigStat, SplitH, GridCards, Stacked, CompareTable, RoadmapDouble,
});
