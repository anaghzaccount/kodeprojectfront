angular.module('kodeApp')
.constant("baseURL","http://localhost:3000/")
.service('userFactory',['$resource','baseURL', function($resource,baseURL){
    console.log("inside userFactory")
    this.getUsers = function(){
        console.log("inside getUsers");
        return $resource(baseURL+"users/:id",{}, 
        {
            query: { method: "GET", isArray: true },
            create: { method: "POST"},
            get: { method: "GET"},
            remove: { method: "DELETE"},
            update: { method: "PUT"}
        });
    }

    this.registerUsers = function(){
        console.log("Inside registerUsers");
        return $resource(baseURL +"register",null,
    {
            query: { method: "GET", isArray: false },
            create: { method: "POST"},
            get: { method: "GET"},
            remove: { method: "DELETE"},
            update: { method: "PUT"}
    });
    }

}])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, baseURL){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
 
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
    $localStorage.remove('userinfo');
    
  }
     
    authFac.login = function(loginData) {
        console.log("entered authfactory login");
        console.log(loginData.username+" "+loginData.password);
        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token});
              $localStorage.storeObject('userinfo',{username:loginData.username, password:loginData.password});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        console.log("entered logout!");
        destroyUserCredentials();
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getUsername = function() {
        return username;  
    };

    loadUserCredentials();
    
    return authFac;
    
}])
;