/**
 * [ecvCombobox]
 * Cria o combobox.
 * Raphael Brandão - 24/01/2017
 */
angular.module('financeiro').directive('ecvCombobox', ['$http', function($http){
	return {
		restrict: 'E',
		scope: {
			desabilitado: '@?',
			obrigatorio: '@?',
			referencia: '@',
			alias: '@',
			modelo: '=',
			ajax: '@?',
			opcoes: '=?',
			descricao: '@?'
		},
		transclude: true,
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-combobox.html'),
		link: function(scope, elem){
			var carregado = false;
			
			scope.$watch(function(){ return scope.modelo; }, function(n){
				if(n){
					scope.opcoes.forEach(function(opcao){
						if(n[scope.descricao] === opcao[scope.descricao] && n !== opcao) scope.modelo = opcao;
					});
				}
			});

			if(!scope.ajax || carregado) return;
			$http.get(GetRESTEndpoint(scope.ajax)).then(function(resp){
				if(resp.data.Retorno){
					carregado = true;
					scope.opcoes = resp.data.Retorno;
				}
			});
		}
	}
}]);