// utils/mailer.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465, // use 587 if not using SSL
  secure: true,
  auth: {
    user: "admin@developeroneview.com",
    pass: "#y6DnQ+[d",
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendSignupEmail = async (toEmail, subject, text) => {
  const mailOptions = {
    from: "admin@developeroneview.com",
    to: toEmail,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail options :", mailOptions);
  } catch (error) {
    console.log("Mail options on error:", mailOptions);
    console.error("Email send failed:", error);
  }
};

module.exports = { sendSignupEmail };
