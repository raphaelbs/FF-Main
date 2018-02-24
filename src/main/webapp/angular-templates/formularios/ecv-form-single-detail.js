/**
 * [ecvFormSingleDetail]
 * Diretiva representativa do formuário single detalhe.
 * Raphael Brandão - 16/01/2016
 */
angular.module('financeiro').directive('ecvFormSingleDetail', ['$http', '$ecv', '$mdDialog',
	function($http, $ecv, $mdDialog){
	return {
		restrict: 'E',
		templateUrl: GetDOMINIOEndpoint('angular-templates/formularios/ecv-form-single-detail.html'),
		scope: {
			data: '='
		},
		link: function(scope, elem){
			$ecv.menu.html.carregado = true;
			scope.voltar = function(){
				$mdDialog.cancel(scope.data.model);
			}
			
		    scope.novaGuia = function(container, tela){
		    	var guiaModelo = container[0];
		    	var mapeamento = guiaModelo.mapeamento;
		    	if(!mapeamento) 
		    		return $ecv.toast.erro('Faltando valor MAPEAMENTO (c10_203) para esta guia (id : ' + guiaModelo.id + ').', 
		    				'Erro ao criar nova aba..');
		    	var novaGuia = angular.copy(guiaModelo);
		    	var novoIndice = container.length;
		    	
		    	if(novaGuia.componentes) novaGuia.componentes.forEach(paraCadaComponente);
		    	tela.containers.forEach(function(containerInterno){
		    		if(container === containerInterno) return;
		    		containerInterno.forEach(function(guia){
						if(guiaModelo === guia) return;
						if(!guia.componentes) return;
						guia.componentes.forEach(paraCadaComponente);
					});
				});
		    	
		    	function paraCadaComponente(componente){
					var pos = componente.referencia.indexOf(mapeamento);
					if(pos<0) return;
		    		pos += mapeamento.length + 1;
		    		var end = componente.referencia.substr(pos).indexOf(']') + pos;
		    		componente.referencia = componente.referencia.substr(0, pos) + novoIndice + componente.referencia.substr(end);
					$ecv.utils.recur(scope.data.model, componente.referencia, componente);
				}
		    	
		    	container.push(novaGuia);
		    };	
		    
		    scope.deletarGuia = function(index, container, tela){
		    	var guia = container[index];
		    	if(!guia.mapeamento) 
		    		return $ecv.toast.erro('Faltando valor MAPEAMENTO (c10_203) para esta guia (id : ' + guia.id + ').', 
		    				'Erro ao criar nova aba..');
		    	if(index === container['selecionado'] || container['selecionado'] === container.length-1) container['selecionado']--;
		    	
		    	tela.containers.forEach(function(containerInterno){
		    		if(container===containerInterno) return;
		    		for(var indexGuia = containerInterno.length - 1; indexGuia > 0; indexGuia--){
		    			var guiaInterna = containerInterno[indexGuia];
		    			if(!guiaInterna.componentes) return;
		    			var deleteGuia = false;
		    			for(var indexComp = 1; indexComp < guiaInterna.componentes.length; indexComp++){
		    				var componente = guiaInterna.componentes[indexComp];
							var pos = componente.referencia.indexOf(guia.mapeamento);
							if(pos<0) continue;
				    		pos += guia.mapeamento.length + 1;
				    		var end = componente.referencia.substr(pos).indexOf(']') + pos;
				    		var val = componente.referencia.substr(pos, end-pos);
				    		if(val !== index) continue;
				    		$ecv.utils.limparPaiDoModelo(scope.data.model, componente.referencia, guia.mapeamento);
				    		deleteGuia = true;
		    			}
		    			if(deleteGuia) containerInterno.splice(indexGuia, 1);
		    		}
				});
		    	if(guia.componentes) 
		    		guia.componentes.forEach(function(componente){
		    			$ecv.utils.limparPaiDoModelo(scope.data.model, componente.referencia, guia.mapeamento);
					});
		    	
		    	container.splice(index, 1);
		    };
		    
		    scope.atualizarGuiasDetalhes = function(index, container, tela){
		    	var guia = container[index];
				if(tela.tipo === 'TELA DE PESQUISA' || !guia || !guia.tipo.match('INCREMENTAL')) return;
		    	if(!guia.mapeamento) 
		    		return $ecv.toast.erro('Faltando valor MAPEAMENTO (c10_203) para esta guia (id : ' + guia.id + ').', 
		    				'Erro ao criar nova aba..');
		    	var mapeamento = guia.mapeamento;
		    	tela.containers.forEach(function(containerInterno){
		    		if(container===containerInterno) return;
		    		containerInterno.forEach(function(guiaInterna){
						if(!guiaInterna.componentes) return;
						guiaInterna.componentes.forEach(paraCadaComponente);
					});
				});
		    	function paraCadaComponente(componente){
		    		var pos = componente.referencia.indexOf(mapeamento);
					if(pos<0) return;
		    		pos += mapeamento.length + 1;
		    		var end = componente.referencia.substr(pos).indexOf(']') + pos;
		    		componente.referencia = componente.referencia.substr(0, pos) + index + componente.referencia.substr(end);
					$ecv.utils.recur(scope.data.model, componente.referencia, componente);
				}
		    };
		    
		    function estaCarregando(comp, bool){
		    	if(bool){
		    		comp.carregando = true;
		    		return;
		    	}
		    	comp.carregando = false;
		    }
			
			scope.acaoCrud = function(comp){
				if(!comp.alias) return $ecv.toast.erro(
						'Botão de ação sem [alias].<br>Cadastre algum termo no campo c7_204_801 para este componente (id: ' + comp.id + ').', 
						'Erro no botão de ação');
				var tipo = comp.alias.toLowerCase();
				if(tipo === 'novo'){
					$ecv.modelo.limpar(scope.data);
					return;
				}
				if(tipo === 'deletar'){
					if(!comp.valor) return $ecv.toast.erro(
							'Botão de ação DELETAR sem [valor].<br>Cadastre a rota do DELETE no campo c13_204 para este componente (id: ' + comp.id + ').', 
							'Erro no botão de GRAVAR');
					estaCarregando(comp, true);
					$http({
						headers: {
					        "Content-Type": "application/json"
					    },
						method: 'DELETE',
						data: $ecv.modelo.copiarELimpar(scope.data.model),
						url: GetRESTEndpoint(comp.valor), 
					})
					.then(function(res){
						estaCarregando(comp);
						if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Houve um erro ao deletar');
						$ecv.toast.ok('Deletado com sucesso!');
						$ecv.modelo.limpar(scope.data);
					}, function(err){
						estaCarregando(comp);
						$ecv.toast.erro(err.data, 'Houve um erro ao deletar');
					});
					return;
				}	
			};
			/**
			 * Valida e salva o formulario.
			 */
			scope.validar = function(form){
				if (form.$invalid) {
				    angular.forEach(form.$error, function (field) {
				        angular.forEach(field, function(errorField){
				            errorField.$setTouched();
				        });
				    });
				    return;
				}
				var comp;
				for(var i=0; i<scope.data.crud.length; i++){
					var itemCrud = scope.data.crud[i];
					if(itemCrud.alias==='GRAVAR') {
						comp = itemCrud;
						break;
					}
				}
				estaCarregando(comp, true);
				
				// Persiste
				$mdDialog.hide(scope.data.model);				
			};
			
			// ================= COLAPSE =======================
			// Guia COLAPSE:
			scope.inserirColapse = function(colapses, colapse, guiaModelo, tela, container){
				var mapeamento = guiaModelo.mapeamento;
		    	if(!mapeamento) 
		    		return $ecv.toast.erro('Faltando valor MAPEAMENTO (c10_203) para esta guia (id : ' + guiaModelo.id + ').', 
		    				'Erro ao criar nova aba..');
		    	colapse = angular.copy(colapse);
				colapse.nome = colapse.nome + ' ' + colapses.length;
				var novoIndice = colapses.length;
		    	
		    	if(colapse.componentes) colapse.componentes.forEach(paraCadaComponente);
		    	tela.containers.forEach(function(containerInterno){
		    		if(container === containerInterno) return;
		    		containerInterno.forEach(function(guia){
						if(guiaModelo === guia) return;
						if(!guia.componentes) return;
						guia.componentes.forEach(paraCadaComponente);
					});
				});
		    	
		    	function paraCadaComponente(componente){
					var pos = componente.referencia.indexOf(mapeamento);
					if(pos<0) return;
		    		pos += mapeamento.length + 1;
		    		var end = componente.referencia.substr(pos).indexOf(']') + pos;
		    		componente.referencia = componente.referencia.substr(0, pos) + novoIndice + componente.referencia.substr(end);
					$ecv.utils.recur(scope.data.model, componente.referencia, componente);
				}
				
				
				colapses.push(colapse);
			};			
		}
	};
}]);
