import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const T = {
  gold: "#C9A84C",
  goldLight: "#E8C96B",
  goldDim: "#8B6F2E",
  black: "#0A0A0A",
  dark: "#111111",
  surface: "#181818",
  surfaceAlt: "#1E1E1E",
  border: "#2A2A2A",
  borderGold: "#3A3020",
  gray: "#6B6B6B",
  grayMid: "#4A4A4A",
  grayLight: "#9B9B9B",
  white: "#F8F8F5",
  offwhite: "#EFEFEA",
  red: "#E05555",
  green: "#4CAF7D",
  blue: "#4C8CE0",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.black};
    color: ${T.white};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${T.dark}; }
  ::-webkit-scrollbar-thumb { background: ${T.grayMid}; border-radius: 2px; }

  .serif { font-family: 'DM Serif Display', serif; }
  .mono { font-family: 'Space Mono', monospace; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes typingDot {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .fade-up  { animation: fadeUp 0.5s ease forwards; }
  .fade-in  { animation: fadeIn 0.4s ease forwards; }
  .slide-in { animation: slideIn 0.4s ease forwards; }

  .gold-text {
    background: linear-gradient(135deg, ${T.gold} 0%, ${T.goldLight} 50%, ${T.gold} 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tag {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
    background: ${T.borderGold}; color: ${T.gold}; border: 1px solid ${T.goldDim}44;
  }
  .tag.gray { background: ${T.surface}; color: ${T.grayLight}; border-color: ${T.border}; }
  .tag.green { background: #1A3329; color: ${T.green}; border-color: #2A5040; }
  .tag.blue  { background: #1A2A3F; color: ${T.blue};  border-color: #2A4060; }

  .card {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 12px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .card:hover { border-color: ${T.grayMid}; }
  .card.gold-hover:hover { border-color: ${T.goldDim}; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .btn-gold {
    background: linear-gradient(135deg, ${T.gold}, ${T.goldLight});
    color: ${T.black};
  }
  .btn-gold:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-outline {
    background: transparent; border: 1px solid ${T.border};
    color: ${T.grayLight};
  }
  .btn-outline:hover { border-color: ${T.gold}; color: ${T.gold}; }
  .btn-ghost {
    background: transparent; color: ${T.grayLight}; padding: 8px 12px;
  }
  .btn-ghost:hover { color: ${T.white}; background: ${T.surface}; border-radius: 6px; }

  .divider {
    height: 1px; background: ${T.border}; margin: 16px 0;
  }

  .input {
    background: ${T.surface}; border: 1px solid ${T.border};
    color: ${T.white}; border-radius: 8px; padding: 10px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; width: 100%; transition: border-color 0.2s;
  }
  .input:focus { border-color: ${T.gold}; }
  .input::placeholder { color: ${T.grayMid}; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
    color: ${T.gray}; font-size: 13px; font-weight: 500;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: ${T.surface}; color: ${T.white}; }
  .nav-item.active {
    background: ${T.borderGold}; color: ${T.gold};
    border-color: ${T.goldDim}44;
  }

  .scroll { overflow-y: auto; }
  .scroll::-webkit-scrollbar { width: 3px; }

  .typing-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${T.gold}; display: inline-block;
  }
  .typing-dot:nth-child(1) { animation: typingDot 1.2s ease infinite 0s; }
  .typing-dot:nth-child(2) { animation: typingDot 1.2s ease infinite 0.2s; }
  .typing-dot:nth-child(3) { animation: typingDot 1.2s ease infinite 0.4s; }
`;

// ─── ICONS ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    plug: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 22v-4"/><path d="M7 10v2a5 5 0 0 0 10 0v-2"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="6" y1="6" x2="18" y2="6"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H4a2 2 0 0 0-2 2v2c0 2.8 2 5.2 5 6"/><path d="M17 4h3a2 2 0 0 1 2 2v2c0 2.8-2 5.2-5 6"/><rect x="7" y="2" width="10" height="9" rx="1"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  };
  return icons[name] || null;
};

// ─── SIDEBAR ─────────────────────────────────────────────────────
const Sidebar = ({ active, onNav }) => {
  const nav = [
    { id: "dashboard", icon: "home",   label: "Dashboard" },
    { id: "scholarships", icon: "search", label: "Find Money" },
    { id: "plugai",   icon: "chat",   label: "Talk to P" },
    { id: "community", icon: "users", label: "Community" },
  ];

  return (
    <div style={{
      width: 220, minHeight: "100vh", background: T.dark,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      padding: "24px 16px", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 36, paddingLeft: 4 }}>
        <div className="serif gold-text" style={{ fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1 }}>
          The Plug
        </div>
        <div className="mono" style={{ fontSize: 10, color: T.gray, marginTop: 4, letterSpacing: "0.06em" }}>
          YOUR UNFAIR ADVANTAGE
        </div>
      </div>

      {/* User pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", background: T.surface,
        borderRadius: 10, border: `1px solid ${T.border}`,
        marginBottom: 28,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: T.black, flexShrink: 0,
        }}>JM</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.white }}>Jordan M.</div>
          <div style={{ fontSize: 11, color: T.gray }}>12th Grade · Dallas, TX</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {nav.map(n => (
          <div key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`}
            onClick={() => onNav(n.id)}>
            <Icon name={n.icon} size={16} />
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      {/* Pro badge */}
      <div style={{
        background: T.borderGold, border: `1px solid ${T.goldDim}44`,
        borderRadius: 10, padding: "12px 14px", marginTop: "auto",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, marginBottom: 4, letterSpacing: "0.06em" }}>
          FREE PLAN
        </div>
        <div style={{ fontSize: 11, color: T.grayLight, lineHeight: 1.5, marginBottom: 8 }}>
          Upgrade to Pro for unlimited P conversations and essay review.
        </div>
        <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", padding: "8px 0", fontSize: 12 }}>
          Upgrade — $4.99/mo
        </button>
      </div>
    </div>
  );
};

// ─── SCREEN: DASHBOARD ────────────────────────────────────────────
const Dashboard = ({ onNav }) => {
  const stats = [
    { label: "Scholarships Saved", value: "14", icon: "star", color: T.gold },
    { label: "Applications Active", value: "3", icon: "book", color: T.blue },
    { label: "Total Available Aid", value: "$47K", icon: "dollar", color: T.green },
    { label: "Deadlines This Month", value: "5", icon: "clock", color: T.red },
  ];

  const deadlines = [
    { name: "Gates Millennium Scholars", amount: "$10,000", due: "Jan 15", urgent: true },
    { name: "Posse Foundation", amount: "Full Tuition", due: "Jan 28", urgent: false },
    { name: "Dell Scholars Program", amount: "$20,000", due: "Feb 1", urgent: false },
  ];

  return (
    <div className="scroll" style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <div className="serif" style={{ fontSize: 28, color: T.white, marginBottom: 4 }}>
          Good evening, Jordan.
        </div>
        <div style={{ color: T.gray, fontSize: 14 }}>
          You have 2 deadlines in the next 14 days. Let's stay ahead of them.
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="card gold-hover fade-up"
            style={{ padding: "20px", animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ color: s.color, opacity: 0.9 }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: T.white, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.gray }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Upcoming deadlines */}
        <div className="card fade-up" style={{ padding: "24px", animationDelay: "0.3s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: T.white }}>Upcoming Deadlines</div>
            <button className="btn btn-ghost" style={{ fontSize: 12, color: T.gold }}
              onClick={() => onNav("scholarships")}>
              View all <Icon name="arrow" size={12} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {deadlines.map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", background: T.surfaceAlt, borderRadius: 8,
                border: `1px solid ${d.urgent ? T.red + "44" : T.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.white, marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: T.gray }}>{d.amount}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: d.urgent ? T.red : T.grayLight }}>{d.due}</div>
                  {d.urgent && <div className="tag" style={{ background: "#3F1A1A", color: T.red, borderColor: T.red + "44", marginTop: 4 }}>URGENT</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talk to P CTA */}
        <div className="card fade-up" style={{
          padding: "24px",
          background: `linear-gradient(145deg, ${T.surface} 0%, ${T.borderGold}88 100%)`,
          border: `1px solid ${T.goldDim}44`,
          animationDelay: "0.4s",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, marginBottom: 16,
            }}>⚡</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.white, marginBottom: 8 }}>
              Talk to P
            </div>
            <div style={{ fontSize: 13, color: T.grayLight, lineHeight: 1.6, marginBottom: 20 }}>
              P knows your profile and your schools. Ask about anything — FAFSA, essays, what comes next.
            </div>
          </div>
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => onNav("plugai")}>
            Start a conversation <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>

      {/* Win board */}
      <div className="card fade-up" style={{ padding: "24px", marginTop: 20, animationDelay: "0.5s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Icon name="trophy" size={16} color={T.gold} />
          <div style={{ fontWeight: 600, fontSize: 15, color: T.white }}>Win Board</div>
          <div style={{ fontSize: 12, color: T.gray, marginLeft: 4 }}>Community celebrations</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { user: "TK", msg: "Just got into UT Austin! First in my family 🔥", time: "2h ago" },
            { user: "MR", msg: "Posse Foundation finalist — they called me today", time: "4h ago" },
            { user: "AS", msg: "Submitted my Common App to all 8 schools. Done.", time: "1d ago" },
          ].map((w, i) => (
            <div key={i} style={{
              flex: "1 1 200px", padding: "12px 14px",
              background: "#1A3329", border: `1px solid ${T.green}33`,
              borderRadius: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${T.green}66, ${T.green})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: T.black,
                }}>{w.user}</div>
                <div style={{ fontSize: 11, color: T.gray }}>{w.time}</div>
              </div>
              <div style={{ fontSize: 12, color: T.white, lineHeight: 1.5 }}>{w.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: SCHOLARSHIPS ─────────────────────────────────────────
const Scholarships = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "STEM", "First-Gen", "Texas", "Arts", "Athletics", "Need-Based"];

  const scholarships = [
    { name: "Gates Millennium Scholars Program", org: "Bill & Melinda Gates Foundation", amount: "$10,000/yr", deadline: "Jan 15, 2025", tags: ["First-Gen", "Need-Based"], saved: true, match: 98 },
    { name: "Dell Scholars Program", org: "Michael & Susan Dell Foundation", amount: "$20,000", deadline: "Feb 1, 2025", tags: ["First-Gen", "Texas", "Need-Based"], saved: false, match: 95 },
    { name: "Ron Brown Scholar Award", org: "CAP Charitable Foundation", amount: "$40,000", deadline: "Jan 9, 2025", tags: ["Need-Based"], saved: true, match: 91 },
    { name: "Posse Foundation", org: "Posse Foundation", amount: "Full Tuition", deadline: "Jan 28, 2025", tags: ["First-Gen"], saved: false, match: 88 },
    { name: "Jackie Robinson Foundation", org: "Jackie Robinson Foundation", amount: "$30,000", deadline: "Feb 1, 2025", tags: ["Need-Based", "Athletics"], saved: false, match: 84 },
    { name: "National Merit Scholarship", org: "NMSC", amount: "$2,500", deadline: "Oct 1, 2025", tags: ["STEM"], saved: false, match: 76 },
  ];

  const filtered = scholarships.filter(s =>
    (activeFilter === "All" || s.tags.includes(activeFilter)) &&
    (query === "" || s.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="scroll" style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <div className="serif" style={{ fontSize: 26, marginBottom: 4 }}>Find Your Money</div>
        <div style={{ color: T.gray, fontSize: 14 }}>Matched to your profile — GPA, major, state, and background.</div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
          <Icon name="search" size={16} color={T.gray} />
        </div>
        <input
          className="input" placeholder="Search by name, major, or organization..."
          style={{ paddingLeft: 42 }}
          value={query} onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: activeFilter === f ? T.gold : T.surface,
              color: activeFilter === f ? T.black : T.grayLight,
              transition: "all 0.15s",
            }}>
            {f}
          </button>
        ))}
        <button className="btn btn-ghost" style={{ fontSize: 12, gap: 4 }}>
          <Icon name="filter" size={13} /> More filters
        </button>
      </div>

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((s, i) => (
          <div key={i} className="card gold-hover fade-up"
            style={{
              padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 20,
              animationDelay: `${i * 0.06}s`, cursor: "pointer",
            }}>
            {/* Match score */}
            <div style={{ textAlign: "center", minWidth: 50 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.match >= 90 ? T.gold : T.grayLight }}>{s.match}%</div>
              <div style={{ fontSize: 10, color: T.gray }}>match</div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: T.white }}>{s.name}</div>
                {s.saved && <span className="tag">SAVED</span>}
              </div>
              <div style={{ fontSize: 12, color: T.gray, marginBottom: 8 }}>{s.org}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.tags.map(t => <span key={t} className="tag gray" style={{ fontSize: 10 }}>{t}</span>)}
              </div>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.green, marginBottom: 4 }}>{s.amount}</div>
              <div style={{ fontSize: 11, color: T.gray, marginBottom: 12 }}>Due {s.deadline}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-outline" style={{ padding: "7px 14px", fontSize: 12 }}>
                  <Icon name="heart" size={13} />
                  Save
                </button>
                <button className="btn btn-gold" style={{ padding: "7px 14px", fontSize: 12 }}>
                  Apply <Icon name="arrow" size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: PLUG AI ──────────────────────────────────────────────
const PlugAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "p",
      text: "Hey Jordan. What's going on? Got something you're working through, or you want me to pull up where you left off with the Gates application?",
      time: "8:41 PM",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggestions = [
    "I don't understand the EFC on my FAFSA",
    "Can you review my Gates essay?",
    "What schools match my profile?",
    "I just got rejected. What now.",
  ];

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are P, the AI guide for The Plug — a college access platform for first-generation and underrepresented high school students. Your persona is a well-connected older cousin who has been through the college process and came back to help. 

Tone rules:
- Warm, direct, and culturally aware. Never robotic.
- If you detect stress or urgency, ground first, then help. Never amplify panic.
- Use the student's name (Jordan) naturally but not in every message.
- Be specific and action-oriented — no vague motivational filler.
- If someone shares bad news, validate before redirecting.
- Keep responses conversational, under 100 words unless a detailed breakdown is genuinely needed.
- Never use em dashes. Never say "intersection." Sound like a real person who cares.

The student is Jordan M., a 12th grader in Dallas TX, first-generation college student, interested in Business/Sports Management, has a 3.4 GPA, FAFSA submitted, applied to UT Austin, Texas A&M, Prairie View A&M, and Howard.`,
          messages: [{ role: "user", content: text }],
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Give me one sec, something went sideways on my end. Try again?";
      setMessages(prev => [...prev, { role: "p", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages(prev => [...prev, { role: "p", text: "Something went wrong on my end. Try again in a second.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "20px 28px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", gap: 14, background: T.dark,
        flexShrink: 0,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>⚡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.white }}>P — The Plug</div>
          <div style={{ fontSize: 12, color: T.green, display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
            Online and ready
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span className="tag">3 / 10 messages this month</span>
        </div>
      </div>

      {/* Messages */}
      <div className="scroll" style={{ flex: 1, padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} className="slide-in" style={{
            display: "flex",
            flexDirection: m.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-end", gap: 10,
            animationDelay: `${i * 0.05}s`,
          }}>
            {m.role === "p" && (
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
              }}>⚡</div>
            )}
            <div style={{ maxWidth: "68%" }}>
              <div style={{
                padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role === "user" ? `linear-gradient(135deg, ${T.goldDim}, ${T.gold})` : T.surface,
                border: m.role === "user" ? "none" : `1px solid ${T.border}`,
                color: m.role === "user" ? T.black : T.white,
                fontSize: 13, lineHeight: 1.6, fontWeight: m.role === "user" ? 500 : 400,
              }}>
                {m.text}
              </div>
              <div style={{ fontSize: 11, color: T.gray, marginTop: 4, textAlign: m.role === "user" ? "right" : "left" }}>
                {m.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>⚡</div>
            <div style={{
              padding: "14px 18px", background: T.surface, borderRadius: "16px 16px 16px 4px",
              border: `1px solid ${T.border}`, display: "flex", gap: 5, alignItems: "center",
            }}>
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ padding: "0 28px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)}
              style={{
                padding: "7px 14px", borderRadius: 20,
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.grayLight, fontSize: 12, cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.target.style.borderColor = T.gold; e.target.style.color = T.gold; }}
              onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.grayLight; }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "16px 28px", borderTop: `1px solid ${T.border}`,
        background: T.dark, display: "flex", gap: 12, flexShrink: 0,
      }}>
        <input
          className="input" placeholder="Ask P anything about college, FAFSA, scholarships..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-gold" style={{ padding: "10px 18px", flexShrink: 0 }}
          onClick={() => send(input)} disabled={loading || !input.trim()}>
          <Icon name="send" size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── SCREEN: COMMUNITY ────────────────────────────────────────────
const Community = () => {
  const [activeRoom, setActiveRoom] = useState("Money Talk");
  const rooms = [
    { name: "Money Talk", desc: "FAFSA, financial aid, scholarship wins", count: 24, icon: "💵" },
    { name: "The Common App Room", desc: "Essays, activities, recommendations", count: 18, icon: "📝" },
    { name: "First Gen Files", desc: "For students whose parents didn't go to college", count: 31, icon: "🔑" },
    { name: "Win Board", desc: "Good news only. Post your wins.", count: 9, icon: "🏆" },
    { name: "Mentor Lounge", desc: "College students and counselors here to help", count: 7, icon: "🎓" },
  ];

  const messages = {
    "Money Talk": [
      { user: "TamaraN", avatar: "TN", msg: "Does anyone know if the Gates deadline is really 11:59pm or midnight??", time: "9:04 PM", tag: null },
      { user: "P ⚡", avatar: "⚡", msg: "It's 11:59pm Central Time. Do not cut it close — submit at least 30 minutes early in case of technical issues.", time: "9:04 PM", tag: "AI Guide", isP: true },
      { user: "DominiqueW", avatar: "DW", msg: "I just found out my EFC came back way higher than I thought. Now I'm worried my financial aid won't cover everything.", time: "9:11 PM", tag: null },
      { user: "MentorAlex", avatar: "MA", msg: "DominiqueW — this is actually really common and there are steps you can take. Your school's financial aid office can do a professional judgment review if your family's circumstances changed. Ask specifically about that.", time: "9:13 PM", tag: "Mentor" },
      { user: "JaylenR", avatar: "JR", msg: "Dell Scholars just called me for a follow-up interview 🙌", time: "9:22 PM", tag: null },
    ],
  };

  const roomMessages = messages[activeRoom] || [
    { user: "P ⚡", avatar: "⚡", msg: "Welcome to " + activeRoom + ". This is a space to connect with students who get it. Be real, be kind, and help when you can.", time: "9:00 PM", tag: "AI Guide", isP: true },
  ];

  const tagColors = {
    "AI Guide": { bg: T.borderGold, color: T.gold },
    "Mentor": { bg: "#1A2A3F", color: T.blue },
  };

  return (
    <div style={{ flex: 1, display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Room list */}
      <div style={{
        width: 240, borderRight: `1px solid ${T.border}`,
        background: T.dark, padding: "24px 16px", flexShrink: 0,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: T.gray, letterSpacing: "0.08em", marginBottom: 16, paddingLeft: 4 }}>
          COMMUNITY SPACES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {rooms.map(r => (
            <div key={r.name} onClick={() => setActiveRoom(r.name)}
              style={{
                padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                background: activeRoom === r.name ? T.borderGold : "transparent",
                border: `1px solid ${activeRoom === r.name ? T.goldDim + "44" : "transparent"}`,
                transition: "all 0.15s",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 14 }}>{r.icon}</span>
                <div style={{ fontSize: 13, fontWeight: 600, color: activeRoom === r.name ? T.gold : T.white }}>{r.name}</div>
                <div style={{ marginLeft: "auto", fontSize: 11, color: T.gray }}>{r.count}</div>
              </div>
              <div style={{ fontSize: 11, color: T.gray, paddingLeft: 22, lineHeight: 1.4 }}>{r.desc}</div>
            </div>
          ))}
        </div>

        {/* Community Agreement */}
        <div style={{
          marginTop: "auto", padding: "12px 14px",
          background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.gold, marginBottom: 4, letterSpacing: "0.06em" }}>
            COMMUNITY AGREEMENT
          </div>
          <div style={{ fontSize: 11, color: T.grayLight, lineHeight: 1.5 }}>
            This is not a competition. Everyone here is building toward something. Act accordingly.
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Room header */}
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${T.border}`,
          background: T.dark, flexShrink: 0,
        }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.white }}>{activeRoom}</div>
          <div style={{ fontSize: 12, color: T.gray }}>
            {rooms.find(r => r.name === activeRoom)?.desc} · Moderated
          </div>
        </div>

        {/* Messages */}
        <div className="scroll" style={{ flex: 1, padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {roomMessages.map((m, i) => (
            <div key={i} className="fade-up" style={{ display: "flex", gap: 12, animationDelay: `${i * 0.06}s` }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: m.isP
                  ? `linear-gradient(135deg, ${T.goldDim}, ${T.gold})`
                  : m.tag === "Mentor" ? `linear-gradient(135deg, #1A2A3F, ${T.blue})`
                    : `linear-gradient(135deg, ${T.grayMid}, ${T.gray})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: m.isP ? 14 : 11, fontWeight: 700, color: T.black,
              }}>{m.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{m.user}</div>
                  {m.tag && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: tagColors[m.tag]?.bg, color: tagColors[m.tag]?.color,
                    }}>{m.tag}</span>
                  )}
                  <div style={{ fontSize: 11, color: T.gray, marginLeft: "auto" }}>{m.time}</div>
                </div>
                <div style={{
                  fontSize: 13, color: T.white, lineHeight: 1.6,
                  padding: "10px 14px", background: T.surface,
                  border: `1px solid ${m.isP ? T.goldDim + "44" : T.border}`,
                  borderRadius: "4px 12px 12px 12px",
                }}>
                  {m.msg}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community input */}
        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${T.border}`,
          background: T.dark, display: "flex", gap: 12, flexShrink: 0,
        }}>
          <input className="input" placeholder="Say something helpful..." style={{ flex: 1 }} />
          <button className="btn btn-gold" style={{ padding: "10px 18px", flexShrink: 0 }}>
            <Icon name="send" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── WIREFRAME LEGEND ─────────────────────────────────────────────
const WireframeNote = ({ screen }) => {
  const notes = {
    dashboard: { title: "Screen 1: Dashboard", type: "High-Fidelity Mockup", notes: ["Stat cards show at-a-glance scholarship pipeline", "Deadline urgency indicated by color (red = <14 days)", "Win Board surfaces community energy on every login", "P CTA keeps AI visible without being intrusive"] },
    scholarships: { title: "Screen 2: Scholarship Finder", type: "High-Fidelity Mockup + Prototype", notes: ["Match % algorithm uses profile data (GPA, major, state, demographics)", "Filters reflect most common user search behaviors from research", "Save/Apply split CTA — tracks intent vs. action separately", "Real-time search filter with no page reload"] },
    plugai: { title: "Screen 3: Talk to P (AI Guide)", type: "Interactive Prototype (Live AI)", notes: ["Live Claude API integration — fully functional", "Tone system: P adapts response style to emotional context", "Message counter visible — nudges toward upgrade without forcing", "Suggestion chips appear only on session start to reduce friction"] },
    community: { title: "Screen 4: Community Spaces", type: "High-Fidelity Mockup", notes: ["Room architecture reflects distinct use cases, not one big chat", "P appears in community with 'AI Guide' tag — transparent AI presence", "Mentor badge differentiates verified helpers from peers", "Community Agreement visible in sidebar — sets tone before posting"] },
  };
  const n = notes[screen];
  return (
    <div style={{
      position: "fixed", bottom: 20, right: 20, width: 280,
      background: T.dark, border: `1px solid ${T.goldDim}66`,
      borderRadius: 12, padding: "16px 18px", zIndex: 100,
      boxShadow: `0 8px 32px ${T.black}88`,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.gold, letterSpacing: "0.08em", marginBottom: 6 }}>
        PROTOTYPE NOTES
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, color: T.white, marginBottom: 2 }}>{n.title}</div>
      <div style={{ fontSize: 11, color: T.gray, marginBottom: 10 }}>Type: {n.type}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {n.notes.map((note, i) => (
          <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold, marginTop: 5, flexShrink: 0 }} />
            <div style={{ fontSize: 11, color: T.grayLight, lineHeight: 1.4 }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("dashboard");

  const screens = { dashboard: <Dashboard onNav={setScreen} />, scholarships: <Scholarships />, plugai: <PlugAI />, community: <Community /> };

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", height: "100vh", background: T.black, overflow: "hidden" }}>
        <Sidebar active={screen} onNav={setScreen} />
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {screens[screen]}
        </div>
        <WireframeNote screen={screen} />
      </div>
    </>
  );
}
