const express = require("express");
const { chatWithGroq } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", chatWithGroq);

module.exports = router;
