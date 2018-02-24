/**
 * [ecvHtmlGrade]
 * Diretiva responsável por implementar a grade de exibição dos
 * para mostrar o conteúdo referente ao formulário carregado.
 */
angular.module('financeiro').directive('ecvHtmlGrade', ['DTOptionsBuilder', 'DTColumnBuilder', '$http', '$ecv', '$mdDialog',
	function(DTOptionsBuilder, DTColumnBuilder, $http, $ecv, $mdDialog){
	return {
		restrict: 'E',
		scope: {
			colunas: '=?',
			modelo: '=?',
			editar: '=?',
			deletar: '=?',
			opcoes: '@?',
			cabecalhoGrade: '@?',
			linhaClique: '=?',
			dialogoDeletar : '=?'
		},
		templateUrl: GetDOMINIOEndpoint('angular-templates/componentes/ecv-html-grade.html'),
		link: function(scope, elem){
			
			function linhaClique(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			    $('td', nRow).unbind('click');
			    $('td', nRow).bind('click', function() {
			    	scope.linhaClique && scope.linhaClique(nRow, aData, iDisplayIndex, iDisplayIndexFull);
			    });
			    return nRow;
			}
			
			if(!scope.opcoes){
				scope.data = DTOptionsBuilder
					.newOptions()
					.withPaginationType('full_numbers');
			}else{
				scope.data = DTOptionsBuilder
					.fromSource(GetRESTEndpoint(scope.opcoes))
			        .withOption('rowCallback', linhaClique)
					.withDataProp('Retorno')
					.withPaginationType('full_numbers');
			}
			
			scope.instancia = {};
			scope.recarregar = function(){
				scope.instancia.reloadData();
			};
			
			var dialogo = scope.dialogoDeletar || $mdDialog.confirm()
		          .title('Deseja deletar este registro?')
		          .textContent('Esta ação não poderá ser desfeita.')
		          .ariaLabel('Deletar registro')
		          .ok('Deletar')
		          .cancel('Cancelar');
			
			scope.deletarDialog = function(obj, index, ev){
				dialogo.targetEvent(ev);
			    $mdDialog.show(dialogo).then(function() {
			    	scope.deletar(obj, index, ev, function(){
			    		scope.modelo.splice(index, 1);
			    	});
			    });
			};
			
			if(!scope.colunas)
				$http.get(GetRESTEndpoint(scope.cabecalhoGrade)).then(function(res){
					if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Houve um erro ao pesquisar o cabeçalho da tabela.');
					if(!res.data || !res.data.Retorno || res.data.Retorno.length === 0) return;
					scope.colunas = [];
					scope.colunasRaw = [];
					res.data.Retorno.sort(function(a,b){
						return a.id - b.id;
					});
					res.data.Retorno.forEach(function(obj){
						if(scope.opcoes){
							scope.colunas.push(DTColumnBuilder.newColumn(obj.alias).withTitle(obj.alias));
							return;
						}
						scope.colunas.push(DTColumnBuilder.newColumn(obj.chave).withTitle(obj.alias));
						scope.colunasRaw.push({ key: obj.chave });
					});
					if(!scope.opcoes)
						scope.colunas.push(DTColumnBuilder.newColumn('AÇÕES').withTitle('AÇÕES'));
					scope.autorizado = true;
				}, function(err){
					$ecv.toast.erro(err.data, 'Houve um erro ao inserir');
				});
		}
	};
}]);