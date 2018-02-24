/**
 * [ecvModalFormDetail]
 * Controller responsável por gerenciar o modal que carrega as 
 * especialidades dos detalhes.
 */
angular.module('financeiro').controller('ecvModalFormDetail', ['$scope', '$mdDialog', '$data', '$http',
    function($scope, $mdDialog, $data){
	
	$scope.data = $data;
}]);