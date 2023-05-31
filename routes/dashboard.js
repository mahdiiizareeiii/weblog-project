const { Router } = require("express");
const {authenticated} = require("../middlewares/auth");
const adminController = require("../controllers/adminController");
const router = new Router();

//  @desc   delete post
//  @route  GET /dashboard/delete-post
router.delete("/delete-post/:id", authenticated, adminController.deletePost);

//  @desc   dashboard handle post creation
//  @route  POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//  @desc   dashboard handle post edit
//  @route  POST /dashboard/edit-post
router.put("/edit-post/:id", authenticated, adminController.editPost);

//  @desc   dashboard handle Image upload
//  @route  POST /dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);


module.exports = router;
