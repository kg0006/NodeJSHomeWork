const http = require("http");
const fs = require("fs");
const path = require("path");

function myWay(...args) {
  return path.join(__dirname, args.join(",").replaceAll(",", "/"));
}

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    fs.promises.readFile(myWay("main.html"), "utf-8").then((data) => {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/users" && req.method === "GET") {
    fs.promises.readFile(myWay("users.json"), "utf-8").then((data) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.write(data);
      res.end();
    });
  } else if (req.url.match(/\/users\/([0-9]+)/) && req.method === "GET") {
    fs.promises
      .readFile(myWay("users.json"), "utf-8")
      .then((data) => JSON.parse(data))
      .then((data) => {
        let url = req.url.split("/");
        let user = data.find((el) => el.id === +url[url.length - 1]);

        console.log(user);

        if (user) {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(user));
        } else {
          res.writeHead(404, { "content-type": "text/plain" });
          res.end("User not found");
        }
      });
  }
});

server.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log("server is running on 3000");
});
