angular.module('kodeApp')

.controller('LoginController', ['$scope', '$localStorage', 'AuthFactory', '$state', '$rootScope','userFactory',function ($scope, $localStorage, AuthFactory, $state, $rootScope,userFactory) {
    
    $scope.isAdmin = false;
    $scope.doLogin = function() {
        var loginData = {
            username: $scope.usernm,
            password: $scope.userpw
        }
        console.log("loginData ",loginData)
        AuthFactory.login(loginData);
        $state.reload(); 
        $state.go('app.dashboard');
        console.log("username is ",$scope.usernm);
        var users= userFactory.getUsers().query({username: $scope.usernm},function(response) {
            console.log(response.admin);
            if(response.admin==true)
            {
                $scope.isAdmin=true;
            }
        },
        function(response) {
            $scope.message = "Error: "+response.status + " " + response.statusText;
            console.log("Exception Thrown! ", $scope.message);
    });
    };
    

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        $state.go('app.login');
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $state.go('app.login')
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };

    
}])

.controller('DashboardController',['$scope', 'userFactory', '$state','$stateParams', function($scope,userFactory,$state,$stateParams){

    console.log("inside controller");
    $scope.users= userFactory.getUsers().query(function(response) {
        $scope.users = response;
        console.log("users are "+$scope.users);
    },
    function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
    });

    $scope.deleteuser = function(id)
    {
        
        console.log("deleting "+id);
        userFactory.getUsers().remove({id:id},function(){
            console.log("deleted ",id);
        })
        $state.go('app.dashboard');

    }

}])
.controller('RegisterController',['$scope','$state','userFactory',function($scope,$state,userFactory){

    console.log("entering register");
    $scope.register = function(){
        var temparray = {
            username:$scope.username,
            password:$scope.password,
            email:$scope.email,
            address:$scope.address,
            admin: false
            
            
        };
        userFactory.registerUsers().create(temparray, function(response) {
                console.log(response);    

        });
        $scope.username="";
        $scope.password="";
        $scope.email="";
        $scope.address="";
        $scope.loginform.$setPristine();
        $state.go('app.login');
       
    }
}])

.controller('AddUserController',['$scope','$state','userFactory',function($scope,$state,userFactory){

    console.log("entering adduser");
    $scope.register = function(){
        var temparray = {
            username:$scope.username,
            password:$scope.password,
            email:$scope.email,
            address:$scope.address,
            
            
        };
        if($scope.admin)
        {
            if($scope.admin.agree) temparray["admin"]= true;
        }
        userFactory.registerUsers().create(temparray, function(response) {
                console.log(response);    

        });
        $state.go('app.dashboard');
       
    }
}])

.controller('EditController',['$scope','userFactory','$state','$stateParams',  function($scope,userFactory,$state,$stateParams){


    $scope.user = {};
    
    $scope.user = userFactory.getUsers().get({
        id: $stateParams.id
    })
    .$promise.then(
        function (response) {
            $scope.user = response; 
            if(response.admin==true)
            {   
                console.log("entered if checkbox")
                $scope.event = {
                    type: {
                        checked: true
                    }
                };
            }
            
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
    
    

    $scope.updateuser = function()
    {
        console.log("entering update user");
        var temparray={};
        if($scope.newpassword!=(null||""))
            temparray["password"]=$scope.newpassword;
        if($scope.email!=(null||""))
            temparray["email"]=$scope.email;
        if($scope.address!=(null||""))
            temparray["address"]=$scope.address;
        console.log("array is", temparray)
        userFactory.getUsers().update({id:$stateParams.id}, temparray, function(response) {
                console.log(response);
                $state.go('app.dashboard');
           });
    };

    $scope.updaterole = function()
    {
        var temparray = {};
        console.log("entering update role");
        console.log($scope.event.type.checked);
        if($scope.event.type.checked) temparray["admin"]= true;
        else temparray["admin"]=false;
        userFactory.getUsers().update({id:$stateParams.id}, temparray, function(response) {
            console.log(response);
            $state.go('app.dashboard');
       });
        
    }



}])

;