const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// INSCRIPTION
exports.register = (req, res) => {
  const { name, email, password} = req.body;
  const role = req.body.role || 'etudiant';

  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create(
    { name, email, password: hashedPassword, role },
    (err) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: "Utilisateur créé avec succès" });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const user = results[0];

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  });
};