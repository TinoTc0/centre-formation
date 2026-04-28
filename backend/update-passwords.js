require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const hash = bcrypt.hashSync('123456', 10);

db.query('UPDATE users SET password = ?', [hash], (err, result) => {
  if (err) {
    console.error('Erreur:', err);
  } else {
    console.log('Mots de passe mis à jour:', result.affectedRows, 'utilisateurs');
  }
  db.end();
});