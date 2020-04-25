(function (angular) {

    var fileUploadService = function ($http, snCore) {

        this.enviarArquivo = function (arquivo, callback) {

            var fd = new FormData();
            fd.append('file', arquivo);

            var url = snCore.fileServer + '/f';

            $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(result => callback(null, result), err => callback(err));
        };

        this.dataUriToBlob = function (dataUri, callback) {

            var byteString = atob(dataUri.split(',')[1]);

            var mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ia], { type: mimeString });

            return bb;
        };

    };


    fileUploadService.$inject = ['$http', 'snCore'];

    angular.module('sharenews')
        .service('fileUploadService', fileUploadService);

})(window.angular);