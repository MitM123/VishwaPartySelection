import { useState, useEffect, useCallback } from "react";
import { fetchClients } from "./api";
import ClientList from "./components/ClientList";
import ClientDetail from "./components/ClientDetail";
import ClientForm from "./components/ClientForm";
import Toast from "./components/Toast";

export default function App() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");          // party search text
  const [activeId, setActiveId] = useState(null);     // open client detail
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const notify = (m) => setToast(m);

  // load parties (debounced search)
  const loadClients = useCallback(async (q = "") => {
    try {
      setLoading(true);
      const { data } = await fetchClients(q);
      setClients(data);
    } catch (e) {
      notify("Could not reach server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadClients(search), 300);
    return () => clearTimeout(t);
  }, [search, loadClients]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const openNew = () => { setEditClient(null); setShowForm(true); };
  const openEdit = (c) => { setEditClient(c); setShowForm(true); };

  return (
    <div className="wrap">
      <header className="top">
        <div className="logo">S</div>
        <div>
          <h1>Selection Notes</h1>
          <div className="sub">Showroom client selections</div>
        </div>
        <div className="spacer" />
        <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Theme">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </header>

      {activeId ? (
        <ClientDetail
          clientId={activeId}
          onBack={() => { setActiveId(null); loadClients(search); }}
          onEditClient={openEdit}
          onDeleted={() => { setActiveId(null); loadClients(search); notify("Client deleted"); }}
          notify={notify}
        />
      ) : (
        <ClientList
          clients={clients}
          search={search}
          setSearch={setSearch}
          loading={loading}
          onOpen={setActiveId}
          onNew={openNew}
        />
      )}

      {showForm && (
        <ClientForm
          existing={editClient}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); loadClients(search); if (activeId) setActiveId(activeId); notify(editClient ? "Client updated" : "Client added"); }}
        />
      )}

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
