const jwt = require("jsonwebtoken");

/**
 * Middleware de vérification JWT
 * - Vérifie le token Bearer
 * - Décode le token
 * - Injecte user dans req.user
 */
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Vérifier présence header
  if (!authHeader) {
    return res.status(403).json({ message: "Token manquant" });
  }

  try {
    // 2. Récupérer le token
    const token = authHeader.split(" ")[1];

    // 3. Vérifier token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Normaliser les données utilisateur
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};