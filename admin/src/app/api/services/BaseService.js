(function (angular) {

    function BaseService(apihttp) {

        function Service(){
            this.endpoint = '/';
            this.$apihttp = apihttp;    
        }

        Service.prototype.all = function () {
            return apihttp.get(this.endpoint, null);
        }

        Service.prototype.add = function (model) {
            return apihttp.post(this.endpoint, model);
        }

        Service.prototype.getById = function (id) {
            return apihttp.get(this.endpoint + '/' + id);
        }

        Service.prototype.update = function (model) {
            return apihttp.put(this.endpoint + '/' + model._id, model);
        }

        Service.prototype.delete = function (model) {
            return apihttp.delete(this.endpoint + '/' + model._id);
        }
        
        return Service;
    }

    angular.module('api.sharenews')
        .factory('BaseService', ['apihttp', BaseService]);

})(window.angular);