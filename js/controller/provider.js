
app.controller("provider", function($scope, $http, $location, $log, dictionary) {

	// console.log($location);

	var providerDefaultPage = $location.$$path;

	$scope.provider = {};

	if (providerDefaultPage.indexOf('menu_gysgl')) {

		$location.path("dashboard/menu_gysgl_gysgl");

		// console.log(dictionary._get('supplyType'))

		dictionary._get('supplyType').then(function(callback) {

			// console.log(callback);

			$scope.provider.proType = {
				data: ['全部','主材','辅材']
			}
			// $scope.provider.proType = callback.
		})
	}

	// console.log(typeof $scope.provider)


	// jQuery( "#dateStart" ).datepicker();

	// jQuery( "#dateEnd" ).datepicker();

})

app.controller("providerPurchaseOrder", function($scope, $http, $location) {


	jQuery('#datePick').daterangepicker({

	    "autoApply": true,
	    "linkedCalendars": false,
	    "startDate": "11/16/2016",
	    "endDate": "11/22/2016",
	    "opens": "left",


	}, function(start, end, label) {

		console.log(start.format('YYYY-MM-DD'))	
	  console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
	});




})