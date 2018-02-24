/**
 * [ecvModalAutocomplete801]
 * Controler para o modal de busca com autocomplete da tabela t801.
 * Raphael Brandão - 26/01/2017
 */
angular.module('financeiro').controller('ecvModalHtmlAutocomplete', ['$scope', 'componente', 'fn', '$http', 
	function($scope, componente, fn, $http){
		$scope.componente = componente;
		$scope.fn = fn;
		//busca assíncrona
		$scope.querySearch = function(componente, query){
			if(!componente.opcoes) return;
			if(componente.caracteresMinimos && componente.caracteresMinimos > query.length) return;
			return $http.get(GetRESTEndpoint(componente.opcoes) + "&query='%25" + query + "%25'").then(function(resp){
				if(resp.data.Retorno)
					return resp.data.Retorno;
			});
		};	
}]);