/**
 * THE PLUG — Full Vision Prototype v2
 * Jazzmin McCoy | SMU MACT | Summer 2026
 * github.com/jazzmcc11/the-plug
 *
 * Stack: Lovable (build) | Anthropic API Claude Sonnet 4 (P AI layer)
 *        Supabase (auth + DB) | Stripe (subscriptions) | Vercel (deploy)
 *        Canva Pro (creative templates) | GitHub (version control)
 *
 * Four Modules (per Assignment 2 Technical Plan):
 *   1. Academic Support — resources, study tools, AI tutor, assignments
 *   2. College & Career — app tracker, scholarships, internships, summer programs, service hours
 *   3. Creative Resources — Canva templates, senior year, social & events, graduation planning
 *   4. Community — six purpose-built spaces
 *
 * Dual user architecture: Student toggle / Parent toggle
 * Shared sections: Senior Year + Social & Events (tagged Student + Parent)
 * Live AI: Talk to P (student), Ask P (parent), AI Tutor — all via Anthropic API
 */

import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const T = {
  gold: "#C9A84C", gold2: "#E8C96B", gd: "#3A2E10", gd2: "#5A4520",
  ink: "#0C0C0C", ink2: "#161616", ink3: "#1E1E1E", ink4: "#242424",
  b: "#2C2C2C", b2: "#383838",
  t: "#F0EDE6", t2: "#A8A49C", t3: "#6A6660",
  green: "#52C48A", red: "#E05555", blue: "#5B9CF6",
  purple: "#A78BFA", coral: "#F4845F",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@400;600;700&family=Space+Mono&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${T.ink};color:${T.t};font-family:'Syne',sans-serif;font-size:14px;overflow:hidden;height:100vh}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:${T.b2};border-radius:2px}
  .serif{font-family:'Playfair Display',serif}
  .mono{font-family:'Space Mono',monospace;font-size:10px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes typingDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
  .fu{animation:fadeUp .4s ease forwards}
  .tdot{width:5px;height:5px;border-radius:50%;background:${T.gold};display:inline-block}
  .tdot:nth-child(1){animation:typingDot 1.2s ease infinite 0s}
  .tdot:nth-child(2){animation:typingDot 1.2s ease infinite .2s}
  .tdot:nth-child(3){animation:typingDot 1.2s ease infinite .4s}
`;

// ─── MODULE TAB DEFINITIONS ───────────────────────────────────────
const MOD_TABS = {
  academic:   ["Resources", "Study Tools", "AI Tutor", "Assignments"],
  college:    ["App Tracker", "Scholarships", "Internships", "Summer Programs", "Service Hours"],
  creative:   ["Templates", "Senior Year", "Social & Events", "Graduation Planning"],
  community:  ["All Spaces", "Money Talk", "First Gen Files", "Social & Events", "Win Board"],
  pacademic:  ["Resources", "Support Tips"],
  pcollege:   ["FAFSA Guide", "Scholarship Deadlines"],
  pcreative:  ["Grad Party Planner", "What to Pay For", "Prom Guide", "Senior Portraits", "Celebration Ideas"],
  pcommunity: ["All Forums", "Financial Aid Q&A", "First Gen Parents", "Senior Year Survival"],
};

const STUDENT_NAV = [
  { section: "MODULES" },
  { id: "home",      ic: "⚡", label: "Dashboard" },
  { id: "academic",  ic: "📚", label: "Academic Support" },
  { id: "college",   ic: "🎓", label: "College & Career" },
  { id: "creative",  ic: "✨", label: "Creative Resources" },
  { id: "community", ic: "👥", label: "Community" },
  { section: "AI GUIDE" },
  { id: "plugai",    ic: "🤖", label: "Talk to P" },
  { section: "MY STUFF" },
  { id: "tracker",   ic: "📋", label: "My Tracker" },
  { id: "docs",      ic: "📄", label: "My Documents" },
];

const PARENT_NAV = [
  { section: "MODULES" },
  { id: "phome",      ic: "🏠", label: "Dashboard" },
  { id: "pacademic",  ic: "📚", label: "Academic Support" },
  { id: "pcollege",   ic: "🎓", label: "College & Career" },
  { id: "pcreative",  ic: "✨", label: "Senior Year Guide" },
  { id: "pcommunity", ic: "👥", label: "Parent Forum" },
  { section: "AI GUIDE" },
  { id: "pplugai",    ic: "🤖", label: "Ask P" },
  { section: "TOOLS" },
  { id: "pcosts",     ic: "💰", label: "Cost Calculator" },
  { id: "pfafsa",     ic: "📋", label: "FAFSA Guide" },
];

// ─── P SYSTEM PROMPTS ─────────────────────────────────────────────
// Three distinct prompts — student, parent, tutor
const P_PROMPTS = {
  student: `You are P, the AI guide for The Plug — a one-stop platform for high school students covering college prep AND high school life (scholarships, internships, summer programs, community service, HOCO, senior year, social events). You are a well-connected older cousin who has been through it and came back to help. Warm, direct, culturally aware. If stress is detected, ground first then help. Under 80 words unless a full breakdown is needed. No em dashes. Sound like a real person who cares. Student: Jordan M., 12th grade, Dallas TX, first-gen, 3.4 GPA, Business/Sports Management interest, FAFSA submitted, applying to UT Austin, Texas A&M, Howard, Prairie View A&M.`,

  parent: `You are P, the AI guide for The Plug, speaking to a parent. Warm, clear, and professional — like a knowledgeable older sibling who navigated the college process and explains it without jargon. Under 100 words unless a full breakdown is genuinely needed. No em dashes. Help them understand financial aid, how to support their student, and what to do next. The student is Jordan M., 12th grade, Dallas TX, first-gen, 3.4 GPA.`,

  tutor: `You are P, acting as an AI tutor for any high school subject. Patient, clear, and encouraging. Break things down simply. Under 120 words unless a step-by-step solution is genuinely needed. No em dashes. Never condescending.`,
};

// ─── API CALL ─────────────────────────────────────────────────────
async function askP(text, promptType) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: P_PROMPTS[promptType] || P_PROMPTS.student,
      messages: [{ role: "user", content: text }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Something went wrong on my end. Try again.";
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────
const Tag = ({ children, variant = "gray" }) => {
  const styles = {
    gold:   { bg: T.gd,      color: T.gold,   border: T.gd2 + "55" },
    green:  { bg: "#1A3328", color: T.green,  border: "#2A504044" },
    red:    { bg: "#3A1818", color: T.red,    border: "#6A282844" },
    blue:   { bg: "#1A2840", color: T.blue,   border: "#2A407044" },
    purple: { bg: "#251A40", color: T.purple, border: "#4A307044" },
    gray:   { bg: T.ink4,    color: T.t2,     border: T.b },
  };
  const s = styles[variant] || styles.gray;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20,
      fontSize:10, fontWeight:700, letterSpacing:".03em",
      background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {children}
    </span>
  );
};

const Card = ({ children, style, gold, onClick }) => (
  <div onClick={onClick} style={{
    background: T.ink3, border: `1px solid ${T.b}`, borderRadius:11,
    transition:"border-color .2s", cursor: onClick ? "pointer" : "default",
    ...style,
  }}
  onMouseEnter={e => e.currentTarget.style.borderColor = gold ? T.gd2 : T.b2}
  onMouseLeave={e => e.currentTarget.style.borderColor = T.b}>
    {children}
  </div>
);

const Btn = ({ children, variant="gold", size="md", onClick, style }) => {
  const base = { display:"inline-flex", alignItems:"center", gap:6,
    borderRadius:7, fontFamily:"'Syne',sans-serif", fontWeight:700,
    cursor:"pointer", border:"none", transition:"all .2s",
    padding: size==="xs" ? "5px 11px" : size==="sm" ? "7px 14px" : "9px 18px",
    fontSize: size==="xs" ? 11 : size==="sm" ? 12 : 13,
  };
  const variants = {
    gold:    { background:`linear-gradient(135deg,${T.gold},${T.gold2})`, color:T.ink },
    outline: { background:"transparent", border:`1px solid ${T.b}`, color:T.t2 },
  };
  return <button onClick={onClick} style={{...base, ...variants[variant], ...style}}>{children}</button>;
};

const Inp = ({ placeholder, value, onChange, onKeyDown, id, style }) => (
  <input id={id} value={value} onChange={onChange} onKeyDown={onKeyDown}
    placeholder={placeholder}
    style={{ background:T.ink3, border:`1px solid ${T.b}`, color:T.t, borderRadius:7,
      padding:"8px 12px", fontFamily:"'Syne',sans-serif", fontSize:13,
      outline:"none", width:"100%", transition:"border-color .2s", ...style }}
    onFocus={e => e.target.style.borderColor = T.gold}
    onBlur={e => e.target.style.borderColor = T.b} />
);

const Avatar = ({ initials, size=34, gradient, emoji }) => (
  <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0,
    background: gradient || `linear-gradient(135deg,${T.gd},${T.gold})`,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize: emoji ? size*0.45 : size*0.32, fontWeight:700, color: T.ink }}>
    {emoji || initials}
  </div>
);

// ─── CHAT COMPONENT ───────────────────────────────────────────────
function Chat({ messages, loading, onSend, chips, promptType }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    onSend(msg);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 60px)",
      margin:"-22px -26px", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ padding:"13px 20px", borderBottom:`1px solid ${T.b}`,
        background:T.ink2, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <Avatar emoji="⚡" size={34} />
        <div>
          <div style={{ fontWeight:700, fontSize:13 }}>P — The Plug</div>
          <div style={{ fontSize:10, color:T.green, display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:T.green, display:"inline-block" }}/>
            Ready
          </div>
        </div>
        <div style={{ marginLeft:"auto" }}><Tag variant="gold">3 / 10 messages</Tag></div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:"flex", flexDirection: m.role==="user" ? "row-reverse" : "row",
            alignItems:"flex-end", gap:7, marginBottom:12 }}>
            {m.role === "p" && <Avatar emoji="⚡" size={28} />}
            <div style={{ maxWidth:"72%" }}>
              <div style={{
                padding:"10px 14px",
                borderRadius: m.role==="user" ? "13px 13px 4px 13px" : "13px 13px 13px 4px",
                background: m.role==="user" ? `linear-gradient(135deg,${T.gd},${T.gold})` : T.ink3,
                border: m.role==="user" ? "none" : `1px solid ${T.b}`,
                color: m.role==="user" ? T.ink : T.t,
                fontSize:12, lineHeight:1.6,
              }}>{m.text}</div>
              <div style={{ fontSize:10, color:T.t3, marginTop:2,
                textAlign: m.role==="user" ? "right" : "left" }}>{m.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:7, marginBottom:12 }}>
            <Avatar emoji="⚡" size={28} />
            <div style={{ padding:"12px 16px", background:T.ink3, border:`1px solid ${T.b}`,
              borderRadius:"13px 13px 13px 4px", display:"flex", gap:5, alignItems:"center" }}>
              <span className="tdot"/><span className="tdot"/><span className="tdot"/>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && chips && (
        <div style={{ padding:"0 20px 10px", display:"flex", gap:6, flexWrap:"wrap" }}>
          {chips.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{
              padding:"5px 11px", borderRadius:20, background:T.ink3,
              border:`1px solid ${T.b}`, color:T.t3,
              fontFamily:"'Syne',sans-serif", fontSize:11, cursor:"pointer",
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding:"12px 20px", borderTop:`1px solid ${T.b}`,
        background:T.ink2, display:"flex", gap:8, flexShrink:0 }}>
        <Inp placeholder="Ask P anything..."
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          style={{ flex:1 }} />
        <Btn onClick={() => send(input)} size="sm" style={{ flexShrink:0 }}>Send</Btn>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────
function Sidebar({ user, screen, onNav, onUserSwitch }) {
  const nav = user === "student" ? STUDENT_NAV : PARENT_NAV;
  return (
    <div style={{ width:210, minHeight:"100vh", background:T.ink2,
      borderRight:`1px solid ${T.b}`, display:"flex", flexDirection:"column",
      padding:"18px 12px", flexShrink:0, overflowY:"auto" }}>
      <div style={{ padding:"0 4px", marginBottom:4 }}>
        <div className="serif" style={{ fontSize:22, fontWeight:900,
          background:`linear-gradient(135deg,${T.gold},${T.gold2})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundClip:"text", lineHeight:1 }}>The Plug</div>
        <div className="mono" style={{ fontSize:9, color:T.t3, letterSpacing:".08em", marginTop:2 }}>
          YOUR UNFAIR ADVANTAGE
        </div>
      </div>

      {/* User toggle */}
      <div style={{ display:"flex", background:T.ink3, borderRadius:8, padding:3,
        margin:"14px 0", border:`1px solid ${T.b}` }}>
        {["student","parent"].map(u => (
          <button key={u} onClick={() => onUserSwitch(u)} style={{
            flex:1, padding:"5px 4px", borderRadius:5, border:"none",
            fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700,
            cursor:"pointer", transition:"all .2s",
            background: user === u ? T.gold : "transparent",
            color: user === u ? T.ink : T.t3,
          }}>{u.charAt(0).toUpperCase() + u.slice(1)}</button>
        ))}
      </div>

      {/* Nav items */}
      <nav style={{ flex:1 }}>
        {nav.map((n, i) => {
          if (n.section) return (
            <div key={i} style={{ fontSize:9, fontWeight:700, color:T.t3,
              letterSpacing:".1em", padding:"0 4px", margin:"10px 0 5px" }}>{n.section}</div>
          );
          const active = screen === n.id;
          return (
            <div key={n.id} onClick={() => onNav(n.id)} style={{
              display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
              borderRadius:7, cursor:"pointer", marginBottom:2,
              background: active ? T.gd : "transparent",
              border: `1px solid ${active ? T.gd2 + "44" : "transparent"}`,
              color: active ? T.gold : T.t3, fontSize:12, fontWeight:600,
              transition:"all .15s",
            }}
            onMouseEnter={e => !active && (e.currentTarget.style.background = T.ink3)}
            onMouseLeave={e => !active && (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize:14, width:16, textAlign:"center" }}>{n.ic}</span>
              {n.label}
            </div>
          );
        })}
      </nav>

      {/* Upgrade prompt */}
      <div style={{ background:T.gd, border:`1px solid ${T.gd2}`, borderRadius:8, padding:12 }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.gold, letterSpacing:".06em", marginBottom:3 }}>
          FREE PLAN
        </div>
        <div style={{ fontSize:11, color:"#C4A86A", lineHeight:1.4, marginBottom:8 }}>
          Upgrade for unlimited P convos + all templates
        </div>
        <Btn size="xs" style={{ width:"100%", justifyContent:"center" }}>Go Pro — $4.99/mo</Btn>
      </div>
    </div>
  );
}

// ─── MODULE BANNER ────────────────────────────────────────────────
function ModuleBanner({ screen, activeTab, onTab }) {
  const tabs = MOD_TABS[screen] || [];
  if (!tabs.length) return null;
  return (
    <div style={{ background:T.ink2, borderBottom:`1px solid ${T.b}`,
      padding:"10px 26px", display:"flex", gap:6, flexShrink:0, flexWrap:"wrap" }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onTab(t)} style={{
          padding:"5px 13px", borderRadius:20, border:"none",
          fontFamily:"'Syne',sans-serif", fontSize:11, fontWeight:700, cursor:"pointer",
          background: activeTab === t ? T.gold : T.ink3,
          color: activeTab === t ? T.ink : T.t2,
          border: `1px solid ${activeTab === t ? "transparent" : T.b}`,
          transition:"all .15s",
        }}>{t}</button>
      ))}
    </div>
  );
}

// ─── SCREEN COMPONENTS ────────────────────────────────────────────

// Student Dashboard
function StudentHome({ onNav }) {
  return (
    <div className="fu">
      <div style={{ marginBottom:20 }}>
        <div className="serif" style={{ fontSize:26, marginBottom:3 }}>Good evening, Jordan.</div>
        <div style={{ color:T.t2, fontSize:13 }}>2 deadlines in 14 days. HOCO in 3 weeks. Let's stay ahead.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
        {[["💰","$47K","Aid available",T.green],["⭐","14","Scholarships saved",T.gold],["📝","3","Essays in progress",T.blue],["🏆","48 hrs","Service logged",T.purple]].map(([ic,v,l,c],i) => (
          <Card key={i} style={{ padding:14 }}>
            <div style={{ fontSize:18, marginBottom:7 }}>{ic}</div>
            <div style={{ fontSize:22, fontWeight:700, color:c, marginBottom:2 }}>{v}</div>
            <div style={{ fontSize:11, color:T.t3 }}>{l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:14, marginBottom:14 }}>
        <Card style={{ padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>⏰ Urgent Deadlines</div>
            <Btn variant="outline" size="xs" onClick={() => onNav("college")}>All →</Btn>
          </div>
          {[["Gates Millennium","$10,000","Jan 15",true],["Dell Scholars","$20,000","Feb 1",false],["Posse Foundation","Full Tuition","Jan 28",false]].map(([n,a,d,u],i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"9px 11px", background:T.ink2, borderRadius:7,
              border:`1px solid ${u ? "#6A282866" : T.b}`, marginBottom:8 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:1 }}>{n}</div>
                <div style={{ fontSize:11, color:T.t3 }}>{a}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:11, fontWeight:700, color: u ? T.red : T.t2 }}>{d}</div>
                {u && <Tag variant="red" >URGENT</Tag>}
              </div>
            </div>
          ))}
        </Card>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Card gold style={{ padding:16, background:`linear-gradient(145deg,${T.ink3},${T.gd})`,
            borderColor:T.gd2+"55", cursor:"pointer" }} onClick={() => onNav("plugai")}>
            <div style={{ fontSize:26, marginBottom:8 }}>⚡</div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Talk to P</div>
            <div style={{ fontSize:12, color:T.t2, lineHeight:1.5, marginBottom:10 }}>
              Ask about anything — essays, FAFSA, HOCO ideas, what to do after a rejection.
            </div>
            <Btn size="xs" style={{ width:"100%", justifyContent:"center" }}>Start →</Btn>
          </Card>
          <Card gold style={{ padding:14, cursor:"pointer" }} onClick={() => onNav("creative")}>
            <div style={{ fontSize:18, marginBottom:6 }}>✨</div>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>Creative Resources</div>
            <div style={{ fontSize:11, color:T.t3 }}>Templates, senior year, HOCO ideas, graduation planning</div>
          </Card>
        </div>
      </div>
      <Card style={{ padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>🏆 Win Board</div>
          <Tag variant="green">COMMUNITY</Tag>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[["TK","Got into UT Austin! First in my family 🔥","2h"],["MR","Posse Foundation finalist!","4h"],["AS","Landed the Google CSSI spot 🙌","1d"]].map(([u,m,t],i) => (
            <div key={i} style={{ padding:10, background:"#1A3328", border:"1px solid #2A504044", borderRadius:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                <Avatar initials={u} size={24} gradient={`linear-gradient(135deg,${T.green}66,${T.green})`} />
                <div style={{ fontSize:10, color:T.t3 }}>{t} ago</div>
              </div>
              <div style={{ fontSize:11, lineHeight:1.4 }}>{m}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Parent Dashboard
function ParentHome({ onNav }) {
  return (
    <div className="fu">
      <div style={{ marginBottom:20 }}>
        <div className="serif" style={{ fontSize:26, marginBottom:3 }}>Welcome back.</div>
        <div style={{ color:T.t2, fontSize:13 }}>Here is where Jordan stands and what needs your attention.</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
        {[["📋","FAFSA Submitted ✓",T.green],["🏫","8 Schools on list",T.gold],["💰","$47K Aid available",T.green]].map(([ic,v,c],i) => (
          <Card key={i} style={{ padding:14 }}>
            <div style={{ fontSize:18, marginBottom:7 }}>{ic}</div>
            <div style={{ fontSize:16, fontWeight:700, color:c }}>{v}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:14 }}>
        <Card style={{ padding:18 }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>⚡ Needs Your Attention</div>
          {[["Gates deadline in 7 days — Jordan has not submitted","URGENT","red"],["EFC may be too high — professional judgment review available","Action needed","gold"],["3 scholarship essays need review before submission","This week","blue"]].map(([t,l,c],i) => (
            <div key={i} style={{ padding:11, background:T.ink2, borderRadius:8, marginBottom:8,
              borderLeft:`3px solid ${c==="red"?T.red:c==="gold"?T.gold:T.blue}` }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:5 }}>{t}</div>
              <Tag variant={c}>{l}</Tag>
            </div>
          ))}
        </Card>
        <Card gold style={{ padding:18, background:`linear-gradient(145deg,${T.ink3},${T.gd})`, borderColor:T.gd2+"55" }}>
          <div style={{ fontSize:26, marginBottom:10 }}>⚡</div>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>Ask P</div>
          <div style={{ fontSize:12, color:T.t2, lineHeight:1.6, marginBottom:14 }}>
            P explains financial aid in plain language, walks you through FAFSA questions, and tells you exactly how to support Jordan right now.
          </div>
          <Btn size="sm" onClick={() => onNav("pplugai")} style={{ width:"100%", justifyContent:"center" }}>Talk to P →</Btn>
        </Card>
      </div>
    </div>
  );
}

// Generic placeholder for screens not fully built out in prototype
function PlaceholderScreen({ title, desc }) {
  return (
    <div className="fu">
      <div className="serif" style={{ fontSize:24, marginBottom:6 }}>{title}</div>
      <div style={{ color:T.t2, fontSize:13, marginBottom:20 }}>{desc}</div>
      <Card style={{ padding:30, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>🚧</div>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>Full build in Phase 3</div>
        <div style={{ fontSize:13, color:T.t2 }}>This screen is scaffolded. Interactive content shown in adjacent tabs.</div>
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState("student");
  const [screen, setScreen] = useState("home");
  const [activeTabs, setActiveTabs] = useState({});
  const [studentMsgs, setStudentMsgs] = useState([
    { role:"p", text:"Hey Jordan. What's going on? I can help with essays, scholarships, FAFSA, HOCO planning, internships — whatever you've got.", time:"Now" }
  ]);
  const [parentMsgs, setParentMsgs] = useState([
    { role:"p", text:"Hi. I'm P — here to help you support your student through high school and college prep. What's on your mind?", time:"Now" }
  ]);
  const [loading, setLoading] = useState(false);

  const getTab = (s) => activeTabs[s] || (MOD_TABS[s] || [])[0] || "";
  const setTab = (s, t) => setActiveTabs(prev => ({ ...prev, [s]: t }));

  const switchUser = (u) => {
    setUser(u);
    setScreen(u === "student" ? "home" : "phome");
  };

  const handleSend = async (text, promptType, setMsgs) => {
    if (!text || loading) return;
    const now = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    setMsgs(prev => [...prev, { role:"user", text, time:now }]);
    setLoading(true);
    try {
      const reply = await askP(text, promptType);
      setMsgs(prev => [...prev, { role:"p", text:reply, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }]);
    } catch {
      setMsgs(prev => [...prev, { role:"p", text:"Technical issue. Try again in a sec.", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }]);
    }
    setLoading(false);
  };

  const renderScreen = () => {
    const tab = getTab(screen);
    switch(screen) {
      case "home":    return <StudentHome onNav={setScreen} />;
      case "phome":   return <ParentHome onNav={setScreen} />;
      case "plugai":  return <Chat messages={studentMsgs} loading={loading}
                        onSend={(t) => handleSend(t, "student", setStudentMsgs)}
                        chips={["Help with my college essay","FAFSA question","HOCO theme ideas","I got rejected. Now what."]}
                        promptType="student" />;
      case "pplugai": return <Chat messages={parentMsgs} loading={loading}
                        onSend={(t) => handleSend(t, "parent", setParentMsgs)}
                        chips={["What is EFC?","Should we appeal our financial aid?","How do I help without hovering?","What is a Professional Judgment Review?"]}
                        promptType="parent" />;
      default:        return <PlaceholderScreen title={screen} desc="Navigate using the module tabs above." />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ display:"flex", height:"100vh", background:T.ink, overflow:"hidden" }}>
        <Sidebar user={user} screen={screen} onNav={setScreen} onUserSwitch={switchUser} />
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <ModuleBanner screen={screen} activeTab={getTab(screen)} onTab={(t) => setTab(screen, t)} />
          <div style={{ flex:1, overflowY:"auto", padding:"22px 26px" }}>
            {renderScreen()}
          </div>
        </div>
      </div>
    </>
  );
}
