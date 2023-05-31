const Yup = require("yup");
const captchapng = require("captchapng");
const Blog = require("../models/blog");
const { sendEmail } = require("../utils/mailer");

let CAPTCHA_NUM;

exports.getIndex = async (req,res) => {
    try {
        const numberOfPosts = await Blog.find({
            status: "public",
        }).countDocuments();

        const posts = await Blog.find({status : "public"}).sort({ createdAt: "desc",
        })
        if(!posts){
            const error = new Error("هیچ پستی در پایگاه داده ثبت نشده است");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({posts, total:numberOfPosts});
    } catch (err) {
        next(err);
    }
}

exports.getSinglePost = async (req,res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id}).populate("user");
        if(!post){
            const error = new Error("پستی با این شناسه یافت نشد");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({post});
    } catch (err) {
        console.log(err);
        res.status(400).json({error:err});
    }
};



exports.handleContactPage = async (req, res, next) => {
    const {fullname, email, message} = req.body;

    const schema = Yup.object().shape({
        fullname: Yup.string()
            .reqiured("نام و نام خانوادگی الزامی است."),
        email : Yup.string().email("آدرس ایمیل صحیح نیست.").reqiured("آدرس ایمیل الزامی است."),
        message: Yup.string().reqiured("پیام اصلی الزامی می باشد."),
    });

    try {
        await schema.validate(req.body, {abortEarly: false});
    
    res.status(200).json({message: "پیام با موفقیت ارسال شد"});
       
        } catch (err) {
                next(error);
        }
};

exports.getCaptcha = (req, res) => {
    CAPTCHA_NUM = parseInt(Math.random() * 9000 * 1000);
    const p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(0,0,0,0);
    p.color(80,80,80,255);

};

