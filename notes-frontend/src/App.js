import { useEffect, useState } from "react";
import "./App.css";
const API_URL = process.env.REACT_APP_API_URL || "";
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [error, setError] = useState("");

  const submitAuth = (path, invalidMessage) => {
    setError("");

    fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.text();

        if (!res.ok) {
          throw new Error(data || invalidMessage);
        }

        localStorage.setItem("token", data);
        setToken(data);
        setConfirmPassword("");
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
  };

  const login = () => {
    submitAuth("login", "Invalid username or password");
  };

  const register = () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    submitAuth("register", "Unable to register");
  };

  useEffect(() => {
    if (!token) {
      setNotes([]);
      return;
    }

    fetch(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Session expired");
        }

        return res.json();
      })
      .then((data) => setNotes(data))
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        setToken(null);
        setNotes([]);
      });
  }, [token]);

  const addNote = () => {
    fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to add note");
        }

        return res.json();
      })
      .then((note) => {
        setNotes((currentNotes) => [...currentNotes, note]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  const deleteNote = (id) => {
    fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to delete note");
        }

        setNotes((currentNotes) =>
          currentNotes.filter((note) => note.id !== id),
        );
      })
      .catch((err) => console.error(err));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
    setTitle("");
    setContent("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setAuthMode("login");
  };

  if (!token) {
    return (
      <div className="app-shell">
        <div className="app-glow app-glow--one" />
        <div className="app-glow app-glow--two" />
        <main className="dashboard-page dashboard-page--auth">
          <section className="hero-panel hero-panel--auth">
            <div className="hero-copy-block">
              <p className="eyebrow">Private Workspace</p>
              <h1>Notes App</h1>
              <p className="hero-copy">
                Capture ideas, shape rough thoughts, and return to everything in
                one calm, focused space.
              </p>

              <div className="hero-metrics">
                <div className="metric-card">
                  <span className="metric-label">Focused</span>
                  <strong>Clear writing flow</strong>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Secure</span>
                  <strong>Personal note access</strong>
                </div>
              </div>
            </div>

            <div className="auth-card">
              <div className="auth-switch">
                <button
                  className={`auth-switch__button ${
                    authMode === "login" ? "auth-switch__button--active" : ""
                  }`}
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                >
                  Login
                </button>
                <button
                  className={`auth-switch__button ${
                    authMode === "register" ? "auth-switch__button--active" : ""
                  }`}
                  onClick={() => {
                    setAuthMode("register");
                    setError("");
                  }}
                >
                  Register
                </button>
              </div>

              <div className="section-heading">
                <p className="eyebrow">
                  {authMode === "login" ? "Welcome Back" : "Create Account"}
                </p>
                <h2>{authMode === "login" ? "Login" : "Register"}</h2>
              </div>

              <input
                className="library-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className="library-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {authMode === "register" ? (
                <input
                  className="library-input"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              ) : null}

              <button
                className="library-button"
                onClick={authMode === "login" ? login : register}
              >
                {authMode === "login" ? "Sign In" : "Create Account"}
              </button>
              {error ? <p className="error-text">{error}</p> : null}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="app-glow app-glow--one" />
      <div className="app-glow app-glow--two" />
      <main className="dashboard-page">
        <section className="hero-panel">
          <div className="hero-copy-block">
            <p className="eyebrow">Daily Capture</p>
            <h1>Notes App</h1>
            <p className="hero-copy">
              A cleaner workspace for quick ideas, deep notes, and everything
              you want within reach.
            </p>
          </div>

          <div className="hero-actions">
            <span className="status-pill">{notes.length} saved notes</span>
            <button
              className="library-button library-button--ghost"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <span className="metric-label">Total Notes</span>

            <strong>
              <h1>{notes.length}</h1>
            </strong>

            <p></p>
          </article>
          <article className="summary-card">
            <span className="metric-label">Workspace</span>
            <strong>Minimal and clear</strong>
            <p>Built for faster reading, writing, and scanning.</p>
          </article>
        </section>

        <section className="content-grid">
          <section className="composer-card surface-card">
            <div className="section-heading">
              <p className="eyebrow">Create</p>
              <h2>New Note</h2>
            </div>

            <input
              className="library-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="library-input library-textarea"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button className="library-button" onClick={addNote}>
              Save Note
            </button>
          </section>

          <section className="notes-panel surface-card">
            <div className="section-heading">
              <p className="eyebrow">Library</p>
              <h2>Your Notes</h2>
            </div>

            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="empty-state">
                  <p>No notes yet.</p>
                  <span>Start with a title and a quick thought to begin.</span>
                </div>
              ) : (
                notes.map((note) => (
                  <article className="note-card" key={note.id}>
                    <div className="note-card__top">
                      <h3>{note.title}</h3>
                      <button
                        className="delete-button"
                        onClick={() => deleteNote(note.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <p>{note.content}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
