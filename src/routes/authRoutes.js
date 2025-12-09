// src/routes/authRoutes.js (FINAL CommonJS)

const express = require("express");
// Menggunakan destructuring karena authController mengekspor objek
const { register, login } = require("../controllers/authController.js"); 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;