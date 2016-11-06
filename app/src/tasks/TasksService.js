(function() {
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('tasks').
        service('tasksService', ['$http', '$q', '$cookies', TasksService]);


    function TasksService($http, $q, $cookies) {


        var tasks = {};

        tasks.getAllTasks = function(id, paging_size, paging_offset) {
            return $http({
                url: 'https://api-test-task.decodeapps.io/tasks',
                method: "GET",
                params: {
                    session: $cookies.get('session'),
                    project_id: id,
                    paging_size: paging_size || 10,
                    paging_offset: paging_offset || 0
                }
            }).then(function(response) {
                var tasks = response.data.tasks.map(function(item) {
                    var result = {
                        created_at: new Date(item.Task.created_at),
                        description: item.Task.description,
                        id: item.Task.id,
                        title: item.Task.title
                    }
                    return result
                });
                return tasks;
            })
        };


        tasks.getTask = function(id) {
            return $http({
                url: 'https://api-test-task.decodeapps.io/tasks/task',
                method: "GET",
                params: {
                    session: $cookies.get('session'),
                    task_id: id || null
                }
            }).then(function(response) {
                return response.data.Task
            })
        }

        tasks.createTask = function(project_id, title, description) {
            return $http({
                url: 'https://api-test-task.decodeapps.io/tasks/task',
                method: "POST",
                data: {
                    session: $cookies.get('session'),
                    'Project': {
                        'id': project_id
                    },
                    'Task': {
                        'title': title,
                        'description': description
                    }
                }
            }).then(function(response) {
                return response.data.Task.id
            })
        }


        tasks.updateTask = function(task_id, title, description) {
            return $http({
                url: 'https://api-test-task.decodeapps.io/tasks/task',
                method: "POST",
                data: {
                    session: $cookies.get('session'),
                    'Task': {
                        'id': task_id,
                        'title': title,
                        'description': description
                    }
                }
            }).then(function(response) {
                return response.data.Task.id
            })
        }



        tasks.deleteProject = function(id) {
            $http({
                url: 'https://api-test-task.decodeapps.io/tasks/task',
                method: "DELETE",
                data: {
                    session: $cookies.get('session'),
                    task_id: id
                }

            })
        }


        tasks.compliteTask = function(id) {
            $http({
                url: 'https://api-test-task.decodeapps.io/tasks/task/complite',
                method: "POST",
                data: {
                    session: $cookies.get('session'),
                    task_id: id
                }
            })
        }

        return tasks;
    }


})();
