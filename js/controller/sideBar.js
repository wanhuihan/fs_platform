app.controller("sideBar", function($scope, getNavBarData, $location) {

    // console.log(getNavBarData)

    $scope.topNav = getNavBarData.data.data.datas;

    var topNav = $scope.topNav;

    var current = $location.path().split('/')[2];

    // console.log(current);

    var currentObj = new Object();

    function getParentId(o) {
        // console.log(o.length)
         var parentId= "" ;
        if (o.length >= 0 ) {
            for (var i = 0 ; i < o.length; i++) {
                
                if (o[i].hasChildren) {
                    getParentId(o[i].children);
                    // console.log(o[i].id +'='+ current);
                    if (o[i].id == current) {
                        currentObj = o[i];
                        // console.log(currentObj)
                        break;
                    }
                } else {
                    if (o[i].id == current) {
                        parentId = o[i].ancestor;
                        for (var b = 0; b < topNav.length; b++) {                            
                            if (topNav[b].id == parentId) {
                                currentObj = topNav[b];  
                                break;
                            }     
                        }
                    }
                }
            }
        }
    }

    getParentId($scope.topNav);

    $scope.cur = currentObj.id;

    $scope.currentSubCat = currentObj.children;

})