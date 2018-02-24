/**
 * [ecvGrade]
 * Diretiva responsável por implementar a grade de exibição dos
 * para mostrar o conteúdo referente ao formulário carregado.
 */
angular.module('financeiro').directive('ecvGrade', ['DTOptionsBuilder', 'DTColumnBuilder', '$http', '$ecv',
	function(DTOptionsBuilder, DTColumnBuilder, $http, $ecv){
	return {
		restrict: 'E',
		scope: {
			componente: '=',
			data: '='
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-grade.html'),
		link: function(scope, elem){			
			
			var detalhamento = scope.componente.detalhamento;
			detalhamento.data = DTOptionsBuilder
				.fromSource(GetRESTEndpoint(detalhamento.opcoes))
		        .withOption('rowCallback', rowCallback)
				.withDataProp('Retorno')
				.withPaginationType('full_numbers');
			
			detalhamento.instancia = {};
			scope.recarregar = function(){
				detalhamento.instancia.reloadData();
			};
			
			$http.get(GetRESTEndpoint(detalhamento.cabecalhoGrade)).then(function(res){
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Houve um erro ao inserir');
				if(!res.data || !res.data.Retorno || res.data.Retorno.length === 0) return;
				detalhamento.colunas = [];
				res.data.Retorno.sort(function(a,b){
					return a.id - b.id;
				});
				res.data.Retorno.forEach(function(obj){
					detalhamento.colunas.push(DTColumnBuilder.newColumn(obj.alias).withTitle(obj.alias));
				});
				scope.componente.autorizado = true;
				
				$ecv.toast.ok('Tabela carregada com sucesso!');
			}, function(err){
				$ecv.toast.erro(err.data, 'Houve um erro ao inserir');
			});
			
			function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    $('td', nRow).unbind('click');
			    $('td', nRow).bind('click', function() {
			    	if(!aData.ID) return;
			    	$ecv.toast.ok('Buscando registro...');
			        $http.get(GetRESTEndpoint(detalhamento.unicoRegistro + '/' + aData.ID))
			        .then(function(res){
			        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Houve um erro ao buscar');
			        	
			        	var telaFormulario;
			        	scope.data.model = res.data.Retorno;
			        	scope.data.telas.forEach(function(tela, telaIndex){
			        		if(tela.tipo === 'TELA DE PESQUISA') return;
			        		telaFormulario = telaIndex;
			        		tela.containers.forEach(function(container){
								container.forEach(function(guia){
									if(!guia.componentes) return;
									guia.componentes.forEach(function(componente){
										$ecv.utils.recur(scope.data.model, componente.referencia, componente);
									});
								});
							});
						});	
			        	
			        	scope.data.telas.selecionada = telaFormulario;
			        	$ecv.toast.ok('Registro carregado!');
						
			        }, function(err){
						$ecv.toast.erro(err.data, 'Houve um erro ao buscar');
					})
			    });
			    return nRow;
			}
		}
	};
}]);