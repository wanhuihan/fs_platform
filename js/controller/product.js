// product

app.controller("products", function($location, $window, $scope, $http, getCityData, page, ngDialog, products, getCatData, getRoleData, getLabelList, getProviderList, getBrandList) {

    $scope.init = {

    	from: '',

    	name: '',

    	materialCode: '',

    	labelType: '',

    	level1: '',

    	level2: '',

    	level3: '',

    }

    $scope.data = {
    	
    	list: {},

    	label: {},

    	category: {},

    	subCate: {},

        finalSubCate: {}
    }

    $scope.pager = {};

    $scope.pager = {
        
        data: '',
        pageSize: '',
        pageCount: '',
        total: '',
        pageNumber: '',
        numList: '', 
        url: '/decoration_manage/decoration/commodity/selectList' 
     }


    $scope.getList = function() {

        var obj = Object.assign($scope.pager, $scope.init);
            delete obj.data;

        page.getData(obj).then(function(callback) {

            var code = callback.data.code;

            // console.log(callback.data.data)

            if (code == 0) {
                // console.log(callback);
                // $scope.pager.data = 
                $scope.pager.data = callback.data.data.datas;
                $scope.pager.pageNumber = callback.data.data.pageNumber.toString();
                $scope.pager.pageCount = callback.data.data.pageCount;
                $scope.pager.pageSize = callback.data.data.pageSize.toString();
                $scope.pager.total = callback.data.data.total;
                $scope.pager.numList = callback.data.data.NumberList;

                // $scope.data.list.pageNumber = $scope.data.list.pageNumber.toString();
            }

            if (callback.data.data.pageCount == 1 && callback.data.data.pageNumber == 1) {
                $scope.pager.next = false;
            }

        })

    }

    $scope.getLabel = function() {

        var type = 'materialLabel';

        $http({

            method: 'post',
            url: g.host+'/decoration_manage/common/dict',
            params: {
                pid: type
            }
        }).success(function(data) {
            $scope.data.label = data.data;
        })
    }

    $scope.getCategory = function() {

        $http({
            method: 'post',
            url: g.host+'/decoration_manage/common/allSubDict',

            params: {
                pid: 'materialType'
            }
        }).success(function(data) {
            // console.log(data);
            $scope.data.category = data.data;
        })
    }

    $scope.getCategory();

    $scope.goodsCateStretch = function(level, subDict, e, key) {

        // console.log(arguments);
        var currentTarget = angular.element(e.target);

        var parent = angular.element(e.target.parentElement);

        // console.log(level, subDict, key);

        if (parent.hasClass("stretchOff") ) {

                
            if (level == 1) {

                $scope.init.level1 = key;

            }
            if (level == 2) {

                $scope.init.level2 = key;

            }
            if (level == 3) {

                $scope.init.level3 = key;

            }

            if (subDict) {

                parent.removeClass("stretchOff").addClass("stretchOn");
                currentTarget.find("> .fa").removeClass("fa-angle-right").addClass("fa-angle-down")

            }

        } else {

            parent.addClass("stretchOff").removeClass("stretchOn");    

            if (level == 1) {

                $scope.init.level1 = key;

                $scope.init.level2 = "";

                $scope.init.level3 = "";

            }
            if (level == 2) {

                $scope.init.level2 = key;
                $scope.init.level3 = "";

            }
            if (level == 3) {

                $scope.init.level3 = key;

            }
                    
        }

        $scope.getList();
 
    }


    $scope.labelSwitch = function(id, e) {

    	// 获取当前节点和父节点
    	var parentHtml = angular.element(e.target)[0].parentElement.parentElement;

    	var target = angular.element(e.target)[0].parentElement;

    	angular.element(parentHtml).find("li").removeClass("active");

    	angular.element(target).addClass("active");

        $scope.init.name = "";

        $scope.init.materialCode = "";

    	var labelId = id;

    	if (labelId == 'all') {

	    	$scope.init.from = '';

	    	$scope.init.labelType = ''; 

    	} else {

	    	$scope.init.from = 'label';

	    	$scope.init.labelType = labelId; 

    	}

        $scope.pager.pageNumber = 1;

    	$scope.getList();
    }

    $scope.quickSearch = function(name, code) {

        // console.log($scope.init);
        $http({
            method: 'post',
            url: g.host+'/decoration_manage/decoration/commodity/selectList',
            params: $scope.init,

        }).success(function(data) {

            // console.log(data)
            $scope.pager.data = data.data.datas;
            $scope.pager.pageNumber = data.data.pageNumber.toString();
            $scope.pager.pageSize = data.data.pageSize.toString();
            $scope.pager.pageCount = data.data.pageCount.toString();

            if (data.data.pageNumber == 1 && data.data.pageCount == 1) {
                $scope.pager.next = false;
            } else {
                $scope.pager.next = true;
            }
        })

    }


    $scope.resetQuickSearchVal = function() {

        $scope.init.name = '';

        $scope.init.materialCode = '';

        // $scope.resetPage();

    }

    $scope.productsDetails = function(id) {

        var goodsId = id;

        ngDialog.open({

            id: 'detailShow',
            template: 'templates/products_details.html',
            appendClassName: 'productDetails',
            showClose : false,
            closeByEscape : true,
            closeByDocument : false,
            width: 800,

            controller: function($http, $scope, products, dictionary) {

                // console.log();
                $scope.supplier = {};
                $scope.brandList = {};
                $scope.cat = {
                    level1:  {
                        data: {},
                        level: '',
                        value: '',
                    },
                    level2: {
                        data: {},
                        level: '',
                        value: '',
                    },
                    level3: {
                        data: {},
                        level: '',
                        value: ''
                    },
                };

                $scope.details = {

                    label: {},
                    brandCode: '',
                    brandName: '',
                    supplier: '',
                    price: '',
                    roleCode: '',
                    roleName: '',
                    number: '',
                    unit: '',
                    rules: '',
                    name: '',
                    model: '',
                    specifications: '',
                    remark:'',
                    roleName: '',
                    roleCode: ''

                };

                $scope.allLabels = {};

                products.supplyList().then(function(callback) {
                    // console.log(callback)
                    $scope.supplier = callback.data.data.datas;
                })

                products.getRole().then(function(callback) {

                    // console.log(callback.data.data.datas)
                    $scope.getRole = callback.data.data.datas;
                })
                // 
                products.getBrandList().then(function(callback) {

                    // console.log(callback.data.data.datas);

                    $scope.brandList = callback.data.data.datas;

                })

                dictionary.getCategory().then(function(callback) {

                    // console.log(callback.data.data.datas);
                    $scope.cat.level1.data = callback.data.data.datas;

                    // console.log($scope.productDetailData.dataMap.ddId1);
                    $scope.cat.level2.data = catSlted(1, $scope.cat.level1.data, $scope.productDetailData.dataMap.ddId1);

                    // console.log($scope.cat.level2.data);

                })

                products.getDetails(goodsId).then(function(callback) {

                    $scope.productDetailData = callback.data.data.datas;

                    // console.log(callback.data.data.datas)
                    // - start 联动菜单需要用的参数 商品分类的ddiD, which is a string;
                    $scope.cat.level1.level = $scope.productDetailData.dataMap.ddId1;

                    $scope.cat.level2.level = $scope.productDetailData.dataMap.ddId2;

                    $scope.cat.level3.level = $scope.productDetailData.dataMap.ddId3;

                    // - end 联动菜单需要用的参数

                    $scope.cat.level1.value = callback.data.data.datas.dataMap.level1;
                    $scope.cat.level2.value = callback.data.data.datas.dataMap.level2;
                    $scope.cat.level3.value = callback.data.data.datas.dataMap.level3;

                    $scope.details.label = callback.data.data.datas.dataMap.materialLabelId;
                    
                    $scope.details.brandCode = callback.data.data.datas.brandCode;

                    $scope.details.brandName = callback.data.data.datas.brandName;

                    $scope.details.supplier = callback.data.data.datas.dataMap.supplierId;
                    
                    $scope.details.price = callback.data.data.datas.price;

                    $scope.details.roleCode = callback.data.data.datas.roleCode;

                    $scope.details.roleName = callback.data.data.datas.roleName;

                    $scope.details.unit = callback.data.data.datas.unit;

                    $scope.details.rules = callback.data.data.datas.rules;

                    $scope.details.name = callback.data.data.datas.name;

                    $scope.details.model = callback.data.data.datas.model;

                    $scope.details.specifications = callback.data.data.datas.specifications;

                    $scope.details.remark = callback.data.data.datas.remark;

                    $scope.details.specifications = callback.data.data.datas.specifications;

                    $scope.details.number = callback.data.data.datas.number;
                    
                    if (callback.data.data.datas.roleCode) {
                        $scope.details.roleCode = callback.data.data.datas.roleCode.toString();
                    }

                    $scope.details.roleName = callback.data.data.datas.roleName;
                    console.log(callback)
                    // console.log



                })



                $scope.$watch('details.label', function() {
                    
                    if ($scope.details.label.length > 0) {

                        dictionary._get('materialLabel').then(function(callback) {

                            // console.log(callback.data.data.datas)
                            $scope.allLabels = callback.data.data.datas;
                            // $scope.stage = callback.data.data.datas;

                            for (var i in $scope.allLabels) {

                                // console.log(allLabels[i].ddId, allLabels[i].ddValue, allLabels[i].ddKey);
                                // $scope.details.label.indexOf(allLabels[i].ddId);
                                if ($scope.details.label.indexOf($scope.allLabels[i].ddId) >= 0) {

                                    $scope.allLabels[i]['selected'] = true;

                                }

                            }

                            // console.log($scope.details.label);
                        })
                    }


                })

                function catSlted(level, levelData, ddId) {

                    // console.log(levelData.hasSubDict, ddId)
                    for (var i = 0; i < levelData.length; i++) {

                        var data = new Object();

                        if (levelData[i].ddId == ddId) {
                           
                            if (levelData[i].hasSubDict) {

                                // console.log(levelData[i].subDictList);
                                data = levelData[i].subDictList;
                                return data;
                            }
                        }                    
                    }                    
                }

                $scope.remove = function(id) {

                    products.productDelete(id);
                    $window.location.reload();
                }


                $scope.catChange = function(level, id) {

                    if (level == 1) {
                        // console.log($scope.cat.level1);

                        for (var i in $scope.cat.level1.data) {

                            if ($scope.cat.level1.data[i].ddId == id) {

                                $scope.cat.level1.value = $scope.cat.level1.data[i].ddKey;

                            }

                        }
                        dictionary._get(id).then(function(callback) {

                            // console.log(callback.data.data.datas);
                            $scope.cat.level2.data = callback.data.data.datas;
                            $scope.cat.level3.data = '';

                        })

                    }

                    if (level == 2) {

                        for (var i in $scope.cat.level2.data) {

                            if ($scope.cat.level2.data[i].ddId == id) {

                                $scope.cat.level2.value = $scope.cat.level2.data[i].ddKey;
                            }

                        }

                        dictionary._get(id).then(function(callback) {

                            // console.log(callback.data.data.datas);
                            $scope.cat.level3.data = callback.data.data.datas;

                        })                        
                    }

                    if (level == 3) {

                        for (var i in $scope.cat.level3.data) {

                            if ($scope.cat.level3.data[i].ddId == id) {

                                $scope.cat.level3.value = $scope.cat.level3.data[i].ddKey;
                            }

                        }                       
                    }


                    // console.log($scope.cat)
                }

                $scope.saveEdit = function(form) {

                    var formData = new Object();

                    var form = angular.element(document.querySelector("#productDetails"));

                    formData.materialConfigurationlId = goodsId;

                    formData.name = $scope.details.name;
                    formData.model = $scope.details.model;

                    formData.level1 = $scope.cat.level1.value;
                    formData.level2 = $scope.cat.level2.value;
                    formData.level3 = $scope.cat.level3.value;

                    formData.brandCode = $scope.details.brandCode;

                    // console.log($scope.brandList)

                    for (var i in $scope.brandList) {
                        if ($scope.brandList[i]['material_brand_id'] == $scope.details.brandCode) {
                            formData.brandName = $scope.brandList[i]['ch_name'];
                        }
                    }

                    formData.supplierId = $scope.details.supplier;

                    formData.price = $scope.details.price;

                    formData.specifications = $scope.details.specifications;
                    formData.remark = $scope.details.remark;
                    formData.roleCode = $scope.details.roleCode;
                    // formData.roleName = $scope.details.roleName;
                    formData.number = $scope.details.number;

                    formData.unit = $scope.details.unit;
                    formData.rules = $scope.details.rules;

                    formData.remark = $scope.details.remark;

                    var checkboxSelected = form.find("input[name='label']");

                    var phase = new Array();

                    for (var i = 0; i < checkboxSelected.length; i++) {

                        // console.log(checkboxSelected[i].checked);
                        if (checkboxSelected[i].checked) {
                            phase.push({'type':checkboxSelected[i].value})
                            // console.log(checkboxSelected[i].value)
                        }

                    }

                    formData.materialLabelJson = phase;
                    
                    // 图片上传
                    formData.addAttachmentJson = ""; 

                    formData.delAttachmentJson = "";

                    // console.log(formData)

                    products.detailEditSave(goodsId, formData);

                    $window.location.reload();

                }

                $scope.detailShow = function(id) {
                    ngDialog.close(id);
                }

                $scope.detailDelete = function(id) {

                }
                // console.log($scope.cat);

                $scope.editActive = false;

                $scope.showActive = true;

                $scope.label = {};
                // console.log($scope.test)
 
            }
        });
        
    }

    $scope.productsAdd = function() {

        ngDialog.open({
            id: 'productAdd',
            template: 'templates/products_add.html',
            appendClassName: 'productAdd',
            showClose : false,
            closeByEscape : true,
            closeByDocument : false,
            width: 800,    

            controller: function($scope, $http, dictionary, products) {

                // console.log(getLabelList);

                $scope.data = {
                    materialLabelJson: {},
                    brandCode: '',
                    brandName: '',
                    supplierId: '',
                    price: '',
                    roleCode: '',
                    roleName: '',
                    number: '',
                    unit: '',
                    rules: '',
                    name: '',
                    model: '',
                    specifications: '',
                    remark:'',
                    roleName: '',
                    roleCode: '',
                    addAttachmentJson: '',

                }

                $scope.data.cat = {
                    level1: {
                        id: '',
                        list: '',
                        name: '',
                        key: ''
                    },
                    level2: {
                        id: '',
                        list: '',
                        name: '',
                        key: ''
                    },
                    level3: {
                        id: '',
                        list: '',
                        name: '',
                        key: ''
                    }
                }
                $scope.testlabel = '';

                $scope.roleData = getRoleData.data.data.datas;

                $scope.catData = getCatData.data.data.datas;

                $scope.labelList = getLabelList.data.data.datas;

                $scope.supplier = getProviderList.data.data.datas;

                $scope.brandList = getBrandList.data.data.datas;

                $scope.labelSelect = function(e, id) {

                    // console.log(e, id);
                    if (e.target.checked) {

                        $scope.data.materialLabelJson[e.target.id] = e.target.value;
                        // console.log(e.target.id)
                        // $scope.data.label.push({'type':e.target.value});

                    } else {

                        delete $scope.data.materialLabelJson[e.target.id];
                        // $scope.data.label[e.target.id] = '';
                    }
                }

                $scope.catChange = function(level, e) {
                    // console.log($scope.catData);
                    // console.log(level)
                    if (level == 1) {

                        for (var i in $scope.catData) {

                            if ($scope.catData[i].ddId == $scope.data.cat.level1.id && $scope.catData[i].hasSubDict) {

                                $scope.data.cat.level1.key = $scope.catData[i].ddKey;
                                // $scope.data.cat.level1.id = $scope.catData[i].ddKey;
                                // console.log($scope.catData[i].ddKey);
                                $scope.data.cat.level2.list = $scope.catData[i].subDictList;

                            }
                        }

                    }
                    if (level == 2) {
                        $scope.data.cat.level3.key = "";
                        $scope.data.cat.level3.list = "";
                        for (var i in $scope.catData) {

                            if ($scope.catData[i].hasSubDict) {

                                for (var a in $scope.catData[i].subDictList) {

                                    if ($scope.catData[i].subDictList[a].hasSubDict && $scope.catData[i].subDictList[a].ddId == $scope.data.cat.level2.id) {

                                        $scope.data.cat.level2.key = $scope.catData[i].subDictList[a].ddKey;

                                        // console.log(a)
                                        $scope.data.cat.level3.list = $scope.catData[i].subDictList[a].subDictList;
                                    }

                                }
                            }
                        }
                    } 
                    if (level == 3) {

                        // console.log($scope.data.cat.level3.id)

                        for (var i in $scope.catData) {

                            if ($scope.catData[i].hasSubDict) {

                                for (var a in $scope.catData[i].subDictList) {

                                    if ($scope.catData[i].subDictList[a].hasSubDict && $scope.catData[i].subDictList[a].ddId == $scope.data.cat.level2.id) {
                                        
                                        var level3Data = $scope.catData[i].subDictList[a].subDictList;

                                        // console.log($scope.catData[i].subDictList[a].hasSubDict)

                                        if ($scope.catData[i].subDictList[a].hasSubDict) {


                                            for (var b in $scope.catData[i].subDictList[a].subDictList) {

                                                if ($scope.catData[i].subDictList[a].subDictList[b].ddId == $scope.data.cat.level3.id) {

                                                    $scope.data.cat.level3.key = $scope.catData[i].subDictList[a].subDictList[b].ddKey;

                                                }
                                            }
                                        }
                                       
                                    }

                                }
                            }
                        }

                    }                   
                }

                $scope.proAddSubmit = function() {

                    $scope.data.level1 = $scope.data.cat.level1.key;
                    $scope.data.level2 = $scope.data.cat.level2.key;
                    $scope.data.level3 = $scope.data.cat.level3.key;

                    delete $scope.data.cat;
                    products.addProductSub($scope.data);

                    $window.location.reload();
                    // console.log($scope.data);
                }
                $scope.PopupRemove = function(id) {
                    ngDialog.close(id);
                }
            }         
        }) 

    }

// 初始需要加载的数据

	// 所有列表
    $scope.getList();

	// 所有标签
    $scope.getLabel('materialLabel');

	// 所有一级栏目类型
    // $scope.getDict('materialType');

})





