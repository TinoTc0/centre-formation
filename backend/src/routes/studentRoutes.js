const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken } = require("../middlewares/authMiddleware");

/* =========================
   PROFIL ETUDIANT
========================= */
router.get("/me", verifyToken, (req, res) => {
  const sql = "SELECT id, name, email, phone, role FROM users WHERE id = ?";

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});

// GET /api/student → liste tous les étudiants
router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT id, name, email, phone FROM users WHERE role = 'etudiant'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// POST /api/student → ajouter un étudiant
router.post("/", verifyToken, (req, res) => {
  const { name, email, phone, password } = req.body;

  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'etudiant')";
  db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
    if (err) {
      console.error("ERREUR INSERT:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ message: "Étudiant ajouté", id: result.insertId });
  });
});

// DELETE /api/student/:id → supprimer un étudiant
router.delete("/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM users WHERE id = ? AND role = 'etudiant'";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Étudiant supprimé" });
  });
});

/* =========================
   FORMATIONS ETUDIANT
========================= */
router.get("/formations", verifyToken, (req, res) => {

  const userId = req.user.id;

  console.log("🔍 USER ID JWT:", userId);

  const sql = `
    SELECT f.*
    FROM formations f
    INNER JOIN enrollments e ON e.formation_id = f.id
    WHERE e.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    console.log("📦 RESULT FORMATIONS:", result);

    res.json(result);
  });
});

module.exports = router;