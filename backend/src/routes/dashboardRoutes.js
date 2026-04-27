const express = require("express");
const router = express.Router();

const controller = require("../controllers/dashboardController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  controller.getDashboardStats
);

module.exports = router;