(function (angular) {

    function core() {

        var api_host;
        var _protocol;
        var port;

        var _userToken;
        var _userInfoKey;

        var _fileServer;

        function getApiUrl() {
            return _protocol.replace(':', '') + "://" + api_host + ":" + port + "/api";
        }

        this.config = function (options) {
            if (options['host'])
                api_host = options['host'];

            if (options['protocol'])
                _protocol = options['protocol'];

            if (options['port'])
                port = options['port'];

            if (options['userInfoKey'])
                _userInfoKey = options['userInfoKey'];

            if (options['token'])
                _userToken = options['token'];

            if (options['fileServer'])
                _fileServer = options['fileServer'];
        };

        this.$get = function () {
            return {
                protocol: _protocol,
                host: api_host,
                port: port,
                url: getApiUrl,
                auth: {
                    userInfoKey: _userInfoKey,
                    token: _userToken
                },
                fileServer: _fileServer
            };
        }

    }

    angular.module('api.sharenews')
        .provider('snCore', core);

})(window.angular);