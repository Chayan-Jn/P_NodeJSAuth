const express = require('express');
const {registerUser,loginUser,changePassword} = require('../controllers/auth-controller')
const router = express.Router();
const authMiddlware = require('../middlewares/auth-middleware');

// All routes related to authentication and authorization
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/change-password',authMiddlware,changePassword)

module.exports = router;