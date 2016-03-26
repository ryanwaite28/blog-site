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

			if($scope.userPhoto != '' || $scope.userPhoto != null) {
				path.push({
					'personName' : postName,
					'personThoughts' : postBody,
					'postDate' : date,
					'postImg' : $scope.userPhoto
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

			$('#newpost-name').val($scope.userName);
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

	$scope.signUp = function() {

		//var name = $('#name').val().toLowerCase();
		var emOne = $('#em-1').val().toLowerCase();
		var emTwo = $('#em-2').val().toLowerCase();
		var pwrdOne = $('#pwrd-1').val();
		var pwrdTwo = $('#pwrd-2').val();

		if(emOne == '' || emTwo == '' || pwrdOne == '' || pwrdTwo == '') {
			alert('Please Fill In All The Fields.');
			$('#em-1').val('');
			$('#em-2').val('');
			$('#pwrd-1').val('');
			$('#pwrd-2').val('');
			return;
		}
		else if(emOne != emTwo || pwrdOne != pwrdTwo) {
			alert("One of the two pairs (email or password) does not match.");
			$('#em-1').val('');
			$('#em-2').val('');
			$('#pwrd-1').val('');
			$('#pwrd-2').val('');
			return;
		}
		else {
			// Continue Function
			console.log("Sign Up Accepted.");
		}

		var ref = new Firebase("https://blogg-site.firebaseio.com");
		ref.createUser({
			userName: name,
  			email : emOne,
  			password : pwrdOne
		}, 
		function(error, userData) {
  			if (error) {
    			console.log("Error creating user:", error);
  			} else {
    			console.log("Successfully created user account with uid:", userData.uid);
  				alert('User Account Created! Use The Login Form to Log In!');
  				//$('#name').val('');
  				$('#em-1').val('');
				$('#em-2').val('');
				$('#pwrd-1').val('');
				$('#pwrd-2').val('');
  			}
		});

	}

	$scope.logIn = function() {

		var email = $('#email').val();
		var password = $('#password').val();

		var ref = new Firebase("https://blogg-site.firebaseio.com");
		ref.authWithPassword({
  			email    : email,
  			password : password
		},
		function(error, authData) {
  			if (error) {
    			console.log("Login Failed!", error);
  			} 
  			else {
    			console.log("Authenticated successfully with payload:", authData);
  				alert('User Login Successful!');

    			$scope.userName = authData.password.email;
    			$scope.userPhoto = authData.password.profileImageURL;
    			$scope.userLink = '#';

    			$('#newpost-name').val($scope.userName);

    			$scope.$apply(function(){})

  			}
		});

	}

	$scope.fbLogin = function() {

		var ref = new Firebase("https://blogg-site.firebaseio.com");
		ref.authWithOAuthPopup("facebook", function(error, authData) {
  			if (error) {
    			console.log("Login Failed!", error);
    			console.log("Login Failed.");
  			} 
  			else {
    			console.log("Authenticated successfully with payload:", authData);

    			$scope.userName = authData.facebook.displayName;
    			$scope.userPhoto = authData.facebook.profileImageURL;
    			$scope.userLink = authData.facebook.cachedUserProfile.link;

    			$('#newpost-name').val($scope.userName);

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
