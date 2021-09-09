var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    var getData = function() {
        return $http( {
            method: 'GET',
            url: '/users'
        }).then(function successCallback(response) {
            $scope.users = response.data;
            console.log('Success: ' + response);
        }, function errorCallback(response) {
            console.log('Error: ' + response);
        });
    };
    getData();
    $scope.del_user = function(user) {
        $http( {
            method: 'DELETE',
            url: '/user/:id',
            params: {'id': user.id}
        }).then(function successCallback(response) {
            console.log(response);
            return getData();
        }, function errorCallback(response) {
            console.log('Error: ' + response);
        });
    };
    $scope.add_user = function() {
        var body = '{ "name": "' + $scope.Name +
        '", "id": "' + $scope.Id +
        '", "type": "user" }';
        $http({
            method: 'POST',
            url: '/user',
            data: body
        }).then(function successCallback(response) {
            console.log(response);
            return getData();
        }, function errorCallback(response) {
            console.log('Error: ' + response);
        });
    };
});