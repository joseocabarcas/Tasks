angular.module('appTareas', ['ui.router','ngResource'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('alta', {
                url: '/alta',
                templateUrl: 'views/alta.html',
                controller: 'ctrlAlta'
            })
            .state('editar', {
                url: '/editar',
                templateUrl: 'views/editar.html',
                controller: 'ctrlEditar'
            });

        $urlRouterProvider.otherwise('alta');
    })
    .factory('Tareas', function($resource){
        return $resource('/tareas/:id', { id: '@_id' }, {
            update: {
              method: 'PUT',
              url:'/tarea/:id'
            },
            save:{
                url:'/tarea',
                method:'POST',
                isArray:false
            },
            get:{
                url:'/tarea/:id',
                method:'GET',
                isArray:false
            },
            delete:{
                url:'/tarea/:id',
                method:'DELETE'
            }
        }
        );
    })
    .factory('comun', function(Tareas) {
        var comun = {}

        comun.tareas = [];
        comun.tarea = {};

    
        //Metodos remotos
        comun.getAll = function(){
            return Tareas.query(function(tareas) {
                    angular.copy(tareas,comun.tareas);
                    //comun.tareas= tareas;
                    return comun.tareas;
                });
        }

        comun.add = function(tarea){
            return Tareas.save(tarea, function(tarea) {
                comun.tareas.push(tarea);
                //comun.tarea = tarea;
                //return comun.tarea;
            });
        }

        comun.update = function (tarea) {
            return Tareas.update({ id: tarea._id}, tarea);
        }

        comun.delete = function (tarea) {
            return Tareas.delete({ id: tarea._id}, function () {
                var indice = comun.tareas.indexOf(tarea);
                comun.tareas.splice(indice, 1);
            });
        }

        return comun;
    })
    .controller('ctrlAlta', function($scope, $state, comun ) {
        $scope.tarea = {}
            // $scope.tareas = [];

        comun.getAll();

        $scope.tareas = comun.tareas;
        $scope.prioridades = ['Baja', 'Normal', 'Alta'];

        $scope.agregar = function() {
            comun.add({
                nombre: $scope.tarea.nombre,
                prioridad: parseInt($scope.tarea.prioridad)
            })

            $scope.tarea.nombre = '';
            $scope.tarea.prioridad = '';
        }

        $scope.masPrioridad = function(tarea) {
            tarea.prioridad += 1;
        }

        $scope.menosPrioridad = function(tarea) {
            tarea.prioridad -= 1;
        }

        $scope.eliminar = function(tarea) {
            comun.delete(tarea)
        }

        $scope.procesaObjeto = function(tarea) {
            comun.tarea = tarea;
            $state.go('editar');
        }

    })
    .controller('ctrlEditar', function($scope, $state, comun) {
        $scope.tarea = comun.tarea;

        $scope.actualizar = function() {
            comun.update($scope.tarea);
            $state.go('alta');
        }

        $scope.eliminar = function(){
            comun.delete($scope.tarea);
            $state.go('alta');
        }
    })
