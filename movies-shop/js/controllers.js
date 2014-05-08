/* Controllers */

var moviesControllers = angular.module('moviesControllers', ['ngRoute','ng-Services']);

moviesControllers.controller("homeController", function($scope, $services, $http)
{	

	// Default layout of the app. Clicking the buttons in the toolbar
	// changes this value.
	$scope.layout = 'grid';
	$scope.showDetail = 'false';
	/**
	* @desc - añade x cantidad de un movie al carrito
	* @return - object - si es nueva inserción devuelve insert, en otro caso update
	*/
	$scope.add = function(movie)
	{
		//alert(movie.total); return;
		
		if (movie.stock > 0){
			var movieObj = {};
			movieObj.id = movie._id;
			movieObj.titulo = movie.titulo;
			movieObj.director = movie.director;
			movieObj.categoria = movie.categoria;
			movieObj.descripcion = movie.descripcion;
			movieObj.precio = parseInt(movie.precio);
			movieObj.stock = parseInt(movie.stock);
			movieObj.qty = parseInt(movie.total || 1,10);
			$services.add(movieObj);
		} else {
			alert("Este producto se encuentra agotado.");
		}
	}

	/**
	* @desc - elimina un movie del carrito por su id
	*/
	$scope.remove = function(id)
	{
		if($services.remove(id))
		{
			alert("Producto eliminado correctamente");
			return;
		}
		else
		{
			alert("Ha ocurrido un error eliminando el movie, seguramente porqué no existe");
			return;
		}
	}
	
	/**
	* @desc - elimina el contenido del carrito
	*/
	$scope.destroy = function()
	{
		$services.destroy();
	}

	/**
	* @desc - redondea el precio que le pasemos con dos decimales
	*/
	$scope.roundCurrency = function(total)
	{
		return total.toFixed(2);
	}

	

	/**
	* @desc - array de objetos con movies para el ejemplo
	*/
	/*$scope.moviesTienda = 
	[
	{"id": 1, "category": "Detalles", "name": "Campanas", "price": 0.9, "picture": "imgs/campanas.jpg"},
	{"id": 2, "category": "Detalles", "name": "Carrito", "price": 1, "picture": "imgs/carrito.jpg"},
	{"id": 3, "category": "Detalles", "name": "Carrito con chupetes", "price": 1.2, "picture": "imgs/carrito_chupetes.jpg"},
	{"id": 4, "category": "Detalles", "name": "Cesta", "price": 1.6, "picture": "imgs/cesta.jpg"},
	{"id": 5, "category": "Detalles", "name": "Mini cesta", "price": 2, "picture": "imgs/cestita.jpg"},
	{"id": 6, "category": "Detalles", "name": "Enfermera", "price": 3, "picture": "imgs/enfermera.jpg"},
	{"id": 7, "category": "Detalles", "name": "Gatitos", "price": 2.5, "picture": "imgs/gatitos.jpg"},
	{"id": 8, "category": "Detalles", "name": "Perritos", "price": 2.5, "picture": "imgs/perritos.jpg"},
	{"id": 9, "category": "Detalles", "name": "Profesoras", "price": 2.5, "picture": "imgs/profesora.jpg"},
	{"id": 10, "category": "Detalles", "name": "Vestido", "price": 1.8, "picture": "imgs/vestido.jpg"},
	{"id": 11, "category": "Detalles", "name": "Otros", "price": 0.5, "picture": "imgs/otros.jpg"}
	];*/
	
	// Cuando se cargue la página, pide del API todos los registros
	//{"titulo": "titulo", "director": "director", "categoria": "categoria", "precio": 1, "picture": "imgs/otros.jpg"}
		
	//TODO: Ver si es la mejor forma de hacerlo porque se recomienda que las llamadas al servidor con $http estén en los servicios
	//y no en los controladores. En el servicio debemos devolver la promesa porque al ser asincrono no podemos asignar los datos
	//binding del modelo hasta que no tenemos respuesta.
	var promise = $services.getMoviesList();	
	promise.then(function(obj){
			$scope.moviesTienda = obj.data;
	});
	
	// movido a services.js
	/*$http.get('/movies')
		.success(function(data) {
			$scope.moviesTienda = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});*/
});


moviesControllers.controller("insertController", function($scope, $services, $http)
{	
//TODO: Ver si es la mejor forma de hacerlo porque se recomienda que las llamadas al servidor con $http estén en los servicios
	//y no en los controladores. En el servicio debemos devolver la promesa porque al ser asincrono no podemos asignar los datos
	//binding del modelo hasta que no tenemos respuesta.
	var promise = $services.getCategoriesList();	
	promise.then(function(obj){
			$scope.categoriesList = obj.data;
	});
	
	/**
	* @desc - añade x cantidad de un movie al carrito
	* @return - object - si es nueva inserción devuelve insert, en otro caso update
	*/
	$scope.add = function()
	{
		//alert(movie.total); return;
		var movieObj = {};
		movieObj.titulo = $scope.formData.titulo;		
		movieObj.director = $scope.formData.director;
		movieObj.categoria = $scope.formData.categoria.category;
		movieObj.descripcion = $scope.formData.descripcion;
		movieObj.precio = $scope.formData.precio;			
		movieObj.imagen = $scope.formData.imagen;
		movieObj.stock = $scope.formData.stock;
		//$services.add(movieObj);
		
		$http.post('/movie', movieObj)
					.success(function(data) {
						$scope.formData = {};
						//$scope.todos = data;
						console.log(data);
					})
					.error(function(data) {
						console.log('Error:' + data);
					});
	}

	/**
	* @desc - elimina un movie del carrito por su id
	*/
	/*$scope.remove = function(id)
	{
		if($services.remove(id))
		{
			alert("Producto eliminado correctamente");
			return;
		}
		else
		{
			alert("Ha ocurrido un error eliminando el movie, seguramente porqué no existe");
			return;
		}
	}*/
	
});

moviesControllers.controller("payController", function($scope, $services, $http)
{	
	
	/**
	* @desc - establecemos los datos para el formulario de paypal
	* @return - object
	*/
	function userDataPayPal()
	{
		var userData = {};
		userData.cmd = "_cart";
		userData.upload = "1";
		userData.business = "correo_business_paypal";
		userData.currencyCode = "EUR";
		userData.lc = "EU";
		userData.rm = 2;
		//url retorno paypal lado server, envia data post
		userData.successUrl = "http://localhost/cartAngularServer/return.php";
		userData.cancelUrl = "http://localhost/cartAngular/#/";
		userData.cbt = "Volver a la tienda";
		userData.formClass = "#formPaypal";
		return userData;
	}
	
	/**
	* @desc - elimina un movie del carrito por su id
	*/
	$scope.remove = function(id)
	{
		if($services.remove(id))
		{
			alert("Producto eliminado correctamente");
			return;
		}
		else
		{
			alert("Ha ocurrido un error eliminando el movie, seguramente porqué no existe");
			return;
		}
	}
	
	/**
	* @desc - elimina el contenido del carrito
	*/
	$scope.destroy = function()
	{
		$services.destroy();
	}
	
	/**
	* @desc - redondea el precio que le pasemos con dos decimales
	*/
	$scope.roundCurrency = function(total)
	{
		return total.toFixed(2);
	}
	
	/**
	* @desc - formulario de paypal preparado para printar
	*/
	$scope.paypalData = function()
	{
		$services.dataPayPal(userDataPayPal());
	}

	/**
	* @desc - añade x cantidad de un movie al carrito
	* @return - object - si es nueva inserción devuelve insert, en otro caso update
	*/
	$scope.payProducts = function()
	{
		var movieObj = $services.refreshStock();
		
		//$scope.moviesTienda
		var i, len;
		var promise;
		for (i = 0, len = movieObj.length; i < len; i++) 
		{
			promise = $http.put('/movie/stock/'+movieObj[i].id, movieObj[i])
					.success(function(data) {
						$scope.formData = {};
						//$scope.todos = data;
						console.log(data);
						if (data.error){
							alert("Lo sentimos no hay stock de este producto: "+data.titulo);
						}
						
					})
					.error(function(data) {
						console.log('Error:' + data);
					});
					
			//chequeamos la promesa que nos devuelve el servidor
			promise.then(function(obj) {			
			  $scope.data = obj.data;
			});
			
			promise.catch(function(err) {			
			  alert("Lo sentimos no hay stock de este producto: "+movieObj.titulo);
			});
		}
	}

});


moviesControllers.controller("movieDetailController", function($scope, $services, $http, $routeParams){
	$scope.showDetail = 'true';

	$scope.id = $routeParams.id;
	
	//TODO: Ver si es la mejor forma de hacerlo porque se recomienda que las llamadas al servidor con $http estén en los servicios
	//y no en los controladores. En el servicio debemos devolver la promesa porque al ser asincrono no podemos asignar los datos
	//binding del modelo hasta que no tenemos respuesta.
	var promise = $services.getMovieDetail($scope.id);	
	promise.then(function(obj){
			$scope.movie = obj.data;
	});
	
	// movido a services.js
	/*
	$http.get('/movie/'+$scope.id)
		.success(function(data) {
			$scope.movie = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		*/
});