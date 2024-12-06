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

        if (user) {
          res.writeHead(200, { "content-type": "application/json" });
          res.write(JSON.stringify(user));
          res.end();
        } else {
          res.writeHead(404, { "content-type": "text/plain" });
          res.write("User not found");
          res.end();
        }
      });
  } else if (req.url.includes("?") && req.method === "GET") {
    const searchIndex = req.url.indexOf("?");
    const queryParam = req.url.slice(searchIndex + 1).split("=")[1];
    fs.promises.readFile(myWay("users.json"), "utf-8").then((data) => {
      const users = JSON.parse(data);
      const newUsers = users.filter((u) =>
        u.name.toLowerCase().includes(queryParam.toLowerCase())
      );
      if (newUsers.length) {
        res.writeHead(200, { "content-type": "application/json" });
        res.write(JSON.stringify(newUsers));
        res.end();
      } else {
        res.writeHead(404, { "content-type": "text/plain" });
        res.write("There is nor users by searching param");
        res.end();
      }
    });
  }
});

server.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log("server is running on 3000");
});
