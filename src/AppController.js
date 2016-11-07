(function () {

    angular
        .module('app')
        .controller('AppController', [
            '$scope',
            '$mdSidenav',
            // '$mdBottomSheet',
            '$timeout',
            '$log',
            'accountService',
            'projectsService',
            'tasksService',
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

    function AppController($scope, $mdSidenav, $timeout, $log, accountService, projectsService, tasksService) {
        var self = this;

        self.account = {
            name : "no name",
            image: "http://icons.iconarchive.com/icons/iconsmind/outline/512/Smile-icon.png"
        };

        self.projects             = [];
        self.tasks                = [];
        self.selectedProject      = 0;
        self.visibleCreateTask    = false;
        self.visibleCreateProject = false;
        self.visibleDetailTask    = false;
        self.showTasksList        = false;

        angular.element(document).ready(function () {
            if (!accountService.isLoggedIn()) {
                accountService.signUp()
                    .then(function (session) {
                        self.getAccountData();
                        self.selectedProject = self.getProjects()[0].id;
                    });
            }
            else {
                accountService.checkSession()
                    .then(function (checked) {
                        if (checked) {
                            self.getAccountData();
                            self.selectedProject = self.getProjects()[0].id;
                        }
                    });
            }
        });

        self.setAccount = function (account) {
            self.account = {
                name : account.username,
                image: account.image_url
            };
        };

        self.getAccountData = function () {
            accountService.accountFetch()
                .then(function (account) {
                    self.setAccount(account);
                })
        };

        self.getProjects = function () {
            self.projects = [];
            projectsService.getAllProjects().then(function (projects) {
                self.projects = projects;
            });
            return self.projects;
        };

        self.showTasksProject = function (id) {
            self.selectedProject = id;
            tasksService.getAllTasks(self.selectedProject, 10, 0)
                .then(function (tasks) {
                    self.tasks         = tasks;
                    self.showTasksList = tasks.length !== 0;
                })
        };

        self.resetRightSideVisible = function () {
            self.visibleCreateTask    = false;
            self.visibleCreateProject = false;
            self.visibleDetailTask    = false;
        };

        self.showCreateProject = function () {
            self.resetRightSideVisible();
            self.visibleCreateProject = true;
            self.toggleRight();
        };

        self.showCreateTask = function () {
            self.resetRightSideVisible();
            self.visibleCreateTask = true;
            self.toggleRight();
        };

        self.showDetailTask = function (task) {
            self.resetRightSideVisible();
            self.visibleDetailTask = true;
            self.toggleRight();

            // console.log(task);

            $scope.$broadcast('task-detail', {
                title      : task.title,
                description: task.description,
                id         : task.id
            })
        };

        $scope.$on('deleteTask', function (event, data) {

            // console.log(data);
            tasksService.deleteTask(data)
                .then(function (isDeleted) {
                    if (isDeleted) {
                        self.getProjects();
                        self.showTasksProject(self.selectedProject);
                    }

                })


        });

        $scope.$on('submit', function (event, data) {
            if (data.project) {
                projectsService.createProject(data.projectName)
                    .then(function (project) {
                        self.getProjects();
                        self.showTasksProject(project.id);
                    });
            } else if (data.task) {
                tasksService.createTask(self.selectedProject, data.taskName, data.description)
                    .then(function (task) {
                        self.getProjects();
                        self.showTasksProject(self.selectedProject);
                    })
            } else {
                console.log(data.error);
            }
        });

        self.toggleLeft  = buildDelayedToggler('left');
        self.toggleRight = buildToggler('right');
        self.isOpenRight = function () {
            return $mdSidenav('right').isOpen();
        };

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = self,
                    args    = Array.prototype.slice.call(arguments);
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

    function LeftCtrl($scope, $mdSidenav, $timeout, $log) {
        this.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });

        };
    }

    function RightCtrl($scope, $mdSidenav, $timeout, $log) {
        var self         = this;
        self.taskName    = '';
        self.description = '';
        self.projectName = '';

        self.title       = '';
        self.description = '';
        self.taskId      = '';

        self.setDetailTask = function (title, description, id) {
            self.title       = title;
            self.description = description;
            self.taskId      = id;
        };

        $scope.$on('task-detail', function (event, data) {
            console.log(data.id)
            self.setDetailTask(data.title, data.description, data.id)
        });

        self.context = function () {
            if (self.taskName !== "") {
                return {
                    task       : true,
                    taskName   : self.taskName,
                    description: self.description
                }
            } else if (self.projectName !== "") {
                return {
                    project    : true,
                    projectName: self.projectName
                }
            } else {
                return {
                    error: true
                }
            }
        };

        self.resetForm = function () {
            self.taskName    = '';
            self.description = '';
            self.projectName = '';
        };

        self.submit = function () {
            $scope.$emit('submit', self.context());
            $mdSidenav('right').close();
            self.resetForm()

        };

        self.delete = function () {
            $scope.$emit('deleteTask', self.taskId);
            $mdSidenav('right').close();
        };


        self.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });

            this.taskName    = '';
            this.description = '';
            this.projectName = '';
        };
    }

})();
