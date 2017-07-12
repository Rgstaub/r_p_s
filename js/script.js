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



//	ADD PLAYER MODULE
//================================================================================


$('#playerNameSubmit').on('click', function() {
	event.preventDefault();
	// if ($('#usernameInput').val().trim() !== "") {
	// 	if (playerCount === 0) {
	// 		addPlayer(1);
	// 		playerCount++;
	// 	}
	// 	else if (playerCount === 1) {
	// 		addPlayer(2);
	// 		playerCount++; 
	// 	}
	// 	else {
	// 		tooManyPlayers();
	// 	}
	// }
	// else {
	// 	alert("null value");
	// }

	//create a new player object
	var newPlayer = {
		name: $('#usernameInput').val().trim(),
		id: $('#usernameInput').val().trim() + Date.now(),
		wins: 0,
		losses: 0
	}
	console.log(newPlayer.name);
	console.log(newPlayer.id);
	// add the player's id to session storage or local storage if "remember me" is checked
	if ($("input[type='checkbox']").is(':checked')) {
		localStorage.setItem('myID', newPlayer.id);
		sessionStorage.setItem('myID', newPlayer.id);
	} else {
		sessionStorage.setItem('myID', newPlayer.id);
		localStorage.setItem('myID', "");
	}

	var key = database.ref().push(newPlayer).key;
	console.log(database.ref('/' + key + "/id").set(key));
})





database.ref().on("value", function(snapshot) {
	console.log(snapshot.val());
	scoreboard.text(snapshot.val().clickCount);
})


