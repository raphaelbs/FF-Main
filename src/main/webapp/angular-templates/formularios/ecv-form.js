/**
 * [ecvForm]
 * Diretiva que controla a exibição dos formulários.
 */
angular.module('financeiro').directive('ecvForm', ['$http', '$mdSidenav', '$ecv',
	function($http, $mdSidenav, $ecv){
	
	return{
		restrict: 'E',
		scope: {
			idForm : '=',
			tipoIdioma : '=',
			banco : '=',
			modelo: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/formularios/ecv-form.html'),
		link: function(scope, elem){
			scope.carregando = 'Buscando formulário...';
			scope.error = {};
			
			var msg400 = 'Informe [idForm] buscar um formulário!';
			var idForm = scope.idForm,
				tipoIdioma = scope.tipoIdioma || $ecv.config['tipo_idioma'],
				banco = scope.banco || $ecv.config['banco'],
				queryParam = '?id_form=' + idForm
					+ '&tipo_idioma=' + tipoIdioma
					+ '&banco=' + banco;
			
			if(!idForm || !tipoIdioma || !banco) {
				delete scope.carregando;
				scope.carregarError = true;
				scope.error.e400 = msg400;
				return;
			}
			queryParam = queryParam.toLowerCase();
			
			function success(resp){
				// Deu errado
				if(resp.data.Resultado==='ERRO'){
					// Em caso de erro na resposta do controler
					scope.carregarError = true;
					delete scope.carregando;
					scope.error.e500 = resp.data.Erro;
					scope.error.detalhe = resp.data.Retorno;
					return;
				}
				// Deu certo
				scope.formData = resp.data.Retorno;
				document.title = scope.formData.nome;
				delete scope.carregando;
				// Agrupa guias dentro dos conteiners certos
				scope.formData.telas.forEach(function(tela){
					tela.containers = [];
					tela.guias.forEach(function(guia){
						var index = 0;
						if(guia.container) index = guia.container;
						delete guia.container;
						if(tela.containers[index]) 
							tela.containers[index].push(guia); 
						else 
							tela.containers[index]=[guia];
					});
					delete tela.guias;
				});
				// Instancia o modelo que o Angular irá usar
				// como representação dos dados do formulário
				scope.formData.model = scope.modelo || {};
				var modeloAngular = scope.formData.model;
				// Estrutura o modelo do formulário de acordo
				// com a estrutura necessária
				scope.formData.telas.forEach(function(tela){
					if(tela.tipo === 'TELA DE PESQUISA') return;
					tela.containers.forEach(function(container){
						container.forEach(function(guia){
							if(!guia.componentes) return;
							if(guia.tipo.match('COLAPSE')) {
								guia.modelo = {componentes: guia.componentes, nome: guia.nome};
								guia.colapses=[guia.modelo];
							}
							guia.componentes.forEach(function(componente){
								$ecv.utils.recur(modeloAngular, componente.referencia, componente);
							});
						});
					});
				});	
			}
			function error(err){
				// Em caso de erro na comunicação ou no servidor,
				// mostra o erro na tela
				scope.carregarError = true;
				delete scope.carregando;
				scope.error.e500 = err.data;
				return;
			}
			// Rota que busca o formulário
			$http.get(GetRESTEndpoint('FORMULARIO/BUSCAR' + queryParam)).then(success, error);			
		}
	}	
}]);