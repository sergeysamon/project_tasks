(function () {
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('tasks').service('tasksService', ['$http', '$q', '$cookies', TasksService]);


    function TasksService($http, $q, $cookies) {

        // group tasks of day
        function groupByDate(obj) {
            var sortArray = [];
            var marker    = [];
            var temp      = {
                date : '',
                tasks: []
            };

            function formatDate(date) {
                var parseDate = new Date(date);
                var dd        = parseDate.getDate() -1;
                var mm        = parseDate.getMonth() + 1;
                var yy        = parseDate.getFullYear();
                return mm + '-' + dd + '-' + yy
            }

            for (var i = 0; i < obj.length; i++) {
                var date = formatDate(obj[i].Task.created_at);
                if (marker.indexOf(date) == -1) {
                    marker.push(date);
                    temp.date = date;
                    for (var j = 0; j < obj.length; j++) {
                        if (formatDate(obj[j].Task.created_at) == temp.date) {
                            temp.tasks.push(obj[j].Task);
                        }
                    }
                    sortArray.push(temp);
                    temp = {
                        date : '',
                        tasks: []
                    };
                }
            }
            return sortArray;
        }


        var tasks = {};

        tasks.getAllTasks = function (id, paging_size, paging_offset) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/',
                method: "GET",
                params: {
                    session      : $cookies.get('session'),
                    project_id   : id,
                    paging_size  : paging_size || 10,
                    paging_offset: paging_offset || 0
                }
            }).then(function (response) {

                var x = groupByDate(response.data.tasks);


                return groupByDate(response.data.tasks);
            })
        };


        tasks.getTask = function (id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/task/',
                method: "GET",
                params: {
                    session: $cookies.get('session'),
                    task_id: id || null
                }
            }).then(function (response) {
                return response.data.Task
            })
        };

        tasks.createTask = function (project_id, title, description) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/task/',
                method: "POST",
                data  : {
                    session  : $cookies.get('session'),
                    'Project': {
                        'id': project_id
                    },
                    'Task'   : {
                        'title'      : title,
                        'description': description
                    }
                }
            }).then(function (response) {
                return response.data.Task.id
            })
        };


        tasks.updateTask = function (task_id, title, description) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/task/',
                method: "POST",
                data  : {
                    session: $cookies.get('session'),
                    'Task' : {
                        'id'         : task_id,
                        'title'      : title,
                        'description': description
                    }
                }
            }).then(function (response) {
                return response.data.Task.id
            })
        };


        tasks.deleteTask = function (id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/task/',
                method: "DELETE",
                params: {
                    session: $cookies.get('session'),
                    task_id: id
                }
            }).then(function (response) {
                return true;
            })
        };


        tasks.completeTask = function (id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/tasks/task/complite/',
                method: "POST",
                data  : {
                    session: $cookies.get('session'),
                    Task   : {
                        "id": id
                    }
                }
            }).then(function (response) {
                return true;
            })
        };

        return tasks;
    }


})();
