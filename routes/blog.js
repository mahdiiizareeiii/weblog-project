const { Router } = require("express");

const blogController = require("../controllers/blogController");

const router = new Router();

//  @desc   Weblog Index Page
//  @route  GET /
router.get("/", blogController.getIndex);

//  @desc   Weblog post Page
//  @route  GET /post/:id
router.get("/", blogController.getSinglePost);

module.exports = router;
