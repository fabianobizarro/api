(function (swal, angular) {

  if (!swal)
    throw new Error("Error: SweetAlert is not defined!");

  var notification = function () {

    function _show(options, confirmAction) {
      swal(options, confirmAction);
    }

    function _success(title, description) {
      swal(title, description, 'success');
    }
    
    function _warning(title, description){
      swal(title, description, 'warning');
    }
    
    function _info(title, description){
      swal(title, description, 'info');
    }
    
    function _error(title, description){
      swal(title, description, 'error');
    }
    
    return {
      show: _show,
      success: _success,
      error: _error,
      info: _info,
      warning: _warning
    };
    
  }

  angular.module('sharenews')
    .factory('notification', notification);

})(window.swal, window.angular);