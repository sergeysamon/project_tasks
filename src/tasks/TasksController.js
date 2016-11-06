(function () {

    angular
        .module('tasks')
        .controller('TasksController', [
            'tasksService',
            '$mdSidenav',
            '$mdBottomSheet',
            '$timeout',
            '$log',
            TasksController
        ]);

    function TasksController(tasksService, $mdSidenav) {
        var self = this;



        tasksService.getAllTasks(6971, 10, 0).then(function (data) {
            self.allTasks = data;
        })

    }

})();
