(function () {

    angular
        .module('account')
        .controller('AccountController', [
            'accountService',
            // '$mdSidenav',
            // '$mdBottomSheet',
            // '$timeout',
            // '$log',
            AccountController
        ]);

    function AccountController(accountService, $mdSidenav) {
        var self = this;

        if (!accountService.isLoggedIn) {
            accountService.SignUp()
        }


        accountService.AccountFetch().then(function (data) {

            self.name = data.username;
            self.image = data.image_url;
        })

    }

})();
