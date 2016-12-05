app.controller("navigation", function($scope, getNavBarData) {
    $scope.name = "Jack";
    $scope.topNav = getNavBarData.data.data.datas;
    // console.log(getNavBarData)
})
