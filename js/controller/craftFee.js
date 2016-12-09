app.controller("craft_fee", function($location, $scope, $http, getCityData, getCraftData, $timeout, $q, $stateParams, getconfigData, ngDialog) {  
 
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

    $scope.craftFeeEdit = function(id, target) {
        // console.log(target);

        angular.element(target.currentTarget).hide();

        angular.element(document.querySelector("#tr_"+id)).find("input").show();

        angular.element(target.currentTarget).parent('.operation').find(".btn-primary").show();

        // console.log(angular.element(document.querySelector("#tr_"+id)).find("input").attr("data"))
    }

    $scope.craftFeeEditCancel = function(id, target) {

        angular.element(document.querySelector("#tr_"+id)).find("input[type='text']").hide();

        angular.element(document.querySelector("#tr_"+id)).find("input[type='text']").value;

        angular.element(target.currentTarget).parent('.operation').find(".btn-success").show();

        angular.element(target.currentTarget).parent('.operation').find(".btn-primary").hide();

        var resetVal = angular.element(document.querySelector("#tr_"+id)).find("input[type='text']");
        // console.log(resetVal.attr("data"))

        // console.log(document.getElementById("work_area_" + id).getAttribute("data"))
        document.getElementById("work_area_" + id).value =  document.getElementById("work_area_" + id).getAttribute("data")
        document.getElementById("rate_" + id).value =  document.getElementById("rate_" + id).getAttribute("data")

    }

    $scope.craftFeeEditSave = function(target, id) {

       var currentId = angular.element(document.querySelector("#labor_expense_statement_id_" + id)).val();

       var workAreaVal = angular.element(document.querySelector("#work_area_"+id)).val();

       var rateVal = angular.element(document.querySelector("#rate_"+id)).val();

       $http({
            method: 'post',
            url: g.host+'/decoration_manage/decoration/laborexpense/update',
            
            data: {
                token: '',
                workArea : workAreaVal,
                rate : rateVal,
                laborExpenseStatementId: currentId
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
                console.log(str)
                return str.join("&");    
            }            
       }).success(function(data) {

        console.log(data)
       })

       $scope.craftFeeEditCancel(id, target);
    }

    $scope.addWorkerType = function() {

        ngDialog.open({

            id: 'workerTypeAdd',
            template: 'templates/decoration_craft_fee_add.html',
            appendClassName: 'workerTypeAdd',
            showClose : false,
            closeByEscape : true,
            closeByDocument : false,
            width: 800,   
            controller: function($scope) {

                // console.log(getCraftData.data.data.datas);
                $scope.city = getCityData.data.data.datas;
                // console.log($scope.city);
                function resetWorkerType(data) {
       
                    var newArr = new Array();

                    for (var i = 0; i < data.length; i++) {

                        if (data[i].id != 11 && data[i].id != 12 && data[i].id != 13 && data[i].id != 14 && data[i].id != 16) {

                            newArr.push(data[i]);

                        }                
                    }

                    return newArr;
                    // console.log(newArr)
                }

                $scope.citySelect = function(cityId, cityName) {

                    var newArr = new Array();
                    // var data = resetWorkerType(getCraftData.data.data.datas);

                    $scope.workerType = resetWorkerType(getCraftData.data.data.datas);

                    // console.log(newArr);

                    for (var i = 0; i < $scope.workerType.length; i++) {
                        
                        $scope.workerType[i]['areaCode'] = cityId;
                        $scope.workerType[i]['area'] = cityName;
                        $scope.workerType[i]['serialNumber'] = '';
                        $scope.workerType[i]['status'] = 1;
                        $scope.workerType[i]['unit'] = '元/工日';
                        $scope.workerType[i]['trades'] = $scope.workerType[i]['id'];

                    }
                    // $scope.workerType = resetWorkerType($scope.workerType);

                    console.log(newArr)
                    // $scope.workerType = newArr;

                    document.getElementById("workTypeAddForm").style.display = "block";
                    document.getElementById("citySelect").style.display = "none";
                }   

                $scope.subWorkerTypeAdd = function() {

                    for (var i = 0; i < $scope.workerType.length; i++) { 
                        
                    // console.log($scope.workerType[i]['id'])
                    var area = document.getElementById('add_work_area_'+$scope.workerType[i]['id'])

                    var rate =  document.getElementById('add_rate_'+$scope.workerType[i]['id'])

                    // console.log(area)
                    $scope.workerType[i]['workArea'] = area.value;
                    $scope.workerType[i]['rate'] = rate.value;

                    }
                    // console.log($scope.workerType);

                    $http({
                        method: 'post',
                        url: g.host+'/decoration_manage/decoration/laborexpense/add',
                        data: $scope.workerType,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } ,

                        transformRequest: function(obj) {    
                            var str = [];    
                            for (var p in obj) {    
                                
                                if (typeof obj[p] == 'object' ) {
                                    // console.log(p, JSON.stringify(obj[p]));
                                    str.push(JSON.stringify(obj[p]))
                                } else {
                                    str.push(obj[p]);  
                                }
                                
                                // console.log(encodeURIComponent(p))  
                            }    
                            // console.log(str);
                            return '['+str.join(",")+']';    
                        }                        
                    }).success(function(data) {
                        // console.log(data);
                    })
                } 

                // 
                $scope.measurePersonConfigShow = false;
                
                $scope.configData = {
                    1: {
                        area: '',
                        price: '',
                        formula: ''
                    },
                    2: {
                        area: '',
                        price: '',
                        formula: ''
                    },
                    3: {
                        area: '',
                        price: '',
                        formula: ''
                    },
                    4: {
                        area: '',
                        price: '',
                        formula: ''
                    }, 
                    5: {
                        area: '',
                        price: '',
                        formula: ''
                    },
                    6: {
                        area: '',
                        price: '',
                        formula: ''
                    }                                       
                }

                $scope.addConfig = function() {


                    // angular.element(document.querySelector(".configAddList")).show()
                }

            }         
        })

    }    
})

