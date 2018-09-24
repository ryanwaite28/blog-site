// Main Angular Application
var App = angular.module("myApp", ["firebase"]);

App.factory("bloggSite", ["$firebaseArray",
  function($firebaseArray) {
    var ref = new Firebase("https://blogg-site.firebaseio.com/");
    return $firebaseArray(ref);
  }
]);

// Master Angular Controller
App.controller("masterCtrl", ["$scope", "bloggSite",
  function($scope, bloggSite) {
		window.logApp = function(){ console.log($scope); }

    $scope.blogSite = bloggSite;
		$scope.blogSite.sortBy("name", "asc");

		$scope.user = null;
		$scope.new_post_body = "";

    $scope.currentTopic = {};
    $scope.currentTopicName = '';
    $scope.currentTopicPosts = [];
    $scope.currentid = '';
    $scope.path = '';

    $scope.hideForm = true;

    $('#topics').change(function() {
      var value = $(this).val();
      if (value == "none") {
        $scope.hideForm = true;
      }
			else {
        $scope.hideForm = false;
				let blog_topic = bloggSite.filter(function(bt){ return bt.name === value })[0];
				if(blog_topic) {
					$scope.currentTopic = blog_topic;
					$scope.currentTopicIndex = bloggSite.indexOf(blog_topic);
	        $scope.currentTopicName = blog_topic.name;
	        $scope.currentid = blog_topic.$id;
	        $scope.currentTopicPosts = blog_topic.posts && Object.keys(blog_topic.posts).reduce(function(acc, cur){
						return acc.concat(blog_topic.posts[cur])
					}, []) || [];
					$scope.$apply();
				}
      }
    });

		$scope.newPost = function() {
			var date = Date();
			if(!$scope.user) {
				return alert('You must be logged in');
			}
			var path = new Firebase('https://blogg-site.firebaseio.com/' + $scope.currentid + '/posts');
			var obj = {
				'personName': $scope.user.name,
				'personThoughts': $scope.new_post_body,
				'postDate': date,
				'postImg': $scope.user.picture
			}
			path.push(obj);


			alert('Post Shared!');
			$scope.new_post_body = "";
			$scope.currentTopicPosts = Object.keys($scope.blogSite[$scope.currentTopicIndex].posts).reduce(function(acc, cur){
				return acc.concat($scope.blogSite[$scope.currentTopicIndex].posts[cur])
			}, []);
		}

    $scope.signUp = function() {

      //var name = $('#name').val().toLowerCase();
      var emOne = $('#em-1').val().toLowerCase();
      var emTwo = $('#em-2').val().toLowerCase();
      var pwrdOne = $('#pwrd-1').val();
      var pwrdTwo = $('#pwrd-2').val();

      if (emOne == '' || emTwo == '' || pwrdOne == '' || pwrdTwo == '') {
        alert('Please Fill In All The Fields.');
        $('#em-1').val('');
        $('#em-2').val('');
        $('#pwrd-1').val('');
        $('#pwrd-2').val('');
        return;
      } else if (emOne != emTwo || pwrdOne != pwrdTwo) {
        alert("One of the two pairs (email or password) does not match.");
        $('#em-1').val('');
        $('#em-2').val('');
        $('#pwrd-1').val('');
        $('#pwrd-2').val('');
        return;
      } else {
        // Continue Function
        console.log("Sign Up Accepted.");
      }

      var ref = new Firebase("https://blogg-site.firebaseio.com");
      ref.createUser({
          userName: name,
          email: emOne,
          password: pwrdOne
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
          email: email,
          password: password
        },
        function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            alert('User Login Successful! Hover Over The Menu Icon At The Top Right Corner To See Your Info!');

            $scope.userName = authData.password.email;
            $scope.userPhoto = authData.password.profileImageURL;
            $scope.userLink = '#';

            $('#newpost-name').val($scope.userName);

            $scope.$apply(function() {})

          }
        });

    }

    $scope.fbLogin = function() {
      var ref = new Firebase("https://blogg-site.firebaseio.com");
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          console.log("Login Failed.");
        } else {
          console.log("Authenticated successfully with payload:", authData);
          alert('User Login Successful! Hover Over The Menu Icon At The Top Right Corner To See Your Info!');

          $scope.userName = authData.facebook.displayName;
          $scope.userPhoto = authData.facebook.profileImageURL;
          $scope.userLink = authData.facebook.cachedUserProfile.link;

          $('#newpost-name').val($scope.userName);

          $scope.$apply(function() {})

        }
      });
    }

		$scope.gLogin = function() {
      var ref = new Firebase("https://blogg-site.firebaseio.com");
      ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
					$scope.user = authData.google.cachedUserProfile;
					$scope.user.uid = authData.uid;
					$scope.$apply();
					alert('Logged In!');
        }
      });
    }

    $scope.newTopic = function() {
      if(!$scope.user) {
				return alert('You must be logged in');
			}

      var newTopic = $('#new-topic').val().toLowerCase();

      if (newTopic == '') {
        alert('Please Enter a Name for a New Topic.');
        return;
      }

      for (var key in $scope.blogSite) {

        if (newTopic == $scope.blogSite[key].name) {
          alert('Topic Already Exists. Select It From The DropDown.');
          console.log('New Topic Rejected.');
          return;
        }

      }

      $scope.blogSite.$add({
        name: newTopic
      });
			$scope.blogSite.sortBy("name", "asc");
      var newTopic = $('#new-topic').val('');
    }

  }
]);
