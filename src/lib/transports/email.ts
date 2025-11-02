import Logger from "../logger";
import nodemailer, { Transporter } from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.NODE_MAILER_AUTH_EMAIL,
    pass: process.env.NODE_MAILER_AUTH_PASSWORD
  },
  debug: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
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
