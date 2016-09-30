var app = angular.module('fs', ['ngRoute','ui.router']);
app.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.when("/", "dashboard")
    // $urlRouterProvider.otherwise("dashboard/login");
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        resolve: {
            getNavBarData : function($http) {
                return $http({method:'post', url: "http://192.168.0.201:8080/decoration_manage/system/selectAllMenuList", params: {
                    token: '9F1257D54952E9E502BE705D80F77C86',
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
   

    $scope.craftData = getCraftData.data.datas;

/*
 * get the cities list function, no need remove 
 * ================GET CITY LIST START==================
*/
    
    $scope.cityData = getCityData.data.datas;

    $scope.cities = new Array();
    $scope.name = "";
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
            $scope.terms.cityCode = '';
        }
    }
/*
 * get the cities list function, no need remove 
 * ================GET CITY LIST END==================
*/

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

    // console.log($scope.pagination.pageNumber) 
    
    $scope.data = getconfigData.data.datas;
    console.log($scope.data);
    $scope.terms = {
        cityCode: '',
        cityName: '',
        craftId: '',   
    }

    // console.log(getconfigData)
    $scope.pageFun = function(e) {

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

            case 'btn btn-default quickSearchCheck':

                $scope.pagination.pageNumber = 1;
                $scope.pagination.pageCount = 20;

                $scope.terms.cityName = $scope.name;
                $scope.terms.cityCode = angular.element(document.querySelector('.citySelectInput')).attr("city-code");               
                var obj = Object.assign($scope.pagination, $scope.terms);
                $scope.getcraftFee(obj);                  
                break;

            case 'btn btn-info resetQuickSearchItem':
                console.log(123);
                $scope.terms.cityName = '';
                $scope.terms.cityCode = '';
                $scope.pagination.pageNumber = 1;
                $scope.pagination.pageCount = 20;
                var obj = Object.assign($scope.pagination, $scope.terms);
                $scope.getcraftFee(obj);                  
                break;
        }
    }


    $scope.getcraftFee = function(obj) {

        $http({
            method: 'post',
            url: "http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList",
            params: obj
        }).success(function(r) {
            // console.log(r)
            $scope.data = r.datas;
            $scope.pagination.pageCount = r.pageCount;
            $scope.pagination.pageNumber = r.pageNumber;
            // $scope.pagination.pageSelect = $scope.reSetPageSelect(r.pageCount);
            $scope.pageSelect = $scope.reSetPageSelect(r.pageCount);
            $scope.currentPageNum = r.pageNumber.toString();
            // console.log($scope.pagination.pageCount)
        })
    }

    // quick edit details
    $scope.quickEdit = {

        quickEditFun: function(e) {
            // console.log(e.target.attributes.data.value);
            var feeId = e.target.attributes.data.value;
            console.log(angular.element(document.querySelector("#work_area_"+feeId))[0].value);

            angular.element(document.querySelector("#quickEditFun_"+feeId))[0].style.display = 'none';
            angular.element(document.querySelector("#quickEditSave_"+feeId))[0].style.display = 'inline-block';
            angular.element(document.querySelector("#inputEditCancel_"+feeId))[0].style.display = 'inline-block';

            // console.log(angular.element(document.querySelector("#quickEditFun_"+feeId)))
        },

        quickEditSave: function(e) {
            console.log(e)
        },

        inputEditCancel: function(e) {
            console.log(e)

        }
    }

    /*
     * 通过id来查找相对应的id的值 拼起来传给后台    
    */

})



var g = {
    error: {

        _CONNECTIVE_ERROR: '数据库连接出错，请稍后再试',
        _JS_FUNCTION_ERROR: 'Javascript代码错误',

    }
}