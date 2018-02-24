/**
 * [ecvMenuItem]
 * Diretiva para controlar os itens dentro do menu gerenciado por [ecvMenuLateral].
 * Raphael Brandão - 31/12/2016
 */
angular.module('financeiro').directive('ecvMenuItem', ['$state', function($state){
	return {
		restrict: 'E',
		scope: {
			debug: '=',
			item: '=',
			pai: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/menu/ecv-menu-item.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.$state = $state;
			// Cores padrões do menu
			scope.cores = { menu: {}, form: {} };
			scope.cores.menu.fundo = 'grey-200';
			scope.cores.menu.cor = 'grey-A200';
			scope.cores.form.fundo = 'grey-A100';
			scope.cores.form.cor = 'grey-A200';
			// Cores do menu selecionado
			scope.cores.menu.fundoA = 'accent';
			scope.cores.menu.corA = 'grey-A100';
			scope.cores.form.fundoA = 'accent';
			scope.cores.form.corA = 'grey-A100';			
		}	
	}
}]);