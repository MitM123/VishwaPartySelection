const Client = require("../models/Client");
const Selection = require("../models/Selection");

// GET /api/clients?search=    -> list parties (with selection count)
exports.getClients = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim()) {
      const rx = new RegExp(search.trim(), "i"); // case-insensitive partial match
      filter = { $or: [{ name: rx }, { mobile: rx }, { address: rx }] };
    }

    const clients = await Client.find(filter).sort({ createdAt: -1 }).lean();

    // attach how many selections each party has
    const counts = await Selection.aggregate([
      { $group: { _id: "$client", count: { $sum: 1 } } },
    ]);
    const map = {};
    counts.forEach((c) => (map[c._id.toString()] = c.count));

    const data = clients.map((c) => ({ ...c, selectionCount: map[c._id.toString()] || 0 }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/clients/:id
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).lean();
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/clients
exports.createClient = async (req, res) => {
  try {
    const { name, mobile, address, notes } = req.body;
    if (!name || !mobile) return res.status(400).json({ message: "Name and mobile are required" });
    const client = await Client.create({ name, mobile, address, notes });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/clients/:id
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/clients/:id  (also removes their selections)
exports.deleteClient = async (req, res) => {
  try {
    await Selection.deleteMany({ client: req.params.id });
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client and selections deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
