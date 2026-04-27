const db = require("../config/db");

const Dashboard = {
  getStats: (callback) => {
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM users WHERE role = 'etudiant') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'formateur')  AS total_trainers,
        (SELECT COUNT(*) FROM formations)                    AS total_formations,
        (SELECT COUNT(*) FROM enrollments)                   AS total_enrollments
    `;
    db.query(sql, callback);
  }
};

module.exports = Dashboard;