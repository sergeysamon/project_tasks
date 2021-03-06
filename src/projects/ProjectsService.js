(function () {
    'use strict';

    // Prepare the 'users' module for subsequent registration of controllers and delegates
    angular.module('projects').service('projectsService', ['$http', '$q', '$cookies', ProjectsService]);


    function ProjectsService($http, $q, $cookies) {


        var projects = {};

        projects.getAllProjects = function () {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/projects/',
                method: "GET",
                params: {session: $cookies.get('session')}
            }).then(function (response) {
                var result;
                result = response.data.projects.map(function (item) {
                    return item.Project;
                });
                return result;
            })
        };

        projects.getProject = function (id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/projects/project/',
                method: "GET",
                params: {session: $cookies.get('session'), project_id: id || null}
            }).then(function (response) {
                return response.data.Project
            })
        };

        projects.createProject = function (title) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/projects/project/',
                method: "POST",
                data  : {
                    session  : $cookies.get('session'),
                    "Project": {
                        "title": title
                    }
                }
            }).then(function (response) {
                return response.data.Project
            });
        };

        projects.updateProject = function (title, id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/projects/project/',
                method: "POST",
                params: {
                    session        : $cookies.get('session'),
                    'Project.title': title,
                    'Project.id'   : id
                },
                data  : {
                    session  : $cookies.get('session'),
                    "Project": {
                        "id"   : id,
                        "title": title
                    }
                }
            }).then(function (response) {
                return response.data.Project
            });
        };

        projects.deleteProject = function (id) {
            return $http({
                url   : 'https://api-test-task.decodeapps.io/projects/project/',
                method: "DELETE",
                params: {
                    session   : $cookies.get('session'),
                    project_id: id
                }

            }).then(function (response) {
                console.log("delete ok!", response);
            })
        };


        return projects;
    }


})();
