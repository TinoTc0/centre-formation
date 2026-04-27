const validator = require("validator");

/* Validation Register */
exports.validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || validator.isEmpty(name.trim())) {
    return res.status(400).json({
      message: "Le nom est obligatoire"
    });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Email invalide"
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Mot de passe minimum 6 caractères"
    });
  }

  const roles = ["admin", "formateur", "etudiant"];

  if (role && !roles.includes(role)) {
    return res.status(400).json({
      message: "Rôle invalide"
    });
  }

  next();
};

/* Validation Student */
exports.validateStudent = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || validator.isEmpty(name.trim())) {
    return res.status(400).json({
      message: "Nom étudiant obligatoire"
    });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Email étudiant invalide"
    });
  }

  next();
};

/* Validation Formation */
exports.validateFormation = (req, res, next) => {
  const { title, duration } = req.body;

  if (!title || validator.isEmpty(title.trim())) {
    return res.status(400).json({
      message: "Titre obligatoire"
    });
  }

  if (!duration) {
    return res.status(400).json({
      message: "Durée obligatoire"
    });
  }

  next();
};