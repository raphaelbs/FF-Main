	/**
 * [ecvInputs]
 * Diretiva para controlar o tipo dos componentes e algumas de suas propriedades.
 * Raphael Brandão - 29/10/2016
 */
angular.module('financeiro').directive('ecvInputs', ['$http', function($http){
	var padraoFlex = 95;
	
	function print(msg, err){
		if(err) return console.error('[ecv-inputs] ' + msg);
		 return console.log('[ecv-inputs] ' + msg);
	}
	return {
		restrict: 'E',
		scope: {
			componentes: '=',
			debug: '=',
			data: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-inputs.html'),
		replace: true,
		link: function (scope, element, attrs) {
			scope.ehTipo = function(angularTipo, componente){
				//Switch de exclusão por componente.ultimaReferencia
				switch(componente.ultimaReferencia){
				case 'c2_5501':
					return false;
				}				
				
				//Switch de comparação com tipo
				switch(componente.tipo.toLowerCase()){ // Transforma em minusculo
				case undefined:
				case 'input text':
				case 'number':
				case 'password':
					if(angularTipo === 'input') return true;
					break;
				case 'combo box - incremental':
				case 'combo box':
					if(!componente.detalhamento && angularTipo === 'select-ajax') return true;
					if(angularTipo === 'select-array' && typeof componente.detalhamento.opcoes === 'object') return true;
					if(angularTipo === 'select-ajax' && typeof componente.detalhamento.opcoes === 'string') return true;
					break;
				case 'autocomplete':
					if(!componente.detalhamento && angularTipo === 'autocomplete-ajax') return true;
					if(angularTipo === 'autocomplete-array' && typeof componente.detalhamento.opcoes === 'object') return true;
					if(angularTipo === 'autocomplete-ajax' && typeof componente.detalhamento.opcoes === 'string') return true;
					break;
				case 'check box':
					if(angularTipo === 'checkbox') return true;
					break;
				case 'imagem - upload':
					if(angularTipo === 'imagem') return true;
					break;
				case 'textarea':
					if(angularTipo === 'textarea') return true;
					break;
				case 'grade de exibicao':
					if(angularTipo === 'gradeExibicao') return true;
					break;
				case 'grade de exibicao - detail':
					if(angularTipo === 'gradeExibicaoDetalhe') return true;
				}
				return false;
			};
						
			
			scope.tamanhoFlex = function(componente){
				if(!componente) return 100 - padraoFlex;
				return (componente.icone || componente.descricao) ? padraoFlex : 100;
			};

			scope.carregaSelectAsync = function(componente){
				if(componente.opcoesCarregadas) return;
				$http.get(GetRESTEndpoint(componente.detalhamento.opcoes)).then(function(resp){
					if(resp.data.Retorno)
						componente.detalhamento.opcoesCarregadas = resp.data.Retorno;
				});
			};
	    }
	};
}]);
