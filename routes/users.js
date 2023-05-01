const { Router } = require("express");

const userController = require("../controllers/userController");

const router = new Router();

//  @desc   Login Page
//  @route  GET /users/login
router.get("/login", userController.login);

//  @desc   Login Handle
//  @route  POST /users/login
router.post("/login", userController.handleLogin, userController.rememberMe);

// @desc Login Handle
// @route POST /users/logout

router.get("/logout", userController.logout);

//  @desc   Register Page
//  @route  GET /users/register
router.get("/register", userController.register);

//  @desc   forget-password
//  @route  GET /users/forget-password
router.get("/forget-password", userController.forgetPassword);

//  @desc   handle-forget-password
//  @route  GET /users/handle-forget-password
router.post("/forget-password", userController.handleForgetPassword);

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register", userController.createUser);

module.exports = router;
