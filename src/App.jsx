import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

/* ================= HOME ================= */

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const generateWish = () => {
    if (name.trim() !== "") {
      navigate(`/wish/${encodeURIComponent(name)}`);
    }
  };

  return (
    <div style={homeStyle.wrapper}>
      <h1 style={homeStyle.title}>🌙 Ramazan Wish Generator</h1>

      <input
        style={homeStyle.input}
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button style={homeStyle.button} onClick={generateWish}>
        Generate Wish
      </button>
    </div>
  );
}

/* ================= WISH PAGE ================= */

function WishPage() {
  const { name } = useParams();
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  const createNew = () => {
    if (newName.trim() !== "") {
      navigate(`/wish/${encodeURIComponent(newName)}`);
    }
  };

  const shareNow = async () => {
    const shareData = {
      title: "Ramazan Mubarak 🌙",
      text: `💛 Ramazan Mubarak from ${name}\nCreate yours 👇`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied! Share it anywhere.");
      }
    } catch (err) {
      console.log("Sharing failed", err);
    }
  };

  /* ================= NATIVE BANNER SETUP ================= */
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl28760265.effectivegatecpm.com/9eac4bdba502a66fe92f84a24789345e/invoke.js";

    const adContainer = document.getElementById(
      "container-9eac4bdba502a66fe92f84a24789345e"
    );
    if (adContainer) adContainer.appendChild(script);
  }, []);

  return (
    <div className="nightWrapper">
      <div className="contentCenter">
        <h1 className="arabicText">رمضان كريم</h1>
        <h2 className="wishLine">💛 Ramazan Mubarak from</h2>
        <h3 className="fromName">{name}</h3>

        <div className="actionBox">
          <input
            placeholder="Enter your name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={createNew}>Create Yours</button>
          <button onClick={shareNow}>Share</button>
        </div>

        {/* ================= NATIVE BANNER AD — Button ke niche ================= */}
        <div
          id="container-9eac4bdba502a66fe92f84a24789345e"
          style={{ margin: "20px auto" }}
        ></div>
      </div>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wish/:name" element={<WishPage />} />
    </Routes>
  );
}

/* ================= HOME STYLE ================= */

const homeStyle = {
  wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #07131c, #000)",
    color: "white",
  },
  title: { marginBottom: "20px" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    marginBottom: "10px",
    width: "220px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    background: "gold",
    cursor: "pointer",
    fontWeight: "bold",
  },
};