const mongoose = require("mongoose");

// A "Party" / Client of the showroom
const clientSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    mobile:  { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: "" },
    notes:   { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Text index so party search (name / mobile / address) is fast
clientSchema.index({ name: "text", mobile: "text", address: "text" });

module.exports = mongoose.model("Client", clientSchema);
