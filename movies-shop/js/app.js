//creamos el modulo y le inyectamos el modulo ngRoute y el modulo cart que hemos creado
var app = angular.module("app", ['ngRoute','ng-Shop','moviesControllers']);

//las rutas que vamos a utilizar para nuestro ejemplo
app.config(function($routeProvider)
{
	$routeProvider.when("/", {
		templateUrl : "home.html",
		controller : "homeController"
	})
	.when("/pay", {
		templateUrl : "pay.html",
		controller : "payController"
	})
	.when("/insert", {
		templateUrl : "insert.html",
		controller : "insertController"
	}).when("/movie/:id", {
		templateUrl : "views/_movie-detail.html",
		controller : "movieDetailController"
	})
	.otherwise({ redirectTo : "/" });
});

//funcion para crear un array y recorrerlo con ng-repeat

app.filter('range',function(){
	return function(input,total){
		total = parseInt(total);
		for (var i=1; i<=total; i++){
			input.push(i);
		}
		return input;
	};
});

