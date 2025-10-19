import Logger from "../logger";
import nodemailer, { Transporter } from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_AUTH_EMAIL,
    pass: process.env.NODE_MAILER_AUTH_PASSWORD
  }
});

function testEmailConnection(connection: Transporter) {
  connection.verify(function (err, success) {
    if (err) return Logger.error(err.message, err);
    Logger.info("Email service running...");
  });
}

export {
  transporter,
  testEmailConnection
}
