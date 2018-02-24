/*Para customizar uma função já existente NÃO ALTERE ESTE ARQUIVO. */
/*Existe um Arquivo chamado custom_TIPO.js onde as customizações para as funções já existentes devem ser feitas. */
var operacao = 'GET';               
var modelView = {};        
var __TIPO_USUARIO_SISTEMA = 'SISTEMA';

$( document ).ready(function() {    
    CarregarPagina();               
});                                 
function CarregarPagina() { 
	CarregarMenuEsquerdo(false); 
    //CarregarComboEmpresa(); 
    CarregarComboOpcoes(0, 'TIPO_FLAG'); 
    CarregarComboOpcoes(0, 'frmTIPO_DE_TIPO_TIPO_VALORs\\.TIPO'); 
    
    $('#boasVindas').html('Bem vindo(a) ' + getItemSessionStorage('usuarioInfoNome'));
	$('#loginData').html('Login efetuado em  ' + getItemSessionStorage('usuarioInfoDataLogin'));
	$('#NomeUsuarioInfCabecalho').html(getItemSessionStorage('usuarioInfoNome'));
	
    // Grade Detalhe TIPO_DE_TIPO_TIPO_VALORs
    $('#TIPO_DE_TIPO_TIPO_VALORs').DataTable();
    $('#TIPO_DE_TIPO_TIPO_VALORs').on('click', 'tr', function () {
       if ($(this).hasClass('selected')) {
           $(this).removeClass('selected');
       }
       else {
           $('#TIPO_DE_TIPO_TIPO_VALORs').DataTable().$('tr.selected').removeClass('selected');
           $(this).addClass('selected');
           popularFormEdicao($('#TIPO_DE_TIPO_TIPO_VALORs').DataTable().row(this).data(), '#frmTIPO_DE_TIPO_TIPO_VALORs');
       }
   });
    $('#dtGrade_TIPO').DataTable();
    $('#dtGrade_TIPO').on('click', 'tr', function () {
       if ($(this).hasClass('selected')) {
           $(this).removeClass('selected');
       }
       else {
           $('#dtGrade_TIPO').DataTable().$('tr.selected').removeClass('selected');
           $(this).addClass('selected');
           popularFormEdicao($('#dtGrade_TIPO').DataTable().row(this).data(), '#frmCRUD_TIPO');
           $('#SelecionaInformacoesGerais').click();
       }
   });
} 
/* ******************** Funções de Pesquisa ******************* */
/* ******************** Funções de Pesquisa ******************* */
function PrepararFormPesquisa(formId) {                                             
    operacao = 'GET';                                                               
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () { 
        var input = $(this); // This is the jquery object of the input, do what you will 
        input.val(''); 
    });
}                                                                                    
function Pesquisar(formId) {
    operacao = 'GET';
    var filtro = [];
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {
        var input = $(this); // This is the jquery object of the input, do what you will 
        if (input.val() != '' && input.val() != undefined) {
            var objetoFiltro = {};
            objetoFiltro[$(this).attr('id')] = $(this).val();
            filtro.push(objetoFiltro);
        }
    });
    if (filtro.length <= 0) {
        ListarTodos('#dtGrade_TIPO');
    } else {
        var modelFiltro = {};
        modelFiltro["TIPO_VALOR"] = $(formId).serializeArray();
        var JSONData = JSON.stringify(filtro)
        Listar('#dtGrade_TIPO', JSONData);
    }
}
function ListarTodos(dataGridId) {                                  
    var retorno;                                                    
    $.ajax({                                                        
        url: GetRESTEndpoint('TIPO'),   
        context: document.body,                                     
        type: 'GET',                                                
        success: function(result){   
        	if(result.Retorno.length > 0){
        		CarregarDataTable(dataGridId, result.Retorno);
        		$('#SelecionaGradeExibicao').click();
        	}
        	else{
        		$(dataGridId).DataTable().clear();
        		$(dataGridId).DataTable().draw();
        	}
        }                                                           
    });                                                             
}                                                                   
function Listar(dataGridId, data) {
    var retorno;
    $.ajax({
        url: GetRESTEndpoint('TIPO') + "?parametros=" + data + "",
        type: 'GET',
        success: function (result) {
            CarregarDataTable(dataGridId, result);
        }
    });
}
function pesquisarLookup(idLookupInput) { }
/**************************************************************/
/* ******************** Funções de Inserção ******************* */
function PrepararFormInclusao(formId) {                                                                             
    operacao = 'POST';                                                                                              
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
        var input = $(this);                                                                                        
        if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL') {                                                                             
            input.val('-1');                                                                                        
            input.attr("disabled", 'disabled');                                                                   
        }else {                                                                                                    
            input.val('');                                                                                          
        }                                                                                                           
    });                                                                                                             
}                                                                                                                   
function Inserir(JSONData) { 
	
	if($('#DESCRICAO').val() == ""){
		alert('Descrição deve ser informada.');
		$('#DESCRICAO').focus();
		return;
	}
	
	//Confirmação caso seja um tipo de Sistema
	if($('#TIPO_FLAG').val() == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA){
		alert('Você está inserindo um tipo de Sistema. Este tipo não pode ser alterado ou excluído.');
	}
	
    var retorno;                        
    $.ajax({                                
        url: GetRESTEndpoint('TIPO'), 
        context: document.body,             
        data: JSONData,
        type: 'POST',                       
        success: function(result){          
            retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Inserido com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO');
        	} else if(status == 'ERRO') {
            	var msg = JSON.parse(result.Erro);
            	alert(msg.mensagem);
        	}
        }                                   
    });                                     
    return retorno;                     
}                                           
function adicionarItem(dataGridId, formId) { 
        var arrayCamposFormulario = $(formId).serializeArray(); 
        var linha = []; 
        for (var i = 0; i < arrayCamposFormulario.length; i++) { 
            linha[i] = arrayCamposFormulario[i].value; 
        }
        $(dataGridId).DataTable().row.add(linha).draw(false); 
}
/**************************************************************/
/* ******************** Funções de Alteração ******************* */
function PrepararFormEdicao(linha, formId) {
	operacao = 'PUT';                                                                                               
    var indiceControle = 0;
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
        var input = $(this);                                                                                        
        input.val(linha[indiceControle]);                                                                           
        if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL' || linha[3] == 1) {                                                                             
            input.attr("disabled", 'disabled');                                                                   
        }                                                                                                           
        indiceControle++;                                                                                           
    });
    
    // Habilitar/Desabilitar botões da barra de Ação
    var habilitar = (linha[3] != 1 && getItemSessionStorage('usuarioInfoTipoUsuario') == __TIPO_USUARIO_SISTEMA);
    $('#btnEditar').attr('disabled', habilitar);
    $('#btnExcluir').attr('disabled', habilitar);
    $('#btnGravar').attr('disabled', habilitar);
    
}                                                                                                                   
function Alterar(JSONData) {                        
    var retorno;                        
    $.ajax({                                
        url: GetRESTEndpoint('TIPO'), 
        context: document.body,             
        data: JSONData,
        type: 'PUT',                        
        success: function(result){          
        	retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Alterado com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO');
        	} else if(status == 'ERRO') {
            	var msg = JSON.parse(result.Erro);
            	alert(msg.mensagem);
        	} 
        }                                   
    });                                     
    return retorno;                         
}                                           
function popularFormEdicao(linha, formId) {
	operacao = 'PUT';
	
	if(linha[3] == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA){
		alert('Este item não pode ser editado ou excluído pois se trata de um item de sistema.');
		return;
	}
	
	
	// Habilitar/Desabilitar botões da barra de Ação
    var habilitar = (linha[3] != 1 && getItemSessionStorage('usuarioInfoTipoUsuario') == __TIPO_USUARIO_SISTEMA);
    $('#btnEditar').attr('disabled', habilitar);
    $('#btnExcluir').attr('disabled', habilitar);
    $('#btnGravar').attr('disabled', habilitar);
    
	
    var indiceControle = 0;
    
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {
        var input = $(this);
        if(input.attr('type') != 'hidden'){
	        input.val(linha[indiceControle]);
	        if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL' || (linha[3] == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA)) {                                                                             
	            input.attr("disabled", 'disabled');                                                                   
	        }                      
	        indiceControle++;
        }
    });
}                                                                                                                   
function alterarItem(dataGridId, formId) {                                                                          
    var linha = $(dataGridId).DataTable().row('.selected').data();                                                  
    var indiceCampo = 1;                                                                                            
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
        var input = $(this);                                                                                        
    if (input.attr("id") != undefined && input.val() != undefined) {                                              
        linha[indiceCampo] = input.val();                                                                           
    }                                                                                                               
    indiceCampo++;                                                                                                  
    });                                                                                                             
    $(dataGridId).DataTable().invalidate();                                                                         
    $(dataGridId).DataTable().draw(false);                                                                          
}                                                                                                                   
/**************************************************************/
/* ******************** Funções de Exclusão ******************* */
function PrepararFormExclusao(formId) { 
	
    if (confirm("Deseja Realmente Excluir este Registro ?")) {                                                        
        operacao = 'DELETE';                                                                                            
        $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
            var input = $(this);                                                                                        
            if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL') {                                                                                 
                input.attr("disabled", 'disabled');                                                                       
            }                                                                                                               
        }); 
        
        Excluir($('#ID__CHAVE_SEQUENCIAL').val());
    }                                                                                                                   
}                                                                                                                       
function Excluir(id) {                  
    var retorno;                        
    $.ajax({                            
        url: GetRESTEndpoint('TIPO') + '/' + id.toString(), 
        context: document.body,         
        data: { 'id' : id },            
        type: 'DELETE',                 
        success: function(result){      
        	retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Excluído com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO');
        	} else if(status == 'ERRO') {
            	var msg = JSON.parse(result.Erro);
            	alert(msg.mensagem);
        	} 
        }                               
    });                                 
    return retorno;                     
}                                       
function removerItem(dataGridId) {
    if (confirm("Deseja Realmente Remover o Registro Selecionado ?")) {   
        $(dataGridId).DataTable().row('.selected').remove().draw(false);    
    }                                                                       
}                                                                        
/**************************************************************/
/* ******************** Funções de Lista ******************* */
function CarregarComboOpcoes(idTipo, idCombo) {                                     
    $.ajax({                                                                        
        url: GetRESTEndpoint('TIPO') + '/' + idTipo,
        context: document.body,                                                     
        type: 'GET',                                                                
        success: function(result){
        	if(result.Retorno != null){
	            var arrayCombo = result.Retorno.TIPO_DE_TIPO_TIPO_VALORs;  
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
/**************************************************************/
/* ******************** Funções de Serialização ******************* */
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
function formularioToJSON(formId) { 
    var modelView = {};
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {
        var input = $(this); // This is the jquery object of the input, do what you will
        if (input.attr("id") != undefined && input.val() != undefined) {
            modelView[input.attr("id")] = input.val();
        }
    });
    return JSON.stringify(modelView);
}
function formularioToJavascriptArray(formId) {                                                                      
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
        var input = $(this);                                                                                        
        if (input.attr("id") != undefined && input.val() != undefined) {                                          
            modelView[input.attr("id")] = input.val();                                                            
        }                                                                                                           
    });                                                                                                             
}                                                                                                                   
function detalhesToJavascriptArray() {                                                  
    var arrayDetalhesData = [];                                                         
    $('#detalhesTabContent table').each(function () {                                   
        var tableId = $(this).attr('id');                                               
        var myTableArray = [];                                                          
        var arrayObjeto = [];                                                           
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
                    if (myTableArray[0][i] == 'ID') {                                   
                        tipoObjeto[myTableArray[0][i]] = rowCount + indiceLinha;        
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
function tableToJavascriptArray(table) {
    var myTableArray = [];
    var arrayObjeto = [];
    $("" + table + " tr").each(function (indiceLinha) {
        var tipoObjeto;
        var arrayOfThisRow = [];
        var tableData = $(this).find('td');
        if (tableData.length > 0) {
            tableData.each(function () { arrayOfThisRow.push($(this).text()); });
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
}
/**************************************************************/
/* ******************** Funções de Apresentação ******************* */
function exibirComoTabela(idDiv) {                                      
	 $(idDiv).hide();                                                       
};                                                                      
function exibirComoDetalhe(idDiv) {                                     
 $(idDiv).show();                                                       
}; 
function setCampoTipoSistema(){
	//Configura o campo de tipo de sistema de acordo com o tipo de usuário
	(getItemSessionStorage('usuarioInfoTipoUsuario') == __TIPO_USUARIO_SISTEMA ? $('#TIPO').show() : $('#TIPO_FLAG').hide());
	(getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA ? $('#TIPO_FLAG').val(0) : null);
	$('#TIPO_FLAG').prop( "disabled", getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA );
}                                                                
/**************************************************************/
/* ******************** Funções Helper ******************* */
                                                                      
function EnviarDadosParaBackEnd(formId) {    
	var msgConfirmacao = "Confirma a gravação do registro ?";
	if($('#TIPO').val() == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA){
		msgConfirmacao += '\nEste é um item de sistema, portanto o mesmo não poderá ser excluído ou alterado.';
	}
    if (confirm(msgConfirmacao)) {                           
        formularioToJavascriptArray(formId);                                        
        detalhesToJavascriptArray('ID__CHAVE_SEQUENCIAL');                                                
        var JSONData = JSON.stringify(modelView);                                   
        switch (operacao) {                                                         
            case "POST":                                                          
                Inserir(JSONData);                                                  
                break;                                                              
            case "PUT": 
            	Alterar(JSONData);
                break;                                                              
            case "DELETE": 
                break;                                                              
            case "GET":                                                           
                break;                                                              
            default:                                                                
                break;                                                              
        }                                                                           
    }                                                                               
}                                                                                   
/**************************************************************/
