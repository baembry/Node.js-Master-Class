//requirements from built-in modules
const http = require("http");
const url = require("url"); //use to get url and parse it
const StringDecoder = require("string_decoder").StringDecoder;
const config = require('./config');
console.log(config);

//create server
const server = http.createServer(function(req, res) {
  //the callback function is called whenever the server is called

  //get url and parse it    true tells url to use querystring parser
  const parsedUrl = url.parse(req.url, true);
  console.log('parsedUrl: ', parsedUrl)
  //get path from url
  const path = parsedUrl.pathname;
  console.log('path: ', path)
  //trim slashes
  const trimmedPath = path.replace(/\/+|\/+$/g, "");
  console.log('trimmedPath: ', trimmedPath)
  //get query string as an object
  const queryStringObject = parsedUrl.query;

  //get http method
  const method = req.method.toLowerCase();

  //get headers as object
  const headers = req.headers;

  //get payload; requires string_decoder, built in Node lib
  const decoder = new StringDecoder("utf-8");

  //buffer will store request payload as a string (this is the same as req.body with express)
  var buffer = "";

  req.on("data", function(data) {
    buffer += decoder.write(data);
  });
  //this gets called after every request
  req.on("end", function() {
    buffer += decoder.end();

    //select appropriate handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    console.log('trimmed path: ', router[trimmedPath]);
    //construct data object to send to handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    //route request to handler specified in router
    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //set default payload to empty object
      payload = typeof payload == "object" ? payload : {};

      const payloadString = JSON.stringify(payload);
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning response: ", statusCode, payloadString);
    });
  });
});

//start server, listen on port 3000
server.listen(config.port, function() {
  console.log("The server is listening on port " + config.port + " in environment " + config.envName);
});

//define route handlers
const handlers = {};

handlers.notFound = function(data, callback) {
  callback(404);
};

handlers.ping = function(data, callback){
  callback(200)
}

handlers.hello = function(data, callback){
  console.log(data)
  if(data.method === 'post'){
    callback(200, {message: "Hello back"})
  } else {
    callback(200)
  }
}
//define request router
const router = {
  ping: handlers.ping,
  hello: handlers.hello
};
