import { useState, useEffect, useCallback } from "react";
import { fetchClient, fetchSelections, deleteClient, deleteSelection } from "../api";
import SelectionForm from "./SelectionForm";

const catIcon = { Plywood: "🪵", Laminate: "🎨", Veneer: "🌳", Hardware: "🔩", Other: "📦" };
const initials = (n = "") => n.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join("").toUpperCase();
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function ClientDetail({ clientId, onBack, onEditClient, onDeleted, notify }) {
  const [client, setClient] = useState(null);
  const [selections, setSelections] = useState([]);
  const [selSearch, setSelSearch] = useState("");
  const [showSelForm, setShowSelForm] = useState(false);
  const [editSel, setEditSel] = useState(null);          // <-- selection being edited
  const [viewSel, setViewSel] = useState(null);          // <-- selection shown in image viewer

  const loadClient = useCallback(async () => {
    const { data } = await fetchClient(clientId);
    setClient(data);
  }, [clientId]);

  const loadSelections = useCallback(async (q = "") => {
    const { data } = await fetchSelections(clientId, q);
    setSelections(data);
  }, [clientId]);

  useEffect(() => { loadClient(); }, [loadClient]);
  useEffect(() => {
    const t = setTimeout(() => loadSelections(selSearch), 250);
    return () => clearTimeout(t);
  }, [selSearch, loadSelections]);

  const removeClient = async () => {
    if (!window.confirm("Delete this client and all their selections?")) return;
    await deleteClient(clientId);
    onDeleted();
  };

  const removeSelection = async (id) => {
    if (!window.confirm("Delete this selection?")) return;
    await deleteSelection(id);
    loadSelections(selSearch);
    notify("Selection removed");
  };

  // open form in ADD mode
  const openAdd = () => { setEditSel(null); setShowSelForm(true); };
  // open form in EDIT mode
  const openEdit = (s) => { setEditSel(s); setShowSelForm(true); };
  const closeForm = () => { setShowSelForm(false); setEditSel(null); };

  if (!client) return <div className="empty glass"><div className="e-ic">⏳</div><h3>Loading…</h3></div>;

  return (
    <>
      <button className="back" onClick={onBack}>← All Clients</button>

      <div className="profile glass">
        <div className="av big">{initials(client.name)}</div>
        <div className="p-info">
          <h2>{client.name}</h2>
          <div className="info">
            <div>📞 <b>{client.mobile}</b></div>
            {client.address && <div>📍 <b>{client.address}</b></div>}
          </div>
          {client.notes && <div className="note">📝 {client.notes}</div>}
        </div>
        <div className="acts">
          <button className="btn ghost sm" onClick={() => onEditClient(client)}>Edit</button>
          <button className="btn danger sm" onClick={removeClient}>Delete</button>
        </div>
      </div>

      <div className="sec-head">
        <h3>Selection Notes</h3>
        <button className="btn sm" onClick={openAdd}>＋ Add Selection</button>
      </div>

      <div className="search sel-search">
        <span className="s-ic">🔍</span>
        <input
          value={selSearch}
          onChange={(e) => setSelSearch(e.target.value)}
          placeholder="Search this party's selections — brand, product, category…"
        />
        {selSearch && <button className="clear" onClick={() => setSelSearch("")}>✕</button>}
      </div>

      {selections.length === 0 ? (
        <div className="empty glass">
          <div className="e-ic">📋</div>
          <h3>{selSearch ? "No matching selection" : "No selections yet"}</h3>
          <p>{selSearch ? "Try a different keyword." : "Add the products this client picked."}</p>
        </div>
      ) : (
        <div className="sel-grid">
          {selections.map((s) => (
            <div key={s._id} className="sel">
              {/* edit + delete tools */}
              <div className="tools">
                <button className="tool edit" title="Edit" onClick={() => openEdit(s)}>✎</button>
                <button className="tool del" title="Delete" onClick={() => removeSelection(s._id)}>✕</button>
              </div>

              <div className="img" title="Click to view" onClick={() => setViewSel(s)}>
                {s.image
                  ? <img src={s.image} alt={s.name} />
                  : <span className="ph">{catIcon[s.category] || "📦"}</span>}
              </div>

              <div className="s-body">
                {s.brand && <div className="br">{s.brand}</div>}
                <div className="nm">{s.name}</div>

                <div className="attrs">
                  {[s.thickness, s.color, s.category, s.quantity].filter(Boolean).map((a, i) => (
                    <span className="attr" key={i}>{a}</span>
                  ))}
                </div>

                {s.remarks && <div className="rmk">“{s.remarks}”</div>}
                {s.selectionDate && <div className="date">🗓 {fmt(s.selectionDate)}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSelForm && (
        <SelectionForm
          clientId={clientId}
          existing={editSel}                          // <-- null = add, object = edit
          onClose={closeForm}
          onSaved={() => { closeForm(); loadSelections(selSearch); notify(editSel ? "Selection updated" : "Selection added"); }}
        />
      )}

      {/* image + details viewer — opens when a selection image is clicked */}
      {viewSel && (
        <div className="overlay" onClick={() => setViewSel(null)}>
          <div className="viewer" onClick={(e) => e.stopPropagation()}>
            <button className="v-close" onClick={() => setViewSel(null)}>✕</button>
            <div className="v-img">
              {viewSel.image
                ? <img src={viewSel.image} alt={viewSel.name} />
                : (catIcon[viewSel.category] || "📦")}
            </div>
            <div className="v-body">
              {viewSel.brand && <div className="v-br">{viewSel.brand}</div>}
              <div className="v-nm">{viewSel.name}</div>
              <div className="v-attrs">
                {viewSel.thickness && <div className="v-attr"><span>Thickness</span><b>{viewSel.thickness}</b></div>}
                {viewSel.color && <div className="v-attr"><span>Color</span><b>{viewSel.color}</b></div>}
                {viewSel.category && <div className="v-attr"><span>Category</span><b>{viewSel.category}</b></div>}
                {viewSel.quantity && <div className="v-attr"><span>Quantity</span><b>{viewSel.quantity}</b></div>}
              </div>
              {viewSel.remarks && <div className="v-rmk">“{viewSel.remarks}”</div>}
              {viewSel.selectionDate && <div className="v-date">🗓 {fmt(viewSel.selectionDate)}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}