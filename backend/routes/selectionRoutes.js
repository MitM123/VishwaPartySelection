const express = require("express");
const router = express.Router();
const s = require("../controllers/selectionController");

router.get("/", s.searchAllSelections);   // global selection search
router.put("/:id", s.updateSelection);
router.delete("/:id", s.deleteSelection);

module.exports = router;
