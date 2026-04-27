const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken } = require("../middlewares/authMiddleware");

/* =========================
   PROFIL FORMATEUR
========================= */
router.get("/me", verifyToken, (req, res) => {
  const sql = `
    SELECT id, name, email, role 
    FROM users 
    WHERE id = ? AND role = 'formateur'
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});

/* =========================
   FORMATIONS + STATS
========================= */
router.get("/formations", verifyToken, (req, res) => {
  const sql = `
    SELECT f.*, COUNT(e.id) AS total_students
    FROM formations f
    LEFT JOIN enrollments e ON e.formation_id = f.id
    WHERE f.trainer_id = ?
    GROUP BY f.id
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* =========================
   LISTE ETUDIANTS
========================= */
router.get("/students", verifyToken, (req, res) => {
  const sql = `
    SELECT DISTINCT u.id, u.name, u.email
    FROM users u
    JOIN enrollments e ON e.user_id = u.id
    JOIN formations f ON f.id = e.formation_id
    WHERE u.role = 'etudiant'
    AND f.trainer_id = ?
  `;
  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

/* =========================
   STATS DASHBOARD
========================= */
router.get("/stats", verifyToken, (req, res) => {
  const trainerId = req.user.id;

  const q1 = "SELECT COUNT(*) AS total FROM formations WHERE trainer_id = ?";
  const q2 = `
    SELECT COUNT(DISTINCT e.user_id) AS total 
    FROM enrollments e
    JOIN formations f ON f.id = e.formation_id
    WHERE f.trainer_id = ?
  `;
  const q3 = `
    SELECT COUNT(*) AS total 
    FROM enrollments e
    JOIN formations f ON f.id = e.formation_id
    WHERE f.trainer_id = ?
  `;

  db.query(q1, [trainerId], (err, r1) => {
    if (err) return res.status(500).json(err);

    db.query(q2, [trainerId], (err, r2) => {
      if (err) return res.status(500).json(err);

      db.query(q3, [trainerId], (err, r3) => {
        if (err) return res.status(500).json(err);

        res.json({
          formations:  r1[0].total,
          students:    r2[0].total,
          enrollments: r3[0].total,
        });
      });
    });
  });
});
/* =========================
   ADMIN — LISTE FORMATEURS
========================= */
router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT id, name, email, role, created_at FROM users WHERE role = 'formateur'";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

/* =========================
   ADMIN — AJOUTER FORMATEUR
========================= */
router.post("/", verifyToken, (req, res) => {
  const { name, email, password } = req.body;
  const bcrypt = require('bcryptjs');

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nom, email et mot de passe obligatoires." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'formateur')";

  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("ERREUR INSERT FORMATEUR:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ message: "Formateur ajouté avec succès", id: result.insertId });
  });
});

/* =========================
   ADMIN — SUPPRIMER FORMATEUR
========================= */
router.delete("/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM users WHERE id = ? AND role = 'formateur'";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Formateur introuvable." });
    }
    res.json({ message: "Formateur supprimé avec succès." });
  });
});

/* =========================
   FORMATEUR — INSCRIRE ETUDIANT
========================= */
router.post("/enroll", verifyToken, (req, res) => {
  const { student_id, formation_id } = req.body;

  if (!student_id || !formation_id) {
    return res.status(400).json({ message: "student_id et formation_id sont obligatoires." });
  }

  // Vérifier que la formation appartient au formateur connecté
  const checkSql = "SELECT id FROM formations WHERE id = ? AND trainer_id = ?";
  db.query(checkSql, [formation_id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(403).json({ message: "Vous ne pouvez pas inscrire dans cette formation." });
    }

    // Vérifier doublon
    const checkDup = "SELECT id FROM enrollments WHERE user_id = ? AND formation_id = ?";
    db.query(checkDup, [student_id, formation_id], (err, existing) => {
      if (err) return res.status(500).json(err);
      if (existing.length > 0) {
        return res.status(409).json({ message: "Cet étudiant est déjà inscrit." });
      }

      // Inscrire
      const sql = "INSERT INTO enrollments (user_id, formation_id) VALUES (?, ?)";
      db.query(sql, [student_id, formation_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Étudiant inscrit avec succès.", id: result.insertId });
      });
    });
  });
});

module.exports = router;