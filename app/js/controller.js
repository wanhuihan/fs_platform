


app.controller("navigation", function($scope, getNavBarData) {
    $scope.name = "Jack";
    $scope.topNav = getNavBarData.data.data.datas;
    // console.log(getNavBarData)
})


app.controller("sideBar", function($scope, getNavBarData, $location) {

    console.log(getNavBarData)

    $scope.topNav = getNavBarData.data.data.datas;

    var topNav = $scope.topNav;

    var current = $location.path().split('/')[2];

    console.log(current);

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

// 工序配置

app.controller('process_config', function($scope, $http, $location, getRuleData, getCraftData, $stateParams, ngDialog) {   
    // console.log(getCraftData.data.datas)

    $scope.craftData = getCraftData.data.data.datas;

    $scope.construction_trades = '';

    function getConfigList() {

        $http.post(g.host+"/decoration_manage/decoration/processconfiguration/list")
        .success(function(response) {
            console.log(response);
            $scope.fs.errorMsgShow = true;

            $scope.data = response.data.datas;

        })        
    }

    getConfigList();
    // console.log(getRuleData)
    $scope.processConfig = {

        edit: {

            data: {
                projectName: '',
                craftId: '',
                files: '',
                unit: '',
                briefInfo: '',
                calRegulation: '',
                processId: '', 
                role: '',
                roleData: getRuleData.data.data.datas,
                // craftData: $scope.craftData
            },

            showPop: function(processId) {

                $http({
                    method: 'post',
                    url: g.host+'/decoration_manage/decoration/processconfiguration/view',

                    params: {
                        processConfigurationId: processId
                    }

                }).success(function(data) {

                    if (g.getData(data)) {

                        var dataGroup = data.data.datas;

                        // console.log(dataGroup);

                        $scope.processConfig.edit.data.projectName = dataGroup.projectName;
                        $scope.processConfig.edit.data.craftId = dataGroup.constructionTrades.toString();
                        $scope.processConfig.edit.data.files = dataGroup.acceptanceBasis;
                        $scope.processConfig.edit.data.briefInfo = dataGroup.constructionDescription;
                        $scope.processConfig.edit.data.unit = dataGroup.unit;
                        $scope.processConfig.edit.data.calRegulation = dataGroup.engineeringCalculationRules;
                        $scope.processConfig.edit.data.processId = dataGroup.processConfigurationId;
                        $scope.processConfig.edit.data.role =  dataGroup.roleCode;

                        // console.log(typeof $scope.processConfig.edit.data.role)

                        ngDialog.open({
                            template:'templates/process_config_edit.html',
                            className: 'ngdialog-theme-default processConfigEdit',
                            scope: $scope,
                        })
                        // console.log($scope.processConfig.edit.data)
                    }

                })
            },


        },


        delete: function(id) {
            // console.log(id)
            $http({
                method: 'post',
                url: g.host+'/decoration_manage/decoration/processconfiguration/delete',
                params: {
                    token: localStorage.fs_token,
                    processConfigurationId: id
                }    
            }). success(function(data) {
                // console.log(data);
                getConfigList();
            })
        },
        add: {
            showPop:  function(e) {
                // console.log(12);
                ngDialog.open({
                    template:'templates/process_config_add.html',
                    className: 'ngdialog-theme-default processConfigAdd',
                    scope: $scope,
                })

            },
            data: {
                projectName: '',
                craftId: '',
                files: '',
                unit: '',
                briefInfo: '',
                calRegulation: '',
                role: '',
                roleData: getRuleData.data.data.datas
            },

            save: function(e) { 

            }

        }
    }

    // 判断添加工序未上传附件返回的数据并还原popup

    // console.log($location.$$search.status)

    if ($location.$$search.status == -1) {

        $scope.processConfig.add.data.briefInfo = $location.$$search.constructionDescription;
        $scope.processConfig.add.data.calRegulation = $location.$$search.engineeringCalculationRules;
        $scope.processConfig.add.data.craftId = $location.$$search.constructionTrades;
        $scope.processConfig.add.data.role = $location.$$search.roleCode;
        $scope.processConfig.add.data.projectName = $location.$$search.projectName;
        $scope.processConfig.add.data.unit = $location.$$search.unit;

        var reOpen = ngDialog.open({
            template:'templates/process_config_add.html',
            className: 'ngdialog-theme-default processConfigAdd',
            scope: $scope,
            controller: function() {
                $("body").on("load", '#addProForm', function() {
                    return;
                })
            }
        })  

        reOpen.closePromise.then(function() {
            // console.log(123)
        })   

        // console.log(reOpen.ngdialog1)  
    }
})


/*
 * 工序配置详情页  
*/

app.controller("process_config_detail", function($scope, $http, getCraftData, $stateParams, ngDialog) {

    var process_configuration_id = $stateParams.processId;

    // 获取工种数据
    $scope.craftData = getCraftData.data.data.datas;

    // 隐藏添加项目表单
    $scope.showAddItemInput = false;

    // 获取列表
    function getItemList() {

        $http.post(g.host+"/decoration_manage/decoration/processconfigurationdetail/list?processConfigurationId="+process_configuration_id)
        
        .success(function(data) {

            console.log(data)

            $scope.configDetails = data.data.datas;

            if (g.getData(data)) {

                $scope.configDetails = data.data.datas;

            } else {

                alert(data.msg);
                return false;
            }

        })        
    }

    // 获取Input值生成Json串

    $scope.inputValToJson = function(input) {

        var data = {};

        for (var i = 0; i < input.length; i++) {

            if (input[i].value == '') {
                return false;
            } 

           data[angular.element(input[i])[0].name] = input[i].value;

        }
        return data;
    }

    getItemList();

    // 返回上一页
    $scope.back2LastPage = function() {

        history.back(-1);

    }

    // 添加显示项目form
    $scope.AddItemInputShow = function(target, e, craftId) {
 
        var t = target;

        // 第一级栏目
        if (t == 'topLevel') {

            angular.element(document.querySelector(".addItem"))[0].style.display = "block";
        }

        // 第二级栏目
        if (t == 'secondLevel') {

            var element = angular.element(e.target.parentElement)[0].nextElementSibling;

            element.style.display = 'block';

            // set default craft value when add sub item

            var options = angular.element(element).find('select')[0].options;

            for (var i = 0; i < options.length; i++) {

                if (options[i].value == craftId) {

                    options[i].selected = true;

                }
            }

        }      
    }

    // 隐藏表单并清空所填值
    $scope.HideItemInputShow = function(e, t) {

        // console.log(e.target.parentElement.parentElement.parentElement.parentElement);
        if (t) {

            var ul = e.target.parentElement.parentElement.parentElement.parentElement;

        } else {

            var ul = e.target.parentElement.parentElement.parentElement;

        }
        
        ul.style.display = 'none';

        angular.element(e.target.form)[0].reset();
    }


    // 添加工程项目方法

    $scope.itemAdd = function(e, itemId) {

        var input = angular.element(e.target.form).find("input");

        var select = angular.element(e.target.form).find("select");

        var data = $scope.inputValToJson(input);

        // console.log(data);
        if (!data) {
            return false;
        }
        
        var dom = e;

        data.listCraft = select[0].value;
        // console.log(data)

        $http({
            method:'post', 
            url: g.host+"/decoration_manage/decoration/processconfigurationdetail/add", 
            params: {

                'token' : localStorage.fs_token,

                'processConfigurationId' : process_configuration_id,

                'parentId' :  itemId,

                'constructionDescription' : data.listProName,

                'position' :  data.listPos,

                'constructionTrades' : data.listCraft, 

                'unit' : data.listUnit,

                'artificialContent' : data.listWorkLoad,

                'serialNumber' : ''
            }

        }).success(function(data) {

            if (g.getData(data)) {

                $scope.HideItemInputShow(dom);
                // 添加成功后重新获取列表数据列表
                getItemList();
            }

        })
    }


    $scope.itemDelete = function(processId, detailId) {

        $http({
            method: 'post',
            url: g.host + '/decoration_manage/decoration/processconfigurationdetail/delete',
            params: {
                token: localStorage.fs_token,
                processConfigurationId: processId,
                processDetailConfigurationId: detailId
            }
        }).success(function(data) {
            // console.log(data)
            if ( data.code == 0) {
                // alert('操作成功');
                getItemList(); 
            }
        })

        // console.log(arguments)
    }
    
    $scope.itemEditData = {};

    $scope.itemEdit = function(detailId) {

        // console.log(detailId);

        $http({
            method: 'post',
            url: g.host+'/decoration_manage/decoration/processconfigurationdetail/view',
            params: {
                processDetailConfigurationId: detailId
            }
        }).success(function(data) {

            var d = data.data.datas;

             $scope.itemEditData.projectName = d.constructionDescription;

             $scope.itemEditData.position = d.position;

             $scope.itemEditData.craftId = d.constructionTrades.toString();

             $scope.itemEditData.unit = d.unit;

             $scope.itemEditData.workLoad = d.artificialContent;

            // console.log(data.data.datas);

        })

        ngDialog.open({

            template:'templates/process_config_details_edit.html',

            className: 'ngdialog-theme-default processConfigDetailsEdit',

            scope: $scope,

        })
    }

    $scope.itemEditSubmit = function() {

        // console.log($scope.itemEditData)

        $http({
            method: 'post',

            url : g.host + '/decoration_manage/decoration/processconfigurationdetail/update',
            
            params: $scope.itemEditData,

        }).success(function(data) {

            console.log(data);

        })
    }

})


app.controller("craft_fee", function($location, $scope, $http, getCityData, getCraftData, $timeout, $q, $stateParams, getconfigData) {  
 
    $scope.craftData = getCraftData.data.data.datas;

/*
 * get the cities list function, no need remove 
 * ================GET CITY LIST START==================
*/
    
    // console.log(getCityData);

    $scope.cityData = getCityData.data.data.datas;

    $scope.cities = new Array();

    $scope.name = "";

    for (var i = 0; i < $scope.cityData.length; i++) {
        
        // console.log($scope.cityData[i].value);

        var cityLetter = $scope.cityData[i].value;

        for (var a in cityLetter) {
            // console.log(cityLetter[a])
            $scope.cities.push({name:cityLetter[a].cityname, cityId: cityLetter[a].cityId})
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

        $scope.terms.cityId = e.item.cityId;

        // console.log(e.item.cityCode)

        angular.element(document.querySelector('.citySelectInput')).attr("city-code",(e.item.cityCode));
        // $scope.terms.cityCode = e.item.cityCode;
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

    $scope.pageSelect = $scope.reSetPageSelect(getconfigData.data.data.pageCount);
    
    $scope.currentPageNum = '1';

    $scope.pagination = {

        pageCount: getconfigData.data.data.pageCount,

        pageNumber: getconfigData.data.data.pageNumber,

        pageSize: '20',

        total: getconfigData.data.data.total,
        // pageSelect: $scope.reSetPageSelect(getconfigData.data.pageCount),
        lastPageBtnActive: false,

        nextPageBtnActive: true,
    }
    
    $scope.data = getconfigData.data.data.datas;

    // console.log($scope.data.data);

    $scope.terms = {
        cityId: '',
        cityName: '',
        craftId: '',   
    }

    // console.log(getconfigData)
    $scope.pageFun = function(e) {

         // console.log(typeof e)

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
            url: g.host+"/decoration_manage/decoration/laborexpense/list",
            params: obj
        }).success(function(r) {
            // console.log(r);
            $scope.data = r.data.datas;
            $scope.pagination.pageCount = r.data.pageCount;
            $scope.pagination.pageNumber = r.data.pageNumber;
            // $scope.pagination.pageSelect = $scope.reSetPageSelect(r.pageCount);
            $scope.pageSelect = $scope.reSetPageSelect(r.data.pageCount);
            $scope.currentPageNum = r.data.pageNumber.toString();
            // console.log($scope.pagination.pageCount)
        })
    }



    // quick edit details
    // $scope.quickEdit = {

    //     saveActive: false,
    //     editData: {
    //         work_area: '',
    //         rate: '',
    //         id: ''
    //     }, 

    //     quickEditFun: function(e, n) {

    //         e.path[3].className = 'selected';
    //         this.editData.work_area = angular.element(document.querySelector("#work_area_"+n))[0];
    //         this.editData.rate = angular.element(document.querySelector("#rate_"+n))[0];
    //         this.editData.id = angular.element(document.querySelector("#labor_expense_statement_id_"+n))[0];
    //     },

    //     quickEditSave: function(e, n) {

    //         e.path[3].className = '';

    //         $http({
    //             method: 'post',
    //             url: g.host+"/decoration_manage/decoration/laborExpenseStatement/update",
    //             params: {
    //                 token: window.localStorage.fs_token,
    //                 workArea: this.editData.work_area.value,
    //                 rate: this.editData.rate.value,
    //                 laborExpenseStatementId: angular.element(document.querySelector("#labor_expense_statement_id_"+n))[0].value
    //             }
    //         }).success(function(data) {
    //             console.log(data);
    //             if (data.success) {
    //                 $scope.pageFun('btn btn-default quickSearchCheck');
    //             } else {
    //                 alert(data.msg);
    //                 return;
    //             }
                
    //         })
    //     },

    //     inputEditCancel: function(e) {
    //         this.editData.work_area.value = this.editData.work_area.attributes.data.value;
    //         this.editData.rate.value = this.editData.rate.attributes.data.value;
    //         e.path[3].className = '';
    //     }
    // }

})





