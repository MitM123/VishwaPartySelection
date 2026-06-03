function initials(n = "") {
  return n.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClientList({ clients, search, setSearch, loading, onOpen, onNew }) {
  return (
    <>
      <div className="bar">
        {/* PARTY SEARCH */}
        <div className="search">
          <span className="s-ic">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search party by name, mobile or address…"
          />
          {search && <button className="clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <button className="btn" onClick={onNew}>＋ New Client</button>
      </div>

      {loading ? (
        <div className="empty glass"><div className="e-ic">⏳</div><h3>Loading…</h3></div>
      ) : clients.length === 0 ? (
        <div className="empty glass">
          <div className="e-ic">🗂️</div>
          <h3>{search ? "No matching party" : "No clients yet"}</h3>
          <p>{search ? "Try another name or number." : "Tap “New Client” to add your first party."}</p>
        </div>
      ) : (
        <div className="list">
          {clients.map((c) => (
            <div key={c._id} className="client glass" onClick={() => onOpen(c._id)}>
              <div className="row">
                <div className="av">{initials(c.name)}</div>
                <div className="c-meta">
                  <h3>{c.name}</h3>
                  <div className="mob">{c.mobile}</div>
                </div>
                <span className="count">
                  {c.selectionCount} selection{c.selectionCount !== 1 ? "s" : ""}
                </span>
              </div>
              {c.address && <div className="addr">📍 {c.address}</div>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}