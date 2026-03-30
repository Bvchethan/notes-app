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
        <div className="app-backdrop" />
        <main className="library-page">
          <section className="hero-card hero-card--login">
            <p className="eyebrow">Quiet Reading Room</p>
            <h1>Library Notes</h1>
            <p className="hero-copy">
              Step into your private archive of thoughts, reading lists, and
              margin notes.
            </p>

            <div className="login-card">
              <h2>Member Login</h2>

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
                Enter The Stacks
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
      <div className="app-backdrop" />
      <main className="library-page">
        <section className="hero-card">
          <div>
            <p className="eyebrow">Curated Collection</p>
            <h1>Library Notes</h1>
            <p className="hero-copy">
              Organize passing ideas like catalog cards, then revisit them
              whenever you need a quiet shelf of clarity.
            </p>
          </div>

          <div className="hero-actions">
            <span className="status-pill">{notes.length} archived notes</span>
            <button
              className="library-button library-button--ghost"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </section>

        <section className="content-grid">
          <section className="composer-card">
            <div className="section-heading">
              <p className="eyebrow">Add To Collection</p>
              <h2>New Catalog Entry</h2>
            </div>

            <input
              className="library-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="library-input library-textarea"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <button className="library-button" onClick={addNote}>
              Add To Shelf
            </button>
          </section>

          <section className="notes-panel">
            <div className="section-heading">
              <p className="eyebrow">Reading Table</p>
              <h2>Your Notes</h2>
            </div>

            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="empty-state">
                  <p>No notes shelved yet.</p>
                  <span>
                    Write your first entry to begin your personal library.
                  </span>
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
