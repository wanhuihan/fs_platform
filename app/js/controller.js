var app = angular.module('fs', ['ngRoute','ui.router']);
app.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.when("/", "dashboard")
    // $urlRouterProvider.otherwise("dashboard/login");
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        resolve: {
            getNavBarData : function($http) {
                return $http({method:'post', url: "http://192.168.0.201:8080/decoration_manage/system/selectAllMenuList", params: {
                    token: '3FB7A1E6933D7B73D0B2DC97C21BE73A',
                }})
            },
            getCraftData: function($http) {  
                return $http.post("http://192.168.0.201:8080/decoration_manage/common/selectWorkTypesList")              
            },

            getCityData: function($http) {  
                return $http.post("http://192.168.0.201:8080/decoration_manage/common/selectAllCityList")              
            },

            // craft fee function
            getconfigData: function($http) {
                return $http.post("http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList")
            }
        },

        views: {
            'topNav': {
                templateUrl: 'templates/header.html',
                controller: 'navigation'
                },
        },
    })

    $stateProvider.state('dashboard.main', {
        url: '/main',
        views: {
            'body@': {
                'templateUrl': 'templates/dashboard.html',           
            },
            'body@topNav': {
                'templateUrl': 'templates/header.html'
            }
        }
    })   

    $stateProvider.state('dashboard.menu_khgl', {
        url: '/menu_khgl',
        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar',         
            },

        }, 
    })

    $stateProvider.state('dashboard.menu_zxgl', {
        url: '/menu_zxgl',
        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar',         
            },
            // 'mainSection@': {
            //     templateUrl: 'tmeplates',
            // },                       
        }, 
    }) 

    $stateProvider.state('dashboard.menu_gxpz', {
        url: '/menu_gxpz',
        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/decoration_config.html',
                // controller: 'test'
                controller: 'process_config'
            }
        }, 
    })

    $stateProvider.state('dashboard.menu_gzfy', {

        url: '/menu_gzfy?pageNum&pageCount&pageSize&cityCode&craftId&cityName',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/decoration_craft_fee.html',
                controller: 'craft_fee'
            }
        }, 
    })

})

app.controller("fs", function($scope, $state) {

    $scope.fs = {
        errorMsgShow : false,
        errorMsg: ''
        // headerBarShow: '',
        // sideBarShow: '',
        // mainSectionShow: ''
    }

    $scope.doLogin = function() {
        $scope.loginFormShow = false;
        $scope.headerBarShow = true;
        $scope.sideBarShow = true;
        $scope.mainSectionShow = true;
        window.localStorage.isLog = 'islogin';
        $state.go('dashboard',null,{
            reload:false,
        });        
    } 
      // is login
      if (window.localStorage.isLog) {
        $scope.loginFormShow = false;
        $scope.headerBarShow = true;
        $scope.sideBarShow = true;
        $scope.mainSectionShow = true;     
      } else {
        $scope.loginFormShow = true;
      }
})

app.controller("navigation", function($scope, getNavBarData) {
    $scope.name = "Jack";
    $scope.topNav = getNavBarData.data.datas;
    // console.log($scope.topNav)
})

app.controller("sideBar", function($scope, getNavBarData, $location) {
    $scope.topNav = getNavBarData.data.datas;
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
                        // console.log(o[i].ancestor);
                        // console.log(parentId)
                        for (var b = 0; b < topNav.length; b++) {
                            // console.log(topNav[b].id +'=>'+ parentId);                            
                            if (topNav[b].id == parentId) {
                                // console.log(topNav[b])
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

app.controller('process_config', function($scope, $http, getCraftData) {   

    console.log(getCraftData.data.datas)
    // $scope.craftData = getCraftData.data.datas;

    $scope.construction_trades = '';

    $http.post("http://192.168.0.201:8080/decoration_manage/decoration/processConfiguration/selectList")
    .success(function(response) {
            // console.log(response)
            $scope.fs.errorMsgShow = true;
            $scope.data = response.datas;
            // console.table($scope.data)
    })
})


app.controller("craft_fee", function($location, $scope, $http, getCityData, getCraftData, $timeout, $q, $stateParams, getconfigData) {
    
//     $scope.craftData = getCraftData.data.datas;

//     $scope.pager = {
//         pageNumber: 1,
//         pageCount: '',
//         pageSize: '20',
//         cityCode: '',
//         cityName: '',
//         craftId: '',
//         showPageSelect: function(p) {
//             var num = new Array();
//             for (var i = 0; i < p; i++) {
//                 num.push(i+1)
//             }
//             return num;
//         },
//         pageNumSelect: '',
//         pageNums: '',
//         nextPageNum: '',
//         nextPageBtnActive: true,
//         lastPageBtnActive: false,
//         lastPageNum: '',
//         currentPageNum: 1,
//         total: ''

//     }

//     $scope.name = "";  
 
//     $scope.params = {
//         pageSize:  '',
//         pageNumber: '',
//         pageCount: '',
//         cityCode: '',
//         craftId: '',
//     }

//     $scope.pager.total = getconfigData.data.total;
//     if ($stateParams.pageNum == undefined) {

//         // $scope.data = getconfigData.data.datas;
//         $scope.pager.pageNumSelect = $scope.pager.showPageSelect(getconfigData.data.pageCount);
//         $scope.pager.pageNumber = getconfigData.data.pageNumber;
//         $scope.pager.currentPageNum = getconfigData.data.pageNumber;
//         $scope.pager.nextPageNum = 2 ;
//         $scope.pager.pageCount = getconfigData.data.pageCount;
//         $scope.pager.total = getconfigData.data.total;
//         // console.log('first');
//         $scope.pager.lastPageBtnActive = false;
//         $scope.params.pageNumber = 2;
//         $scope.pager.total = getconfigData.data.total;


//     } else if ($stateParams.pageNum == 1) {

//         $scope.pager.nextPageNum = parseInt($stateParams.pageNum) + 1 ;
//         $scope.pager.lastPageBtnActive = false;
//         $scope.pager.pageCount = $stateParams.pageCount;
//         $scope.pager.pageNumber = parseInt($stateParams.pageNum);
//         $scope.pager.pageNumSelect = $scope.pager.showPageSelect($stateParams.pageCount);
//         $scope.pager.currentPageNum = $stateParams.pageNum;
//         $scope.pager.pageSize = $stateParams.pageSize;
//         $scope.pager.cityCode = $stateParams.cityCode;
//         $scope.name = $stateParams.cityName;
//         $scope.pager.craftId = $stateParams.craftId;
//         angular.element(document.querySelector('.citySelectInput')).attr("city-code",($stateParams.cityCode));

//         // 

//     } else {
        
//         $scope.pager.lastPageBtnActive = true;
//         $scope.pager.nextPageNum = parseInt($stateParams.pageNum) + 1 ;
//         $scope.pager.lastPageNum = parseInt($stateParams.pageNum) - 1 ; 

//         $scope.pager.pageNumSelect = $scope.pager.showPageSelect($stateParams.pageCount);
//         $scope.pager.pageCount = $stateParams.pageCount;
//         $scope.pager.pageNumber = parseInt($stateParams.pageNum);
//         $scope.pager.currentPageNum = $stateParams.pageNum;
//         $scope.pager.pageSize = $stateParams.pageSize;
//         $scope.pager.cityCode = $stateParams.cityCode;
//         $scope.name = $stateParams.cityName;
//         $scope.pager.craftId = $stateParams.craftId;
//         angular.element(document.querySelector('.citySelectInput')).attr("city-code",($stateParams.cityCode));
        
//         // console.log($scope.pager.name)
//     }


//     // console.log($stateParams);


/*
 * get the cities list function, no need remove 
 * ================GET CITY LIST START==================
*/
    
    $scope.cityData = getCityData.data.datas;

    $scope.cities = new Array();

    for (var i in $scope.cityData) {
        var letter = $scope.cityData[i];
        // console.log(letter)
        for (var a = 0; a < letter.length; a++) {
            $scope.cities.push({name:letter[a].city_name, cityCode: letter[a].city_code})
        }
    }    

    $scope.cityListShowVal = false; 
    // $scope.cityCode = '';

    $scope.cityListShow = function() {
        $scope.cityListShowVal = true;
    }

    $scope.cityListHide = function() {
        var HideCityListDelay = $timeout(function() {
            $scope.cityListShowVal = false;
            $timeout.cancel(HideCityListDelay);

        },200) 
    }

    $scope.getCityCode = function(e) {
        $scope.name = e.item.name;
        $scope.terms.cityCode = e.item.cityCode;
        // console.log(e.item.cityCode)
        angular.element(document.querySelector('.citySelectInput')).attr("city-code",(e.item.cityCode));
        $scope.terms.cityCode = e.item.cityCode;
    }

    $scope.cityDefaultValSet = function(e) {
        // console.log(e)
        if ($scope.name == '') {
            angular.element(document.querySelector('.citySelectInput')).attr("city-code",(''));
            $scope.pager.cityCode = '';
        }
    }
/*
 * get the cities list function, no need remove 
 * ================GET CITY LIST END==================
*/



//     $scope.params.pageSize = $scope.pager.pageSize;
//     $scope.params.pageNumber = $stateParams.pageNum;
//     $scope.params.pageCount = $scope.pager.pageCount;
//     $scope.params.cityCode = $scope.pager.cityCode;
//     $scope.params.craftId = $scope.pager.craftId;

//     $http({
//         method: 'post',
//         url: "http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList",
//         params: $scope.params
//     }).success(function(r) {
//         $scope.data = r.datas;
//         // console.log($scope.pager.pageNumber)
//         $scope.pager.pageCount = r.pageCount;
//         console.log(r.pageCount);
//         $scope.pager.pageNumSelect = $scope.pager.showPageSelect(r.pageCount);

//     }) 

//     $scope.quickSearchFun = function(n) {

//         $location.path('dashboard/menu_gzfy').search({
//             pageNum:1, 
//             cityCode:$scope.pager.cityCode, 
//             craftId: $scope.pager.craftId,
//             cityName: $scope.name,
//             pageSize: $scope.pager.pageSize
//         })
//     }



//     $scope.showListAsPageSize = function(e) {

//         console.log($scope.pager.total / $scope.pager.pageSize);

//         // $scope.pager.pageCount =
//         $scope.pager.pageCount =  $scope.pager.total / $scope.pager.pageSize;
//         $scope.pager.pageNumber = 1;
//         $location.path('dashboard/menu_gzfy').search({
//             pageNum: $scope.pager.pageNumber, 
//             cityCode: $scope.pager.cityCode, 
//             craftId: $scope.pager.craftId,
//             cityName: $scope.name,
//             pageSize: $scope.pager.pageSize,
//             pageCount: Math.ceil($scope.pager.total / $scope.pager.pageSize)
//         })        
//     }

//      $scope.showListAsPageNum = function() {

//         $scope.pager.pageCount =  $scope.pager.total / $scope.pager.pageSize;

//         $location.path('dashboard/menu_gzfy').search({
//             pageNum: $scope.pager.pageNumber, 
//             cityCode: $scope.pager.cityCode, 
//             craftId: $scope.pager.craftId,
//             cityName: $scope.name,
//             pageSize: $scope.pager.pageSize,
//             pageCount: Math.ceil($scope.pager.total / $scope.pager.pageSize)
//         })        
//     }   
//     // console.log($scope.pager.total);
    // console.log(getconfigData.data);



    $scope.reSetPageSelect = function(data) {
        var pNum = new Array();
        for (var i = 0; i< data; i++) {
            pNum.push(parseInt(i+1))
        }
        return pNum;
    }

    $scope.pageSelect = $scope.reSetPageSelect(getconfigData.data.pageCount);
    $scope.currentPageNum = '1';
    // console.log(typeof $scope.reSetPageSelect(getconfigData.data.pageCount));


    $scope.pagination = {
        pageCount: getconfigData.data.pageCount,
        pageNumber: getconfigData.data.pageNumber,
        pageSize: '20',
        total: getconfigData.data.total,
        // pageSelect: $scope.reSetPageSelect(getconfigData.data.pageCount),
        lastPageBtnActive: false,
        nextPageBtnActive: true,
    }


    console.log($scope.pagination.pageNumber) 
    
    $scope.data = getconfigData.data.datas;

    $scope.terms = {
        cityCode: '',
        cityName: '',
        trades: '',   
    }

    // console.log(getconfigData)
    $scope.test = function(e) {

         console.log(typeof e)

         // return;
        if (typeof e == 'string') {
            var currentTarget = e;
        } else {
            if (e.target.className == '') {

                alert(g.error._JS_FUNCTION_ERROR)
                return;

            } else {

                var currentTarget = e.target.className;

            }
        }
        switch(currentTarget) {

            case 'previous':
                // 
                // console.log($scope.pagination.pageNumber)
   
                $scope.pagination.nextPageBtnActive = true;
                $scope.pagination.pageNumber -=1;  

                var obj = Object.assign($scope.pagination, $scope.terms);
                $scope.getcraftFee(obj);

                if ($scope.pagination.pageNumber <= 1) {
                    $scope.pagination.lastPageBtnActive = false;
                } 
                break;

            case 'next':
                // 
                $scope.pagination.lastPageBtnActive = true;
                console.log(typeof $scope.pagination.pageNumber)
                $scope.pagination.pageNumber +=1;

                // console.log($scope.pagination.lastPageBtnActive)
                var obj = Object.assign($scope.pagination, $scope.terms);
                $scope.getcraftFee(obj);

                if ($scope.pagination.pageNumber == $scope.pagination.pageCount) {

                    $scope.pagination.nextPageBtnActive = false;

                } 
                break;  

            case 'perPage':   
                //
                $scope.pagination.pageNumber = 1;
                $scope.pagination.nextPageBtnActive = true;
                $scope.pagination.lastPageBtnActive = false;
                console.log($scope.pagination)
                var obj = Object.assign($scope.pagination, $scope.terms);

                $scope.getcraftFee(obj);  

                // console.log($scope.pagination);
                break;

            case 'pageNumSelect':

                // console.log($scope.pagination.pageNumber);
                $scope.pagination.pageNumber = $scope.currentPageNum;
                if ($scope.currentPageNum == $scope.pagination.pageCount) {
                    $scope.pagination.nextPageBtnActive = false;
                    $scope.pagination.lastPageBtnActive = true;
                }
                if ($scope.currentPageNum == 1) {
                    $scope.pagination.lastPageBtnActive = false;
                    $scope.pagination.nextPageBtnActive = true;
                }
                // $scope.pagination.pageNumber = $scope.pagination.pageNumber;
                var obj = Object.assign($scope.pagination, $scope.terms);
                $scope.getcraftFee(obj);   
                console.log($scope.pagination)
                break;
        }
    }
    // console.log($scope.currentPageNum)
    $scope.getcraftFee = function(obj) {
        $http({
            method: 'post',
            url: "http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList",
            params: obj
        }).success(function(r) {

            $scope.data = r.datas;
            $scope.pagination.pageCount = r.pageCount;
            $scope.pagination.pageNumber = r.pageNumber;
            // $scope.pagination.pageSelect = $scope.reSetPageSelect(r.pageCount);
            $scope.pageSelect = $scope.reSetPageSelect(r.pageCount);
            $scope.currentPageNum = r.pageNumber.toString();

        })
    }
})



var g = {
    error: {

        _CONNECTIVE_ERROR: '数据库连接出错，请稍后再试',

        _JS_FUNCTION_ERROR: 'Javascript代码错误',
    }
}