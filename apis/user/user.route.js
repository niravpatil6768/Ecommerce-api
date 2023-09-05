const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserController = require('./user.controller');
const auth = require('../middlewares/authh');
const roleAccess = require("../middlewares/roleAccess");


router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/',UserController.getUsers);
router.delete('/deleteUser/:userId', UserController.deleteUser);


module.exports = router;
















