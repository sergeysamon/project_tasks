(function () {

    angular
        .module('app')
        .controller('AppController', [
            '$mdSidenav',
            '$mdBottomSheet',
            '$timeout',
            '$log',
            'projectsService',
            AppController

        ])
        .controller('LeftCtrl', [
            '$scope',
            '$mdSidenav',
            '$timeout',
            '$log',
            LeftCtrl
        ])
        .controller('RightCtrl', [
            '$scope',
            '$mdSidenav',
            '$timeout',
            '$log',
            RightCtrl
        ]);

    function AppController($mdSidenav, $mdBottomSheet, $timeout, $log) {
        var self = this;

        self.visible_empty = true;

        self.toggleLeft = buildDelayedToggler('left');
        self.toggleRight = buildToggler('right');
        self.isOpenRight = function () {
            return $mdSidenav('right').isOpen();
        };

        self.addNewProject = function () {
           self.toggleRight()
        };

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = self,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }


        function buildDelayedToggler(navID) {
            return debounce(function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

    }

    function LeftCtrl($scope, $timeout, $mdSidenav, $log) {
        this.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    }

    function RightCtrl($scope, $timeout, $mdSidenav, $log) {
        this.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
        };
    }

})();
