/**
 * [formulario]
 * Controler para gerir a UI-Router formulario.
 */
angular.module('financeiro').controller('formulario', ['$scope', '$state',
	function($scope, $state){
	
	$scope.idForm = $state.params["id_form"];
	$scope.tipoIdioma = $state.params["tipo_idioma"];
	$scope.banco = $state.params["banco"];
	
}]);