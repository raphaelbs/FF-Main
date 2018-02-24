/**
 * [ecvModalImagemUpload]
 * Controler para o modal de inserção de imagem.
 * Raphael Brandão - 29/10/2016
 */
angular.module('financeiro').controller('ecvModalImagemUpload', ['$scope', 'componente', 'componenteLegenda', 'fn', 
	function($scope, componente, componenteLegenda, fn){
		$scope.componente = componente;
		$scope.componenteLegenda = componenteLegenda;
		var detalhamento = componente.detalhamento;
		$scope.fn = fn;
	
		var crop = null;
		
		// Chamado quando a imagem for selecionada
		$scope.imagemSelecionada = function (err, files) {
			var imgProfile = $('#imgProfile');
			if (crop) {
				crop.cropper('replace', files.file64);
			}
			else {
				imgProfile.attr('src', files.file64);
				imgProfile.cropper({
					crop: function (e) {
						componente.imagemCorte = {
							x : e.x,
							y : e.y,
							w : e.width,
							h : e.height,
							ow: e.target.width,
							oh: e.target.height
						};
					},
					built: function () {
						crop = $(this);
					},
					aspectRatio: detalhamento.largura && detalhamento.altura && 
						parseInt(detalhamento.largura)/parseInt(detalhamento.altura),
					viewMode: 1,
					background: false,
					modal: false,
					movable: false,
					rotatable: false,
					scalable: false,
					zoomable: false,
					zoomOnTouch: false,
					zoomOnWheel: false
				});
			}
			$scope.$apply(function(){
				$scope.files = files;
				$scope.imagemAberta = true;
			});
		};
	
		$scope.recortar = function(){
			detalhamento.imagemRecortada = crop.cropper('getCroppedCanvas', {width: detalhamento.largura, height: detalhamento.altura});
			detalhamento.imagemRecortada.toBlob(function(blob){
				blobToBase64(blob, function(base64){
					$scope.$apply(function(){
						componente.modelo[componente.ultimaReferencia] = 'data:image/jpeg;base64,' + base64;
					});
				});
			});
			fn.close();
		};
		
		function blobToBase64 (blob, cb) {
		    var reader = new FileReader();
		    reader.onload = function() {
		    var dataUrl = reader.result;
		    var base64 = dataUrl.split(',')[1];
		    cb(base64);
		    };
		    reader.readAsDataURL(blob);
		}
}]);
