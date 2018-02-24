/**
 * [principal]
 * Controler para gerir a UI-Router principal.
 */
angular.module('financeiro').controller('principal', ['$scope', '$ecv', 
	function($scope, $ecv){
	$ecv.menu.html.carregado = true;
	$scope.toggleMenu = $ecv.menu.fn.toggle;
}]);