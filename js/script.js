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
var playerCount = 0;
var signedIn = false;

if(sessionStorage.myID) {
	
	var myKey = sessionStorage.myID;
	console.log(myKey);


}

database.ref("/users/" + myKey).on('value', function(snap) {
	var name = snap.val().name;
	console.log(name);
	$('#playerNameDisplay').text(name);
});

var player = {};

//===============================================================================

var newPlayerSubmit = $('#playerNameSubmit');
var newPlayerInput = $('usernameInput');
var playerNameDisplay = $('playerNameDisplay');






// function tooManyPlayers() {
// 	alert("Too many players! :P");
// }

// function addPlayer(x) {
// 	console.log("player " + x + ": " + $('#usernameInput').val().trim());
// 	var player = $('#usernameInput').val().trim();
// 	if ($("input[type='checkbox']").is(':checked')) {
// 		localStorage.setItem('myName', player);
// 		sessionStorage.setItem('myName', player);
// 	} else {
// 		sessionStorage.setItem('myName', player);
// 	}
// 	if (x === 1) {
// 		database.ref().set({
// 			player1: player
// 		})
// 	} else if (x === 2) {
// 		database.ref().set({
// 			player2: player
// 		})
// 	}
// }



//	ADD PLAYER MODULE
//================================================================================

// Handle a new player submission
$('#playerNameSubmit').on('click', function() {
	event.preventDefault();

	//create a new player object
	var newPlayer = {
		name: $('#usernameInput').val().trim(),
		id: "placeholder",
		wins: 0,
		losses: 0
	}
	console.log(newPlayer.name);


	var key = database.ref('/users').push(newPlayer).key;
	newPlayer.id = key;
	database.ref('/users/' + key + '/id').set(key);

	// add the player's id to session storage or local storage if "remember me" is checked
	if ($("input[type='checkbox']").is(':checked')) {
		localStorage.setItem('myID', newPlayer.id);
		sessionStorage.setItem('myID', newPlayer.id);
	} else {
		sessionStorage.setItem('myID', newPlayer.id);
		localStorage.setItem('myID', "");
	}
})




database.ref().on("value", function(snapshot) {
	
})

