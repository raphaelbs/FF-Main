/*Existe um Arquivo chamado custom_TIPO_VALOR.js onde as customizacoes para as funcoes ja existentes devem ser feitas. */
var operacao = 'GET';  
var tipoId;
var modelView = {}; 
var __TIPO_USUARIO_SISTEMA = 'SISTEMA';

$( document ).ready(function() {    
    CarregarPagina();               
});                                 
function CarregarPagina() { 
	//Fixar o valor do Tipo de acordo com a URL
    tipoId = recuperarTipoIdURL()['TIPO_ID'];
    $('#TIPO_DE_TIPO_ID').val(tipoId);
    
    setTituloPagina();
    
    CarregarMenuEsquerdo(true); 
    //CarregarComboEmpresa(); 
    CarregarComboOpcoes(0, 'TIPO');
    
    $('#boasVindas').html('Bem vindo(a) ' + getItemSessionStorage('usuarioInfoNome'));
	$('#loginData').html('Login efetuado em  ' + getItemSessionStorage('usuarioInfoDataLogin'));
	$('#NomeUsuarioInfCabecalho').html(getItemSessionStorage('usuarioInfoNome'));
    
    //Configurar Grade de Exibicao
    $('#dtGrade_TIPO_VALOR').DataTable({
            "oLanguage": {
                "sProcessing":   "Processando...",
                "sLengthMenu":   "Mostrar _MENU_ registros",
                "sZeroRecords":  getsZeroRecords(),
                "sInfo":         getsInfo(),
                "sInfoEmpty":    getsInfoEmpty(),
                "sInfoFiltered": "",
                "sInfoPostFix":  "",
                "sSearch":       "Buscar:",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    getsFirst(),
                    "sPrevious": getsPrevious(),
                    "sNext":     getsNext(),
                    "sLast":     getsLast()
                }
            }
    });
    $('#dtGrade_TIPO_VALOR').on('click', 'tr', function () {
       if ($(this).hasClass('selected')) {
           $(this).removeClass('selected');
       }
       else {
           $('#dtGrade_TIPO_VALOR').DataTable().$('tr.selected').removeClass('selected');
           $(this).addClass('selected');
           popularFormEdicao($('#dtGrade_TIPO_VALOR').DataTable().row(this).data(), '#frmCRUD_TIPO_VALOR');
           $('#SelecionaInformacoesGerais').click();
       }
   });
    
   setCampoTipoSistema();
   
} 
/* ******************** Funcoes de Pesquisa ******************* */
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
function ListarTodos(dataGridId, idLabelExibicaoQuantidade) {                                  
    var retorno;                                                    
    $.ajax({                                                        
        //url: GetRESTEndpoint('TIPO_VALOR') + '/TIPO/' + tipoId.toString(),
        url: GetRESTEndpoint('TIPO') + "/" + tipoId.toString() + "/GETTIPOVALOR",   
        context: document.body,                                     
        type: 'GET',                                                
        success: function(result){   
        	if(result.Retorno.length > 0){
        		CarregarDataTable(dataGridId, result.Retorno, false);
        		var tituloAtual = getTituloGradeExibicao();
        		$(idLabelExibicaoQuantidade).text('');
        		$(idLabelExibicaoQuantidade).html(tituloAtual).append(" <span class='badge'>" + $(dataGridId).DataTable().data().length + "</span>");
        		$('#SelecionaGradeExibicao').click();
        	}
        	else{
        		$(dataGridId).DataTable().clear();
        		$(dataGridId).DataTable().draw();
        		alert(getsZeroRecords());
        	}
        }                                                           
    });                                                             
}                                                                   
function Listar(dataGridId, data) {
    var retorno;
    $.ajax({
        url: GetRESTEndpoint('TIPO_VALOR') + "?parametros=" + data + "",
        type: 'GET',
        success: function (result) {
            CarregarDataTable(dataGridId, result);
        }
    });
}
function pesquisarLookup(idLookupInput) { }
/**************************************************************/
/* ******************** Fun��es de Inser��o ******************* */
function PrepararFormInclusao(formId) {                                                                             
    operacao = 'POST';  
    //Set Tipo
    var idTipo = recuperarTipoIdURL();
    $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
        var input = $(this);   
        input.attr("disabled", false);
        if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL') {                                                                             
            input.val('-1');                                                                                        
            input.attr("disabled", true);                                                                   
        }else if(input.attr('id') == 'TIPO_DE_TIPO_ID'){
        	input.val(tipoId);
        } else {                                                                                                    
            input.val('');                                                                                          
        }                                                                                                           
    }); 
    
    $('#TIPO').val(idTipo["TIPO_ID"]);
    
}                                                                                                                   
function Inserir(JSONData, idLabelExibicaoQuantidade) { 
	
	if($('#DESCRICAO').val() == ""){
		alert('Descricao deve ser informada.');
		$('#DESCRICAO').focus();
		return;
	}
	
	//ConfirmaÃ§Ã£o caso seja um tipo de Sistema
	if($('#TIPO').val() == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA){
		alert('Voce esta inserindo um tipo de Sistema. Este tipo nao pode ser alterado ou exclui�do.');
	}
	
    var retorno;                        
    $.ajax({                                
        url: GetRESTEndpoint('TIPO_VALOR'), 
        context: document.body,             
        data: JSONData,
        type: 'POST',                       
        success: function(result){          
            retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Inserido com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO_VALOR', idLabelExibicaoQuantidade);
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
/* ******************** FunÃ§Ãµes de AlteraÃ§Ã£o ******************* */
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
    
    // Habilitar/Desabilitar botÃµes da barra de AÃ§Ã£o
    var habilitar = (linha[3] != 1 && getItemSessionStorage('usuarioInfoTipoUsuario') == __TIPO_USUARIO_SISTEMA);
    $('#btnEditar').attr('disabled', habilitar);
    $('#btnExcluir').attr('disabled', habilitar);
    $('#btnGravar').attr('disabled', habilitar);
    
}                                                                                                                   
function Alterar(JSONData) {                        
    var retorno;                        
    $.ajax({                                
        url: GetRESTEndpoint('TIPO_VALOR'), 
        context: document.body,             
        data: JSONData,
        type: 'PUT',                        
        success: function(result){          
        	retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Alterado com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO_VALOR');
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
		alert('Este item n�o pode ser editado ou exclui�do pois se trata de um item de sistema.');
		//return;
	}
	
	
	// Habilitar/Desabilitar botÃµes da barra de AÃ§Ã£o
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
        }
        
        indiceControle++;
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
/* ******************** Fun��es de Exclus�o ******************* */
function PrepararFormExclusao(formId, idLabelExibicaoQuantidade) { 
	
    if (confirm("Deseja Realmente Excluir este Registro ?")) {                                                        
        operacao = 'DELETE';                                                                                            
        $("form" + formId + " input,form" + formId + " select,form" + formId + " textarea").each(function () {  
            var input = $(this);                                                                                        
            if (input.attr('id') == 'ID__CHAVE_SEQUENCIAL') {                                                                                 
                input.attr("disabled", 'disabled');                                                                       
            }                                                                                                               
        }); 
        
        Excluir($('#ID__CHAVE_SEQUENCIAL').val(), idLabelExibicaoQuantidade);
    }                                                                                                                   
}                                                                                                                       
function Excluir(id, idLabelExibicaoQuantidade) {                  
    var retorno;                        
    $.ajax({                            
        url: GetRESTEndpoint('TIPO_VALOR') + '/' + id.toString(), 
        context: document.body,         
        data: { 'id' : id },            
        type: 'DELETE',                 
        success: function(result){      
        	retorno = result;               
            status = result.Resultado ;
            if(status == 'SUCESSO') { 
            	alert('Registro Exclu�do com Sucesso. '); 
            	ListarTodos('#dtGrade_TIPO_VALOR', idLabelExibicaoQuantidade);
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

/**************************************************************/
/* ******************** FunÃ§Ãµes de ApresentaÃ§Ã£o ******************* */
function exibirComoTabela(idDiv) {                                      
 $(idDiv).hide();                                                       
};                                                                      
function exibirComoDetalhe(idDiv) {                                     
 $(idDiv).show();                                                       
}; 
function setTituloPagina(){
	var retorno;                                                    
    $.ajax({                                                        
        url: GetRESTEndpoint('TIPO') + '/' + tipoId.toString(),   
        context: document.body,                                     
        type: 'GET',                                                
        success: function(result){  
        	if(result.Retorno != null){
        		$('#tituloPagina').html(result.Retorno.DESCRICAO.toLowerCase()); 
        	}else{
        		$('#tituloPagina').empty();
        	}
                   
        }                                                           
    });      
}
function setCampoTipoSistema(){
	//Configura o campo de tipo de sistema de acordo com o tipo de usuÃ¡rio
	(getItemSessionStorage('usuarioInfoTipoUsuario') == __TIPO_USUARIO_SISTEMA ? $('#divTIPO').show() : $('#divTIPO').hide());
	(getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA ? $('#TIPO').val(0) : null);
	$('#TIPO').prop( "disabled", getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA );
}
/**************************************************************/
/* ******************** FunÃ§Ãµes Helper ******************* */
                                                                                  
function EnviarDadosParaBackEnd(formId, idLabelExibicaoQuantidade) {    
	var msgConfirmacao = "Confirma a grava��o do registro ?";
	if($('#TIPO').val() == 1 && getItemSessionStorage('usuarioInfoTipoUsuario') != __TIPO_USUARIO_SISTEMA){
		msgConfirmacao += '\nEste Ã© um item de sistema, portanto o mesmo nÃ£o poderÃ¡ ser excluÃ­do ou alterado.';
	}
    if (confirm(msgConfirmacao)) {                           
        formularioToJavascriptArray(formId);                                        
        detalhesToJavascriptArray('ID__CHAVE_SEQUENCIAL');                                                
        var JSONData = JSON.stringify(modelView);                                   
        switch (operacao) {                                                         
            case "POST":                                                          
                Inserir(JSONData, idLabelExibicaoQuantidade);                                                  
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
