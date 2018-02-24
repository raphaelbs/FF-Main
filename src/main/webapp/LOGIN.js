/*Para customizar uma funcao ja existente Nao ALTERE ESTE ARQUIVO. */
/*Existe um Arquivo chamado login.js onde as customizacoes para as funcoes ja existentes devem ser feitas. */

/* ******************** Funcoes de Negocio ******************* */
$( document ).ready(function() {    
    CarregarPagina();               
});       

function CarregarPagina() { 
	$('#processando').hide();
	$('#mensagemLogin').hide();
}

function efetuarLogin(usuario, senha) { 
	$('#mensagemLogin').empty();
	$('#mensagemLogin').hide();
	
	if(usuario == ''){
		$('#mensagemLogin').show();
		$('#mensagemLogin').append('<h5 style="color:red;font-weight:bold">Usuario deve ser informado.</h5>');
		return;
	}
	
	if(senha == ''){
		$('#mensagemLogin').show();
		$('#mensagemLogin').append('<h5 style="color:red;font-weight:bold">Senha deve ser informada.</h5>');
		return;
	}
	
    var retorno;      
    var data = '{ "usuario" : "' + usuario +'" , "senha" : "' + senha + '" , "dominio" : "' + GetDOMINIO() + '" }';
    $('#processando').show();
    $.ajax({                                
        url: GetRESTEndpoint('LOGIN'),
        contentType:"application/json; charset=utf-8",
        data: data,
        type: 'POST',                       
        success: function(result){  
        	$('#processando').hide();
    		if(result != null && result != undefined){
	            status = result.Resultado;
	            if(status == 'ERRO') {
	            	var msg = JSON.parse(result.Erro);
	            	$('#mensagemLogin').show();
	        		$('#mensagemLogin').append('<h5 style="color:red;font-weight:bold">' + msg.mensagem + '</h5>');
	            	$('#senha').val('');
	            }else if(status == 'SUCESSO'){
	            	var retornoJSON = JSON.parse(result.Retorno);

	            	adicionarItemSessionStorage("usuarioInfoNome", retornoJSON.usuarioInfo.nome);
	            	adicionarItemSessionStorage("usuarioInfoUsuario", retornoJSON.usuarioInfo.usuario);
	            	adicionarItemSessionStorage("usuarioInfoTipoUsuario", retornoJSON.usuarioInfo.tipoUsuario);
	            	adicionarItemSessionStorage("usuarioInfoDataLogin", retornoJSON.usuarioInfo.dataLogin);
	            	adicionarItemSessionStorage("idSessao", retornoJSON.idSessao);
	            	adicionarItemSessionStorage("menuId", retornoJSON.usuarioInfo.menuId);
	            	
	            	window.location = retornoJSON.url;
	            }
    		}
        }
    });                                     
    return retorno;                     
}                                           

/**************************************************************/

