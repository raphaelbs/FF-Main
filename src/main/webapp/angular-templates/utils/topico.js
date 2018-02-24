/** [topico]
 *	Diretiva para alterar o estilo do texto separador de tópico.
*/
angular.module('financeiro').directive('topico', [function() {
	return {
		restrict: 'E',
		transclude : {
	        'titulo': 'topicoTitulo',
	        'botoes': '?topicoBotoes',
	        'conteudo': 'topicoConteudo'
	    },
		replace: true,
		templateUrl: GetDOMINIOEndpoint('angular-templates/utils/topico.html')
	};
}]);