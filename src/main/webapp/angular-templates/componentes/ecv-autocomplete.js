/**
 * [ecvAutocomplete]
 * Diretiva para controle do autocomplete.
 * Gustavo Domingueti - 16/12/2016
 */
angular.module('financeiro').directive('ecvAutocomplete', ['$mdDialog', function($mdDialog){
	return {
		restrict: 'E',	
		scope: {
			componente: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-autocomplete.html'),
		link: function(scope, elem){
			
			 scope.modalMdAutocomplete = function(componente, ev){
					$mdDialog.show({
						multiple: true,
						templateUrl: GetDOMINIOEndpoint('angular-templates/modals/ecv-modal-autocomplete.html'),
						controller: 'ecvModalAutocomplete',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
						locals: {
							componente: scope.componente,
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