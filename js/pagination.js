/*
 * 这是一个翻页插件，
 * 要求 模板页必须必须指定$scope.pager 为 双向数据绑定的变量
 * 
 * in list page 
 * 
 * $scope.pager = {
    
    data: '',
    pageSize: '',
    pageCount: '',
    pageCount: '',
    total: '',
    numList: '' 该属性专为页码切换做循环用
    url： '' 因为使用的公共插件，所以每个不同栏目的列表分页就不一样，初始的时候就要赋值
 }
 *
*/

app.directive('componentPagination', function() {

    return {

        // require: 'ngModel',
        
        // scope: {

        //     pageCount: '@pagecount',

        //     pagenumber: '@pagenumber',

        //     pagesize: '@pagesize',

        //     // lastpage

        // },

        restrict: 'EA',

        replace: true, 

        // transclude: true,
        // terminal: true, 
        // template: 'helo world',

        templateUrl: 'templates/pagination.html',

        controller: function($scope, page) {

            $scope.pagination = {};

            $scope.pagination.lastActive = false;

            $scope.pagination.nextActive = false;

            var pagination = angular.element(document.querySelector(".pagination"));

            var attributes = angular.element(document.querySelector(".pagination"))[0].attributes;

            var items = {};

            // $scope.data.list.pageSize = Number($scope.data.list.pageSize);

            $scope.resetPage = function() {

                $scope.data.list.pageNumber = $scope.data.list.pageNumber.toString();
                // console.log($scope.data.list.pageNumber);

                if ($scope.data.list.pageNumber > 1) {
                    // console.log('first')
                    $scope.pagination.lastActive = true;

                } 

                if (Number($scope.data.list.pageNumber) == $scope.data.list.pageCount) {
                    // console.log('last')
                    $scope.pagination.nextActive = false;

                } 

                if ($scope.data.list.pageNumber == 1) {
                    // console.log('first')
                    $scope.pagination.lastActive = false;
                }

            }

            $scope.$watch('data.list.pageNumber+data.list.pageCount+data.list.pageSize', function() {

                $scope.pagination.pageNumArr = page.calcPages($scope.data.list.pageCount);

                $scope.data.list.pageNumber = $scope.data.list.pageNumber + '';

                $scope.data.list.pageSize = $scope.data.list.pageSize + '';

                items.pageCount = attributes.pagecount.value;

                items.pageSize = attributes.pagesize.value;

                items.url = attributes.url.value;

                // console.log(attributes);
                var data = attributes.data.value;

                var dataArr = data.split(',');

                for (var i = 0; i < dataArr.length; i++) {

                    items[dataArr[i].split(":")[0]] = dataArr[i].split(":")[1];

                }
                // console.log(items);

                if ($scope.data.list.pageCount > 1 ) {

                    $scope.pagination.nextActive = true;
                }

                if ($scope.data.list.pageCount == 1) {

                    $scope.pagination.lastActive = false;

                    $scope.pagination.nextActive = false;

                }

            })

            // 下一页
            $scope.pageTurn = function(i) {

                // console.log($scope.init)

                if (i) {

                    if (i == 'next') {
                        // $scope.pagination.lastActive = true;

                        items.pageNumber = Number(attributes.pagenumber.value) + 1;

                    } else if (i == 'last') {
                        items.pageNumber = Number(attributes.pagenumber.value) - 1;
                        // $scope.pagination.lastActive = true;    
                    }

                    page.getData(items).then(function(callback) { 

                        $scope.data.list = callback.data.data;

                        $scope.resetPage();

                    })
                }                
            }

            // 按页面查询

            $scope.pageNumberSelect = function(num) {

                items.pageNumber = Number(num);

                page.getData(items).then(function(callback) { 

                    $scope.data.list = callback.data.data;

                    $scope.data.list.pageSize = callback.data.data.pageSize+'';

                    $scope.resetPage();

                })
               
            }

            $scope.pageCountSelect = function(num) {

                // console.log(num);

                items.pageSize = num;
                items.pageNumber = 1;
                page.getData(items).then(function(callback) { 

                    $scope.data.list = callback.data.data;

                    // $scope.data.pageNumber = 1;

                    // console.log(items)

                    $scope.resetPage();

                })
   
            }

        }

    }
})


/*
 * new accessory   
 *
*/

app.directive('pagination', function() {

    return {

        // require: 'ngModel',
        
        // scope: {

        //     pageCount: '@pagecount',

        //     pagenumber: '@pagenumber',

        //     pagesize: '@pagesize',

        //     // lastpage

        // },

        restrict: 'EA',

        replace: true, 

        // transclude: true,
        // terminal: true, 
        // template: 'helo world',

        templateUrl: 'templates/pagination.html',

        controller: function($scope, page) {

            var items = new Object();

            // 获取翻页插件模板中的所有翻页属性, pageCount, pageSize, pageNumber, 
            // url 为获取数据列表的接口            
            var attributes = angular.element(document.querySelector(".pagination"))[0].attributes;

            $scope.pager.prev = false;
            $scope.pager.next = false;

            $scope.$watch("pager.pageNumber+pager.pageCount+pager.pageSize", function() {

                if ($scope.pager.pageNumber == 1 && $scope.pager.pageCount > 1) {

                    $scope.pager.prev = false;
                    $scope.pager.next = true;
                } 

            })


            function dataChk(obj) {

                if (obj) {
                    if (obj.data.value != '') {

                        var dataArr = obj.data.value.split(',');

                        for (var i = 0; i < dataArr.length; i++) {

                            items[dataArr[i].split(":")[0]] = dataArr[i].split(":")[1];

                        }
                    }                        
                }
            }


            $scope.pageTurn = function(e) {

                items.url = attributes.url.value;

                function dataChk(obj) {

                    if (obj) {
                        if (obj.data.value != '') {

                            var dataArr = obj.data.value.split(',');

                            for (var i = 0; i < dataArr.length; i++) {

                                items[dataArr[i].split(":")[0]] = dataArr[i].split(":")[1];

                            }
                        }                        
                    }
                }

                if (typeof e == 'string') {

                    if (e == 'next') {

                        attributes.pagenumber.value++;

                    }

                    if (e == 'last') {

                        attributes.pagenumber.value--;

                    }
                }
               
                items.pageNumber = attributes.pageNumber.value;

                items.pageCount = attributes.pagecount.value;

                items.pageSize = attributes.pagesize.value;

                // console.log(attributes.data.value)
                
                // 如果不是单纯翻页有条件查询的话, 那么将处理data中的参数 
                dataChk(attributes)

                // 重现计算当前页面列表内容和翻页数据
                page.getData(items).then(function(callback) {

                    $scope.pager.data = callback.data.data.datas;
                    $scope.pager.pageNumber = callback.data.data.pageNumber.toString();
                    $scope.pager.pageCount = callback.data.data.pageCount.toString();
                    $scope.pager.pageSize = callback.data.data.pageSize.toString();
                    $scope.pager.total = callback.data.data.total;

                    if ($scope.pager.pageCount > 1) {

                        $scope.pager.prev = true;

                    }                    

                    if ($scope.pager.pageCount == $scope.pager.pageNumber) {

                        $scope.pager.next = false;
                    }

                    if ($scope.pager.pageCount > $scope.pager.pageNumber) {
                        $scope.pager.next = true;
                    }
                    // console.log(callback);
                })

            }

            $scope.pageCountSelect = function(num) {

                // console.log(num);
                items.pageSize = num;
                items.pageNumber = 1;
                items.url = attributes.url.value;
                page.getData(items).then(function(callback) { 

                    // console.log(callback.data.data)
                    $scope.pager.data = callback.data.data.datas;
                    $scope.pager.pageNumber = callback.data.data.pageNumber.toString();
                    $scope.pager.pageCount = callback.data.data.pageCount;
                    $scope.pager.pageSize = callback.data.data.pageSize.toString();
                    $scope.pager.total = callback.data.data.total;
                    $scope.pager.numList = callback.data.data.NumberList;
                    // console.log($scope.pager.pageCount)
                    if ($scope.pager.pageCount == 1) {

                        $scope.pager.next = false;
                        $scope.pager.prev = false;

                        // console.log($scope.pager)
                    }
                    // console.log(typeof $scope.pager.pageSize)
                })
            }

            $scope.pageNumberSelect = function(num) {
                // console.log(num);
                items.url = attributes.url.value;                            
                items.pageNumber = num;

                dataChk(attributes)

                page.getData(items).then(function(callback) { 

                    $scope.pager.data = callback.data.data.datas;

                    if ($scope.pager.pageCount == $scope.pager.pageNumber) {

                        $scope.pager.next = false;
                        $scope.pager.prev = true;

                    }

                })

            }

        }

    }

})




