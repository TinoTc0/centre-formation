const Student = require("../models/studentModel");

/* =========================
   CREATE STUDENT
========================= */
exports.createStudent = (req, res) => {
  const { name, email, phone } = req.body;

  Student.create({ name, email, phone }, (err) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({
      message: "Étudiant créé avec succès",
    });
  });
};

/* =========================
   GET ALL STUDENTS
========================= */
exports.getAllStudents = (req, res) => {
  Student.findAll((err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};

/* =========================
   GET STUDENT BY ID
========================= */
exports.getStudentById = (req, res) => {
  Student.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    res.json(results[0]);
  });
};

/* =========================
   UPDATE STUDENT
========================= */
exports.updateStudent = (req, res) => {
  const { name, email, phone } = req.body;

  Student.update(req.params.id, { name, email, phone }, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Étudiant mis à jour" });
  });
};

/* =========================
   DELETE STUDENT
========================= */
exports.deleteStudent = (req, res) => {
  Student.delete(req.params.id, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Étudiant supprimé" });
  });
};