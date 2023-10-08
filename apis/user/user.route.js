const express = require('express'); //import express module
const router = express.Router(); // import express router which is useful to define routes and group related route handler together.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserController = require('./user.controller'); //import usercontroller module.which may contain function for user operation.
const authh = require('../middlewares/authh'); //import middleware auth module. which is useful for user authentication.
const roleAccess = require("../middlewares/roleAccess"); //import middleware module for role-based access control.

//define routes. and different HTTP routes on this routers and fun. that will execute when this routes are accessed.
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/',authh, roleAccess(['SUPERADMIN']) ,UserController.getUsers);
router.delete('/deleteuser/:userId', UserController.deleteUser);


module.exports = router;
















