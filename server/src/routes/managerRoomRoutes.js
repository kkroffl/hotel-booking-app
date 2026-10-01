const express = require("express");
const requireManager = require("../middleware/managerMiddleware");

const {
  getManagerRooms,
  createManagerRoom,
  updateManagerRoom,
  deleteManagerRoom,
} = require("../controllers/managerRoomController");

const router = express.Router();

router.get("/", requireManager, getManagerRooms);
router.post("/", requireManager, createManagerRoom);
router.patch("/:id", requireManager, updateManagerRoom);
router.delete("/:id", requireManager, deleteManagerRoom);

module.exports = router;
