const mongoose = require("mongoose");

// One product a client selected during a visit
const selectionSchema = new mongoose.Schema(
  {
    client:    { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, index: true },
    brand:     { type: String, trim: true, default: "" },
    name:      { type: String, required: true, trim: true },   // product name
    thickness: { type: String, trim: true, default: "" },
    color:     { type: String, trim: true, default: "" },
    category:  { type: String, enum: ["Plywood", "Laminate", "Veneer", "Hardware", "Other"], default: "Plywood" },
    quantity:  { type: String, trim: true, default: "" },
    remarks:   { type: String, trim: true, default: "" },
    image:     { type: String, default: "" },                  // base64 data URL or image URL
    selectionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Search selections by product name / brand / category
selectionSchema.index({ name: "text", brand: "text", category: "text" });

module.exports = mongoose.model("Selection", selectionSchema);
