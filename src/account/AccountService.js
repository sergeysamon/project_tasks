(function() {
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('account').
        service('accountService', ['$http', '$q', '$cookies', AccountService]);


    function AccountService($http, $q, $cookies) {


        var account = {};

        account.isLoggedIn = function() {
            return $cookies.get('session') !== '';
        };

        account.CheckSession = function() {
            $http({
                url: 'https://api-test-task.decodeapps.io/session',
                method: "GET",
                params: { session: $cookies.get('session') }
            }).then(function(response) {
                return true;
            }, function(response) {
                console.log('---> Error check session');
                return false;
            })
        };

        account.AccountFetch = function(scope) {
            return $http({
                url: 'https://api-test-task.decodeapps.io/account',
                method: "GET",
                params: { session: $cookies.get('session') }
            })
                .then(function(response) {
                    return response.data.Account
                },
                function(response) {
                    console.log('---> error account fetch ');
                    scope.name = "no name"
                    scope.image = "http://icons.iconarchive.com/icons/iconsmind/outline/512/Smile-icon.png"
                })
        };

        account.SignUp = function() {
            $http.post('https://api-test-task.decodeapps.io/signup')
                .success(function(response) {
                    $cookies.put('session', response.session);
                })
        };

        return account;
    }


})();
