var app = angular.module('fs', ['ngDialog','ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
    // route for the home page
    .when('/index', {
      templateUrl : 'templates/dashboard.html',
      // controller  : 'mainController'
    })

    .when('/', {
      templateUrl : 'templates/dashboard.html',
      // controller  : 'mainController'
    })

    // route for the member management page
    .when('/member', {
      templateUrl : 'templates/member.html',
      // controller  : 'aboutController'
    })

    // route for the decoration page
    .when('/menu_zxgl', {
      templateUrl : 'templates/decoration.html',
      // controller  : 'decoration_config'
    })

    .when('/provider', {
      templateUrl : 'templates/provider.html',
      // controller  : 'aboutController'
    }) 

    .when('/finance', {
      templateUrl : 'templates/finance.html',
      // controller  : 'aboutController'
    })

     .when('/system', {
      templateUrl : 'templates/system.html',
      // controller  : 'aboutController'
    })

     // decoration configuration page
     .when('/menu_gxpz', {
      templateUrl : 'templates/decoration_config.html',
      controller  : 'decoration_config',
    })
    // 
    .when('/decorationconfigdetails', {
        templateUrl : 'templates/decorationconfigdetails.html',
        controller: 'decorationConfigDetails',
    })
    .when('/menu_gzfy/', {
        templateUrl: 'templates/menu_gzfy.html',
        // controller: 'menu_gzfy'
    })

    .when('/menu_gzfy/:pager', {
        templateUrl: 'templates/menu_gzfy.html',
        // controller: 'menu_gzfy'
    })

    .when('/menu_kfjl', {
        templateUrl: 'templates/menu_kfjl.html',
        // controller: 'callCenterRecords'
    })
});

app.service('fsService', function($q, $http, $location){
    var service = {};
        service.decoration = {
            redirectPage : function(e) {
                console.log(e.target.id);
                $location.path('/'+e.target.id);
                this.highlightTarget(e.target);
            },
            highlightTarget: function(t) {
                // console.log(t.className)
                var leftSideBarH = 'panel-collapse-item';
               
                if (t.className.indexOf(leftSideBarH) >=0) {
                    // console.log(t);
                    angular.element(t).parents().find('.panel-collapse-item').removeClass('active');
                    angular.element(t).addClass('active');
                }
            }
        }
    return service;
})


app.controller("decorationConfigDetails", function($http, $scope, $controller, $location, $sce){
    // console.log($location.url);
    var processId = $location.search()['processId'];
    $controller('init', {$scope: $scope});
    
    $http.jsonp("http://192.168.0.201:8080/decoration_manage/decoration/processConfigurationDetail/selectList?processId="+processId+"&callback=JSON_CALLBACK")
    .success(function(response,status,headers,config) { 
        console.log(response);
        $scope.configDetails = response;
    })
    .error(function(response) {
        // console.log(response);
        if (!response) {
            $scope.errMsgShow = false;
            $scope.errorMsg = '程序出现错误，请稍后再试';
        }
    })

    // console.log(processId);

    $scope.back2LastPage = function() {       
        history.back(-1);
    }
})

// 工种费用
/**
 * @ craftFee - all the craft type fees 
 * @ craftData - all the craft types
 * @ cities - all the cities
**/
app.controller('menu_gzfy', function($scope, $http, $location, $timeout, $sce, $controller){

    var pager = $location.search().pager;
    console.log(pager);
    $controller('init', {$scope: $scope});
    $scope.craftFee = "";
    if (!pager) {
         // Get all the craft type fees list form back end;
        $http.jsonp("http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList?callback=JSON_CALLBACK")
        .success(function(response, status) {
            // console.log(response);
            $scope.pagination.craftFee = response.datas;
            $scope.pagination.isLastPgae = response.isLastPage;
            $scope.pagination.pageCount = response.pageCount;
            $scope.pagination.pageNumber = response.pageNumber;
            $scope.pagination.pageSize = response.pageSize;
            $scope.pagination.total = response.total;
            $scope.craftFee = response.datas;
            $scope.c = $scope.pagination.a(response.pageCount);  
            $scope.errMsgShow = true; 
        }).error(function(response){
            // console.log(response);
            if (!response) {
                $scope.errMsgShow = false;
                $scope.errorMsg = '程序出现错误，请稍后再试';    
            }
        })      
    } else {
        if (typeof pager == 'number') {
            console.log(123);

        }
    }


    // Get the city list from back end;
    $http.jsonp("http://192.168.0.201:8080/decoration_manage/common/selectAllCityList?callback=JSON_CALLBACK")
    .success(function(response, status) {       
        $scope.cityData = response.datas;
        $scope.cities = new Array();
        // console.log(response);
        // recreate the city list for template page
        for (var i in $scope.cityData) {
            var letter = $scope.cityData[i];
            for (var a = 0; a < letter.length; a++) {
                $scope.cities.push({name:letter[a].city_name, cityCode: letter[a].city_code})
            }
        }
    })
    
    // the value for city list show & hide;
    $scope.cityListShowVal = false; 

    // function for city list showing
    $scope.cityListShow = function() {
        $scope.cityListShowVal = true;
    }
    // function for city list hiding
    // the purpose for coding settimeout is when click the item in the city list, it will fire the blur function,
    // the city list will be hidden immediately, it can't get the city value you click;
    $scope.cityListHide = function() {
        var HideCityListDelay = $timeout(function() {
            $scope.cityListShowVal = false;
            $timeout.cancel(HideCityListDelay);
        },200)       
    }

    // input default value
    $scope.name= "";
    $scope.craftTypeSelect = "all";

    $scope.cityCode = '';
    // function for set the input value and city code
    $scope.getCityCode = function(e) {
        // console.log(e)
        $scope.name = e.item.name;
        $scope.cityCode = e.item.cityCode;
        $(".citySelectInput").attr("city-code",e.item.cityCode);
    }

    // reset the input value for search craft type fess
    $scope.resetInputSearch = function() {
        $scope.name = '';
        $(".craftSelect option:first").prop("selected","selected");
    }

    $scope.pagination = {
        pageCount: '',
        pageNumber: '1',
        pageSize: '20',
        total: '',
        isLastPgae: '',
        currentPage: false,
        a: function(p) {
            var html = new Array();
            for (var i = 0; i < p; i++) {
                if ($scope.pagination.pageNumber == i + 1) {
                    $scope.pagination.currentPage = true;
                } else {
                    $scope.pagination.currentPage = false;
                }
                html.push({pageNum: i+1,current:$scope.pagination.currentPage});
            }
            return html;
        },
        nextPage: function() {    
            // var  nextPNum =   $scope.pagination.pageNumber + 1;     
            $http({
                method: 'jsonp',
                url: 'http://192.168.0.201:8080/decoration_manage/decoration/workTypeExpense/selectList?callback=JSON_CALLBACK',
                params: {
                    area:  $scope.name,
                    areaCode: $scope.cityCode,
                    trades: $scope.craftTypeSelect,
                    // tradesValue: '',
                    pageNumber : $scope.pagination.pageNumber + 1,
                    pageSize : $scope.pagination.pageSize,
                },
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }

            }).success(function(response){
                console.log($scope.pagination.pageNumber);
                $scope.pagination.pageNumber = response.pageNumber;
                $scope.craftFee = response.datas;
                $location.path('/menu_gzfy/').search({pager:response.pageNumber});
                $scope.pagination.pageNumber = response.pageNumber;
               
            })   
            // console.log(nextPNum)         
        },
        prevPage: function() {

        }
    }

    // console.log($scope.pagination.pageNumber +1);
})

app.controller("init", function($scope, $http, $location, fsService, ngDialog){

    $scope.currentSubCat =  false;
	$scope.load = function() {
    
	    $http.get("http://192.168.0.100:3000/js/demo_data.js?callback=JSON_CALLBACK")
	    .success(function(response,status,headers,config){
	    	// console.log(response);
	        $scope.navTitle = response.data;            
	    })
        .success(function(response,status,headers,config){
            //alert(data);
            $scope.navTitle = response.data;
        })        
	    .error(function(response) {
	        // console.log(response);
	        if (!response) {
	            $scope.errorMsg = '程序出现错误，请稍后再试';
	        }
	    })

		var location = window.location.href.split('/')[1];
	 //    if (!location =='index' || !location=="") {	    	
	    	var getSideBar = setInterval(function() {
	    		var currentCat = $(".catId_" + location);
                // console.log(currentCat)
	    		currentCat.show(); 
	    		if (currentCat.length) {
		    		$("a[name="+location+"]").parent("li").addClass("active");
		    		if (currentCat[0].style.display == "block") {
		    			clearInterval(getSideBar);
		    		}
	    		} else {
	    			// console.log(123+ window.location)
	    			window.location.hash = "#/index";	    			
	    			clearInterval(getSideBar);
	    		}	    		
	    	},200);  	
	    // } 
	   
        // console.log(window.location.href);   
		$(".navbar-nav:first-child").on("click","a", function(e) {
			e.preventDefault();            
			window.location.href= '#/'+$(this).attr("name");
            var currentCat = window.location.hash.split("/")[1];
            if (currentCat == 'index') {
                $(".sideBarTab").hide();             
            } 
            $(".catId_"+currentCat).show().siblings(".sideBarTab").hide();
            $($(this)[0]).parent("li").addClass("active").siblings("li").removeClass("active"); 
		})	

        $scope.test = function(e) {
            // console.log(typeof e.target);
            fsService.decoration.redirectPage(e);

        }
	}
    $scope.showAddProcessPopup = function () {
        ngDialog.open({ 
            template: 'process_popup.html',
            className: 'ngdialog-theme-plain addProjectPop',
            scope: $scope
        });
    };


    // Get all the craft types form back end;
    $http.jsonp("http://192.168.0.201:8080/decoration_manage/common/selectWorkTypesList?callback=JSON_CALLBACK")
    .success(function(response, status) {
        // console.log(response);
        $scope.craftData = response.datas;
    })

    $scope.craftListHtml = 'hhhh';

})

// 装修配置
//  decoration configration

app.controller('decoration_config', function($scope, $http, ngDialog, $location, fsService) {

    $scope.currentSubCat = $location.path().slice(1);
    console.log($scope.currentSubCat);
    // $(".overwrap").show();
    $http.jsonp("http://192.168.0.201:8080/decoration_manage/decoration/processConfiguration/selectList?callback=JSON_CALLBACK")
    .success(function(response,status,headers,config) {
         $(".overwrap").hide();
        if (!response.success) {          
            $scope.errMsgShow = false;
            $scope.errorMsg = response.msg;
        } 
        else {
            $scope.errMsgShow = true;
            $scope.data = response.datas;
            console.log(response);
            
        }
    })

    .error(function(response){
        $(".overwrap").hide();
        // console.log(response);
        if (!response) {
          $scope.errMsgShow = false;
            $scope.errorMsg = '程序出现错误，请稍后再试';
        }
    })

    $scope.addProject = function() {
        $scope.datas.push({
            acceptance_basis: '',
            check_man: '',
            construction_description: '',
            engineering_calculation_rules: '',
            process_configuration_id: '',
            project_name: '',
            serial_number: '',
            status: '',
            unit: ''
        })
    }  
    $scope.showProcessDetailsPopup = function (e) {
        // console.log(e.item.serial_number);
        var process_configuration_id = e.item.process_configuration_id;
        $http.jsonp("http://192.168.0.201:8080/decoration_manage/decoration/processConfigurationDetail/selectList?processId="+process_configuration_id+"&callback=JSON_CALLBACK")
        .success(function(response,status,headers,config){
          // console.log(response)
            $scope.processDetails = response;
            // console.log($scope.processDetails) 
            ngDialog.open({ 
                template: 'process_popup_details.html',
                className: 'ngdialog-theme-plain project',
                scope: $scope

            });                       
        })
        .error(function(response){
            console.log(response);
            if (!response) {
                $scope.errorMsg = '程序出现错误，请稍后再试';
            }
        })  
    };  

    $scope.getDetails = function(processId) {
        console.log(processId);

        $http.jsonp("http://192.168.0.200:8080/decoration_manage/decoration/processConfigurationDetail/selectList?processId="+processId+"&callback=JSON_CALLBACK")
        .success(function(response,status,headers,config) { 
/*            if (!response.success) {          
                $scope.errMsgShow = false;
                $scope.errorMsg = response.msg;
            } 
            else {
                $scope.errMsgShow = true;
                $scope.data = response.datas;
                console.log(response);
                
            }*/
            console.log(response);
            // window.location.href="./ss";
        })
        .error(function(response){
            // console.log(response);
            if (!response) {
              $scope.errMsgShow = false;
                $scope.errorMsg = '程序出现错误，请稍后再试';
            }
        })        
    }


})


// app.controller("callCenterRecords", function($scope, $controller){
//     $controller('init', {$scope: $scope});
// })


