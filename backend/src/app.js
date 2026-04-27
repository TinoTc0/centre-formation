const express = require("express");
const cors = require("cors");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const formationRoutes = require("./routes/formationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const trainerRoutes = require("./routes/trainerRoutes");

const app = express();

/* ==================================
   MIDDLEWARES GLOBAUX
================================== */

// Autoriser frontend (React / Vue / Angular)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Lire JSON
app.use(express.json());

// Lire formulaires HTML
app.use(express.urlencoded({ extended: true }));

/* ==================================
   ROUTE TEST API
================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 API Centre de Formation active",
    status: "OK"
  });
});

/* ==================================
   ROUTES PRINCIPALES
================================== */

// Authentification
app.use("/api/auth", authRoutes);

// Gestion étudiants
app.use("/api/student", studentRoutes);

// Gestion formations + inscriptions
app.use("/api/formations", formationRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

//Gestion formateur
app.use("/api/trainer", trainerRoutes);

/* ==================================
   ROUTE NON TROUVÉE
================================== */

app.use((req, res) => {
  res.status(404).json({
    message: "❌ Route introuvable"
  });
});

/* ==================================
   ERREUR GLOBALE SERVEUR
================================== */

app.use((err, req, res, next) => {
  console.error("🔥 Erreur serveur :", err);

  res.status(500).json({
    message: "Erreur interne du serveur"
  });
});

module.exports = app;