/**
 * [$ecv]
 * Factory para padronizar o $mdToast de sucesso e erro.
 * Raphael Brandão - 19/12/2016
 */
angular.module('financeiro').factory('$ecv', ['$mdToast', '$mdDialog', function($mdToast, $mdDialog){
	var posicao = 'bottom right';
	
	var toastError = $mdToast.simple()
		.action('LOG')
		.highlightAction(true)
		.highlightClass('md-accent')
		.hideDelay(5000)
		.position(posicao);

	var toastOk = $mdToast.simple()
		.hideDelay(3000)
		.position(posicao);
	
	var dialog = $mdDialog.alert()
	    .clickOutsideToClose(false)
	    .ok('Ok');
	
	function erro(err, msg){
	    $mdToast.show(
	    		toastError.textContent(msg)
	    		).then(function(response) {
	      if ( response == 'ok' )
	    	  $mdDialog.show(
	    			  dialog.title(msg)
	    			    	.htmlContent(err)
	    			    	.ariaLabel(msg)
	    			   	);
	    });
	}
	
	function ok(msg){
		$mdToast.show(toastOk.textContent(msg));
	}
	
	/**
	 * Limpa objetos e arrays vazios do objeto pai.
	 */
	function limpaVazios(objPai){
		varrer(objPai, function(obj, key, type){
			if(!type){
				delete obj[key];
				return;
			}
			if(type === 'object' && Object.keys(obj[key]).length === 0) {
				if(obj[key].length === 0) return;
				delete obj[key];
				return;
			}
		});
	}
	
	/**
	 * Cria uma cópia, varre o objeto e limpa os vazios.
	 */
	function copiarELimpar(objPai){
		var copia = angular.copy(objPai);
		// LIMPEZA
		// Deleta objetos e arrays vazios
		limpaVazios(copia);
		return copia;
	}
	
	/**
	 * Varre todo objeto e retorna pelo callback.
	 */
	function varrer(obj, callback){
		if(!obj || !callback) return;
		if(typeof obj !== 'object') return callback(obj, null, typeof obj[key]);
		for(var key in obj){
			if(!obj[key] && obj[key] !== 0){
				callback(obj, key, obj[key]);
				continue;
			}
			if(typeof obj[key] === 'object') varrer(obj[key], callback); 
			callback(obj, key, typeof obj[key]);
		}
		callback(obj, key, typeof obj[key]);
	}
	
	/**
	 * Limpa o modelo do formulário
	 */
	function limpar(data){
		data.telas.forEach(function(tela){
			if(tela.tipo === 'TELA DE PESQUISA') return;
			tela.containers.forEach(function(container){
				container.forEach(function(guia){
					if(!guia.componentes) return;
					guia.componentes.forEach(function(componente){
						if(!componente.referencia) return;
						if(componente.tipo === 'GRADE DE EXIBICAO - DETAIL'){
							componente.modelo[componente.ultimaReferencia].length = 0;
							return;
						}
						if(typeof componente.modelo[componente.ultimaReferencia] !== 'object' || componente.visivel)
							componente.modelo[componente.ultimaReferencia] = undefined;
						if(!componente.valor) return;
						try{
							componente.modelo[componente.ultimaReferencia] = JSON.parse(componente.valor);
						}catch(e){
							componente.modelo[componente.ultimaReferencia] = componente.valor;
						}	
					});
				});
			});
		});	
	}
	
	/**
	 * Cria a árvore no Obj enviado segundo a Ref enviada.
	 */
	function recur(obj, ref, comp){
		if(!ref) return;
		if(!obj || !comp) throw 'ECV-RECURException:\nFaltando parâmetros\n' 
		+ comp.referencia + '\nComponente id: ' + comp.id + '\nrecur('+ JSON.stringify(obj) + ', ' + ref + ', ' + JSON.stringify(comp) + ');';
		if(ref.indexOf('.')===-1){
			if(ref.indexOf('[') > 0){
				var rx = /(.+)\[([^\]]*)\]/.exec(ref); //rx[1] chave, rx[2] posicao
				if(rx){
					if(!obj[rx[1]]) obj[rx[1]] = [];
					comp.modelo = obj;
					comp.ultimaReferencia = ref.substr(0, ref.indexOf('['));
					comp.modelo[comp.ultimaReferencia] = obj[rx[1]];
				}
				return;
			}
			comp.ultimaReferencia = ref;
			var val = obj[comp.ultimaReferencia] || comp.valor;
			comp.modelo = obj;
			if(!val) return;	
			try{
				comp.modelo[comp.ultimaReferencia] = JSON.parse(val);
			}catch(e){
				if(comp.tipo==='COMBO BOX'){
					if(comp.detalhamento){
						if(comp.detalhamento.opcoesCarregadas && comp.detalhamento.opcoesCarregadas.length>0){
							for(var i=0; i<comp.detalhamento.opcoesCarregadas.length; i++){
								var ocObj = comp.detalhamento.opcoesCarregadas[i];
								if(val[comp.detalhamento.descricao] === ocObj[comp.detalhamento.descricao]){
									val = ocObj;
									break
								}
							}
						}else{
							comp.detalhamento.opcoesCarregadas = [val];
						}
					}	
				}
				comp.modelo[comp.ultimaReferencia] = val;
			}
			return;
		}
		var refl = ref.indexOf('.');
		if(ref.indexOf('[') < refl) refl = ref.indexOf(']') + 1;
		var n = ref.substr(0, refl);
		ref = ref.substr(refl+1);
		// Confere se o obj atual é um array
		var rx = /(.+)\[([^\]]*)\]/.exec(n); //rx[1] chave, rx[2] posicao
		if(rx){
			var isRx2Number = parseInt(rx[2]) > -1;
			if(!obj[rx[1]]) obj[rx[1]] = [];
			var rci = rx[2];
			if(!isRx2Number){
				// Cria o objeto (se não houver) referenciaComposta dentro do componente
				// para abrigar todas as referencias [{}] que esse objeto
				// pode conter durante a string da referencia.
				if(!obj[rx[1]].referenciaComposta) obj[rx[1]].referenciaComposta = {};
				// Dentro da referencia composta, cria (se nao houver) 
				// um array usando rx[1] como chave (o nome do array no modelo JPA)
				if(!obj[rx[1]].referenciaComposta[rx[1]]) obj[rx[1]].referenciaComposta[rx[1]] = [];
				// Neste array é inserido (se não houver no modelo ou no referenciaComposta) 
				// o valor rx[2] e a posição dele representa a posição real no array do modelo JPA.
				rci = obj[rx[1]].referenciaComposta[rx[1]].indexOf(rx[2]);
				if(rci < 0){
					if(obj[rx[1]].length > 0){
						try{
							var rx2Json = JSON.parse(rx[2]);
							var acObj = angular.copy(obj[rx[1]]);
							ol: for(var key in rx2Json){
								for(var i=acObj.length - 1; i>-1; i--){
									var rx1Obj = acObj[i];
									if(eval('rx1Obj.' + key) != rx2Json[key]) acObj.splice(i, 1);
									else{
										// Somente 1 chave por enquanto, nada de AND
										obj[rx[1]].referenciaComposta[rx[1]][i] = rx[2];
										rci = i;
										break ol;
									}
								}
							}
							
						}catch(e){
							throw 'ECV-RECURException:\nHouve um erro ao converter o JSON da referencia\n' 
								+ comp.referencia + '\nComponente id: ' + comp.id + '\nErro:\n'+ e;
						}
					}else
						rci = obj[rx[1]].referenciaComposta[rx[1]].push(rx[2]) - 1;
				}	
			}
			if(!obj[rx[1]][rci]) obj[rx[1]][rci] = {};
			return recur(obj[rx[1]][rci], ref, comp);
		}else{
			if(!obj[n]) obj[n] = {};
			return recur(obj[n], ref, comp);
		}
	}
	
	/**
	 * Limpar maior pai do modelo.
	 */
	function limparPaiDoModelo(obj, ref, mapeamento){
		var n = ref.substr(0, ref.indexOf('.'));
		ref = ref.substr(ref.indexOf('.')+1);
		// Confere se o obj atual é um array
		var rx = /(.+)\[(\d+)\]/.exec(n); //rx[1] chave, rx[2] posicao
		if(rx){
			if(obj[rx[1]] && obj[rx[1]][rx[2]]){
				if(rx[1] === mapeamento) obj[rx[1]].splice(rx[2], 1);
				else return limparPaiDoModelo(obj[rx[1]][rx[2]], ref, mapeamento);
			}
			return;
		}
		return limparPaiDoModelo(obj[n], ref, mapeamento);
	}
	
	/**
	 * Busca e retorna a instancia do ultimo array com base na referencia.
	 */
	function ultimoArrayDaReferencia(obj, ref){
		var last = ref.lastIndexOf('[');
		ref = ref.substr(0, last);
		ref = 'obj.' + ref;
		return eval(ref);
	}
	
	return {
		toast: {
			erro: erro,
			ok: ok
		},
		utils: {
			recur: recur,
			varrer : varrer,
			limparPaiDoModelo: limparPaiDoModelo,
			ultimoArrayDaReferencia: ultimoArrayDaReferencia
		},
		modelo : {
			limpar : limpar,
			copiarELimpar: copiarELimpar,
			limpaVazios: limpaVazios
		},
		menu: {
			html: {},
			fn: {}
		},
		config: {
			tipo_idioma: 1601, 
			banco: 'bd_0'
		}
	};
}]);