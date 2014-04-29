var express  = require("express"),
    app      = express(),
    http     = require("http"),
    server   = http.createServer(app),
    mongoose = require('mongoose'); 

app.configure(function () {
  app.use(express.static(__dirname));		// Localización de los ficheros estáticos
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

/*app.get('/', function(req, res) {
  res.send("Hello world!");
});*/

routes = require('./routes/moviesRoute')(app);

//http://127.0.0.1:28017/local/productos/
mongoose.connect('mongodb://localhost/movies', function(err, res) {
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  } else {
    console.log('Connected to Database');
  }
});
/*
server.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});*/

app.get('/', function(req, res) {						// Carga una vista HTML simple donde irá nuesta Single App Page
	res.sendfile('./index.html');				// Angular Manejará el Frontend
});

// Escucha en el puerto 8080 y corre el server
app.listen(8080, function() {
    console.log('App listening on port 8080');
});
