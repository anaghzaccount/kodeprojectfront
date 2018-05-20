angular.module('kodeApp',['ui.router','ngResource'])
.config(function($stateProvider,$urlRouterProvider){
    $stateProvider
    .state('app',{
        url:'/',
        views:{
            'header':{
                templateUrl:'views/header.html',
            },
            'content':{
                templateUrl:'views/login.html',
                controller:'LoginController'
            }
        }
    })
    .state('app.login',{
        url:'login',
        views:{
            'content@': {
                templateUrl:'views/login.html',
                controller:'LoginController'
            }   
        }
        
    })
    .state('app.register',{
        url:'register',
        views:{
            'content@': {
                templateUrl:'views/register.html',
            }   
        }
        
    })
    .state('app.dashboard',{
        url:'dashboard',
        views:{
            'content@': {
                templateUrl:'views/dashboard.html',
                //controller:'dashboardController'
            }   
        }
        
    })
    .state('app.user',{
        url:'users/add',
        views:{
            'content@': {
                templateUrl:'views/add.html',
                
            }   
        }
        
    })
    .state('app.edituser',{
        url:'users/:id',
        views:{
            'content@':{
                templateUrl:'views/edituser.html',
                //controller:'EditController'
            }
        }
    })
    .state('app.editrole',{
        url:'users/:id/edit',
        views:{
            'content@':{
                templateUrl:'views/editrole.html',
                //controller:'EditController'
            }
        }
    })
    
    ;

$urlRouterProvider.otherwise('/');
});