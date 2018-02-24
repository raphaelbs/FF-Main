/*Para customizar uma função já existente NÃO ALTERE ESTE ARQUIVO. */
/*Existe um Arquivo chamado custom_PESSOA_FISICA.js onde as customizações para as funções já existentes devem ser feitas. */
var operacao = 'GET';
var modelView = {};
$(document).ready(function() {
	CarregarPagina();
});

function CarregarPagina() {

	//CarregarMenuEsquerdo(false);
	// CarregarComboEmpresa();

	$('#boasVindas').html(
			'Bem vindo(a) ' + getItemSessionStorage('usuarioInfoNome'));
	$('#loginData').html(
			'Login efetuado em  '
					+ getItemSessionStorage('usuarioInfoDataLogin'));
	$('#NomeUsuarioInfCabecalho')
			.html(getItemSessionStorage('usuarioInfoNome'));

}

/** ************************************************ */
