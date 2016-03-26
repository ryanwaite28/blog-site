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

			var date = Date();

			if(postName == '' || postBody == '') {
				alert('Please Fill In Both Fields.');
				return;
			}

			var path = new Firebase('https://blogg-site.firebaseio.com/'+ $scope.currentid +'/posts');

			if($scope.fbLink != '' || $scope.fbLink != null) {
				path.push({
					'personName' : postName,
					'personThoughts' : postBody,
					'postDate' : date,
					'postImg' : $scope.fbPhoto
				})
			}
			else {
				path.push({
					'personName' : postName,
					'personThoughts' : postBody,
					'postDate' : date
				})
			}

			alert('Post Shared!');

			$('#newpost-name').val($scope.fbName);
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

	$scope.fbLogin = function() {

		var ref = new Firebase("https://blogg-site.firebaseio.com");
		ref.authWithOAuthPopup("facebook", function(error, authData) {
  			if (error) {
    			console.log("Login Failed!", error);
  			} 
  			else {
    			console.log("Authenticated successfully with payload:", authData);

    			$scope.fbName = authData.facebook.displayName;
    			$scope.fbPhoto = authData.facebook.profileImageURL;
    			$scope.fbLink = authData.facebook.cachedUserProfile.link;

    			$('#newpost-name').val($scope.fbName);

    			$scope.$apply(function(){})

  			}
		});
	}

	$scope.newTopic = function() {
		console.log("New Topic.");

		var newTopic = $('#new-topic').val().toLowerCase();

		if(newTopic == '') {
			alert('Please Enter a Name for a New Topic.');
			return;
		}

		for(var key in $scope.blogSite) {

			if(newTopic == $scope.blogSite[key].name){
				alert('Topic Already Exists. Select It From The DropDown.');
				console.log('New Topic Rejected.');
				return;
			}

		}

		$scope.blogSite.$add({
			name : newTopic,
			//date : Date(),
			//posts : ['']
		})
		console.log('New Topic Accepted.');
		alert("New Topic Created!");
		var newTopic = $('#new-topic').val('');

	}

}
]);
