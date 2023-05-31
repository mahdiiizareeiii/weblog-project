const path = require("path");
const fileUpload = require("express-fileupload");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const {errorHandler} = require("./middlewares/errors");
const { setHeaders } = require("./middlewares/headers");



//* Database connection
connectDB();

const app = express();



//* BodyPaser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(setHeaders);

//* file upload middleware
app.use(fileUpload());

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//* Error Controller
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
