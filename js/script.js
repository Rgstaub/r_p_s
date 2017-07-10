/*

Connect the two players to the app
		Have player enter their name
		name is saved to local storage
		db 'logs in' player from name in local storage
		db checks for opponent and sets that in local storage

Get the player input and hold it until both players have submitted



*/

// Initialize Firebase
var config = {
		apiKey: "AIzaSyATz6wrwWUZOobB20cfFDtyGdJKMRDGnX4",
		authDomain: "rock-paper-scissors-9b720.firebaseapp.com",
		databaseURL: "https://rock-paper-scissors-9b720.firebaseio.com",
		projectId: "rock-paper-scissors-9b720",
		storageBucket: "rock-paper-scissors-9b720.appspot.com",
		messagingSenderId: "392615458043"
	};

firebase.initializeApp(config);


var database = firebase.database();
var clickCounter = 0;
var scoreboard = $('#testTitle')

$('#counterButton').on("click", function() {
	clickCounter++;
	database.ref().set({
		clickCount: clickCounter
	})
})

database.ref().on("value", function(snapshot) {
	console.log(snapshot.val());
	scoreboard.text(snapshot.val().clickCount);
})


