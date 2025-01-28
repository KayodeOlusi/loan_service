import http from "http";
import app from "./src/api/app";
import * as EmailTransport from "./src/lib/transports/email";

const PORT = process.env.PORT || 8000;

EmailTransport.testEmailConnection(EmailTransport.transporter);
http
  .createServer(app)
  .listen(PORT, () => {
    console.log("Server connection has been established successfully.", PORT);
  });

