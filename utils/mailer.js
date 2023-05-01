const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    host: "",
    port: 465,
    secure: true,
    auth: {
        user: "",
        pass: ""
    },
    tls: {
        rejectUnauthorized: false,
    }
})

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from: "",
        to: email,
        subject: subject,
        html: `<h1> سلام ${fullname} </h1>
            <p>${message}</p>`,
    })
}


// const transporter = nodeMailer.createTransport(transporterDetails);

// const options = {
//     from: "",
//     to: "",
//     subject: "Nodemailer Test",
//     text: "Simple Test of Nodemailer",
// }

// transporter.sendMail(options, (err, info) => {
//     if(err) return console.log(err);
//     console.log(info);
// })
