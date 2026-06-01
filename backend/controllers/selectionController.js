const Selection = require("../models/Selection");

// GET /api/clients/:clientId/selections?search=
exports.getSelections = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = { client: req.params.clientId };
    if (search && search.trim()) {
      const rx = new RegExp(search.trim(), "i");
      filter.$or = [{ name: rx }, { brand: rx }, { category: rx }, { color: rx }];
    }
    const selections = await Selection.find(filter).sort({ selectionDate: -1, createdAt: -1 });
    res.json(selections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/selections?search=   -> global selection search across all parties
exports.searchAllSelections = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim()) {
      const rx = new RegExp(search.trim(), "i");
      filter.$or = [{ name: rx }, { brand: rx }, { category: rx }];
    }
    const selections = await Selection.find(filter)
      .populate("client", "name mobile")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(selections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/clients/:clientId/selections
exports.createSelection = async (req, res) => {
  try {
    if (!req.body.name) return res.status(400).json({ message: "Product name is required" });
    const selection = await Selection.create({ ...req.body, client: req.params.clientId });
    res.status(201).json(selection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/selections/:id
exports.updateSelection = async (req, res) => {
  try {
    const selection = await Selection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!selection) return res.status(404).json({ message: "Selection not found" });
    res.json(selection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/selections/:id
exports.deleteSelection = async (req, res) => {
  try {
    const selection = await Selection.findByIdAndDelete(req.params.id);
    if (!selection) return res.status(404).json({ message: "Selection not found" });
    res.json({ message: "Selection deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
