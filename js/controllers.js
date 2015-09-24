var myApp = angular.module('myApp', [])

.filter('noPeriod', function(){
      return function(val){
  var filteredString = val.replace(/\./g, '@2E');
  return filteredString;
}
    })

.controller('MyCtrl', ['$scope', '$http', function ($scope, $http) {
$http.get('js/9-16.json').success(function(data){
    $scope.kills = angular.fromJson(data);

    $scope.filteredList = {};
    $scope.filteredList.pilots = [];
    $scope.filteredList.corps = [];
    $scope.filteredList.allies = [];
    $scope.filteredList.ships = [];

//Loop through Pilots and remove dupes
angular.forEach($scope.kills, function(key,value){
  if (!pilotCheck($scope.filteredList.pilots, key.victim.characterName) && key.victim.characterName != ""){
    $scope.filteredList.pilots.push({pilotName:key.victim.characterName, pilotId:key.victim.characterID, type:"victim"});
  }
    angular.forEach(key.attackers, function(key,attackerValue){
      if (!pilotCheck($scope.filteredList.pilots, key.characterName) && key.characterName != ""){
        $scope.filteredList.pilots.push({pilotName:key.characterName, pilotId:key.characterID, type:"attacker"});
      }
    })
});

function pilotCheck(pilotList, pilotName){
  for (var i = 0; i < pilotList.length; i++){
    if (pilotList[i].pilotName == pilotName){
      return true;
      break
    }
  }
  return false;
};
//Loop through Corps and remove dupes
angular.forEach($scope.kills, function(key,value){
  if (!corpCheck($scope.filteredList.corps, key.victim.corporationName) && key.victim.corporationName != ""){
    // key.victim.corporationName = key.victim.corporationName.replace(".","@2E");
    $scope.filteredList.corps.push({corpName:key.victim.corporationName, corpId:key.victim.corporationID, type:"victim"});
  }
    angular.forEach(key.attackers, function(key,attackerValue){
      if (!corpCheck($scope.filteredList.corps, key.corporationName) && key.corporationName != ""){
        // key.corporationName = key.corporationName.replace(".","@2E");
        $scope.filteredList.corps.push({corpName:key.corporationName, corpId:key.corporationID, type:"attacker"});
      }
    })
});

function corpCheck(corpList, corpName){
  for (var i = 0; i < corpList.length; i++){
    if (corpList[i].corpName == corpName){
      return true;
      break
    }
  }
  return false;
};
//Loop through Alliances and remove dupes
angular.forEach($scope.kills, function(key,value){
  if ($scope.filteredList.allies.lastIndexOf(key.victim.allianceName) === -1 && key.victim.allianceName != ""){
    $scope.filteredList.allies.push(key.victim.allianceName);
  }
    angular.forEach(key.attackers, function(key,attackerValue){
      if ($scope.filteredList.allies.lastIndexOf(key.allianceName) === -1 && key.allianceName != ""){
        $scope.filteredList.allies.push(key.allianceName);
      }
    })
});

angular.forEach($scope.kills, function(key,value){
  if ($scope.filteredList.ships.lastIndexOf(key.victim.shipTypeID) === -1 && key.victim.shipTypeID != ""){
    $scope.filteredList.ships.push(key.victim.shipTypeID);
  }
    angular.forEach(key.attackers, function(key,attackerValue){
      if ($scope.filteredList.ships.lastIndexOf(key.shipTypeID) === -1 && key.shipTypeID != ""){
        $scope.filteredList.ships.push(key.shipTypeID);
      }
    })
});


});
}]);
