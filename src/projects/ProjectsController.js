(function () {

  angular
    .module('projects')
    .controller('ProjectsController', [
      'projectsService',
      '$mdSidenav',
      '$mdBottomSheet',
      '$timeout',
      '$log',
      ProjectsController
    ]);

  function ProjectsController(projectsService, $mdSidenav) {
    var self = this;


    // projectsService.getAll().then(function (data) {
    //   self.projects = data
    // });

    // projectsService.get(6971).then(function (data) {
    //     self.project = data
    //     console.log(data)
    // })
    // projectsService.updateProject("Home", 6971)

    // projectsService.createProject('Hello world')
    // projectsService.deleteProject(7035)
  }

})();
