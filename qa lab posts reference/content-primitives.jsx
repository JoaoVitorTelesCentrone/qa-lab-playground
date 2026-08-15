/* ── QA Lab Carousel Primitives v3 — Dark + Mint Green ──── */
const BG     = '#111318';
const CARD   = '#1A1D24';
const BORDER = '#2A2E38';
const GREEN  = '#4ADE80';
const WHITE  = '#F0F2F5';
const GRAY   = '#8B919A';
const DGRAY  = '#3A3F4A';
const RED    = '#F87171';
const S      = 360;
const px     = n => Math.round(n * S / 1080);

const SERIF  = "'Playfair Display', Georgia, serif";
const SANS   = "'Inter', 'Space Grotesk', system-ui, sans-serif";

/* ─── Brand stamp ────────────────────────────────────── */
function Stamp({ light }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:px(12) }}>
      <div style={{ width:px(36), height:px(36), borderRadius:px(10), background: light ? '#1A1D24' : '#1E222A', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width={px(20)} height={px(20)} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2L15 2"/>
          <path d="M12 2L12 6"/>
          <path d="M5 10L5 22"/>
          <path d="M19 10L19 22"/>
          <path d="M5 10L19 10"/>
          <path d="M8 14L16 14"/>
          <path d="M8 18L16 18"/>
        </svg>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:px(8) }}>
        <span style={{ fontFamily:SANS, fontWeight:800, fontSize:px(24), color:GREEN, letterSpacing:'0.05em' }}>QA LAB</span>
      </div>
      <div style={{ flex:1 }}></div>
      <span style={{ fontFamily:SANS, fontSize:px(16), color:GRAY, opacity:0.5 }}>qalab.io</span>
    </div>
  );
}

/* ─── Base shell ─────────────────────────────────────── */
function Sl({ children, bg=BG }) {
  return (
    <div style={{ width:S, height:S, background:bg, display:'flex', flexDirection:'column', padding:`${px(52)}px ${px(56)}px`, overflow:'hidden', position:'relative', fontFamily:SANS }}>
      {children}
    </div>
  );
}

/* ─── Card component ─────────────────────────────────── */
function Card({ children, accent=false }) {
  return (
    <div style={{
      background: accent ? 'transparent' : CARD,
      border: `1px solid ${accent ? GREEN : BORDER}`,
      borderRadius: px(14),
      padding: `${px(18)}px ${px(20)}px`,
      display: 'flex', flexDirection: 'column', gap: px(10),
    }}>
      {children}
    </div>
  );
}

/* ─── Small pill/tag ─────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{
      display:'inline-flex', padding:`${px(5)}px ${px(14)}px`,
      background:'rgba(74,222,128,0.1)', border:`1px solid rgba(74,222,128,0.25)`,
      borderRadius:px(20), color:GREEN, fontSize:px(14), fontWeight:600,
      letterSpacing:'0.06em', fontFamily:SANS,
    }}>{children}</span>
  );
}

/* ─── Check icon ─────────────────────────────────────── */
function Check() {
  return (
    <div style={{ width:px(22), height:px(22), borderRadius:'50%', background:'rgba(74,222,128,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <svg width={px(12)} height={px(12)} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COVERS
   ═══════════════════════════════════════════════════════ */

/* Cover A: dark, classic */
function Cov({ eyebrow, headline, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        {eyebrow && <div style={{ color:GREEN, fontSize:px(16), letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:600, fontFamily:SANS }}>{eyebrow}</div>}
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(80), lineHeight:0.92 }}>{headline}</div>
        {sub && <div style={{ color:GRAY, fontSize:px(24), lineHeight:1.6, fontFamily:SANS }}>{sub}</div>}
        <div style={{ display:'flex', alignItems:'center', gap:px(14), marginTop:px(8) }}>
          <div style={{ width:px(36), height:px(2), background:GREEN, opacity:0.5 }}></div>
          <div style={{ color:GRAY, fontSize:px(16), opacity:0.45 }}>Arraste para ver →</div>
        </div>
      </div>
    </Sl>
  );
}

/* Cover B: with card-like hero section */
function CovCard({ eyebrow, headline, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(16), marginTop:px(16) }}>
        {eyebrow && <div style={{ color:GREEN, fontSize:px(16), letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:600, fontFamily:SANS }}>{eyebrow}</div>}
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(72), lineHeight:0.92 }}>{headline}</div>
        {sub && (
          <Card>
            <div style={{ color:GRAY, fontSize:px(22), lineHeight:1.6, fontFamily:SANS }}>{sub}</div>
          </Card>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:px(14), marginTop:px(4) }}>
          <div style={{ width:px(36), height:px(2), background:GREEN, opacity:0.5 }}></div>
          <div style={{ color:GRAY, fontSize:px(16), opacity:0.45 }}>Arraste para ver →</div>
        </div>
      </div>
    </Sl>
  );
}

/* Cover C: green accent top bar */
function CovGreen({ eyebrow, headline, sub }) {
  return (
    <Sl>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:px(5), background:GREEN }}></div>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        {eyebrow && <Tag>{eyebrow}</Tag>}
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(80), lineHeight:0.92 }}>{headline}</div>
        {sub && <div style={{ color:GRAY, fontSize:px(24), lineHeight:1.6, fontFamily:SANS }}>{sub}</div>}
      </div>
    </Sl>
  );
}

/* ═══════════════════════════════════════════════════════
   CTAs
   ═══════════════════════════════════════════════════════ */

function CTA({ lines }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(28) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(78), lineHeight:0.92 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div style={{ display:'inline-flex', padding:`${px(14)}px ${px(28)}px`, background:GREEN, color:BG, fontWeight:700, fontSize:px(18), letterSpacing:'0.06em', borderRadius:px(10), alignSelf:'flex-start', fontFamily:SANS }}>Começar agora →</div>
      </div>
    </Sl>
  );
}

function CTACard({ lines, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(20) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(70), lineHeight:0.92 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        {sub && (
          <Card accent>
            <div style={{ color:GREEN, fontSize:px(22), lineHeight:1.5, fontFamily:SANS, fontWeight:500 }}>{sub}</div>
          </Card>
        )}
        <div style={{ display:'inline-flex', padding:`${px(14)}px ${px(28)}px`, background:GREEN, color:BG, fontWeight:700, fontSize:px(18), letterSpacing:'0.06em', borderRadius:px(10), alignSelf:'flex-start', fontFamily:SANS }}>qalab.io →</div>
      </div>
    </Sl>
  );
}

function CTAMinimal({ lines }) {
  return (
    <Sl>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:px(5), background:GREEN }}></div>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(28) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(78), lineHeight:0.92 }}>{lines.map((l,i)=><span key={i}>{l}<br/></span>)}</div>
        <div style={{ display:'flex', alignItems:'center', gap:px(14) }}>
          <div style={{ width:px(10), height:px(10), borderRadius:'50%', background:GREEN }}></div>
          <span style={{ color:GRAY, fontFamily:SANS, fontSize:px(20), fontWeight:500 }}>qalab.io</span>
        </div>
      </div>
    </Sl>
  );
}

/* ═══════════════════════════════════════════════════════
   CONTENT SLIDES
   ═══════════════════════════════════════════════════════ */

/* ── Versus: errado vs certo ─────────────────────── */
function Versus({ topic, wrong, right }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:GREEN, fontSize:px(14), letterSpacing:'0.16em', textTransform:'uppercase', fontWeight:600, marginTop:px(16), marginBottom:px(14), fontFamily:SANS }}>{topic}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:px(10) }}>
        <Card>
          <div style={{ color:RED, fontSize:px(14), fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:SANS }}>✕ Errado</div>
          <div style={{ color:GRAY, fontSize:px(22), lineHeight:1.5, fontFamily:SANS }}>{wrong}</div>
        </Card>
        <Card accent>
          <div style={{ color:GREEN, fontSize:px(14), fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:SANS }}>✓ Certo</div>
          <div style={{ color:WHITE, fontSize:px(22), lineHeight:1.5, fontFamily:SANS }}>{right}</div>
        </Card>
      </div>
    </Sl>
  );
}

/* ── VersusSplit: horizontal split ────────────────── */
function VersusSplit({ wrong, right }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', gap:px(10), marginTop:px(14) }}>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:px(8) }}>
          <div style={{ color:RED, fontSize:px(14), fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:SANS, marginBottom:px(4) }}>✕ Sem QA</div>
          {wrong.map((t,i) => (
            <div key={i} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:px(10), padding:`${px(10)}px ${px(12)}px` }}>
              <span style={{ color:GRAY, fontSize:px(17), fontFamily:SANS }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ width:px(2), background:GREEN, opacity:0.3, flexShrink:0, borderRadius:1 }}></div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:px(8) }}>
          <div style={{ color:GREEN, fontSize:px(14), fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:SANS, marginBottom:px(4) }}>✓ Com QA</div>
          {right.map((t,i) => (
            <div key={i} style={{ background:'rgba(74,222,128,0.05)', border:`1px solid rgba(74,222,128,0.2)`, borderRadius:px(10), padding:`${px(10)}px ${px(12)}px` }}>
              <span style={{ color:WHITE, fontSize:px(17), fontFamily:SANS, fontWeight:500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </Sl>
  );
}

/* ── Checklist: dark ─────────────────────────────── */
function Checklist({ heading, items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:WHITE, fontSize:px(24), fontWeight:700, fontFamily:SANS, marginTop:px(18), marginBottom:px(14) }}>{heading}</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(11) }}>
        {items.map((item,i) => (
          <div key={i} style={{ display:'flex', gap:px(12), alignItems:'flex-start' }}>
            <Check/>
            <div style={{ color:GRAY, fontSize:px(21), lineHeight:1.5, fontFamily:SANS }}>{item}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Checklist Card: inside a card ───────────────── */
function ChecklistCard({ heading, items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', marginTop:px(12) }}>
        <Card>
          <div style={{ color:WHITE, fontSize:px(22), fontWeight:700, fontFamily:SANS, marginBottom:px(6) }}>{heading}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:px(10) }}>
            {items.map((item,i) => (
              <div key={i} style={{ display:'flex', gap:px(12), alignItems:'flex-start' }}>
                <Check/>
                <div style={{ color:GRAY, fontSize:px(20), lineHeight:1.5, fontFamily:SANS }}>{item}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Sl>
  );
}

/* ── ListItem: numbered ──────────────────────────── */
function ListItem({ num, title, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(48), height:px(48), borderRadius:px(12), background:'rgba(74,222,128,0.1)', border:`1px solid rgba(74,222,128,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:GREEN, fontFamily:SANS, fontWeight:800, fontSize:px(24) }}>{String(num).padStart(2,'0')}</span>
          </div>
          <div style={{ flex:1, height:1, background:BORDER }}></div>
        </div>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(56), lineHeight:0.92 }}>{title}</div>
        <div style={{ color:GRAY, fontSize:px(24), lineHeight:1.6, fontFamily:SANS }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── ListItem Green: green accent bg ─────────────── */
function ListItemGreen({ num, title, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(16) }}>
        <div style={{ display:'flex', alignItems:'center', gap:px(16) }}>
          <div style={{ width:px(48), height:px(48), borderRadius:px(12), background:GREEN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ color:BG, fontFamily:SANS, fontWeight:800, fontSize:px(24) }}>{String(num).padStart(2,'0')}</span>
          </div>
          <div style={{ flex:1, height:1, background:BORDER }}></div>
        </div>
        <Card>
          <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(48), lineHeight:0.92 }}>{title}</div>
          <div style={{ color:GRAY, fontSize:px(22), lineHeight:1.6, fontFamily:SANS }}>{body}</div>
        </Card>
      </div>
    </Sl>
  );
}

/* ── Quote: with green bar ───────────────────────── */
function Quote({ text, attribution }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <Card>
          <div style={{ display:'flex', gap:px(16) }}>
            <div style={{ width:px(4), background:GREEN, borderRadius:2, flexShrink:0 }}></div>
            <div style={{ display:'flex', flexDirection:'column', gap:px(16) }}>
              <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:700, fontStyle:'italic', fontSize:px(44), lineHeight:1.0 }}>"{text}"</div>
              {attribution && <div style={{ display:'flex', alignItems:'center', gap:px(10) }}>
                <div style={{ width:px(8), height:px(8), borderRadius:'50%', background:GREEN }}></div>
                <div style={{ color:GREEN, fontSize:px(18), fontWeight:600, fontFamily:SANS }}>{attribution}</div>
              </div>}
            </div>
          </div>
        </Card>
      </div>
    </Sl>
  );
}

/* ── Insight: big italic statement ────────────────── */
function Insight({ statement, sub }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(22) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(60), lineHeight:0.95 }}>{statement}</div>
        {sub && (
          <Card>
            <div style={{ color:GRAY, fontSize:px(22), lineHeight:1.6, fontFamily:SANS }}>{sub}</div>
          </Card>
        )}
      </div>
    </Sl>
  );
}

/* ── AmberPoint → GreenPoint: headline + body ──── */
function AmberPoint({ headline, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(20) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(56), lineHeight:0.95 }}>{headline}</div>
        <div style={{ height:px(2), background:BORDER }}><div style={{ width:'60%', height:'100%', background:GREEN, borderRadius:1 }}></div></div>
        <div style={{ color:GRAY, fontSize:px(26), lineHeight:1.6, fontFamily:SANS }}>{body}</div>
      </div>
    </Sl>
  );
}

/* ── AmberPointLight → now a card layout ──────── */
function AmberPointLight({ headline, body }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(18) }}>
        <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(56), lineHeight:0.95 }}>{headline}</div>
        <Card accent>
          <div style={{ color:GREEN, fontSize:px(24), lineHeight:1.6, fontFamily:SANS, fontWeight:500 }}>{body}</div>
        </Card>
      </div>
    </Sl>
  );
}

/* ── GridCards: 2×N grid ──────────────────────── */
function GridCards({ heading, items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ color:WHITE, fontSize:px(22), fontWeight:700, fontFamily:SANS, marginTop:px(16), marginBottom:px(14) }}>{heading}</div>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:px(8) }}>
        {items.map((item,i) => (
          <div key={i} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:px(12), padding:`${px(14)}px ${px(14)}px`, display:'flex', alignItems:'center', gap:px(10) }}>
            <Check/>
            <span style={{ color:WHITE, fontSize:px(17), fontWeight:500, lineHeight:1.25, fontFamily:SANS }}>{item}</span>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── Stacked: boxes stacked ──────────────────── */
function Stacked({ heading, boxes }) {
  return (
    <Sl>
      <Stamp/>
      {heading && <div style={{ color:WHITE, fontSize:px(22), fontWeight:700, fontFamily:SANS, marginTop:px(14), marginBottom:px(12) }}>{heading}</div>}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(8) }}>
        {boxes.map((box,i) => (
          <Card key={i} accent={box.accent || false}>
            <div style={{ display:'flex', alignItems:'center', gap:px(10) }}>
              <div style={{ width:px(8), height:px(8), borderRadius:'50%', background: box.accent ? GREEN : DGRAY, flexShrink:0 }}></div>
              <span style={{ color: box.accent ? GREEN : WHITE, fontSize:px(16), fontWeight:700, fontFamily:SANS, letterSpacing:'0.06em' }}>{box.label}</span>
            </div>
            <div style={{ color: box.accent ? WHITE : GRAY, fontSize:px(20), lineHeight:1.5, fontFamily:SANS, paddingLeft:px(18) }}>{box.text}</div>
          </Card>
        ))}
      </div>
    </Sl>
  );
}

/* ── CompareTable: side-by-side rows ──────────── */
function CompareTable({ rows }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(8), marginTop:px(14) }}>
        {rows.map(([left,right],i) => (
          <div key={i} style={{ display:'flex', gap:px(8) }}>
            <div style={{ flex:1, background:CARD, border:`1px solid ${BORDER}`, borderRadius:px(10), padding:`${px(12)}px ${px(14)}px`, color:GRAY, fontSize:px(18), lineHeight:1.35, fontFamily:SANS }}>{left}</div>
            <div style={{ flex:1, background:'rgba(74,222,128,0.05)', border:`1px solid rgba(74,222,128,0.2)`, borderRadius:px(10), padding:`${px(12)}px ${px(14)}px`, color:WHITE, fontSize:px(18), lineHeight:1.35, fontWeight:600, fontFamily:SANS }}>{right}</div>
          </div>
        ))}
      </div>
    </Sl>
  );
}

/* ── RoadmapDouble: two items stacked with nums ── */
function RoadmapDouble({ items }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(14) }}>
        {items.map(({ n, t, d }) => (
          <Card key={n}>
            <div style={{ display:'flex', gap:px(14), alignItems:'flex-start' }}>
              <div style={{ width:px(40), height:px(40), borderRadius:px(10), background:'rgba(74,222,128,0.1)', border:`1px solid rgba(74,222,128,0.25)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ color:GREEN, fontFamily:SANS, fontWeight:800, fontSize:px(20) }}>{n}</span>
              </div>
              <div>
                <div style={{ color:WHITE, fontFamily:SANS, fontWeight:700, fontSize:px(24), lineHeight:1.1, marginBottom:px(6) }}>{t}</div>
                <div style={{ color:GRAY, fontSize:px(18), lineHeight:1.5, fontFamily:SANS }}>{d}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Sl>
  );
}

/* ── SplitH: left green block, right dark ──────── */
function SplitH({ left, right }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', gap:px(14), marginTop:px(14) }}>
        <div style={{ flex:'0 0 44%', background:'rgba(74,222,128,0.08)', border:`1px solid rgba(74,222,128,0.2)`, borderRadius:px(14), display:'flex', flexDirection:'column', justifyContent:'center', padding:`${px(20)}px ${px(18)}px` }}>
          <div style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(48), lineHeight:0.92 }}>{left}</div>
        </div>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          {typeof right === 'string' ? (
            <div style={{ color:GRAY, fontSize:px(22), lineHeight:1.6, fontFamily:SANS }}>{right}</div>
          ) : right}
        </div>
      </div>
    </Sl>
  );
}

/* ── BigStat: giant number ───────────────────── */
function BigStat({ number, unit, caption }) {
  return (
    <Sl>
      <Stamp/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:px(8) }}>
        <div style={{ display:'flex', alignItems:'flex-start' }}>
          <span style={{ color:WHITE, fontFamily:SERIF, fontWeight:900, fontStyle:'italic', fontSize:px(200), lineHeight:0.8, letterSpacing:'-0.03em' }}>{number}</span>
          {unit && <span style={{ color:GREEN, fontFamily:SANS, fontWeight:800, fontSize:px(60), lineHeight:1, marginTop:px(20) }}>{unit}</span>}
        </div>
        <div style={{ height:px(3), background:BORDER, borderRadius:1 }}>
          <div style={{ width:'100%', height:'100%', background:GREEN, opacity:0.4, borderRadius:1 }}></div>
        </div>
        <div style={{ color:GRAY, fontSize:px(24), lineHeight:1.45, fontFamily:SANS, marginTop:px(4) }}>{caption}</div>
      </div>
    </Sl>
  );
}

/* ─── Aliases for backward compat ────────────────── */
const ChecklistAmber = ChecklistCard;
const ChecklistLight = Checklist;
const ListItemAmber = ListItemGreen;
const QuoteLight = Quote;
const CTADark = CTAMinimal;
const CTALight = CTACard;
const CovSplit = CovCard;
const CovLight = CovGreen;

/* Export */
Object.assign(window, {
  BG, CARD, BORDER, GREEN, WHITE, GRAY, DGRAY, RED, S, px, SERIF, SANS,
  Stamp, Sl, Card, Tag, Check,
  Cov, CovCard, CovGreen, CovSplit, CovLight,
  CTA, CTACard, CTAMinimal, CTADark, CTALight,
  Versus, VersusSplit,
  Checklist, ChecklistCard, ChecklistAmber, ChecklistLight,
  ListItem, ListItemGreen, ListItemAmber,
  Quote, QuoteLight,
  Insight, AmberPoint, AmberPointLight,
  GridCards, Stacked, CompareTable, RoadmapDouble, SplitH, BigStat,
});
