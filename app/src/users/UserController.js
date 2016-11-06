(function () {

  angular
    .module('users')
    .controller('UserController', [
      'userService',
      '$mdSidenav',
      '$mdBottomSheet',
      '$timeout',
      '$log',
      UserController
    ]);

  function UserController(userService, $mdSidenav, $mdBottomSheet, $timeout, $log) {
    var self = this;

    self.visible_empty = true;




  }

})();
