const mongoose = require("mongoose");
const {Schema} = require("./secure/postValidation");
const e = require("connect-flash");
const { error } = require("winston");
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "public",
        enum: ["private", "public"]
    },
    thumbnail: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

blogSchema.index({ title: "text" });

blogSchema.statics.postValidation = function (body) {
    return schema.validate(body, {abortEarly: false});
}

module.exports = mongoose.model("Blog", blogSchema);