/*

Connect the two players to the app
		Have player enter their name
		name is saved to local storage
		db 'logs in' player from name in local storage
		db checks for opponent and sets that in local storage

Get the player input and hold it until both players have submitted

1

*/
//=============================================================================

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

// Set global variables
var database = firebase.database();
var clickCounter = 0;
var scoreboard = $('#testTitle');
var playerCount = 0;

//===============================================================================

function tooManyPlayers() {
	alert("Too many players! :P");
}

function addPlayer(x) {
	console.log("player " + x + ": " + $('#usernameInput').val().trim());
	var player = $('#usernameInput').val().trim();
	if ($("input[type='checkbox']").is(':checked')) {
		localStorage.setItem('myName', player);
		sessionStorage.setItem('myName', player);
	} else {
		sessionStorage.setItem('myName', player);
	}
	if (x === 1) {
		database.ref().set({
			player1: player
		})
	} else if (x === 2) {
		database.ref().set({
			player2: player
		})
	}
}
















//================================================================================

// Test counter click
$('#counterButton').on("click", function() {
	event.preventDefault();
	clickCounter++;
	database.ref().set({
		clickCount: clickCounter
	})
})

$('#playerNameSubmit').on('click', function() {
	event.preventDefault();
	if ($('#usernameInput').val().trim() !== "") {
		if (playerCount === 0) {
			addPlayer(1);
			playerCount++;
		}
		else if (playerCount === 1) {
			addPlayer(2);
			playerCount++; 
		}
		else {
			tooManyPlayers();
		}
	}
	else {
		alert("null value");
	}
})





database.ref().on("value", function(snapshot) {
	console.log(snapshot.val());
	scoreboard.text(snapshot.val().clickCount);
})


