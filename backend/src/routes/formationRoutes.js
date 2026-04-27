const express = require("express");
const router = express.Router();

const controller = require("../controllers/formationController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const { validateFormation } = require("../middlewares/validationMiddleware");

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin","formateur"),
  validateFormation,
  controller.createFormation
);

router.post(
  "/enroll",
  verifyToken,
  authorizeRoles("etudiant"),
  controller.enrollStudent
);

router.get("/available", verifyToken, controller.getAllFormations);

router.delete(
  "/enrollments/:id",
  verifyToken,
  authorizeRoles("admin"),
  controller.deleteEnrollment
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("formateur"),
  controller.deleteFormation
);

router.get("/", verifyToken, controller.getAllFormations);

module.exports = router;