var myApp = angular.module('myApp', [])


.filter('noPeriod', function(){
      return function(val){
  var filteredString = val.replace(/\./g, '@2E');
  return filteredString;
}
    })

.controller('MyCtrl', ['$scope', '$http', function ($scope, $http) {

/// ----------------- REMOVE THE DUPES-------------////
  function pilotCheck(pilotList, pilotName){
    for (var i = 0; i < pilotList.length; i++){
      if (pilotList[i].pilotName == pilotName){
        return true;
        break
      }
    }
    return false;
  };

  function corpCheck(corpList, corpName){
    for (var i = 0; i < corpList.length; i++){
      if (corpList[i].corpName == corpName){
        return true;
        break
      }
    }
    return false;
  };

  function allyCheck(allyList, allyName){
    for (var i = 0; i < allyList.length; i++){
      if (allyList[i].allyName == allyName){
        return true;
        break
      }
    }
    return false;
  };

  function shipCheck(shipList, shipType){
    for (var i = 0; i < shipList.length; i++){
      if (shipList[i].shipType == shipType){
        return true;
        break
      }
    }
    return false;
  };
  /// ----------------- end REMOVE THE DUPES-------------////

  $scope.exportData =function(){
  var csvData = [];

                        csvData.push("Pilots, Corps, Alliances, Ships,")

                        //////YOUR ARRAY
                        ///REPLACE -  result.data with your stuff
  for (var i = 0; i < $scope.filteredList.pilots.length; i++){
    csvData.push($scope.filteredList.pilots[i].pilotName + "," + dataChecker( i, "corps", "corpName") + "," + dataChecker( i, "allies", "allyName") + "," + dataChecker( i, "ships", "shipType") + ",");
  }


                        var fileName = "OniExport.csv";
                        var buffer = csvData.join("\n");
                        var blob = new Blob([buffer], {
                            "type": "text/csv;charset=utf8;"
                        });

                        var link = document.createElement("a");

                        if(link.download !== undefined) {
                            ////HTML 5 browsers only
                            link.setAttribute("href", window.URL.createObjectURL(blob));
                            link.setAttribute("download", fileName);
                        }
                        else if(navigator.msSaveBlob) {
                            // IE 10+ special handler
                            navigator.msSaveBlob(blob, fileName);
                        }

                        document.body.appendChild(link);

                        link.click();
  }

    function dataChecker(index,target,value){
    try{
      return $scope.filteredList[target][index][value];
    }catch(e){
      return "";
    }
    }
//Input API query and click to run
$scope.apiClick = function(){
if ($scope.apiVal === "" || $scope.apiVal === undefined){
  alert("API Input is Blank");
  return;
}
  $http.get($scope.apiVal).success(function(data){
      $scope.kills = angular.fromJson(data);
//create data arrays to store objects
      $scope.filteredList = {};
      $scope.filteredList.pilots = [];
      $scope.filteredList.corps = [];
      $scope.filteredList.allies = [];
      $scope.filteredList.ships = [];

  //loop through Pilots and create objects for pilotName and pilotId
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

  //Loop through Corps and create ojecst for corpName and corpId
  angular.forEach($scope.kills, function(key,value){
    if (!corpCheck($scope.filteredList.corps, key.victim.corporationName) && key.victim.corporationName != ""){
      $scope.filteredList.corps.push({corpName:key.victim.corporationName, corpId:key.victim.corporationID, type:"victim"});
    }
      angular.forEach(key.attackers, function(key,attackerValue){
        if (!corpCheck($scope.filteredList.corps, key.corporationName) && key.corporationName != ""){
          $scope.filteredList.corps.push({corpName:key.corporationName, corpId:key.corporationID, type:"attacker"});
        }
      })
  });

  //Loop through Alliances and create object allyName
  angular.forEach($scope.kills, function(key,value){
    if (!allyCheck($scope.filteredList.allies, key.victim.allianceName) && key.victim.allianceName != ""){
      $scope.filteredList.allies.push({allyName:key.victim.allianceName});
    }
      angular.forEach(key.attackers, function(key,attackerValue){
        if (!allyCheck($scope.filteredList.allies, key.allianceName) && key.allianceName != ""){
          $scope.filteredList.allies.push({allyName:key.allianceName});
        }
      })
  });
  //Loop through Ships and create object shipType
  angular.forEach($scope.kills, function(key,value){
    if (!shipCheck($scope.filteredList.ships, key.victim.shipTypeID) && key.victim.shipTypeID != ""){
      $scope.filteredList.ships.push({shipType:key.victim.shipTypeID});
    }
      angular.forEach(key.attackers, function(key,attackerValue){
        if (!shipCheck($scope.filteredList.ships, key.shipTypeID) && key.shipTypeID != ""){
          $scope.filteredList.ships.push({shipType:key.shipTypeID});
        }
      })
  });


}).error(function(){
  alert("Please Check API Query Input");
});

}

}]);
