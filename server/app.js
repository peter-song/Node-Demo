var express = require('express');
var fs = require("fs");
var app = express();
//方法1：通过express.static访问静态文件，这里访问的是ajax.html
// app.use(express.static("./stone.html"));
//方法2：使用fs.readFile打开html文件
app.get('/', function (request, response) {
  fs.readFile('./stone.html' + request.path.substr(1), function (err, data) {
    if (err) {
      console.log(err); //404：NOT FOUND
      response.writeHead(404, {"Content-Type": "text/html"});
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(data.toString());
    }
    response.end();
  });
});
app.listen(4001, function () {
  //监听http://127.0.0.1:3000端口
  console.log("server start 4001");
});