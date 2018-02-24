var __GLOBAL_DOMINIO = '/financeiro';
var __GLOBAL_REST_ENDPOINT_API = __GLOBAL_DOMINIO + '/restfullAPI/'; 
var __GLOBAL_REST_ENDPOINT = __GLOBAL_DOMINIO + '/restfullAPI/';
var __DOMINIO = 'financeiro';

function GetRESTEndpoint(nomeTabela) {              
    return __GLOBAL_REST_ENDPOINT + nomeTabela;     
}

function GetRESTEndpointAPI() {              
    return __GLOBAL_REST_ENDPOINT_API;       
}

function GetDOMINIOEndpoint(nome){
	return __GLOBAL_DOMINIO + '/' + nome;
}

function GetMENU_ID() {
    return getItemSessionStorage("menuId");       
}

function GetDOMINIO() {              
    return __DOMINIO;       
}