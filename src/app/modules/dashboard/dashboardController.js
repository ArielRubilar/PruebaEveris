app.controller("dashboardController", ["rutas", "Auth", "Dashboard",'$location', function(rutas, Auth, Dashboard,$location){
    var ctrl = this;
    ctrl.rutas = rutas;
    ctrl.currentLocation = $location.path();
    ctrl.usuario = Auth.parseToken(Auth.getToken()).email;
    ctrl.songs = [];
    ctrl.dashboard = Dashboard.get({ id : 1 }, function(value){
        ctrl.songs = ctrl.dashboard.songs;
    });
}]);