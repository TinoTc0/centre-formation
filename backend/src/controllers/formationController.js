const db = require("../config/db");
const Formation = require("../models/formationModel");

/* CREATE */
exports.createFormation = (req, res) => {
  const data = { ...req.body, trainer_id: req.user.id };
  Formation.create(data, (err, result) => {
    if (err) {
      console.error("ERREUR FORMATION:", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ message: "Formation créée avec succès" });
  });
};

/* GET ALL */
exports.getAllFormations = (req, res) => {
  Formation.findAll((err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

/* GET ONE */
exports.getFormationById = (req, res) => {
  Formation.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({
        message: "Formation introuvable",
      });
    }

    res.json(results[0]);
  });
};

/* UPDATE */
exports.updateFormation = (req, res) => {
  Formation.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Formation mise à jour",
    });
  });
};

/* DELETE */
exports.deleteFormation = (req, res) => {
  // Vérifier que la formation appartient au formateur connecté
  const checkSql = "SELECT id FROM formations WHERE id = ? AND trainer_id = ?";
  db.query(checkSql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) {
      return res.status(403).json({ message: "Vous ne pouvez pas supprimer cette formation." });
    }

    Formation.delete(req.params.id, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Formation supprimée avec succès." });
    });
  });
};

exports.enrollStudent = (req, res) => {
  // Si étudiant, il s'inscrit lui-même
  const student_id = req.user.role === 'etudiant'
    ? req.user.id
    : req.body.student_id;

  const { formation_id } = req.body;

  if (!student_id || !formation_id) {
    return res.status(400).json({ message: "student_id et formation_id sont obligatoires." });
  }

  // Vérifier si l'inscription existe déjà
  const checkSql = "SELECT id FROM enrollments WHERE user_id = ? AND formation_id = ?";
  db.query(checkSql, [student_id, formation_id], (err, existing) => {
    if (err) return res.status(500).json({ message: err.message });

    if (existing.length > 0) {
      return res.status(409).json({ message: "Vous êtes déjà inscrit à cette formation." });
    }

    // Inscrire
    const sql = "INSERT INTO enrollments (user_id, formation_id) VALUES (?, ?)";
    db.query(sql, [student_id, formation_id], (err, result) => {
      if (err) {
        console.error("ERREUR ENROLLMENTS:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ message: "Inscription réussie.", id: result.insertId });
    });
  });
};

exports.getEnrollments = (req, res) => {
  const sql = `
    SELECT 
      e.id,
      u.name AS student_name,
      f.title AS formation_title,
      e.created_at AS enrollment_date
    FROM enrollments e
    JOIN users u ON u.id = e.user_id
    JOIN formations f ON f.id = e.formation_id
    ORDER BY e.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(result);
  });
};

exports.deleteEnrollment = (req, res) => {
  const sql = "DELETE FROM enrollments WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inscription introuvable." });
    }
    res.json({ message: "Inscription supprimée avec succès." });
  });
};