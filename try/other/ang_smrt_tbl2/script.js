angular.module('myApp', ['smart-table','lrDragNDrop'])
    .controller('mainCtrl', ['$scope', '$timeout',
        function ($scope, $timeout) {

            var nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'];
            var familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

            $scope.isLoading = false;
            $scope.rowCollection = [];


            function createRandomItem() {
                var
                    firstName = nameList[Math.floor(Math.random() * 4)],
                    lastName = familyName[Math.floor(Math.random() * 4)],
                    age = Math.floor(Math.random() * 100),
                    email = firstName + lastName + '@whatever.com',
                    balance = Math.random() * 3000;

                return {
                    firstName: firstName,
                    lastName: lastName,
                    age: age,
                    email: email,
                    balance: balance
                };
            }
            
            $scope.columns=['firstName', 'lastName','age','email','balance'];
            
            for(var i=0;i<50;i++){
              $scope.rowCollection.push(createRandomItem());
            }



        }
    ]);