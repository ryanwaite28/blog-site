// Main Angular Application
var App = angular.module("myApp", ["firebase"]);

App.factory("bloggSite", ["$firebaseArray",
	function($firebaseArray) {

   	var ref = new Firebase("https://blogg-site.firebaseio.com/");

   	// this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
	}
]);

// Master Angular Controller
App.controller("masterCtrl", ["$scope", "bloggSite",
function($scope, bloggSite) {

	$scope.blogSite = bloggSite;



	$scope.currentTopic = {};
	$scope.currentTopicName = '';
	$scope.currentTopicPosts = [];
	$scope.currentid = '';
	$scope.path = '';

	$scope.hideForm = true;

	$('#topics').change(function(){

		var value = $(this).val().toString();
		console.log(value);

		if(value == "-Select a Topic-") {
			$scope.hideForm = true;
		}
		else {
			$scope.hideForm = false;

			var index = this.selectedIndex;
			index = index - 1;
			console.log(index);

			$scope.currentTopic = bloggSite[index];
			$scope.currentTopicName = bloggSite[index].name;
			$scope.currentid = bloggSite[index].$id;
			$scope.currentTopicPosts = bloggSite[index].posts;
			console.log($scope.currentTopic);
			console.log($scope.currentTopicPosts);

		}

		$scope.newPost = function(str) {
			console.log(str);

			var postName = $('#newpost-name').val();
			var postBody = $('#newpost-body').val();
			console.log(postName);

			var path = new Firebase('https://blogg-site.firebaseio.com/'+ $scope.currentid +'/posts');

			path.push({
				'personName' : postName,
				'personThoughts' : postBody
			})

			alert('Post Shared!');

			$('#newpost-name').val('');
			$('#newpost-body').val('');

			$scope.currentTopicPosts = bloggSite[index].posts;

			//$scope.refreshBoard();

		}

		$scope.refreshBoard = function() {
			$scope.$apply(function(){
				$scope.currentTopicPosts = bloggSite[index].posts;
			})
		}

		$scope.$apply(function(){

		})

	})

	$scope.refreshBoard = function() {

	}

	$scope.newTopic = function() {
		console.log("New Topic.");

		var newTopic = $('#new-topic').val().toLowerCase();

		for(var key in $scope.blogSite) {

			if(newTopic == $scope.blogSite[key].name){
				alert('Topic Already Exists. Select It From The DropDown.');
				console.log('New Topic Rejected.');
				return;
			}

		}

		$scope.blogSite.$add({
			name : newTopic,
			//posts : ['']
		})
		console.log('New Topic Accepted.');
		alert("New Topic Created!");
		var newTopic = $('#new-topic').val('');

	}

}
]);
