/********** Manipulação Local Storage - Armazenamento sem data de expiração **************/
function adicionarItemLocalStorage(chave, valor){
	localStorage.setItem(chave, valor);
}

function removerItemLocalStorage(chave){
	localStorage.removeItem(chave);
}

function getItemLocalStorage(chave){
	return localStorage.getItem(chave);
}
/****************************************************************************************/

/********** Manipulacao Session Storage - Armazenamento com data de expiracao ***********/
function adicionarItemSessionStorage(chave, valor){
	sessionStorage.setItem(chave, valor);
}

function removerItemSessionStorage(chave){
	sessionStorage.removeItem(chave);
}

function getItemSessionStorage(chave){
	return sessionStorage.getItem(chave);
}
/***************************************************************************************/

/********** Funcoes de Listas Globais *************************************************/
function CarregarMenuEsquerdo(expandirMenuAutomaticamente) {
    var retorno;
    $.ajax({
    url:GetRESTEndpointAPI() + 'MENU_LATERAL/' + GetMENU_ID(),
    context: document.body,
    type: 'GET',
    statusCode: {
        404: function() {
        	console.log( "Recurso não encontrado." );
        	},
        401: function() {
        	sairDoSistema();
          	},
        403: function() {
        	sairDoSistema();
          	},
    },
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("AUTHORIZATION", "Basic " + (getItemSessionStorage('usuarioInfoUsuario') + ":" + getItemSessionStorage('idSessao')));
    },
    success: function (result) {
    		//Response Ok
			var arrayItemMenu = $.parseJSON(result.Retorno).menu;
			var menu = [];
	        for (var i = 0; i < arrayItemMenu.length; i++) {
	        		var itemMenu = [];
	        		
	        		if(arrayItemMenu[i].DESCRICAO != null ){
	        			itemMenu.text = arrayItemMenu[i].DESCRICAO.toLowerCase();
	        			//itemMenu.showIcon = (arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs != null && arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs.length > 0);
	        			itemMenu.expandIcon = 'glyphicon';
        				itemMenu.collapseIcon = 'glyphicon';
	        			itemMenu.href = arrayItemMenu[i].FORM;
	        			(arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs != null ? itemMenu.tags = [arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs.length] : 0);
	        			itemMenu.nodes = [];
	        			
	        			if(arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs != null && arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs.length > 0){
    						
	        				itemMenu.expandIcon = 'glyphicon glyphicon-plus';
	        				itemMenu.collapseIcon = 'glyphicon glyphicon-minus';
	        				
	        				for (var j = 0; j < arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs.length; j++) {
	        					var itemFilhoMenu = {};
		        				itemFilhoMenu.text = arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs[j].DESCRICAO.toLowerCase();
		        				itemFilhoMenu.href = arrayItemMenu[i].MENU_SUPERIOR_MENU_ITEMs[j].FORM;
		        				itemMenu.nodes.push(itemFilhoMenu);
		        				itemMenu.state = { expanded: expandirMenuAutomaticamente };
							}
	        				
	        			}
	        			menu.push(itemMenu);
	        		}
	        }
	       
	                         
	        $('#menuEsquerdo').treeview({
	        	color: "#000000",
	        	showTags : true,
	        	enableLinks : true,
	        	onhoverColor: "orange",
	        	highlightSelected: true,
	        	data: menu
        	});
        }
    });
} 

function CarregarComboEmpresa() {
    
    $.ajax({
    url:GetRESTEndpointAPI() + 'EMPRESA/', 
    context: document.body,
    type: 'GET',
    statusCode: {
        404: function() {
        	alert( "Recurso nao encontrado." );
        	},
        401: function() {
        	sairDoSistema();
          	},
        403: function() {
        	sairDoSistema();
          	},
    },
    beforeSend: function (xhr) {
        xhr.setRequestHeader ("AUTHORIZATION", "Basic " + (getItemSessionStorage('usuarioInfoUsuario') + ":" + getItemSessionStorage('idSessao')));
    },
    success: function (result) {
            var arrayItemMenu = $.parseJSON(result.Retorno).listaEmpresa;
            for (var i = 0; i < arrayItemMenu.length; i++) {
                $('#cbo_AlterarEmpresa').append(
                    "<li><a href='#'>" + arrayItemMenu[i].nomeEmpresa + "</a></li>"
                );
            }
        }
    });
}

function CarregarComboGenerico(entidade, path, idCombo, campoValor, campoDescricao) {                                     
    $.ajax({                                                                        
        url: GetRESTEndpoint(entidade) + "/" + (path == null || path == undefined ? '' : path),
        context: document.body,                                                     
        type: 'GET',
        statusCode: {
            404: function() {
            	alert( getMensagem404() );
            	},
            401: function() {
            	sairDoSistema();
              	},
            403: function() {
            	sairDoSistema();
              	},
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("AUTHORIZATION", "Basic " + (getItemSessionStorage('usuarioInfoUsuario') + ":" + getItemSessionStorage('idSessao')));
        },
        success: function(result){
        	$('#' + idCombo + '').empty();
        	$('#' + idCombo + '').append($('<option>', {                    
                value: null,                                    
                text :  ''                         
        	}));
        	if(result.Retorno != null){
	            var arrayCombo = result.Retorno;  
	            for (var i = 0; i < arrayCombo.length; i++) {  
                        var obj = arrayCombo[i];
	                    $('#' + idCombo + '').append($('<option>', { 
	                        value: obj[campoValor],                                    
	                        text :  obj[campoDescricao]                        
	                }));                                                                
	            } 
        	}else{
        		alert('Erro ao buscar lista de opcoes para o seletor ' + idCombo);
        	}
        }                                                                           
    });                                                                             
}

function CarregarComboOpcoes(idTipo, idCombo) {                                     
    $.ajax({                                                                        
        url: GetRESTEndpoint('TIPO') + "/" + idTipo + "/GETTIPOVALOR",
        context: document.body,                                                     
        type: 'GET',
        statusCode: {
            404: function() {
            	alert( "Recurso não encontrado." );
            	},
            401: function() {
            	sairDoSistema();
              	},
            403: function() {
            	sairDoSistema();
              	},
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("AUTHORIZATION", "Basic " + (getItemSessionStorage('usuarioInfoUsuario') + ":" + getItemSessionStorage('idSessao')));
        },
        success: function(result){
        	$('#' + idCombo + '').empty();
        	$('#' + idCombo + '').append($('<option>', {                    
                value: null,                                    
                text :  ''                         
        	}));
        	if(result.Retorno != null){
	            var arrayCombo = result.Retorno;  
	            for (var i = 0; i < arrayCombo.length; i++) {                           
	                    $('#' + idCombo + '').append($('<option>', {                    
	                        value: arrayCombo[i].ID__CHAVE_SEQUENCIAL,                                    
	                        text :  arrayCombo[i].DESCRICAO                         
	                }));                                                                
	            } 
        	}else{
        		alert('Erro ao buscar lista de opções para o seletor ' + idCombo);
        	}
        }                                                                           
    });                                                                             
}

function CarregarLookup(idPopUp, idDataTable, idLookupInputCodigo,idLookupInputDescricao, model, filtroOuPath, colunas) { 
	
	/*/*/
    $.ajax({                                                                        
        url: GetRESTEndpoint(model) + "/" + filtroOuPath,
        context: document.body,                                                     
        type: 'GET',
        statusCode: {
            404: function() {
            	alert( "Recurso não encontrado." );
            	},
            401: function() {
            	sairDoSistema();
              	},
            403: function() {
            	sairDoSistema();
              	},
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("AUTHORIZATION", "Basic " + (getItemSessionStorage('usuarioInfoUsuario') + ":" + getItemSessionStorage('idSessao')));
        },
        success: function(result){
            $(idDataTable).unbind( "click" );
            $(idDataTable).DataTable().clear().draw();

            /*Carregar DataTable*/
            CarregarDataTableComDefinicaoDeColunas(idDataTable, result.Retorno, false, colunas)
        	
            $(idPopUp).dialog('open');
            
            $(idDataTable).on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(idDataTable).DataTable().$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                $(idLookupInputCodigo).val($(idDataTable).DataTable().row(this).data()[0]);
                $(idLookupInputDescricao).val($(idDataTable).DataTable().row(this).data()[1]);
                $(idPopUp).dialog('close');
            }

    	   });
        }                                                                           
    });                                                                             
}

/**************************************************************************************/

/*********************** Funcoes Helper ***********************************************/
function recuperarTipoIdURL()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function CarregarDataTable(dataTableId, colecao, exibirSubColecao){ 
	if(colecao != null){
		if(colecao[0] != undefined){
	        var propriedades = Object.keys(colecao[0]);                    
	        var colunas = [];                                                           
	        for (var i=0; i < propriedades.length; i++ ){  
	        	if(Object.prototype.toString.call(colecao[0][propriedades[i]] ) !== '[object Array]'){ 
	                colunas.push({ "title": propriedades[i], "class": "center" });  
	            } else{
	            	if(exibirSubColecao){
	            		colunas.push({ "title": propriedades[i], "class": "center" }); 
            		}
	            }
	        }                                                                           
	        var dataSet = [];                                                           
	        for (var i = 0; i < colecao.length; i++) {                     
	            var arrayValores = [];                                                  
	            for(j in colecao[i]){   
	            	var valorAtual = colecao[i][j];
	            	if(Object.prototype.toString.call(valorAtual) !== '[object Array]'){
	            		if(valorAtual == null){
	            			arrayValores.push('');
	            		}
	            		else if(typeof(valorAtual) === 'object'){
	            			arrayValores.push((colecao[i][j]).DESCRICAO);
	            		}else{
	            			arrayValores.push(colecao[i][j]);
	            		}
	            	}else{
	            		if(exibirSubColecao){
	            			arrayValores.push("<a style=\"cursor: pointer\" onclick=\"javascript:pesquisarLookup(null,null, 'TABELA', null);\">i class=\"fa fa-search\"></i></a>");
	            		}
	            	}
	            }                                                                       
	            dataSet.push(arrayValores);                                             
	        }                                                                           
	        var oTable = $(dataTableId).dataTable({                                     
	                "retrieve": true,                                                 
	                "columns": colunas                                                
	        });                                                                         
	        oTable.fnClearTable();                                                      
	        if (dataSet.length > 0) {                                                   
	            oTable.fnAddData(dataSet);                                              
	        }                                                                           
	        oTable.fnDraw();  
		}
	}
} 

function CarregarDataTableComDefinicaoDeColunas(dataTableId, colecao, exibirSubColecao, colunas){ 
	if(colecao != null){
		if(colecao[0] != undefined){
	        var propriedades = Object.keys(colecao[0]);                    
	        for (var i=0; i < propriedades.length; i++ ){  
	        	if(Object.prototype.toString.call(colecao[0][propriedades[i]] ) !== '[object Array]'
	        		&& $.inArray( propriedades[i], colunas ) > -1){ 
	                colunas.push({ "title": propriedades[i], "class": "center" });  
	            } else{
	            	if(exibirSubColecao 
	            			&& $.inArray( colecao[0][propriedades[i]], colunas ) > -1){
	            		colunas.push({ "title": propriedades[i], "class": "center" }); 
            		}
	            }
	        }                                                                           
	        var dataSet = [];                                                           
	        for (var i = 0; i < colecao.length; i++) {                     
	            var arrayValores = [];                                                  
	            for(j in colecao[i]){   
	            	var valorAtual = colecao[i][j];
	            	if(Object.prototype.toString.call(valorAtual) !== '[object Array]'
	            		&& $.inArray( j, colunas ) > -1){
	            		if(valorAtual == null){
	            			arrayValores.push('');
	            		}
	            		else if(typeof(valorAtual) === 'object'){
	            			arrayValores.push((colecao[i][j]).DESCRICAO);
	            		}else{
	            			arrayValores.push(colecao[i][j]);
	            		}
	            	}else{
	            		if(exibirSubColecao && $.inArray( j, colunas ) > -1){
	            			arrayValores.push("<a style=\"cursor: pointer\" onclick=\"javascript:pesquisarLookup(null,null, 'TABELA', null);\">i class=\"fa fa-search\"></i></a>");
	            		}
	            	}
	            }                                                                       
	            dataSet.push(arrayValores);                                             
	        }        
	        
	        var colunasExibicao = [];
                for (var i = 0; i < colunas.length; i++){
                        if(typeof(colunas[i]) !== 'object'){
                                colunasExibicao.push(colunas[i])
                        }
                }
	        
	        var oTable = $(dataTableId).dataTable({                                     
	                "retrieve": true,                                                 
	                "columns": colunasExibicao                                               
	        });                                                                         
	        oTable.fnClearTable();                                                      
	        if (dataSet.length > 0) {                                                   
	            oTable.fnAddData(dataSet);                                              
	        }                                                                           
	        oTable.fnDraw();  
		}
	}
} 
/************************************************************************************/
/* ******************** Funcoes de Serializacao ******************* */
function datagridToJSON(dataGridId) {                                               
    var myTableArray = [];                                                          
    $("" + dataGridId + " tr").each(function () {                               
        var arrayOfThisRow = [];                                                    
        var tableData = $(this).find('td');                                         
        if (tableData.length > 0) {                                                 
            tableData.each(function () { arrayOfThisRow.push($(this).text()); });   
            myTableArray.push(arrayOfThisRow);                                      
        }                                                                           
    });                                                                             
}     

function limparFormulario(formId){
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea, form" + formId + " checkbox, form" + formId + " password").each(function () {
        var input = $(this);
        input.val("");
    });
}

function objetoToFormulario(formId, objetoDados){
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea, form" + formId + " checkbox, form" + formId + " password").each(function () {
        var input = $(this);
        var valorBackEnd = objetoDados[input.attr('id')];
        if(valorBackEnd !== undefined){
            input.val(valorBackEnd);
        }
            
    });
}

function formularioToModelView(formId, modelView){
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea, form" + formId + " checkbox, form" + formId + " password").each(function () {
        var input = $(this);
        modelView[input.attr('id')] = input.val();
    });
}

function formularioToJSON(formId) { 
    var modelView = {};
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea, form" + formId + " checkbox, form" + formId + " password").each(function () {
        var input = $(this); 
        if (input.attr("id") !== undefined && input.val() !== undefined) {
            modelView[input.attr("id")] = input.val();
        }
    });
    return JSON.stringify(modelView);
}

function formularioToJavascriptArray(formId) {                                                                      
    $("form" + formId + " input,form" + formId + " select,form" + formId + 
    		" textarea, form" + formId + " checkbox, form" + formId + " password ").each(function () {  
        var input = $(this);                                                                                        
        if (input.attr("id") != undefined && input.val() != undefined) {                                          
            modelView[input.attr("id")] = input.val();                                                            
        }                                                                                                           
    });                                                                                                             
} 

function detalhesToJavascriptArray(idCampoChave) {  
    var arrayDetalhesData = [];                                                         
    $('#detalhesTabContent table').each(function () {  
        var tableId = $(this).attr('id');              
        var myTableArray = [];                                                          
        var arrayObjeto = [];   
        var rowCount = $(tableId).dataTable().fnGetData().length;
        
        /*
        var oTable = $(tableId).dataTable();
        // Get the nodes from the table
        var nNodes = oTable.fnGetNodes( );
        */
       
        $("#" + tableId + " tr").each(function (indiceLinha) {                      
            var tipoObjeto;                                                             
            var arrayOfThisRow = [];                                                    
            var tableData = $(this).find('td');                                         
            if (tableData.length > 0) {                                                 
                tableData.each(function () {                                            
                    if (indiceLinha == 0) {                                             
                         arrayOfThisRow.push($(this).attr('id'));                       
                    } else {                                                            
                        arrayOfThisRow.push($(this).text());                            
                    }                                                                   
                });                                                                     
                myTableArray.push(arrayOfThisRow);                                      
            }                                                                           
            if (indiceLinha > 0) {                                                      
                tipoObjeto = {};                                                        
                for (var i = 0; i < myTableArray[0].length; i++) {                      
                    if (myTableArray[0][i] == idCampoChave) {                                   
                        tipoObjeto[myTableArray[0][i]] = (rowCount + indiceLinha).toString();        
                    } else {                                                            
                        tipoObjeto[myTableArray[0][i]] = arrayOfThisRow[i];             
                    }                                                                   
                }                                                                       
                arrayObjeto.push(tipoObjeto);                                           
            }                                                                           
        });                                                                             
        modelView[tableId] = arrayObjeto;                                               
    });                                                                                 
}

function tableToJavascriptArray(tableId) {
    var myTableArray = [];
    var arrayObjeto = [];
    $("#" + tableId + " tr").each(function (indiceLinha) {
        var tipoObjeto;
        var arrayOfThisRow = [];
        var tableData = $(this).find('td');
        if (tableData.length > 0) {
            tableData.each(function () { 
                arrayOfThisRow.push($(this).text()); 
            });
            myTableArray.push(arrayOfThisRow);
        }
        if (indiceLinha > 0) {
            tipoObjeto = {};
            for (var i = 0; i < myTableArray[0].length; i++) {
                tipoObjeto[myTableArray[0][i]] = arrayOfThisRow[i];
            }
            arrayObjeto.push(tipoObjeto);
        }
    });
    
    return myTableArray;
}

function sairDoSistema(){

    if(confirm('Deseja realmente sair do sistema ?')){
        $.ajax({
        url:GetRESTEndpointAPI() + 'LOGIN/LOGOUT/' + getItemSessionStorage('idSessao'), 
        context: document.body,
        type: 'POST',
        success: function (result) {
                sessionStorage.clear();
                alert('Logout efetuado com sucesso.');
                window.location = JSON.parse(result.Retorno).url;
            }
        });
    }
	
}
/************************************************************************************/

