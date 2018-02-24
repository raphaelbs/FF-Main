/*Para customizar uma função já existente NÃO ALTERE ESTE ARQUIVO. */
/*Existe um Arquivo chamado custom_PESSOA_FISICA.js onde as customizações para as funções já existentes devem ser feitas. */
var operacao = 'GET';
var modelView = {};
$(document).ready(function() {
	CarregarPagina();
});

function CarregarPagina() {

	CarregarMenuEsquerdo(false);
	// CarregarComboEmpresa();

	$('#boasVindas').html(
			'Bem vindo(a) ' + getItemSessionStorage('usuarioInfoNome'));
	$('#loginData').html(
			'Login efetuado em  '
					+ getItemSessionStorage('usuarioInfoDataLogin'));
	$('#NomeUsuarioInfCabecalho')
			.html(getItemSessionStorage('usuarioInfoNome'));

	// Grade Entidade
	$('#dtGrade_ENTIDADE').DataTable({
		"oLanguage" : {
			"sProcessing" : "Processando...",
			"sLengthMenu" : "Mostrar _MENU_ registros",
			"sZeroRecords" : "Nao foram encontrados resultados",
			"sInfo" : "Mostrando de _START_ ate _END_ de _TOTAL_ registros",
			"sInfoEmpty" : "Mostrando de 0 ate 0 de 0 registros",
			"sInfoFiltered" : "",
			"sInfoPostFix" : "",
			"sSearch" : "Buscar:",
			"sUrl" : "",
			"oPaginate" : {
				"sFirst" : "Primeiro",
				"sPrevious" : "Anterior",
				"sNext" : "Seguinte",
				"sLast" : "Ultimo"
			}
		}
	});
	$('#dtGrade_ENTIDADE').on(
			'click',
			'tr',
			function() {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				} else {
					$('#dtGrade_ENTIDADE').DataTable().$('tr.selected')
							.removeClass('selected');
					$(this).addClass('selected');
					popularFormEdicao($('#dtGrade_ENTIDADE').DataTable().row(
							this).data(), '#frmCRUD_ENTIDADE');
					$('#SelecionaInformacoesGerais').click();
				}
			});

	// Grade Pesquisa
	$('#dtGrade_POPUP_PESQUISA').DataTable({
		"oLanguage" : {
			"sProcessing" : "Processando...",
			"sLengthMenu" : "Mostrar _MENU_ registros",
			"sZeroRecords" : "Nao foram encontrados resultados",
			"sInfo" : "Mostrando de _START_ ate _END_ de _TOTAL_ registros",
			"sInfoEmpty" : "Mostrando de 0 ate 0 de 0 registros",
			"sInfoFiltered" : "",
			"sInfoPostFix" : "",
			"sSearch" : "Buscar:",
			"sUrl" : "",
			"oPaginate" : {
				"sFirst" : "Primeiro",
				"sPrevious" : "Anterior",
				"sNext" : "Seguinte",
				"sLast" : "Ultimo"
			}
		}
	});

	CarregarComboOpcoes(66, 'frmTABELA_ENTIDADE_CONTATOs\\.TIPO_DE_TRATAMENTO');
	CarregarComboOpcoes(59, 'frmTABELA_ENTIDADE_CONTATOs\\.SEXO');
	CarregarComboOpcoes(21, 'frmTABELA_ENTIDADE_CONTATOs\\.ESTADO_CIVIL');
	CarregarComboOpcoes(6, 'frmTABELA_ENTIDADE_CONTATOs\\.RELIGIAO');
	CarregarComboOpcoes(20, 'TIPO_DO_LOGRADOURO_TIPO_DE_VIA');
	CarregarComboOpcoes(65, 'TIPO_DO_COMPLEMENTO_TIPO_DE_COMPLEMENTO');
	CarregarComboOpcoes(32, 'DADOS_TECNICOS_MODULACAO');
	CarregarComboOpcoes(33, 'DADOS_TECNICOS_FREQUENCIA');
	CarregarComboOpcoes(34, 'DADOS_TECNICOS_CANAL');
	CarregarComboOpcoes(35, 'PERFIL_RADIO_TIPO_RADIO');
	CarregarComboOpcoes(38, 'OUVINTE_IDADE_PREDOMINANTE');
	CarregarComboOpcoes(41, 'OUVINTE_GENERO_PREDOMINANTE');
	CarregarComboOpcoes(42, 'PROGRAMACAO_PRODUCAO');
	CarregarComboOpcoes(44, 'PROGRAMACAO_CONTEUDO');
	CarregarComboOpcoes(45, 'PROGRAMACAO_BASE');
	CarregarComboOpcoes(0, 'PERFIL_RADIO_PERTENCE_GRUPO_RADIO');
	CarregarComboOpcoes(0, 'PERFIL_RADIO_INTEGRA_REDE_RADIO');
	CarregarComboOpcoes(0, 'DADOS_TECNICOS_UTILIZA_RDS');

	$('#popupPesquisa').dialog({
		bJQueryUI : false,
		autoOpen : false,
		height : 300,
		width : 600,
		modal : true
	}).prev(".ui-dialog-titlebar").css("background", "gray");

	$('#popupPesquisaEstado').dialog({
		bJQueryUI : false,
		autoOpen : false,
		height : 300,
		width : 600,
		modal : true
	}).prev(".ui-dialog-titlebar").css("background", "gray");
}
/* ******************** Funções de Pesquisa ******************* */
function PrepararFormPesquisa(formId) {
	operacao = 'GET';
	$(
			"form" + formId + " input,form" + formId + " select,form" + formId
					+ " textarea").each(function() {
		var input = $(this);
		input.val('');
	});
}
function Pesquisar(formId) {
	operacao = 'GET';
	var filtro = [];
	$(
			"form" + formId + " input,form" + formId + " select,form" + formId
					+ " textarea").each(function() {
		var input = $(this); // This is the jquery object of the input, do
								// what you will
		if (input.val() != '' && input.val() != undefined) {
			var objetoFiltro = {};
			objetoFiltro[$(this).attr('id')] = $(this).val();
			filtro.push(objetoFiltro);
		}
	});
	if (filtro.length <= 0) {
		ListarTodos('#dtGrade_MENSAGEM');
	} else {
		var modelFiltro = {};
		modelFiltro["MENSAGEM"] = $(formId).serializeArray();
		var JSONData = JSON.stringify(filtro)
		Listar('#dtGrade_MENSAGEM', JSONData);
	}
}

function ListarTodos(dataGridId, model, path, idLabelExibicaoQuantidade,
		selecionarAbaGrade) {
	var pathCompleto = GetRESTEndpoint(model) + '/' + (path != undefined && path != '' ? path : '');

	$.ajax({
		url : pathCompleto,
		context : document.body,
		type : 'GET',
		success : function(result) {
			if (result.Retorno.length > 0) {
				CarregarDataTable(dataGridId, result.Retorno, false);
				var tituloAtual = getTituloGradeExibicao();
				$(idLabelExibicaoQuantidade).text('');
				$(idLabelExibicaoQuantidade).html(tituloAtual).append(
						" <span class='badge'>"
								+ $(dataGridId).DataTable().data().length
								+ "</span>");
				if (selecionarAbaGrade)
					$('#SelecionaGradeExibicao').click();
			} else {
				$(dataGridId).DataTable().clear();
				$(dataGridId).DataTable().draw();
				alert(getsZeroRecords());
			}
		}
	});
}

function Listar(dataGridId, data) {
	$.ajax({
		url : GetRESTEndpoint('TIPO') + "?parametros=" + data + "",
		type : 'GET',
		success : function(result) {
			CarregarDataTable(dataGridId, result);
		}
	});
}

function pesquisarLookup(idLookupInputCodigo, idLookupInputDescricao, model,
		filtroOuPath, idPopUp, idGradePopUp) {
	idPopUp = (idPopUp != null ? idPopUp : '#popupPesquisa');
	idGradePopUp = (idGradePopUp != null ? idGradePopUp : '#dtGrade_POPUP_PESQUISA');

	$(idGradePopUp).unbind("click");
	$(idGradePopUp).DataTable().clear().draw();

	$(idPopUp).dialog('open');
	ListarTodos(idGradePopUp, model, filtroOuPath);

	$(idGradePopUp).on(
			'click',
			'tr',
			function() {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				} else {
					$(idGradePopUp).DataTable().$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					$(idLookupInputCodigo).val($(idGradePopUp).DataTable().row(this).data()[0]);
					$(idLookupInputDescricao).val($(idGradePopUp).DataTable().row(this).data()[1]);
					$(idPopUp).dialog('close');
				}
			});
}

function pesquisarLookupEstado(idLookupInputCodigo, idLookupInputDescricao, model,
		filtroOuPath, idPopUp, idGradePopUp) {
	idPopUp = (idPopUp != null ? idPopUp : '#popupPesquisa');
	idGradePopUp = (idGradePopUp != null ? idGradePopUp : '#dtGrade_POPUP_PESQUISA');
	
	$(idGradePopUp).unbind("click");
	$(idGradePopUp).DataTable().clear().draw();
	
	$(idPopUp).dialog('open');
	ListarTodos(idGradePopUp, model, filtroOuPath);
	
	$(idGradePopUp).on(
			'click',
			'tr',
			function() {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				} else {
					$(idGradePopUp).DataTable().$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					$(idLookupInputCodigo).val($(idGradePopUp).DataTable().row(this).data()[0]);
					$(idLookupInputDescricao).val($(idGradePopUp).DataTable().row(this).data()[1]);
					$(idPopUp).dialog('close');
					$("#CIDADE_CODIGO").val("");
					$("#CIDADE_DESCRICAO").val("");
				}
			});
}

function pesquisarLookupCidade(idLookupInputCodigo, idLookupInputDescricao, model,
		filtroOuPath, idPopUp, idGradePopUp) {
	idPopUp = (idPopUp != null ? idPopUp : '#popupPesquisa');
	idGradePopUp = (idGradePopUp != null ? idGradePopUp : '#dtGrade_POPUP_PESQUISA');
	filtroOuPath += ($("#UF_CODIGO").val() != "" ? "/" + $("#UF_CODIGO").val() : "");
	
	$(idGradePopUp).unbind("click");
	$(idGradePopUp).DataTable().clear().draw();
	
	$(idPopUp).dialog('open');
	ListarTodos(idGradePopUp, model, filtroOuPath);
	
	$(idGradePopUp).on(
			'click',
			'tr',
			function() {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				} else {
					$(idGradePopUp).DataTable().$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
					$(idLookupInputCodigo).val($(idGradePopUp).DataTable().row(this).data()[0]);
					$(idLookupInputDescricao).val($(idGradePopUp).DataTable().row(this).data()[1]);
					$(idPopUp).dialog('close');
				}
			});
}

/** *********************************************************** */
/* ******************** Funcoes de Insercao ******************* */
function PrepararFormInclusao(formId, dataTableId) {
	operacao = 'POST';

	// Limpar Tela
	limparFormulario('#frmCRUD_ENTIDADE');
	limparFormulario('#frmENDERECO');
	limparFormulario('#frmCONTATO');
	limparFormulario('#frmENTIDADE_AGENDA');
	limparFormulario('#frmENTIDADE_DADOS_TECNICOS');
	limparFormulario('#frmCOMERCIAL');
	limparFormulario('#frmPERFIL');
	limparFormulario("#frmLOGIN");

	for (index = 0; index < formId.length; ++index) {
		$(
				"form" + formId[index] + " input,form" + formId[index]
						+ " select,form" + formId[index] + " textarea").each(
				function() {
					var input = $(this);
					if (input.attr('id') === 'ID__CHAVE_SEQUENCIAL') {
						input.val('-1');
						input.attr("disabled", 'disabled');
					} else {
						input.val('');
					}
				});
	}
}
function Inserir(JSONData) {
	var retorno;
	$.ajax({
		url : GetRESTEndpoint('RADIO'),
		context : document.body,
		data : JSONData,
		type : 'POST',
		success : function(result) {
			retorno = result;
			status = result.Resultado;
			if (status == 'SUCESSO') {
				alert('Registro Inserido com Sucesso. ');
				ListarTodos('#dtGrade_ENTIDADE');
			} else if (status == 'ERRO') {
				var msg = JSON.parse(result.Erro);
				alert(msg.mensagem);
			}
		}
	});
	return retorno;
}

/** *********************************************************** */
/* ******************** Funcoes de Alteracao ******************* */
function Alterar(JSONData) {
	var retorno;
	$.ajax({
		url : GetRESTEndpoint('RADIO'),
		context : document.body,
		data : JSONData,
		type : 'PUT',
		success : function(result) {
			status = result.Resultado;
			if (status == 'SUCESSO') {
				alert('Registro Alterado com Sucesso ');
			} else if (status == 'ERRO') {
				alert('Ocorreu um erro inesperado.\nDetalhes: ' + result.Erro);
			}
		}
	});
	return retorno;
}

function popularFormEdicao(linha, formId) {

	$.ajax(GetRESTEndpoint('RADIO') + '/' + linha[0]).then(
			function(data, status, jqXHR) {
				switch (status) {
				case 'success':
					var dadosRadio = data.Retorno;
					popularTela(dadosRadio);
					operacao = 'PUT';
					break;
				default:
					alert('Ocorreu um erro inesperado.');
					break;
				}

			});
}

function popularTela(dadosRadio) {
	// Limpar Tela
	limparFormulario('#frmCRUD_ENTIDADE');
	limparFormulario('#frmENDERECO');
	limparFormulario('#frmCONTATO');
	limparFormulario('#frmENTIDADE_AGENDA');
	limparFormulario('#frmENTIDADE_DADOS_TECNICOS');
	limparFormulario('#frmCOMERCIAL');
	limparFormulario('#frmPERFIL');
	limparFormulario('#frmLOGIN');

	// Popular Cabecalho
	$('#ID__CHAVE_SEQUENCIAL').val(dadosRadio.ID__CHAVE_SEQUENCIAL);
	$('#CNPJ').val(dadosRadio.CNPJ);
	$('#NOME_FANTASIA_OU_APELIDO').val(dadosRadio.NOME_FANTASIA_OU_APELIDO);
	$('#RAZAO_SOCIAL').val(dadosRadio.RAZAO_SOCIAL);

	// Popular Aba Endere�o
	objetoToFormulario('#frmENDERECO', dadosRadio);

	// Popular Aba de Contatos
	objetoToFormulario('#frmCONTATO', dadosRadio);

	// Popular Aba de Agenda
	objetoToFormulario('#frmENTIDADE_AGENDA', dadosRadio);

	// Popular Aba de Detalhes (Dados T�cnicos / Comercial / Perfil)
	objetoToFormulario('#frmENTIDADE_DADOS_TECNICOS', dadosRadio);
	objetoToFormulario('#frmCOMERCIAL', dadosRadio);
	objetoToFormulario('#frmPERFIL', dadosRadio);
	objetoToFormulario('#frmLOGIN', dadosRadio);
}

/** *********************************************************** */
/* ******************** Funcoes de Exclusao ******************* */
function PrepararFormExclusao(formId) {
	if (confirm("Deseja Realmente Excluir este Registro ?")) {
		operacao = 'DELETE';
		$(
				"form" + formId + " input,form" + formId + " select,form"
						+ formId + " textarea").each(function() {
			var input = $(this);
			input.val(linha[input.attr("id")]);
			if (input.attr('id') == 'ID') {
				input.attr("disabled", 'disabled');
			}
		});
	}
}
function Excluir(id) {
	var retorno;
	$.ajax({
		url : GetRESTEndpoint('MENSAGEM'),
		context : document.body,
		data : {
			'id' : id
		},
		type : 'DELETE',
		success : function(result) {
			retorno = result;
			status = $.parseJSON(result.Retorno).Resultado
			if (status == 'Sucesso') {
				alert('Registro Excluído com Sucesso ');
			}
		}
	});
	return retorno;
}

/** *********************************************************** */
/* ******************** Funções de Apresentação ******************* */
function exibirComoTabela(idDiv) {
	$(idDiv).hide();
};

function exibirComoDetalhe(idDiv) {
	$(idDiv).show();
};

/** *********************************************************** */
/* ******************** Funcoes Helper ******************* */
function EnviarDadosParaBackEnd(formId) {

	//validação
	senha = $("#SENHA").val();
	confirmacao = $("#CONFIRMACAO").val();
	
	if (senha != confirmacao) {
		alert('A senha não confere com a confirmação.');
		return;
	}
	
	// Preenchimento Model View
	formularioToModelView('#frmCRUD_ENTIDADE', modelView);
	formularioToModelView('#frmENDERECO', modelView);
	formularioToModelView('#frmCONTATO', modelView);
	formularioToModelView('#frmENTIDADE_AGENDA', modelView);
	formularioToModelView('#frmENTIDADE_DADOS_TECNICOS', modelView);
	formularioToModelView('#frmCOMERCIAL', modelView);
	formularioToModelView('#frmPERFIL', modelView);
	formularioToModelView('#frmLOGIN', modelView);
	
	var msgConfirmacao = "Confirma a gravacao do registro ?";
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

/** *********************************************************** */
