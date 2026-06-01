import { useState, useEffect } from "react";
import { createSelection, updateSelection } from "../api";

export default function SelectionForm({ clientId, existing, onClose, onSaved }) {
  const [form, setForm] = useState({
    brand: "", name: "", thickness: "", color: "",
    category: "Plywood", quantity: "", remarks: "",
    selectionDate: new Date().toISOString().slice(0, 10), image: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (existing) {
      setForm({
        brand: existing.brand || "",
        name: existing.name || "",
        thickness: existing.thickness || "",
        color: existing.color || "",
        category: existing.category || "Plywood",
        quantity: existing.quantity || "",
        remarks: existing.remarks || "",
        selectionDate: existing.selectionDate ? existing.selectionDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        image: existing.image || "",
      });
      setErr("");
    }
  }, [existing]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file); // stored as base64 data URL
  };

  const save = async () => {
    if (!form.name.trim()) { setErr("Product name is required"); return; }
    try {
      setSaving(true);
      if (existing) {
        await updateSelection(existing._id, form);
      } else {
        await createSelection(clientId, form);
      }
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const title = existing ? "Edit Selection" : "Add Selection";
  const buttonLabel = existing ? "Save Changes" : "Add Selection";

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal glass">
        <div className="head"><h3>{title}</h3><button onClick={onClose}>✕</button></div>
        <div className="body">
          {err && <div className="err-line">{err}</div>}

          <div className="field"><label>Product Image</label>
            <div className="imgpick">
              <div className="imgprev" style={form.image ? { backgroundImage: `url('${form.image}')` } : {}}>
                {!form.image && "＋"}
              </div>
              <label className="file">Choose photo
                <input type="file" accept="image/*" onChange={onImage} hidden />
              </label>
            </div>
          </div>

          <div className="two">
            <div className="field"><label>Brand</label><input value={form.brand} onChange={set("brand")} placeholder="e.g. Greenply" /></div>
            <div className="field"><label>Product Name <span className="req">*</span></label><input value={form.name} onChange={set("name")} placeholder="e.g. Club 710" autoFocus /></div>
          </div>
          <div className="two">
            <div className="field"><label>Thickness</label><input value={form.thickness} onChange={set("thickness")} placeholder="e.g. 19mm" /></div>
            <div className="field"><label>Color</label><input value={form.color} onChange={set("color")} placeholder="e.g. Birch" /></div>
          </div>
          <div className="two">
            <div className="field"><label>Category</label>
              <select value={form.category} onChange={set("category")}>
                <option>Plywood</option><option>Laminate</option><option>Veneer</option><option>Hardware</option><option>Other</option>
              </select>
            </div>
            <div className="field"><label>Quantity</label><input value={form.quantity} onChange={set("quantity")} placeholder="e.g. 30 sheets" /></div>
          </div>
          <div className="field"><label>Remarks</label><textarea value={form.remarks} onChange={set("remarks")} placeholder="Where it's used, finish notes…" /></div>
          <div className="field"><label>Selection Date</label><input type="date" value={form.selectionDate} onChange={set("selectionDate")} /></div>
        </div>
        <div className="foot">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : buttonLabel}</button>
        </div>
      </div>
    </div>
  );
}
