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
