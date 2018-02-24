/**
 * [cadastroFormulario]
 * Controler para o cadastro de formulário.
 * Raphael Brandão - 25/01/2017
 */
angular.module('financeiro').controller('cadastroFormulario', [
    '$scope', '$ecv', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', '$mdDialog',
    function($scope, $ecv, $http, DTOptionsBuilder, DTColumnBuilder, $mdDialog){
    
    document.title = 'CADASTRO FORMS 1.2';	
    	
	$ecv.menu.html.carregado = true;
	$scope.toggleMenu = $ecv.menu.fn.toggle;
	$scope.botoes = {};
	$scope.modelo = {};
	$scope.modeloTela = {};
	$scope.modeloGuia = {};
	$scope.modeloComponente = {};
	$scope.modeloDetalhe ={};
	
	// Carrega todos formulários
	$http.get(GetRESTEndpoint('T201'))
    .then(function(res){
    	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
    	$scope.modelos = res.data.Retorno;
    }, function(err){
		$ecv.toast.erro(err.data, 'Erro ao buscar');
	});
	
	// Grade de exibição das telas;
	$scope.gradeFormularios = {
		deletar : function(obj, index, ev, cb){
			$http({
				headers: {
			        "Content-Type": "application/json"
			    },
				method: 'DELETE',
				data: obj,
				url: GetRESTEndpoint('T201'), 
			})
			.then(function(res){
				if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Erro ao deletar');
				$ecv.toast.ok('Formulário deletado com sucesso!');
				
				cb();
				
				$scope.modelo = {};
				$scope.modeloTela = {};
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao deletar');
			});
		},
		editar : function(aData, ev){
			if(!aData.c1_201) return;
			$ecv.toast.ok('Buscando formulário...');
	        $http.get(GetRESTEndpoint('T201/' + aData.c1_201))
	        .then(function(res){
	        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
	        	
	        	$scope.modelo = res.data.Retorno;
	        	$scope.telaSelecionada = 1;
	        	$scope.detalheSelecionado = 0;
	        	$scope.modeloTela = {};
	        	$scope.modeloGuia = {};
	        	$scope.modeloComponente = {};
	        	$scope.modeloDetalhe ={};
	        	$ecv.toast.ok('Formulário carregado!');
				
	        }, function(err){
				$ecv.toast.erro(err.data, 'Erro ao buscar');
			});
		}
	};

	// Grade de exibição das telas;
	$scope.gradeTelas = {
		deletar : function(obj, index, ev, cb){
			$http({
				headers: {
			        "Content-Type": "application/json"
			    },
				method: 'DELETE',
				data: obj,
				url: GetRESTEndpoint('T202'), 
			})
			.then(function(res){
				if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Erro ao deletar');
				$ecv.toast.ok('Tela deletada com sucesso!');
				$scope.modeloTela = {};
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				
				cb();
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao deletar');
			});
		},
		editar : function(aData, ev){
			if(!aData.c1_202) return;
	    	$ecv.toast.ok('Buscando tela...');
	        $http.get(GetRESTEndpoint('T202/' + aData.c1_202))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	
		        	$scope.modeloTela = res.data.Retorno;
		        	$scope.modeloGuia = {};
		        	$scope.modeloComponente = {};
		        	$scope.modeloDetalhe ={};
		        	$scope.detalheSelecionado = 1;
		        	$ecv.toast.ok('Tela carregada!');
					
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
		}
	};

	// Grade de exibição das guias;
	$scope.gradeGuias = {
		deletar : function(obj, index, ev, cb){
			$http({
				headers: {
			        "Content-Type": "application/json"
			    },
				method: 'DELETE',
				data: obj,
				url: GetRESTEndpoint('T203'), 
			})
			.then(function(res){
				if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Erro ao deletar');
				$ecv.toast.ok('Guia deletada com sucesso!');
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				
				cb();
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao deletar');
			});
		},
		editar : function(aData, ev){
			if(!aData.c1_203) return;
	    	$ecv.toast.ok('Buscando guia...');
	        $http.get(GetRESTEndpoint('T203/' + aData.c1_203))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	
		        	$scope.modeloGuia = res.data.Retorno;
		        	$scope.detalheSelecionado = 2;
		        	$scope.modeloComponente = {};
		        	$scope.modeloDetalhe ={};
		        	$ecv.toast.ok('Guia carregada!');
					
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
		}
	};
	
	// Grade de exibição dos componentes;
	$scope.gradeComponentes = {
		deletar : function(obj, index, ev, cb){
			$http({
				headers: {
			        "Content-Type": "application/json"
			    },
				method: 'DELETE',
				data: obj,
				url: GetRESTEndpoint('T204'), 
			})
			.then(function(res){
				if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Erro ao deletar');
				$ecv.toast.ok('Componente deletado com sucesso!');
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				
				cb();
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao deletar');
			});
		},
		editar : function(aData, ev){
			if(!aData.c1_204) return;
	    	$ecv.toast.ok('Buscando componente...');
	        $http.get(GetRESTEndpoint('T204/' + aData.c1_204))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	
		        	$scope.modeloComponente = res.data.Retorno;
		        	$scope.modeloDetalhe ={};
		        	$scope.modeloComponente.tipo = { };
		        	$scope.detalheSelecionado = 3;
		        	$ecv.toast.ok('Componente carregado!');
					
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
		}
	};
	
	// Grade de exibição dos componentes;
	$scope.gradeDetalhes = {
		deletar : function(obj, index, ev, cb){
			$http({
				headers: {
			        "Content-Type": "application/json"
			    },
				method: 'DELETE',
				data: obj,
				url: GetRESTEndpoint('T206'), 
			})
			.then(function(res){
				if(res.data.Resultado === 'ERRO')return $ecv.toast.erro(res.data.Erro, 'Erro ao deletar');
				$ecv.toast.ok('Detalhe deletado com sucesso!');
				$scope.modeloDetalhe ={};
				
				cb();
			}, function(err){
				$ecv.toast.erro(err.data, 'Erro ao deletar');
			});
		},
		editar : function(aData, ev){
			if(!aData.c1_206) return;
	    	$ecv.toast.ok('Buscando detalhe do componente...');
	        $http.get(GetRESTEndpoint('T206/' + aData.c1_206))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	
		        	$scope.modeloDetalhe = res.data.Retorno;
		        	$scope.detalheSelecionado = 4;
		        	$ecv.toast.ok('Detalhe carregado!');
					
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
		}
	};
	
	// Monitora a mudança da página Componente
	(function(){
		function mudou(n){
			if(!n) return;
			if(!$scope.modeloComponente.t206C5) return;
			
			$scope.modeloComponente.t206C5.forEach(function(detalhe){
				$scope.modeloComponente.tipo['t' + detalhe.c6_206_5002.c1_5002] = detalhe;
			});
		}
		
		// Monitora a mudança do componente
		$scope.$watch(function(){
			return $scope.modeloComponente;
		},mudou);
		
		// Monitora a mudança de tipo do componente
		$scope.$watch(function(){
			if($scope.modeloComponente)
				return $scope.modeloComponente.c6_204_5002;
		},mudou);
	})();
	
	// Ações dos botões
	(function(){
		var acaoSalvar = {};
		acaoSalvar.FORM = function(form){
			$scope.botoes.gravarFormCarregando = true;
			$http.post(GetRESTEndpoint('T201'), $scope.modelo)
			.then(function(res){
				$scope.botoes.gravarFormCarregando = false;
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao inserir o formulário');
				
	        	$scope.modelo = res.data.Retorno;
				$ecv.toast.ok('Formulário inserido com sucesso!');
				
				$http.get(GetRESTEndpoint('T201'))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	$scope.modelos = res.data.Retorno;
		        	$ecv.toast.ok('Grade recarregado!');
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
			}, function(err){
				$scope.botoes.gravarFormCarregando = false;
				$ecv.toast.erro(err.data, 'Erro ao inserir o formulário');
			});
		};
		acaoSalvar.TELA = function(form){
			$scope.modeloTela.c2_202_201 = $scope.modelo;
			$scope.botoes.gravarTelaCarregando = true;
			$http.post(GetRESTEndpoint('T202'), $scope.modeloTela)
			.then(function(res){
				$scope.botoes.gravarTelaCarregando = false;
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao inserir a tela');
	        	$scope.modeloTela = res.data.Retorno;
	        	
	        	$ecv.toast.ok('Tela inserida com sucesso!');
	        	$http.get(GetRESTEndpoint('T201/' + $scope.modelo.c1_201))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	$scope.modelo = res.data.Retorno;
		        	$ecv.toast.ok('Formulário recarregado!');
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
			}, function(err){
				$scope.botoes.gravarTelaCarregando = false;
				$ecv.toast.erro(err.data, 'Erro ao inserir a tela');
			});
		};
		acaoSalvar.GUIA = function(form){
			$scope.modeloGuia.c2_203_201 = $scope.modelo;
			$scope.modeloGuia.c3_203_202 = $scope.modeloTela;
			$scope.botoes.gravarGuiaCarregando = true;
			$http.post(GetRESTEndpoint('T203'), $scope.modeloGuia)
			.then(function(res){
				$scope.botoes.gravarGuiaCarregando = false;
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao inserir a guia');
	        	$scope.modeloGuia = res.data.Retorno;
	        	
	        	$ecv.toast.ok('Guia inserida com sucesso!');
	        	$http.get(GetRESTEndpoint('T202/' + $scope.modeloTela.c1_202))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	$scope.modeloTela = res.data.Retorno;
		        	$ecv.toast.ok('Tela recarregada!');
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
			}, function(err){
				$scope.botoes.gravarGuiaCarregando = false;
				$ecv.toast.erro(err.data, 'Erro ao inserir a guia');
			});
		}
		acaoSalvar.COMPONENTE = function(form){
			var cp = angular.copy($scope.modeloComponente);
			for(var key in cp.tipo){
				var detalhe = cp.tipo[key];
				if(detalhe.c1_206) continue;
				detalhe.c2_206_201 = $scope.modelo;
				detalhe.c3_206_202 = $scope.modeloTela;
				detalhe.c4_206_203 = $scope.modeloGuia;
				detalhe.c6_206_5002 = {
						c1_5002 : parseInt(key.substr(1))
				};
				if(!cp.t206C5) cp.t206C5 = [];
				cp.t206C5.push(detalhe);
			}
			
			
			cp.c2_204_201 = $scope.modelo;
			cp.c3_204_202 = $scope.modeloTela;
			cp.c4_204_203 = $scope.modeloGuia;
			$scope.botoes.gravarComponenteCarregando = true;
			$http.post(GetRESTEndpoint('T204'), cp)
			.then(function(res){
				$scope.botoes.gravarComponenteCarregando = false;
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao inserir o componente');
	        	$scope.modeloComponente = res.data.Retorno;
	        	$scope.modeloComponente.tipo = { };
	        	
	        	$ecv.toast.ok('Componente inserido com sucesso!');
	        	$http.get(GetRESTEndpoint('T203/' + $scope.modeloGuia.c1_203))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	$scope.modeloGuia = res.data.Retorno;
		        	$ecv.toast.ok('Guia recarregada!');
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
			}, function(err){
				$scope.botoes.gravarComponenteCarregando = false;
				$ecv.toast.erro(err.data, 'Erro ao inserir o componente');
			});
		};
		acaoSalvar.DETALHE = function(form){
			$scope.modeloDetalhe.c2_206_201 = $scope.modelo;
			$scope.modeloDetalhe.c3_206_202 = $scope.modeloTela;
			$scope.modeloDetalhe.c4_206_203 = $scope.modeloGuia;
			$scope.modeloDetalhe.c5_206_204 = $scope.modeloComponente;
			$scope.botoes.gravarDetalheCarregando = true;
			$http.post(GetRESTEndpoint('T206'), $scope.modeloDetalhe)
			.then(function(res){
				$scope.botoes.gravarDetalheCarregando = false;
				if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao inserir o detalhe');
	        	$scope.modeloDetalhe = res.data.Retorno;
	        	
	        	$ecv.toast.ok('Detalhe inserido com sucesso!');
	        	$http.get(GetRESTEndpoint('T204/' + $scope.modeloComponente.c1_204))
		        .then(function(res){
		        	if(res.data.Resultado === 'ERRO') return $ecv.toast.erro(res.data.Erro, 'Erro ao buscar');
		        	$scope.modeloComponente = res.data.Retorno;
		        	$ecv.toast.ok('Componente recarregada!');
		        }, function(err){
					$ecv.toast.erro(err.data, 'Erro ao buscar');
				});
			}, function(err){
				$scope.botoes.gravarDetalheCarregando = false;
				$ecv.toast.erro(err.data, 'Erro ao inserir o detalhe');
			});
		};
		
		// Verifica se os campos obrigatórios estão preenchidos
		$scope.validar = function(form, id){
			if (form.$invalid) {
			    angular.forEach(form.$error, function (field) {
			        angular.forEach(field, function(errorField){
			            errorField.$setTouched();
			        });
			    });
			    return;
			}
			acaoSalvar[id](form);
		};
		
		// Ação dos outros botões
		$scope.acaoCrud = function(id, ev){
			switch (id) {
			case 'NOVO':
				$scope.modelo = {};
				$scope.modeloTela = {};
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				break;
			case 'NOVO_TELA':
				$scope.modeloTela = {};
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				break;
			case 'NOVO_GUIA':
				$scope.modeloGuia = {};
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				break;
			case 'NOVO_COMPONENTE':
				$scope.modeloComponente = {};
				$scope.modeloDetalhe ={};
				break;
			case 'NOVO_DETALHE':
				$scope.modeloDetalhe ={};
				break;
			default:
				break;
			}
		};
	})();
	
}]);