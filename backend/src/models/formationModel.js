const db = require("../config/db");

const Formation = {
  create: (data, callback) => {
    console.log("DATA FORMATION:", data);
    const sql = "INSERT INTO formations (title, duration, description, trainer_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.title, data.duration, data.description, data.trainer_id], callback);
  },

  findAll: (callback) => {
    const sql = `
      SELECT 
        f.*,
        COUNT(e.id) AS total_students,
        u.name AS trainer_name
      FROM formations f
      LEFT JOIN enrollments e ON e.formation_id = f.id
      LEFT JOIN users u ON u.id = f.trainer_id
      GROUP BY f.id
    `;
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    db.query("SELECT * FROM formations WHERE id = ?", [id], callback);
  },

  update: (id, data, callback) => {
    const sql =
      "UPDATE formations SET title=?, duration=?, description=? WHERE id=?";
    db.query(sql, [data.title, data.duration, data.description, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM formations WHERE id=?", [id], callback);
  },

  enrollStudent: (studentId, formationId, callback) => {
    const sql =
      "INSERT INTO enrollments (student_id, formation_id) VALUES (?, ?)";
    db.query(sql, [studentId, formationId], callback);
  },
};

module.exports = Formation;