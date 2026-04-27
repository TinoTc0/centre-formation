const express = require("express");
const router = express.Router();

const controller = require("../controllers/authController");
const {
  validateRegister
} = require("../middlewares/validationMiddleware");

router.post("/register", validateRegister, controller.register);
router.post("/login", controller.login);

module.exports = router;