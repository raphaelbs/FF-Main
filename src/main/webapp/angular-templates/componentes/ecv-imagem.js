/**
 * [ecvImagem]
 * Diretiva responsável por criar o componente imagem.
 */
angular.module('financeiro').directive('ecvImagem', ['$mdDialog', function($mdDialog){
	return {
		restrict: 'E',
		scope: {
			componente: '=',
			componentes: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-imagem.html'),
		link: function(scope, elem){
			elem.css('cursor', scope.componente.habilitado===false ? 'not-allowed' : 'pointer');
			
			for(var i = 0; i<scope.componentes.length; i++){
				var componente = scope.componentes[i];
				if(componente.ultimaReferencia === 'c2_5501'){
					scope.componenteLegenda = componente;
					break;
				}
			}
			
			scope.uploadImagem = function(ev){
				if(!scope.componente.habilitado) return true;
				$mdDialog.show({
					controller: 'ecvModalImagemUpload',
					templateUrl: GetDOMINIOEndpoint('angular-templates/modals/ecv-modal-imagem-upload.html'),
					parent: angular.element(document.body),
					targetEvent: ev,
					clickOutsideToClose:true,
					locals: {
						componente: scope.componente,
						componenteLegenda: scope.componenteLegenda,
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