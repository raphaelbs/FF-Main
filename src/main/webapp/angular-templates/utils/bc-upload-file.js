/** [bcUploadFile]
 *	Diretiva para realizar ações de upload.
 *	Atributos:
 *		accept 			- 'string' 		- tipos de arquivos aceitados		- opcional
 *		callback		- 'function'	- função provinda do controller		- obrigatorio
 *	ex no html:
 *		<bc-upload-file material-icons="photo" image="seiLa.jpeg" callback="fnCallback" accept=".jpeg"></bc-upload-file>
*/
angular.module('financeiro').directive('bcUploadFile', [function() {
return {
	restrict: 'E',
	scope: {
		componente: '=',
		callback : '&',
		image : '=',
		accept: '='
	},
	transclude : true,
	templateUrl: GetDOMINIOEndpoint('angular-templates/utils/bc-upload-file.html'),
	compile: function(parent, attrs){
		var input = parent.find('input');
		parent.css('cursor', 'pointer');

		return function(scope, parent) {
			var input = parent.find('input');
			scope['accept'] && input.attr('accept', scope['accept']);

			parent.on('click', function(){
				input.click();
			});

			input.on('click', function(e){
				e.stopPropagation();
			});

			input.on('change', function () {
				if (!this.files || !this.files[0]) return scope.callback()('Não existe arquivo');
				var reader = new FileReader();
				var file = this.files[0];
				reader.onload = function (e) {
					return scope.callback()(null, {file: file, file64: e.target.result});
				};
				reader.readAsDataURL(this.files[0]);
				$(this)[0].value = '';
			});
		};
	}
};
}]);