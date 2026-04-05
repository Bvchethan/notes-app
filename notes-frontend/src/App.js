import { useEffect, useState } from "react";
import "./App.css";
const API_URL = "https://notes-app-f2vu.onrender.com";
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [error, setError] = useState("");

  const login = () => {
    setError("");

    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (res) => {
        const data = await res.text();

        if (!res.ok || data === "Invalid credentials") {
          throw new Error("Invalid username or password");
        }

        localStorage.setItem("token", data);
        setToken(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error(err);
      });
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
    setError("");
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
              <div className="section-heading">
                <p className="eyebrow">Welcome Back</p>
                <h2>Login</h2>
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

              <button className="library-button" onClick={login}>
                Sign In
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
            <strong>{notes.length}</strong>
            <p>Your personal note collection, ready anytime.</p>
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
