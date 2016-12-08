var app = angular.module('fs', ['ngRoute','ui.router', 'ngDialog']);

app.controller("fs", function($scope, $state, $http, $location) {

    // 初始化数据，判断是否登录
    $scope.fs = {
        host: g.host,
        errorMsgShow : false,
        errorMsg: '',
        // headerBarShow: '',
        // sideBarShow: '',
        // mainSectionShow: ''
        loginFormShow: true,
        dashboardShow: false,
        user: {
            name: '',
            pwd: '',
            loginCheck: function(e) {
                // console.log(e);
                $http({
                    method:'post', 
                    url: g.host+"/decoration_manage/login/login", 
                    params: {
                        loginName: $scope.fs.user.name,
                        loginPwd: $scope.fs.user.pwd
                    }
                }) 
                .success(function(data) {
                    console.log(data)
                    g.setCookie('fs_token', data.data.token, data.data.exp);
                    if (!data.code==0) {

                        alert(data.msg);

                        return;

                    } else {

                        alert(data.msg);

                        window.localStorage.fs_token = data.data.token;

                        $location.path('dashboard');

                        $scope.fs.loginFormShow = false;

                        $scope.fs.dashboardShow = true;
                    }
                }).error(function(data) {

                    console.log(data)

                })               
            }
        },

    }

    if (window.localStorage.fs_token) {
        $scope.fs.loginFormShow = false;
        $scope.fs.dashboardShow = true;
    }

})

var g = {
    
    error: {

        _CONNECTIVE_ERROR: '数据库连接出错，请稍后再试',
        _JS_FUNCTION_ERROR: 'Javascript代码错误',

    },

    host: 'http://192.168.0.224:8089',

    getData : function(data) {
        
        var code = data.code;

        if (code === 0) {

            return true;

        } else  {

            return false;
        }      
    },

    setCookie: function(name, value, expireDay) {

        var date = new Date();
        date.setTime(date.getTime() + expireDay);
        // console.log(new Date(date.getTime() + expireDay));
        document.cookie = name + '=' + value + " ; expires = " + date.toGMTString(); 


    },
 
}