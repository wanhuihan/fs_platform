
app.controller("member", function($location, $scope, $http, getCityData, verifyList, member) {

    var status = $location.$$path;

    status = status.substring(status.lastIndexOf('/'));

    console.log(status)
    $scope.data = new Object();

    // console.log(status);

    // $scope.data = new Object();

    // $scope.subCategory = function(status) {

    //     //  业主管理
    //     if (status.indexOf('menu_yzgl') > 0 ) {

    //             this.data = function() {

    //                 var arr = [{
    //                     name: 'owner_Jack',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26',
    //                     id: 1                 
    //                 },
    //                 {
    //                     name: 'owner_Male',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26', 
    //                     id:2                  
    //                 }, 
    //                 {
    //                     name: 'owner_Ivy',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26',  
    //                     id: 3                  
    //                 },
    //                 {
    //                     name: 'owner_Tiger',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26',
    //                     id: 6                     
    //                 }, 
    //                 {
    //                     name: 'owner_Tiger',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26',  
    //                     id: 4                   
    //                 }, 
    //                 {
    //                     name: 'owner_Tiger',
    //                     gender: 'Male',
    //                     cell: '13911442668',
    //                     area: 'Beijing',
    //                     origin: 'Weixin',
    //                     regTime: '2016-08-10 05:30:26',
    //                     id: 5                     
    //                 },                                                               
    //                 ];

    //                 return arr; 
    //             }

    //             this.getDetail = function(detailId) {
                    
    //                 var id = detailId;

    //                 if (detailId) {
                        
    //                 }
    //             }
    //     }

    // }

    // var obj = new $scope.subCategory(status);

    // $scope.data = obj.data();





    // switch(status) {

    //     case '/menu_hysh':
    //     $scope.data = verifyList.data.data;
    //     // console.log($scope.data);

    //     member.getList()

    //     // $scope.data.list = {
    //     //     pageCount: $scope.data.pageCount,
    //     //     pageNumber: $scope.data.pageNumber,
    //     //     pageSize: $scope.data.pageSize,
    //     //     url: '/decoration_manage/member/verify/list'
    //     // }
    //     case '/menu_yzgl':

    //     case '/menu_fwry':
    // }    

    // // console.log(verifyList)

})


app.controller("member_verify", function($location, $scope, $http, getCityData, member, ngDialog) {
    
    $scope.pager = {};

    member.verifyList().then(function(callback) {

        // console.log(callback.data.data);

        $scope.pager.url = '/decoration_manage/member/verify/list';
        $scope.pager.data = callback.data.data.datas;
        $scope.pager.pageNumber = callback.data.data.pageNumber.toString();
        $scope.pager.pageCount = callback.data.data.pageCount;
        $scope.pager.pageSize = callback.data.data.pageSize;
        $scope.pager.total = callback.data.data.total;
        $scope.pager.numList = callback.data.data.NumberList;

    })

    $scope.verifyDetails = function(userId, roleCode) {

        // console.log(userId, roleCode);

        ngDialog.open({
            id: '',
            templateUrl: 'templates/member_detail.html',
            width: 800,
            controller: function($scope) {
                
                member.details(userId, roleCode).then(function(callback) {

                    // console.log(callback)
                    $scope.memberDetails = callback.data.data.datas;

                })

            }
        })
    }

})




