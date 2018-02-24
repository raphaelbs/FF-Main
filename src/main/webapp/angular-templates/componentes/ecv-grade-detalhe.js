/**
 * [ecvGradeDetalhe]
 * Diretiva responsável por implementar a grade de exibição dos detalhes
 * para mostrar o conteúdo referente ao formulário carregado.
 */
angular.module('financeiro').directive('ecvGradeDetalhe', [function(){
	return {
		restrict: 'E',
		scope: {
			componente: '=',
			data: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-grade-detalhe.html'),
		controller: ['$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$http', '$ecv', '$mdDialog', '$compile', '$timeout',
		    function($scope, DTOptionsBuilder, DTColumnBuilder, $http, $ecv, $mdDialog, $compile, $timeout){	
			
			// Se o valor do componente vinculado mudar, o a grade será recarregada
			var detalhamento = $scope.componente.detalhamento;
			
			if(!detalhamento.carregarForm) return $ecv.toast.erro('A grade de exibição (id: ' + $scope.componente.id 
					+ ') não contem o detalhe do tipo carregarForm (7514). Este detalhe é obrigatório e deve conter o forumário a ser carregado.', 'Erro ao criar a GradeDetalhe');
			
			// Cria o container dos dados
			detalhamento.data = DTOptionsBuilder
				.newOptions()
				.withPaginationType('full_numbers');
			
			detalhamento.instancia = {};
			
			// Ação do botão de novo
			$scope.novo = function(ev){
				modalDetalhe({
					idForm : detalhamento.carregarForm
				}, function(nData) {
					$scope.componente.modelo[$scope.componente.ultimaReferencia].push(nData);
			    	$ecv.toast.ok('Novo detalhe inserido');
			    }, function(cData){
			    	// TODO: reabrir modal para recuperar os dados
			    }, ev);
			}
			
			// Ação da linha para atualizar
			$scope.atualizar = function(aData, ev){
				var copy = angular.copy(aData);
				modalDetalhe({
					modelo: aData,
				    idForm : detalhamento.carregarForm
				}, function(nData) {
					detalhamento.instancia.rerender();
			    	$ecv.toast.ok('Detalhe atualizado');
			    }, function(cData) {
			    	for(var key in aData)
			    		aData[key] = copy[key];
			    }, ev);
			};
			
			// Ação da linha para deletar
			$scope.deletar = function(index){
				$timeout(function(){
					$scope.componente.modelo[$scope.componente.ultimaReferencia].splice(index, 1);
					//detalhamento.instancia.rerender();
				}, 0);		
			};
			
			// Busca valor da chave composta
			$scope.buscaValor = function(chave, linha){
				var ev = 'linha.' + chave;
				return eval(ev);
			}
			
			$http.get(GetRESTEndpoint(detalhamento.cabecalhoGrade)).then(function(res){
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar cabeçalho GradeDetalhe');
				if(!res.data || !res.data.Retorno || res.data.Retorno.length === 0) return;
				detalhamento.colunas = [];
				detalhamento.colunasRaw = [];
				res.data.Retorno.sort(function(a,b){
					return a.id - b.id;
				});
				res.data.Retorno.forEach(function(obj){
					detalhamento.colunas.push(DTColumnBuilder.newColumn(obj.chave).withTitle(obj.alias));
					detalhamento.colunasRaw.push({ key: obj.chave });
				});
				detalhamento.colunas.push(DTColumnBuilder.newColumn('Ações').withTitle('Ações'));
				$scope.componente.autorizado = true;
				
				$ecv.toast.ok('Tabela carregada com sucesso!');
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao buscar cabeçalho GradeDetalhe');
			});
			
			
			function modalDetalhe($data, detalheOk, detalheError, ev){
				$mdDialog.show({
					multiple: true,
				    controller: 'ecvModalFormDetail',
				    templateUrl: 'angular-templates/modals/ecv-modal-form-detail.html',
				    parent: angular.element('form > md-content'),
				    clickOutsideToClose: false,
				    targetEvent: ev,
				    fullscreen: false,
				    locals: {
				    	$data: $data
				    }
				}).then(detalheOk, detalheError);
			}
		}]
	};
}]);