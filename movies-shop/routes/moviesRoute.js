//File: routes/movies.js
module.exports = function(app) {

  var Movie = require('../models/movie.js');

  //GET - Return all movies in the DB
  findAllMovies = function(req, res) {
  	Movie.find(function(err, movies) {
  		if(!err) {
        console.log('GET /movies')
  			res.send(movies);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Movie with specified ID
  findById = function(req, res) {
  	Movie.findById(req.params.id, function(err, movie) {
  		if(!err) {
        console.log('GET /movie/' + req.params.id);
  			res.send(movie);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Movie in the DB
  addMovie = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var movie = new Movie({  		
		titulo: req.body.titulo,
		categoria:  req.body.categoria,
		director:  req.body.director,
		descripcion:  req.body.descripcion,
		precio:   req.body.precio,
		imagen:  req.body.imagen  
  	});

  	movie.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.send(movie);
  };

  //PUT - Update a register already exists
  updateMovie = function(req, res) {
  	Movie.findById(req.params.id, function(err, movie) {
  		movie.stock   = req.body.stock;

  		movie.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(movie);
  		});
  	});
  }

  //DELETE - Delete a Movie with specified ID
  deleteMovie = function(req, res) {
  	Movie.findById(req.params.id, function(err, movie) {
  		movie.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  		})
  	});
  }
  
  //PUT - Update a register already exists
  updateStock = function(req, res) {
  	Movie.findById(req.params.id, function(err, movie) {
		
		if (movie.stock > 0){
			movie.stock -= parseInt(req.body.qty);
			movie.save(function(err) {
				if(!err) {
					console.log('Updated');
				} else {
					console.log('ERROR: ' + err);
				}
  			res.send(movie);
			});
		} else {			
			//throw new Error("Lo sentimos no hay stock de este producto");
			console.log("Lo sentimos no hay stock de este producto: "+req.body.titulo);
		}
		
  		
  	});
  }

  //Link routes and functions
  app.get('/movies', findAllMovies);
  app.get('/movie/:id', findById);
  app.post('/movie', addMovie);
  app.put('/movie/:id', updateMovie);
  app.put('/movie/stock/:id', updateStock);
  app.delete('/movie/:id', deleteMovie);

}