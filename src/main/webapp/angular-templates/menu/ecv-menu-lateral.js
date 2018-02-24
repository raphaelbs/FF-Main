/**
 * [ecvMenuLateral]
 * Diretiva para controlar a hierarquia e disposição do menu lateral.
 * Raphael Brandão - 31/12/2016
 */
angular.module('financeiro').directive('ecvMenuLateral', ['$http', '$ecv',
	function($http, $ecv){
	return {
		restrict: 'E',
		scope: {
			debug: '=',
			data: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/menu/ecv-menu-lateral.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.$watch(function(){ return $ecv.config.tipo_idioma; }, function(bandeiraCod){
				switch(bandeiraCod){
				case 1602:
					scope.bandeira = 'flag-icon-es';
					break;
				case 1603:
					scope.bandeira = 'flag-icon-us';
					break;
				default:
					scope.bandeira = 'flag-icon-br';
					break;
				}
			});
			
			scope.menuCarregado = false;
			scope.erroAoCarregar = false;
			scope.menu = $ecv.menu;
			
			$http.get(GetRESTEndpoint('T9802'))
			.then(function(res){
				scope.menuCarregado = true;
				if(res.data.Resultado === 'ERRO') {
					scope.erroAoCarregar = true;
					return $ecv.toast.erro(res.data.Erro, 'Houve um erro ao buscar o menu');
				}
				if(res.data.Retorno){
					scope.items = res.data.Retorno;
				}
			}, function(err){
				scope.menuCarregado = true;
				scope.erroAoCarregar = true;
				$ecv.toast.erro(err.data, 'Houve um erro ao buscar o menu');
			});
		}
	}
}]);