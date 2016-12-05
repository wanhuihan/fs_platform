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