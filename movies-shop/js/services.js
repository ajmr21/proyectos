'use strict';

/**
 * ng-Shop v0.0.1 Israel Parra - modulo que cumple el proceso de compra con angularjs
 * @link - http://uno-de-piera.com/carrito-de-compras-angularjs
 */

var shop = angular.module('ng-Services', []);

//nuestra factoria se llamará $shop, inyectamos $rootScope
//devuleve un objeto con toda la funcionalidad que debe tener un carrito
shop.factory('$services', ['$rootScope','$http', function ($rootScope,$http)
{	
	/**
	* @var array con el contenido del carrito
	*/
	$rootScope.udpShopContent = [],
	/**
	* @var float con el precio total del carrito
	*/
	$rootScope.udpShopTotalPrice = 0,
	/**
	* @var integer con el número de artículos del carrito
	*/
	$rootScope.udpShopTotalProducts = 0;

	return{
		/**
		* @desc - comprueba los campos que introducimos al añadir movies
		*/
		minimRequeriments: function(movie)
		{
			if(!movie.titulo || !movie.categoria || !movie.precio)
			{
				throw new Error("Los campos titulo, categoria y precio son necesarios");
			}
			if(isNaN(movie.precio))
			{
				throw new Error("El campo precio debe ser númerico");
			}			
			if(this.isInteger(movie.precio) === false)
			{
				throw new Error("El precio debe ser un número entero");
			}
			if(this.checkExistsStock(movie,$rootScope.udpShopContent) === false)
			{
				throw new Error("No hay más stock de este producto");
			}
		},
		/**
		* @desc - comprueba si el número pasado es un entero
		* @return - bool
		*/
		isInteger: function(n) 
		{
		    if(n % 1 === 0)
		    	return true;
		    else
		    	return false;
		},
		/**
		* @desc - añade nuevos movies al carrito
		* @param - array con los datos del movie
		* @return - mixed
		*/
		add: function(movie)
		{
			try{
				//comprobamos si el movie cumple los requisitos
				this.minimRequeriments(movie);													
				
				//si el movie existe le actualizamos la cantidad
				if(this.checkExistsProduct(movie,$rootScope.udpShopContent) === true)
				{
					$rootScope.udpShopTotalPrice += parseFloat(movie.precio * movie.qty,10);
					$rootScope.udpShopTotalProducts += movie.qty;
					return {"msg":"updated"};
				}
				//en otro caso, lo añadimos al carrito
				else
				{
					$rootScope.udpShopTotalPrice += parseFloat(movie.precio * movie.qty,10);
					$rootScope.udpShopTotalProducts += movie.qty;
					$rootScope.udpShopContent.push(movie);
					return {"msg":"insert"};
				}
			}
			catch(error)
			{
				alert(error);
			}
		},
		/**
		* @desc - comprueba si el movie existe en el carrito
		* @param - movie - objecto con los datos del movie a añadir
		* @param - movies - array con el contenido del carrito
		* @return - bool
		*/
		checkExistsProduct: function(movie, movies) 
		{
		    var i, len;
		    for (i = 0, len = movies.length; i < len; i++) 
		    {
		        if (movies[i].id === movie.id) 
		        {	
					if ((movies[i].qty + 1) > movies[i].stock){
						return false
					}
		        	movies[i].qty += movie.qty;  
		            return true;
		        }
		    }
		    return false;
		},
		/**
		* @desc - comprueba si ha añadido más productos que el stock del producto
		* @param - movie - objecto con los datos del movie a añadir
		* @param - movies - array con el contenido del carrito
		* @return - bool
		*/
		checkExistsStock: function(movie, movies) 
		{
		    var i, len;
		    for (i = 0, len = movies.length; i < len; i++) 
		    {
		        if (movies[i].id === movie.id) 
		        {	
					if ((movies[i].qty + 1) > movies[i].stock){
						return false
					}		        	 
		            return true;
		        }
		    }
		    return true;
		},
		/**
		* @desc -elimina un movie completo por su id
		* @param - int - id del movie
		* @return - mixed
		*/
		remove: function(id)
		{
			try{
				var i, len;
				for (i = 0, len = $rootScope.udpShopContent.length; i < len; i++) 
			    {
			        if ($rootScope.udpShopContent[i].id === id) 
			        {
			        	$rootScope.udpShopTotalPrice -= parseFloat($rootScope.udpShopContent[i].price * $rootScope.udpShopContent[i].qty,10);
			        	$rootScope.udpShopTotalProducts -= $rootScope.udpShopContent[i].qty;
			        	$rootScope.udpShopContent.splice(i, 1);
			        	if(isNaN($rootScope.udpShopTotalPrice))
			        	{
			        		$rootScope.udpShopTotalPrice = 0;
			        	}
			        	return {"msg":"deleted"};
			        }
			    }
			}
			catch(error)
			{
				alert("Error " + error);
			}
		},
		/**
		* @desc - elimina todo el contenido del carrito, precio total y movies
		* @return - bool
		*/
		destroy: function()
		{
			try{
				$rootScope.udpShopContent = [];
				$rootScope.udpShopTotalPrice = 0;
				$rootScope.udpShopTotalProducts = 0;
			}
			catch(error)
			{
				alert("Error " + error);
			}
		},
		/**
		* @desc - elimina todo el contenido del carrito, precio total y movies
		* @return - bool
		*/
		refreshStock: function()
		{
			try{
				/*var i, len;
				for (i = 0, len = $rootScope.udpShopContent.length; i < len; i++) 
			    {
					alert($rootScope.udpShopContent[i].titulo);
				}*/
				
				return $rootScope.udpShopContent;
			}
			catch(error)
			{
				alert("Error " + error);
			}
		},
		/**
		* @desc - prepara el formulario hacía paypal con el contenido del carrito y los datos
		* que ha establecido el usuario previamente
		* @param - userData - datos de la tienda para el formulario de paypal
		*/
		dataPayPal: function(userData)
		{
			var htmlForm = "";
			for (var i = 0, len = $rootScope.udpShopContent.length; i < len; i++) 
			{
			    var movie = $rootScope.udpShopContent[i];
			    var currentProduct = i + 1;
			    htmlForm += "<input type='hidden' name='item_number_"+currentProduct+"' value="+movie.id+" />";
			    htmlForm += "<input type='hidden' name='item_name_"+currentProduct+"' value='"+movie.titulo+"' />";
			    htmlForm += "<input type='hidden' name='quantity_"+currentProduct+"' value="+movie.qty+" />";
			    htmlForm += "<input type='hidden' name='amount_"+currentProduct+"' value="+movie.precio.toFixed(2)+" />";
			}

			htmlForm += "<input type='hidden' name='cmd' value='"+userData.cmd+"' />";
			htmlForm += "<input type='hidden' name='upload' value='"+userData.upload+"' />";
			htmlForm += "<input type='hidden' name='business' value='"+userData.business+"' />";
			htmlForm += "<input type='hidden' name='cancel_return' value='"+userData.cancelUrl+"' />";
			htmlForm += "<input type='hidden' name='cbt' value='"+userData.msgReturn+"' />";
			htmlForm += "<input type='hidden' name='return' value='"+userData.successUrl+"' />";
			htmlForm += "<input type='hidden' name='rm' value="+userData.rm+ " />";
			htmlForm += "<input type='hidden' name='lc' value='"+userData.lc+"' />";
			htmlForm += "<input type='hidden' name='currency_code' value='"+userData.currencyCode+"' />";
			htmlForm += "<input type='hidden' name='cbt' value='"+userData.cbt+"' />";
			htmlForm += "<input type='image' src='https://www.paypal.com/es_ES/i/btn/btn_buynow_SM.gif' border='0' name='submit' ng-click='payProducts()' />";
        	htmlForm += "<img border='0' src='https://www.paypal.com/es_ES/i/scr/pixel.gif' width='1' height='1' />";
			//htmlForm += "<a ng-click='payProducts()'>Ir a payPall</a>";

			$(userData.formClass).html("").append(htmlForm);
		},
		/**
		* @desc - obtiene el listado de los registros en BdD
		* @return - Array
		*/
		getMoviesList: function(){			
			var promise = $http.get('/movies')
								.success(function(data) {								
								console.log("Listado "+data);
								})
								.error(function(data) {
									console.log('Error: ' + data);
								});					
			return promise;
		},
		/**
		* @desc - obtiene el listado de los registros en BdD
		* @return - Array
		*/
		getMovieDetail: function(movieId){			
			var promise = $http.get('/movie/'+movieId)
								.success(function(data) {
									console.log("Detalle "+data)
								})
								.error(function(data) {
									console.log('Error: ' + data);
								});					
			return promise;
		},
		/**
		* @desc - obtiene el listado de las categorias de BdD
		* @return - Array
		*/
		getCategoriesList: function(){			
			var promise = $http.get('/categories')
								.success(function(data) {								
								console.log("Listado "+data);
								})
								.error(function(data) {
									console.log('Error: ' + data);
								});					
			return promise;
		}
	};
}]);