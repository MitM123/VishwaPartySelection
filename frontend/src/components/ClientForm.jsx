import { useState } from "react";
import { createClient, updateClient } from "../api";

export default function ClientForm({ existing, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: existing?.name || "",
    mobile: existing?.mobile || "",
    address: existing?.address || "",
    notes: existing?.notes || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    if (!form.name.trim() || !form.mobile.trim()) { setErr("Name and mobile are required"); return; }
    try {
      setSaving(true);
      if (existing) await updateClient(existing._id, form);
      else await createClient(form);
      onSaved();
    } catch (e) {
      setErr(e.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal glass">
        <div className="head"><h3>{existing ? "Edit Client" : "New Client"}</h3><button onClick={onClose}>✕</button></div>
        <div className="body">
          {err && <div className="err-line">{err}</div>}
          <div className="field"><label>Client Name <span className="req">*</span></label>
            <input value={form.name} onChange={set("name")} placeholder="e.g. Rajesh Patel" autoFocus /></div>
          <div className="two">
            <div className="field"><label>Mobile <span className="req">*</span></label>
              <input value={form.mobile} onChange={set("mobile")} placeholder="+91 …" /></div>
            <div className="field"><label>Address</label>
              <input value={form.address} onChange={set("address")} placeholder="Area, City" /></div>
          </div>
          <div className="field"><label>Notes</label>
            <textarea value={form.notes} onChange={set("notes")} placeholder="Any notes about this client / project…" /></div>
        </div>
        <div className="foot">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Client"}</button>
        </div>
      </div>
    </div>
  );
}
