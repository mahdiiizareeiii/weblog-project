// const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

exports.login = (req, res) => {
    res.render("login", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error"),
    });
};

exports.handleLogin = async (req, res, next) => {
    // console.log(req.body["g-recaptcha-response"]);
    if(!req.body["g-recaptcha-response"]){
        req.flash("error", "اعتبارسنجی captcha الزامی میباشد.");
        return res.redirect("/users/login");
    }

    const secretkey = process.env.GOOGLE_SECRET;
    const verifyurl = `https://google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${req.body}["g-recaptcha-response]
    &remoteip=${req.connection.remoteAddress}`;

    const response = await fetch(verifyurl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded: charset-utf-8"
        }
    });

    const json = await response.json();
    console.log(json);

    if(json.success){
        passport.authenticate("local", {
            // successRedirect: "/dashboard",
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);
    } else {
        req.flash("error", "مشکلی در اعتبارسنجی captcha هست");
        res.redirect("/users/login");
    }
        
};


exports.rememberMe = (req, res) => {
    if(req.body.remember){
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect("/dashboard");
};

exports.logout = (req, res) => {
    req.session = null;
    req.logout();
    // req.flash("success_mg", "خروج موفقیت امیز بود");
    res.redirect("/users/login");
};

exports.register = (req, res) => {
    res.render("register", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register",
    });
};

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            errors.push({ message: "کاربری با این ایمیل موجود است" });
            return res.render("register", {
                pageTitle: "ثبت نام کاربر",
                path: "/register",
                errors,
            });
        }

        // const hash = await bcrypt.hash(password, 10);
        // await User.create({ fullname, email, password });
        req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });

        return res.render("register", {
            pageTitle: "ثبت نام کاربر",
            path: "/register",
            errors,
        });
    }
};