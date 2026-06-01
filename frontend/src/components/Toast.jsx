import { useEffect } from "react";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [message, onDone]);

  return <div className={`toast ${message ? "show" : ""}`}>✓ <span>{message}</span></div>;
}
