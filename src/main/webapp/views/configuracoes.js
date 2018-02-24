/**
 * [configuracoes]
 * Controler para gerir a UI-Router configuracoes.
 */
angular.module('financeiro').controller('configuracoes', ['$scope', '$ecv', 
	function($scope, $ecv){
	$scope.config = {};
	$scope.config = $ecv.config;
	$scope.flags = [
		{
			id: 1601,
			bandeira : 'flag-icon-br',
			titulo: 'Português brasileiro'
		},
		{
			id: 1603,
			bandeira : 'flag-icon-us',
			titulo: 'Inglês'
		},
		{
			id: 1602,
			bandeira : 'flag-icon-es',
			titulo: 'Espanhol'
		}
	];
	$ecv.menu.html.carregado = true;
	$scope.toggleMenu = $ecv.menu.fn.toggle;
}]);
