/**
 * [ecvAutocomplete801]
 * Diretiva para controle do autocomplete de busca e cadastro da t801.
 * Raphael Brandão - 26/01/2017
 */
angular.module('financeiro').directive('ecvHtmlAutocomplete', ['$mdDialog', function($mdDialog){
	return {
		restrict: 'E',	
		scope: {
			desabilitado: '@?',
			obrigatorio: '@?',
			referencia: '@',
			alias: '@',
			inputAlias: '@',
			modelo: '=',
			opcoes: '@?',
			caracteresMinimos: '@?'
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-html-autocomplete.html'),
		link: function(scope, elem){			
			scope.modalMdAutocomplete = function(ev){
				$mdDialog.show({
					templateUrl: GetDOMINIOEndpoint('angular-templates/modals/ecv-modal-html-autocomplete.html'),
					controller: 'ecvModalHtmlAutocomplete',
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					locals: {
						componente: scope,
						fn: {
							close:  function() {
								$mdDialog.cancel();
							}
						}
					}
				});
			};
						
		}
	};
}]);