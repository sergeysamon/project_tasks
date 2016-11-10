(function () {

    angular
        .module('app')
        .controller('AppController', [
            '$scope',
            '$mdSidenav',
            // '$mdBottomSheet',
            // '$mdOpenMenu',
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
            // '$mdOpenMenu',
            '$timeout',
            '$log',
            LeftCtrl
        ])
        .controller('RightCtrl', [
            '$scope',
            '$mdSidenav',
            // '$mdOpenMenu',
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
        self.visibleSearch        = false;

        angular.element(document).ready(function () {
            if (!accountService.isLoggedIn()) {
                accountService.signUp()
                    .then(function (session) {
                        self.getAccountData();
                        self.getProjects();
                    });
            }
            else {
                accountService.checkSession()
                    .then(function (checked) {
                        if (checked) {
                            self.getAccountData();
                            self.getProjects();
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
            $timeout(function () {
                projectsService.getAllProjects().then(function (projects) {
                    self.projects        = projects;
                    self.selectedProject = projects[0].id

                });
            }, 100);

        };

        self.showTasksProject = function (id) {
            self.tasks           = [];
            self.selectedProject = id;
            $timeout(function () {
                tasksService.getAllTasks(self.selectedProject, 10, 0)
                    .then(function (tasks) {
                        self.tasks         = tasks;
                        self.showTasksList = tasks.length !== 0;
                    })
            }, 100);


        };

        self.resetRightSideVisible = function () {
            self.visibleCreateTask    = false;
            self.visibleCreateProject = false;
            self.visibleDetailTask    = false;
            self.visibleSearch        = false;

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

            $scope.$broadcast('task-detail', {
                title      : task.title,
                description: task.description,
                id         : task.id,
                textHeader : "Edit task " + task.title

            })
        };

        self.showEditProject = function () {
            self.resetRightSideVisible();
            self.visibleCreateProject = true;
            self.toggleRight();

            projectsService.getProject(self.selectedProject).then(function (project) {
                $scope.$broadcast('edit-project', {
                    project   : project,
                    textHeader: "Edit project " + project.title
                })
            });


        };

        self.deleteProject = function () {
            projectsService.deleteProject(self.selectedProject).then(function () {
                self.getProjects();
                $timeout(function () {
                    if (self.selectedProject > 0) {
                        self.showTasksProject(self.selectedProject)
                    } else {
                        self.showTasksList = false;
                    }
                }, 500)
            })
        };

        self.completeTask = function (id) {
            tasksService.completeTask(id).then(function (data) {
                self.getProjects();
                self.showTasksProject(self.selectedProject);
            });
        };

        self.showSearch = function () {
            self.visibleSearch = !self.visibleSearch;
        };

        $scope.$on('edit-task', function (event, data) {
            if (data.taskEdit) {
                self.resetRightSideVisible();
                self.visibleCreateTask = true;
            }
        });

        $scope.$on('deleteTask', function (event, data) {
            tasksService.deleteTask(data)
                .then(function (isDeleted) {
                    if (isDeleted) {
                        self.getProjects();
                        self.showTasksProject(self.selectedProject);
                    }
                })
        });

        $scope.$on('submit', function (event, data) {
            if (data.taskInfo) {

            } else if (data.project) {
                if (data.projectId > 0) {
                    projectsService.updateProject(data.projectName, data.projectId)
                        .then(function (project) {
                            self.getProjects();
                            self.showTasksProject(project.id);
                        });
                } else {
                    projectsService.createProject(data.projectName)
                        .then(function (project) {
                            self.getProjects();
                            self.showTasksProject(project.id);
                        });
                }


            } else if (data.task) {
                tasksService.createTask(self.selectedProject, data.taskName, data.description)
                    .then(function (task) {
                        self.getProjects();
                        self.showTasksProject(self.selectedProject);
                    })
            } else if (data.taskEdit) {
                tasksService.updateTask(data.id, data.taskName, data.description)
                    .then(function (task) {
                        self.getProjects();
                        self.showTasksProject(self.selectedProject);
                    })
            }
            else {
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
        var self            = this;
        self.taskName       = '';
        self.description    = '';
        self.projectName    = '';
        self.taskId         = '';
        self.projectId      = '';
        self.taskEdit       = false;
        self.taskInfo       = false;
        self.textHeader     = '';
        self.tempTextHeader = '';

        self.setDetailTask = function (title, description, id) {
            self.taskName    = title;
            self.description = description;
            self.taskId      = id;
        };


        $scope.$on('task-detail', function (event, data) {
            self.setDetailTask(data.title, data.description, data.id);
            console.log(self.taskName, self.description);
            self.taskInfo       = true;
            self.tempTextHeader = data.textHeader;
        });

        $scope.$on('edit-project', function (event, data) {
            self.projectName = data.project.title;
            self.projectId   = data.project.id;
            self.textHeader  = data.textHeader;
        });

        self.context = function () {
            if (self.taskEdit) {
                return {
                    taskEdit   : self.taskEdit,
                    id         : self.taskId,
                    taskName   : self.taskName,
                    description: self.description
                }
            } else if (self.taskName !== "") {
                return {
                    task       : true,
                    taskName   : self.taskName,
                    description: self.description,
                    taskInfo   : self.taskInfo
                }
            } else if (self.projectName !== "") {
                if (self.projectId > 0) {
                    return {
                        project    : true,
                        projectName: self.projectName,
                        projectId  : self.projectId
                    }
                }
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
            self.taskName       = '';
            self.description    = '';
            self.projectName    = '';
            self.projectId      = -1;
            self.taskInfo       = false;
            self.projectEdit    = false;
            self.textHeader     = '';
            self.tempTextHeader = '';

        };

        self.submit = function () {
            $scope.$emit('submit', self.context());
            $mdSidenav('right').close();
            self.resetForm();
        };

        self.delete = function () {
            $scope.$emit('deleteTask', self.taskId);
            $mdSidenav('right').close();
        };

        self.editTask = function () {
            if (self.tempTextHeader !== '') {
                self.textHeader = self.tempTextHeader;
            }
            self.taskEdit = true;
            $scope.$emit('edit-task', {task_id: self.taskId, taskEdit: self.taskEdit});
            self.resetForm();

        };

        self.close = function () {
            $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
            self.resetForm();
        };
    }

})
();
