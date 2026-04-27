const db = require("../config/db");

const Student = {
  create: (data, callback) => {
    const sql = "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)";
    db.query(sql, [data.name, data.email, data.phone], callback);
  },

  findAll: (callback) => {
    const sql = "SELECT * FROM students";
    db.query(sql, callback);
  },

  findById: (id, callback) => {
    const sql = "SELECT * FROM students WHERE id = ?";
    db.query(sql, [id], callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE students SET name=?, email=?, phone=? WHERE id=?";
    db.query(sql, [data.name, data.email, data.phone, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM students WHERE id=?";
    db.query(sql, [id], callback);
  },
};

module.exports = Student;