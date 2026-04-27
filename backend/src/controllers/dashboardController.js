const Dashboard = require("../models/dashboardModel");

exports.getDashboardStats = (req, res) => {
  Dashboard.getStats((err, results) => {
    if (err) return res.status(500).json(err);

    res.status(200).json({
      message: "Statistiques dashboard",
      data: results[0]
    });
  });
};