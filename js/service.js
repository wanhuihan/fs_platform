// pagination

"use strict";

app.service('page', function($http) {

    this.getData = function(items) {

        // console.log(items);

        var url = items.url;

        return $http({

            method: 'post',
            url: g.host + url,
            params: items,

        })

    }

    this.calcPages = function(pageCount) {

        var pages = Number(pageCount);

        var arr = new Array();

        if (pages && pages > 1) {

            for (var i = 0; i < pages; i++) {

                arr.push(i+1);
            }

        } else {
            arr.push(1);
        }

        return arr;
    } 

});

app.service('dictionary', function($http) {

    this._get = function(type) {

        var t = type;

        return $http({

            method: 'post',
            url: g.host+'/decoration_manage/common/dict',
            params: {
                pid: t
            }

        })
    }

    this.getCategory = function() {

        return $http({
            method: 'post',
            url: g.host+'/decoration_manage/common/allSubDict',

            params: {
                pid: 'materialType'
            }
        })
    }

})

app.service('products', function($http) {

    this.supplyList = function() {

        return $http({
                method: 'post',
                url: g.host+ '/decoration_manage/supplier/supplier/selectList',
            })
    }

    this.getDetails = function(id) {

        return $http({

            method: 'post',
            url: g.host+'/decoration_manage/decoration/commodity/viewMaterialConfigurtion',
            params: {
                materialConfigurationlId: id
            }
        })
    }

    this.detailEditSave = function(id, params) {

        params.materialConfigurationlId = id;

        return $http({

            method: 'post',
            // datatype: 'jsonp',
            url: g.host+'/decoration_manage/decoration/commodity/update',
            data: params,
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
    }

    this.getBrandList = function() {

        return $http({
            url: g.host+'/decoration_manage/decoration/materialbrand/list',
            method: 'post',
                        
        })        
    }

    this.getRole = function() {

        return $http({

            method: 'post',
            
            url: g.host+'/decoration_manage/common/designer'
        })
        
    }

    this.addProductSub = function(params) {

        return $http({

            method: 'post',
            // datatype: 'jsonp',
            url: g.host+'/decoration_manage/decoration/commodity/add',
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },

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
    }

    this.productDelete = function(id) {

        return $http({

            method: 'post',
            
            url: g.host+'/decoration_manage/decoration/commodity/delete',

            data: {
                materialConfigurationlId: id,
                token: g.host
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
    }

})

app.service("decoration", function($http) {

    this.craftFeeEditSave = function(items) {

        return $http({
            method: 'post',
            url: g.host+'',
        })

    }

    // this.calcRate = function(value) {

    //     return 
    // }

})

app.service("member", function($http) {

    this.verifyList = function(item) {

        return $http({

            method: 'post',
            url: g.host + '/decoration_manage/member/verify/list',

            // params: items,

        })
    }

    this.details = function(userId, roleCode) {

        return $http({

            method: 'post',
            data: {
                userId: userId,
                roleCode: roleCode
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },

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
            },  
                     
            url: g.host+'/decoration_manage/member/verify/view'

        })

    }
})