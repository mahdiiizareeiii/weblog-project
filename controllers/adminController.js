const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Blog = require("../models/blog");
const { fileFilter } = require("../utils/multer");


exports.editPost = async (req, res) => {
    const errorArr = [];
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;
    const post = await Blog.findOne({_id: req.params.id});
    try {
        if(thumbnail.name) 
            await Blog.postValidation({... req.body, thumbnail});
        else
            await Blog.postValidation({... req.body, thumbnail: {name: "placeholder", size:0, mimetype: "image/jpeg"}});
        await Blog.postValidation(req.body);

        if(!post){
            return res.redirect("/404");
        }

        if(post.user.toString() != req.user._id){
            return res.redirect("/dashboard");
        }else{

            if(thumbnail.name){
                fs.unlink(`${appRoot}/public/uploads/thumbnails/${post.thumbnail}`, async (err) => {
                    if(err) console.log(err);
                    else {
                        await sharp(thumbnail.data)
                        .jpeg({quality: 60})
                        .toFile(uploadPath)
                        .catch((err) => console.log(err));
                    }
                });
            }


            const {title, status, body} = req.body;
            post.title = title;
            post.status = status;
            post.body = body;
            post.thumbnail = thumbnail.name ? fileName : post.thumbnail;
            await post.save();
            return res.redirect("/dashboard");

        }
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errorArr.push({
                name: e.path,
                message: e.message,
            });
        });
    res.render("private/editPost", {
        pageTitle: "بخش مدیریت | ویرایش پست",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname,
        errors: errorArr,
        post,
    });
}
}

exports.deletePost = async (req, res) => {
    try {
        const result = await Blog.findByIdAndRemove(req.params.id);
        console.log(result);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        get500(req ,res);
    }

};  

exports.createPost = async (req, res, next) => {
    const thumbnail = req.files ? req.files.thumbnail : {};
    const fileName = `${shortId.generate()}_${thumbnail.name}`;
    const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

    try {
        req.body = { ...req.body, thumbnail};

    

        await Blog.postValidation(req.body);

        await sharp(thumbnail.data)
            .jpeg({quality: 60})
            .toFile(uploadPath)
            .catch((err) => console.log(err));
        await Blog.created({ ... req.body, user: req.userId, thumbnail: fileName});
        res.status(201).json({message: "پست جدید با موفقیت ساخته شد"}); 
    } catch (err) {
        next(err);
    }        
    };

    exports.uploadImage = (req, res) => {

        const upload = multer({
            limits: {fileSize: 4000000},
            // dest: "uploads/",
            // storage: storage,
            fileFilter: fileFilter
        }).single("image");
        // req.file

        upload(req, res, async err => {
            if (err) {
                if(err.code === "LIMIT_FILE_SIZE"){
                    return res.status(400).send("حجم عکس باید بیشتز از 4 مگابایت نباشد");
                }
                res.status(400).send(err);
            } else {
                if(req.files){
                    const fileName = `${shortId.generate()}_${req.files.name}`;
                    await sharp(req.files.image.date).jpeg({
                        quality: 60
                    }).toFile(`./public/uploads/${fileName}`).catch(err => console.log(err));
                    res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
                } else{
                    res.send("جهت آپلود عکس باید عکسی انتخاب کنید");
                }
            }
        });
    };

