const express = require("express");
const router = express.Router();
const c = require("../controllers/clientController");
const s = require("../controllers/selectionController");

// Party / client routes
router.get("/", c.getClients);
router.post("/", c.createClient);
router.get("/:id", c.getClient);
router.put("/:id", c.updateClient);
router.delete("/:id", c.deleteClient);

// Selections that belong to a specific party
router.get("/:clientId/selections", s.getSelections);
router.post("/:clientId/selections", s.createSelection);

module.exports = router;
