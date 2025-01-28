import http from "http";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Hello, World!</h1>");
  }
});
server.listen(3000, () => console.log("Server running"));