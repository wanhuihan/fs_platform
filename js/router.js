app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("/", "dashboard")

    $stateProvider.state('dashboard', {
        url: '/dashboard',
        resolve: {
            getNavBarData : function($http) {
                return $http({method:'post', url: g.host+"/decoration_manage/common/menu", params: {
                    token: window.localStorage.fs_token,
                }})
            },

            // 
            getCraftData: function($http) {  
                return $http.post(g.host+"/decoration_manage/common/worktype")              
            },

            getCityData: function($http) {  
                return $http.post(g.host+"/decoration_manage/common/opencity")              
            },

            // craft fee function
            getconfigData: function($http) {
                return $http.post(g.host+"/decoration_manage/decoration/laborexpense/list")
            },

            getRuleData: function($http) {
                return $http.post(g.host+'/decoration_manage/common/role')
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

    $stateProvider.state('dashboard.menu_gxpz_detail', {

        url: '/menu_gxpz/detail?processId?processName',

        views: {

            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },

            'mainSection@': {
                templateUrl: 'templates/decoration_config_details.html',
                controller: 'process_config_detail'
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


    // 业主管理

    $stateProvider.state('dashboard.menu_yzgl', {

        url: '/menu_yzgl',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/member_owner.html',
                controller: 'member'
            }
        }, 
    })


    $stateProvider.state('dashboard.menu_yzgl_detail', {

        url: '/menu_yzgl_detail?id=userId',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/member_owner.html',
                controller: 'member'
            }
        }, 
    })

    $stateProvider.state('dashboard.menu_hysh', {

        url: '/menu_hysh',

        resolve:{
            verifyList: function($http) {
                return $http.post(g.host+'/decoration_manage/member/verify/list')  
                // return $http.post(g.host+'/decoration_manage/common/role')
            }    
        },

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/member_verify.html',
                controller: 'member_verify'
            }
        }, 
    })    

    // 商品库

    $stateProvider.state('dashboard.menu_spk', {

        url: '/menu_spk',
        resolve: {
            getCatData : function($http) {
                return $http({
                    method: 'post',
                    url: g.host+'/decoration_manage/common/allSubDict',

                    params: {
                    pid: 'materialType'
                    }
                })
            },

            getRoleData : function($http) {
                return $http({

                    method: 'post',

                    url: g.host+'/decoration_manage/common/designer'
                })
            },

            getLabelList : function($http) {
                return $http({

                    method: 'post',
                    url: g.host+'/decoration_manage/common/dict',
                    data: {
                        pid: 'materialLabel'
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } ,

                    transformRequest: function(obj) {    
                        var str = [];    
                        for (var p in obj) {    
                            
                            if (typeof obj[p] == 'object' ) {
                                // console.log(p, JSON.stringify(obj[p]));
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                            } else {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                            }
                              
                        }    
                        return str.join("&");    
                    }                    

                })                
            },

            getProviderList : function($http) {
                return $http({
                        method: 'post',
                        url: g.host+ '/decoration_manage/supplier/supplier/selectList',
                    })
            },


            getBrandList : function($http) {

                return $http({
                    url: g.host+'/decoration_manage/decoration/materialbrand/list',
                    method: 'post',
                                
                })  
                              
            }


        },
        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/products.html',
                controller: 'products'
            }
        }, 
    })

    // 供应商管理

    $stateProvider.state('dashboard.menu_gysgl', {

        url: '/menu_gysgl',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/provider.html',
                controller: 'provider'
            }
        }, 
    })

    $stateProvider.state('dashboard.menu_gysgl_gysgl', {

        url: '/menu_gysgl_gysgl',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/provider.html',
                controller: 'provider'
            }
        }, 
    })

    $stateProvider.state('dashboard.menu_cgddgl', {

        url: '/menu_cgddgl',

        views: {
            'sideBar@': {
                templateUrl: 'templates/sideBar.html',  
                controller: 'sideBar'    
            },
            'mainSection@': {
                templateUrl: 'templates/provider_purchase_order.html',
                controller: 'providerPurchaseOrder'
            }
        }, 
    })

})