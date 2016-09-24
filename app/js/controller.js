var app = angular.module('fs', ['ngRoute','ui.router']);



app.config(function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.when("/", "dashboard")
    // $urlRouterProvider.otherwise("dashboard/login");
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        resolve: {
            getNavBarData : function($http) {
                return $http.get("http://192.168.0.100:3000/js/demo_data.js?callback=JSON_CALLBACK")
            }
        },
        views: {
            'topNav': {
                templateUrl: 'templates/header.html',
                controller: 'navigation'
                },
            'sideBar': {
                // templateUrl: 'templates/sideBar.html'
            }
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
        }, 
    }) 

    $stateProvider.state('dashboard.menu_gxpz', {
        url: '/menu_gxpz',
        views: {
            // 'sideBar@': {
            //     templateUrl: 'templates/sideBar.html',  
            //     controller: 'sideBar',         
            // },
            'mainSection@': {
                template: 'hell oworld',
                controller: 'test'
            }
        }, 
        
    }) 
           

})

app.controller("fs", function($scope, $state) {

    // $scope.fs = {
    //     headerBarShow: '',
    //     sideBarShow: '',
    //     mainSectionShow: ''
    // }

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
    $scope.topNav = getNavBarData.data.data;
})

app.controller("sideBar", function($scope, getNavBarData, $location) {

    $scope.topNav = getNavBarData.data.data;
    var topNav = $scope.topNav;
    var current = $location.path().split('/')[2];
    var currentObj = new Object();
    for (var i = 0; i < topNav.length; i++) {
        if (topNav[i].id == current) {
            currentObj = topNav[i];
            break;
        }
    }
    console.log(currentObj);
    $scope.currentSubCat = currentObj.children;
})

app.controller("test", function($scope, getNavBarData, $location) {
    $scope.topNav = getNavBarData.data.data;
    var topNav = $scope.topNav;
    var current = $location.path().split('/')[2];
    var currentObj = new Object();
    // console.log(current);
    // console.log(topNav)
    for (var i = 0; i < topNav.length; i++) {
        // console.log(topNav[i].id == current)
        // if (topNav[i].id == current) {
        //     currentObj = topNav[i];
        //     break;
        // }
        // console.log(topNav[i].hasChildren)
        if (topNav[i].hasChildren) {
            var a = topNav[i].children;
            // console.log(a)
            for (var b = 0; b < a.length; b++) {
                // console.log(a[b].hasChildren)
                if(a[b].hasChildren) {
                    var d = a[b].children;
                    // console.log(d);

                    for (var c = 0; d.length; c++) {
                        console.log(d[c]);
                        if (d[c].id == current) {
                            currentObj = topNav[i];
                        }
                        break;
                    }

                    // for (var c = 0; d.length; c++) {
                    //     console.log(d[c].hasChildren);
                    //     break;
                    // }
                }
            }
        }
    }
    console.log(currentObj.children);
    $scope.currentSubCat = currentObj.children;
})



