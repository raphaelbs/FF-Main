/* ******************** Angular ******************* */
angular.module('financeiro', ['ngMaterial', 'ngMessages', 'datatables', 'ngSanitize', 'ui.router', 'ngAnimate', 'jsonFormatter'])
.run(['DTDefaultOptions', function(DTDefaultOptions){
	DTDefaultOptions.setLanguageSource(GetDOMINIOEndpoint('recursos/angular-datatables-pt-br.json'));
}])
.config(['$mdThemingProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'JSONFormatterConfigProvider',
	function($mdThemingProvider, $locationProvider, $stateProvider, $urlRouterProvider, JSONFormatterConfigProvider) {
	
	$urlRouterProvider.otherwise('/');
	    
    $stateProvider
    .state('financeiro', {
    	url: '/',
    	templateUrl: GetDOMINIOEndpoint('views/principal.html'),
    	controller: 'principal'
    })
    .state('formulario', {
    	url: '/formulario?id_form&tipo_idioma&banco',
        templateUrl: GetDOMINIOEndpoint('views/formulario.html'),
        controller: 'formulario'
    })
    .state('cadastro-formulario', {
    	url: '/cadastro-formulario',
        templateUrl: GetDOMINIOEndpoint('views/cadastro-formulario.html'),
        controller: 'cadastroFormulario'
    })
    .state('configuracoes', {
    	url: '/configuracoes',
        templateUrl: GetDOMINIOEndpoint('views/configuracoes.html'),
        controller: 'configuracoes'
    });
	
    // A # precisa estar habilitada
	$locationProvider.html5Mode({requireBase: false, enabled: true});
	
	// Tema gerado em: http://mcg.mbitson.com/#/
	$mdThemingProvider.definePalette('custompurple', {
		  '50': '#f0eef6','100': '#c5bcdc','200': '#a597c9','300': '#7d68b0',
		  '400': '#6c55a4','500': '#5f4b90','600': '#52417c','700': '#443668',
		  '800': '#372c54','900': '#2a2140','A100': '#f0eef6','A200': '#c5bcdc',
		  'A400': '#6c55a4','A700': '#443668','contrastDefaultColor': 'light',
		  'contrastDarkColors': '50 100 200 A100 A200'
		});

	$mdThemingProvider.theme('default')
		.primaryPalette('custompurple')
		.accentPalette('orange');
	
	$mdThemingProvider.enableBrowserColor({
		theme: 'default',
		palette: 'primary',
		hue: '800' 
	});
	
	JSONFormatterConfigProvider.hoverPreviewEnabled = true;
	JSONFormatterConfigProvider.hoverPreviewArrayCount=100;
	JSONFormatterConfigProvider.hoverPreviewFieldCount=5;
}]);

/**
 * [tudo]
 * Controler geral do formulário.
 * Raphael Brandão - 28/10/2016
 */
angular.module('financeiro').controller('tudo', ['$scope', '$mdSidenav', '$ecv', '$mdMedia',
	function($scope, $mdSidenav, $ecv, $mdMedia){	
	
	$scope.menu = $ecv.menu;
	$ecv.menu.html.fixado = true;
	
	$ecv.menu.fn.toggle = function(bool) {
		if(bool || $mdMedia('gt-md')){
			$ecv.menu.html.fixado = !$ecv.menu.html.fixado;
    		return;
		}
		$mdSidenav('left').toggle();
    };
    
    $ecv.menu.fn.close = function() {
    	if($ecv.menu.html.fixado){
    		$ecv.menu.html.fixado = false;
    		return;
    	}
		$mdSidenav('left').close();
    };
    
    $scope.$watch(function() { return $mdMedia('gt-md'); }, function(bool) {
	    if($ecv.menu.html.fixado && !bool && $ecv.menu.html.carregado) 
	    	$ecv.menu.fn.toggle(true);
	});
    
    $scope.$watch(function() { return $ecv.menu.html.carregado; }, function(bool) {
	    if($ecv.menu.html.fixado && !$mdMedia('gt-md') && bool) 
	    	$ecv.menu.fn.toggle(true);
	});
	
}]);