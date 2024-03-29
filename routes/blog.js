const { Router } = require("express");

const blogController = require("../controllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /
router.get("/", blogController.getIndex);

//  @desc   Weblog post Page
//  @route  GET /post/:id
router.get("/", blogController.getSinglePost);


//  @desc   Weblog numeric captcha
//  @route  GET /captchapng
router.get("/captcha.png", blogController.getCaptcha);

//  @desc   handle contact Page
//  @route  POST /contact
router.get("/contact", blogController.handleContactPage);

module.exports = router;
