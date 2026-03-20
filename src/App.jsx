import { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

/* ─── INJECT FONTS ─────────────────────────────────────────────── */
const injectFonts = () => {
  if (document.getElementById("ramadan-fonts")) return;
  const link = document.createElement("link");
  link.id = "ramadan-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cinzel+Decorative:wght@700;900&family=Scheherazade+New:wght@400;700&display=swap";
  document.head.appendChild(link);
};

/* ─── INJECT CSS ────────────────────────────────────────────────── */
const injectCSS = () => {
  if (document.getElementById("ramadan-css")) return;
  const style = document.createElement("style");
  style.id = "ramadan-css";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      width: 100%; min-height: 100vh;
      overflow-x: hidden;
    }

    body {
      font-family: 'Amiri', serif;
      background: #020c1b;
      color: #fff;
    }

    /* STARS */
    .r-star {
      position: fixed;
      border-radius: 50%;
      background: #ffe87c;
      pointer-events: none;
      z-index: 1;
      animation: r-twinkle linear infinite alternate;
    }
    @keyframes r-twinkle {
      0%   { opacity: 0.15; transform: scale(0.8); }
      100% { opacity: 1;    transform: scale(1.5); }
    }

    /* PATTERN */
    .r-pattern {
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.6' opacity='0.1'%3E%3Cpolygon points='50,6 60,30 86,30 65,46 73,70 50,56 27,70 35,46 14,30 40,30'/%3E%3Ccircle cx='50' cy='50' r='18'/%3E%3Crect x='20' y='20' width='60' height='60' rx='4'/%3E%3C/g%3E%3C/svg%3E");
      background-size: 100px 100px;
    }

    /* LANTERNS */
    .r-lantern { position: fixed; top: 0; z-index: 4; transform-origin: top center; }
    .r-lantern-l { left: 12px; animation: r-swing 3.5s ease-in-out infinite alternate; }
    .r-lantern-r { right: 12px; animation: r-swing 3.5s ease-in-out 0.8s infinite alternate; }
    @keyframes r-swing {
      from { transform: rotate(-7deg); }
      to   { transform: rotate(7deg);  }
    }
    .r-lstring { width:2px; height:36px; background:#D4AF37; margin:0 auto; }
    .r-lbody {
      width:42px; height:88px;
      background: linear-gradient(160deg,#FFD700,#8B6914);
      border-radius: 5px 5px 22px 22px;
      box-shadow: 0 0 30px 10px rgba(255,190,0,0.45);
      position:relative; overflow:hidden;
    }
    .r-linner {
      position:absolute; inset:8px;
      border-radius:3px 3px 14px 14px;
      background:rgba(255,240,80,0.2);
    }
    .r-lline {
      position:absolute; left:0; right:0; height:1px;
      background:rgba(0,0,0,0.2);
    }
    .r-lbase {
      width:52px; height:10px; margin:-1px auto 0;
      background:linear-gradient(to right,#8B6914,#FFD700,#8B6914);
      border-radius:0 0 6px 6px;
    }

    /* MOON float */
    @keyframes r-float {
      from { transform: translateY(0px);   }
      to   { transform: translateY(-12px); }
    }

    /* GLOW NAME */
    @keyframes r-glow {
      from { text-shadow: 0 0 12px #FFD700, 0 0 24px #B8860B; }
      to   { text-shadow: 0 0 28px #FFD700, 0 0 50px #FFD700, 0 0 80px #FFD700; }
    }

    /* CARD SHIMMER */
    @keyframes r-shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }

    /* PULSE BORDER */
    @keyframes r-border-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.4), inset 0 0 30px rgba(212,175,55,0.05); }
      50%      { box-shadow: 0 0 0 8px rgba(212,175,55,0), inset 0 0 50px rgba(212,175,55,0.1); }
    }

    /* BTN HOVER */
    .r-btn { transition: transform 0.15s, box-shadow 0.15s, background 0.15s; }
    .r-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255,190,0,0.5); }
    .r-btn:active { transform: scale(0.97); }

    /* INPUT FOCUS */
    .r-input:focus { outline:none; border-color:#FFD700; box-shadow:0 0 0 3px rgba(255,215,0,0.2); }

    /* FADE IN */
    @keyframes r-fadein {
      from { opacity:0; transform: translateY(20px); }
      to   { opacity:1; transform: translateY(0);    }
    }
    .r-fadein { animation: r-fadein 0.7s ease forwards; }
    .r-fadein-2 { animation: r-fadein 0.7s ease 0.2s both; }
    .r-fadein-3 { animation: r-fadein 0.7s ease 0.4s both; }
    .r-fadein-4 { animation: r-fadein 0.7s ease 0.6s both; }

    @media (max-width: 480px) {
      .r-lbody { width:34px; height:72px; }
      .r-lstring { height:28px; }
      .r-lbase { width:42px; }
      .r-lantern-l { left:6px; }
      .r-lantern-r { right:6px; }
    }
  `;
  document.head.appendChild(style);
};

/* ─── STARS ────────────────────────────────────────────────────── */
const Stars = () => {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: (Math.random() * 3 + 2).toFixed(1),
      delay: (Math.random() * 4).toFixed(1),
    }))
  ).current;

  return (
    <>
      {stars.map((s) => (
        <div
          key={s.id}
          className="r-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
};

/* ─── LANTERN ───────────────────────────────────────────────────── */
const Lantern = ({ side }) => (
  <div className={`r-lantern r-lantern-${side}`}>
    <div className="r-lstring" />
    <div className="r-lbody">
      <div className="r-linner" />
      {[16, 36, 56].map((t) => (
        <div key={t} className="r-lline" style={{ top: t }} />
      ))}
    </div>
    <div className="r-lbase" />
  </div>
);

/* ─── CRESCENT MOON ─────────────────────────────────────────────── */
const Moon = ({ size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{ animation: "r-float 4s ease-in-out infinite alternate", display: "block" }}
  >
    <defs>
      <radialGradient id="mg" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFFDE7" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" stopOpacity="0.3" />
      </radialGradient>
      <filter id="mf">
        <feGaussianBlur stdDeviation="2.5" result="b" />
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="38" fill="url(#mg)" filter="url(#mf)" />
    <circle cx="64" cy="42" r="32" fill="#020c1b" />
    <polygon
      points="28,22 30,29 37,29 31,33 33,40 28,36 23,40 25,33 19,29 26,29"
      fill="#FFD700"
      filter="url(#mf)"
    />
  </svg>
);

/* ─── ORNAMENT ──────────────────────────────────────────────────── */
const Ornament = () => (
  <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center", margin:"10px 0" }}>
    <div style={{ flex:1, maxWidth:70, height:1, background:"linear-gradient(to right,transparent,#D4AF37)" }} />
    <svg width="18" height="18" viewBox="0 0 18 18">
      <polygon points="9,1 11,7 17,7 12,11 14,17 9,13 4,17 6,11 1,7 7,7" fill="#D4AF37" />
    </svg>
    <div style={{ flex:1, maxWidth:70, height:1, background:"linear-gradient(to left,transparent,#D4AF37)" }} />
  </div>
);

/* ─── CARD WRAPPER ──────────────────────────────────────────────── */
const Card = ({ children, style }) => (
  <div
    style={{
      background: "linear-gradient(135deg,rgba(10,22,50,0.95),rgba(2,12,27,0.98))",
      border: "1px solid rgba(212,175,55,0.35)",
      borderRadius: 20,
      padding: "clamp(20px,5vw,40px)",
      animation: "r-border-pulse 3s ease-in-out infinite",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      ...style,
    }}
  >
    {/* corner ornaments */}
    {["0,0","0,auto","auto,0","auto,auto"].map((pos,i) => {
      const [t,b] = pos.split(",");
      return (
        <svg
          key={i}
          width="28" height="28"
          style={{ position:"absolute", top:t, bottom:b, left:i<2?0:undefined, right:i>=2?0:undefined, opacity:0.5 }}
          viewBox="0 0 28 28"
        >
          <path d="M0,0 L14,0 L14,2 L2,2 L2,14 L0,14 Z" fill="#D4AF37" transform={i===1||i===3?"scale(1,-1) translate(0,-28)":i===2?"scale(-1,1) translate(-28,0)":i===3?"scale(-1,-1) translate(-28,-28)":""} />
          <circle cx={i===0||i===1?4:24} cy={i===0||i===2?4:24} r="2" fill="#D4AF37" />
        </svg>
      );
    })}
    <div
      style={{
        position:"absolute", inset:0,
        background:"linear-gradient(105deg,transparent 40%,rgba(212,175,55,0.04) 50%,transparent 60%)",
        backgroundSize:"400px 100%",
        animation:"r-shimmer 6s infinite",
        pointerEvents:"none",
      }}
    />
    {children}
  </div>
);

/* ─── INPUT ─────────────────────────────────────────────────────── */
const Input = ({ value, onChange, placeholder }) => (
  <input
    className="r-input"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width:"100%",
      padding:"12px 16px",
      background:"rgba(255,255,255,0.06)",
      border:"1px solid rgba(212,175,55,0.4)",
      borderRadius:10,
      color:"#fff",
      fontSize:"clamp(14px,3.5vw,16px)",
      fontFamily:"'Amiri',serif",
      transition:"border-color 0.2s, box-shadow 0.2s",
    }}
  />
);

/* ─── BUTTON ────────────────────────────────────────────────────── */
const Btn = ({ onClick, children, secondary }) => (
  <button
    className="r-btn"
    onClick={onClick}
    style={{
      flex:1,
      minWidth:0,
      padding:"12px 10px",
      borderRadius:10,
      border: secondary ? "1px solid rgba(212,175,55,0.5)" : "none",
      background: secondary
        ? "rgba(212,175,55,0.1)"
        : "linear-gradient(135deg,#D4AF37,#8B6914)",
      color: secondary ? "#D4AF37" : "#0a0a0a",
      fontWeight:700,
      fontSize:"clamp(13px,3vw,15px)",
      fontFamily:"'Amiri',serif",
      cursor:"pointer",
      whiteSpace:"nowrap",
    }}
  >
    {children}
  </button>
);

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const go = () => {
    if (name.trim()) navigate(`/wish/${encodeURIComponent(name.trim())}`);
  };

  return (
    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        padding:"clamp(16px,5vw,40px)",
        position:"relative",
      }}
    >
      <div className="r-pattern" />
      <Stars />
      <Lantern side="l" />
      <Lantern side="r" />

      <div style={{ position:"relative", zIndex:5, width:"100%", maxWidth:480 }}>
        {/* Moon */}
        <div className="r-fadein" style={{ textAlign:"center", marginBottom:16 }}>
          <Moon size={Math.min(90, window.innerWidth * 0.22)} />
        </div>

        <Card>
          {/* Arabic heading */}
          <div className="r-fadein" style={{ textAlign:"center", marginBottom:4 }}>
            <div style={{
              fontFamily:"'Scheherazade New',serif",
              fontSize:"clamp(28px,8vw,44px)",
              color:"#FFD700",
              textShadow:"0 0 20px rgba(255,215,0,0.6)",
              lineHeight:1.3,
            }}>
              رَمَضَانُ كَرِيم
            </div>
          </div>

          <Ornament />

          <div className="r-fadein-2" style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{
              fontFamily:"'Cinzel Decorative',serif",
              fontSize:"clamp(13px,3.5vw,17px)",
              color:"#D4AF37",
              letterSpacing:2,
              textTransform:"uppercase",
            }}>
              Ramadan Mubarak
            </div>
            <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"clamp(12px,3vw,14px)", marginTop:6 }}>
              Enter your name to create a personalised wish ✨
            </div>
          </div>

          <div className="r-fadein-3" style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name..."
            />
            <Btn onClick={go}>🌙 Generate Wish</Btn>
          </div>

          <Ornament />

          <div className="r-fadein-4" style={{ textAlign:"center", color:"rgba(255,255,255,0.25)", fontSize:11 }}>
            ☪ Share the blessings of Ramadan
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   WISH PAGE
══════════════════════════════════════════════════════════════════ */
function WishPage() {
  const { name } = useParams();
  const decoded = decodeURIComponent(name);
  const [newName, setNewName] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const createNew = () => {
    if (newName.trim()) navigate(`/wish/${encodeURIComponent(newName.trim())}`);
  };

  const share = async () => {
    const url = window.location.href;
    const text = `🌙 Ramadan Mubarak from ${decoded}!\n\nCreate your own wish 👇\n${url}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Ramadan Mubarak 🌙", text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  /* duas / wishes list */
  const duas = [
    "Taqabbal Allahu minna wa minkum",
    "May Allah accept our fasts & prayers",
    "May this Ramadan bring peace & barakah",
    "Ramadan Kareem — every dua be accepted",
  ];
  const dua = duas[Math.abs([...decoded].reduce((a,c)=>a+c.charCodeAt(0),0)) % duas.length];

  return (
    <div
      style={{
        minHeight:"100vh",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        padding:"clamp(16px,5vw,40px)",
        position:"relative",
      }}
    >
      <div className="r-pattern" />
      <Stars />
      <Lantern side="l" />
      <Lantern side="r" />

      <div style={{ position:"relative", zIndex:5, width:"100%", maxWidth:500 }}>
        {/* Moon */}
        <div className="r-fadein" style={{ textAlign:"center", marginBottom:14 }}>
          <Moon size={Math.min(80, window.innerWidth * 0.2)} />
        </div>

        <Card>
          {/* Arabic */}
          <div className="r-fadein" style={{ textAlign:"center" }}>
            <div style={{
              fontFamily:"'Scheherazade New',serif",
              fontSize:"clamp(26px,7vw,42px)",
              color:"#FFD700",
              textShadow:"0 0 20px rgba(255,215,0,0.6)",
              lineHeight:1.4,
            }}>
              رَمَضَانُ كَرِيم
            </div>
          </div>

          <Ornament />

          {/* From */}
          <div className="r-fadein-2" style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:"clamp(13px,3.2vw,15px)" }}>
              💛 Ramadan Mubarak from
            </div>
            <div style={{
              fontFamily:"'Cinzel Decorative',serif",
              fontSize:"clamp(20px,6vw,32px)",
              color:"#FFD700",
              marginTop:6,
              animation:"r-glow 2s ease-in-out infinite alternate",
              wordBreak:"break-word",
            }}>
              {decoded}
            </div>
          </div>

          {/* Dua box */}
          <div className="r-fadein-3" style={{
            background:"rgba(212,175,55,0.08)",
            border:"1px solid rgba(212,175,55,0.2)",
            borderRadius:12,
            padding:"12px 16px",
            textAlign:"center",
            marginBottom:18,
          }}>
            <div style={{ color:"#D4AF37", fontSize:"clamp(11px,2.8vw,13px)", letterSpacing:1, marginBottom:4 }}>✦ DUA ✦</div>
            <div style={{ color:"rgba(255,255,255,0.8)", fontSize:"clamp(12px,3vw,14px)", fontStyle:"italic" }}>
              "{dua}"
            </div>
          </div>

          <Ornament />

          {/* Create yours */}
          <div className="r-fadein-4" style={{ marginBottom:14 }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"clamp(11px,2.8vw,13px)", marginBottom:8, textAlign:"center" }}>
              Create your own wish 👇
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name..."
              />
              <button
                className="r-btn"
                onClick={createNew}
                style={{
                  padding:"12px 16px",
                  borderRadius:10,
                  border:"none",
                  background:"linear-gradient(135deg,#D4AF37,#8B6914)",
                  color:"#0a0a0a",
                  fontWeight:700,
                  fontSize:14,
                  cursor:"pointer",
                  whiteSpace:"nowrap",
                  flexShrink:0,
                }}
              >
                ✨ Go
              </button>
            </div>
          </div>

          {/* Share + Home buttons */}
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <Btn onClick={share} secondary>
              {copied ? "✅ Copied!" : "🔗 Share"}
            </Btn>
            <Btn onClick={() => navigate("/")} secondary>
              🏠 Home
            </Btn>
          </div>

          <div style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:10 }}>
            ☪ May Allah bless you this Ramadan
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════ */
export default function App() {
  useEffect(() => {
    injectFonts();
    injectCSS();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wish/:name" element={<WishPage />} />
    </Routes>
  );
}