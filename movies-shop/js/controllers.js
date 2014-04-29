/* Controllers */

var moviesControllers = angular.module('moviesControllers', ['ngRoute','ng-Shop']);

moviesControllers.controller("homeController", function($scope, $shop, $http)
{	

	// Default layout of the app. Clicking the buttons in the toolbar
	// changes this value.

	$scope.layout = 'grid';

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
			movieObj.qty = parseInt(movie.total || 1,10);
			$shop.add(movieObj);
		} else {
			alert("Este producto se encuentra agotado.");
		}
	}

	/**
	* @desc - elimina un movie del carrito por su id
	*/
	$scope.remove = function(id)
	{
		if($shop.remove(id))
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
		$shop.destroy();
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
	$http.get('/movies')
		.success(function(data) {
			$scope.moviesTienda = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
});


moviesControllers.controller("insertController", function($scope, $shop, $http)
{	
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
		movieObj.categoria = $scope.formData.categoria;
		movieObj.descripcion = $scope.formData.descripcion;
		movieObj.precio = $scope.formData.precio;			
		movieObj.imagen = $scope.formData.imagen;
		movieObj.stock = $scope.formData.stock;
		//$shop.add(movieObj);
		
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
	$scope.remove = function(id)
	{
		if($shop.remove(id))
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
	
});

moviesControllers.controller("payController", function($scope, $shop, $http)
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
		if($shop.remove(id))
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
		$shop.destroy();
	}
	
	/**
	* @desc - formulario de paypal preparado para printar
	*/
	$scope.paypalData = function()
	{
		$shop.dataPayPal(userDataPayPal());
	}

	/**
	* @desc - añade x cantidad de un movie al carrito
	* @return - object - si es nueva inserción devuelve insert, en otro caso update
	*/
	$scope.payProducts = function()
	{
		var movieObj = $shop.refreshStock();
		
		//$scope.moviesTienda
		var i, len;
		for (i = 0, len = movieObj.length; i < len; i++) 
		{
			$http.put('/movie/stock/'+movieObj[i].id, movieObj[i])
					.success(function(data) {
						$scope.formData = {};
						//$scope.todos = data;
						console.log(data);
					})
					.error(function(data) {
						console.log('Error:' + data);
					});
		}
	}

});


moviesControllers.controller("movieDetailController", function($scope, $shop, $http, $routeParams){
	$scope.id = $routeParams.id;
	
	$http.get('/movie/'+$scope.id)
		.success(function(data) {
			$scope.movie = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
});