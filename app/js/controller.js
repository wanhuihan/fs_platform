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
});

app.controller("decorationConfigDetails", function($http, $scope, $controller, $location){
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

    console.log(processId);

})

app.controller("init", function($scope, $http, $location){

	$scope.load = function() {
	    $http.get("http://192.168.0.100:3000/js/demo_data.js?callback=JSON_CALLBACK")
	    .success(function(response,status,headers,config){
	    	// console.log(response);
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
	   
        console.log(window.location.href);   
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
	}
})

app.controller('decoration_config', function($scope,$http,ngDialog){
    $http.jsonp("http://192.168.0.201:8080/decoration_manage/decoration/processConfiguration/selectList?callback=JSON_CALLBACK")
    .success(function(response,status,headers,config) { 
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
        console.log(response);
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
    $scope.showAddProcessPopup = function () {
        ngDialog.open({ 
            template: 'process_popup.html',
            className: 'ngdialog-theme-plain addProjectPop',
            scope: $scope
        });
    };  
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


