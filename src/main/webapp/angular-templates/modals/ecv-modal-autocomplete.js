/**
 * [ecvModalAutocomplete]
 * Controler para o modal de busca com autocomplete.
 * Gustavo Domingueti - 16/12/2016
 */
angular.module('financeiro').controller('ecvModalAutocomplete', ['$scope', 'componente', 'fn', '$http', 
	function($scope, componente, fn, $http){
		$scope.componente = componente;
		$scope.fn = fn;
		//busca assíncrona
		$scope.querySearch = function(componente, query){
			if(componente.detalhamento.caracteresMinimos && componente.detalhamento.caracteresMinimos > query.length) return;
			return $http.get(GetRESTEndpoint(componente.detalhamento.opcoes) + "&query='%25" + query + "%25'").then(function(resp){
				if(resp.data.Retorno)
					return resp.data.Retorno;
			});
		};	
}]);