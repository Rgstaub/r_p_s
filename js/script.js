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
var playerCount = 0;
var signedIn = false;
var player = {};
var opponent = {};

var players = database.ref('/connectedPlayers');
var myPosition = "";
var playerA_id = "";
var playerB_id = ""; 

// reset the database
function initialize() {
	database.ref().set("");
	database.ref('/connectedPlayers').set(0);
	reload();

}

// Check if the player is signed in

function signInCheck() {
	if (sessionStorage.myID) {
		console.log("Temporarily signed in as ");
		var signedIn = true;
		database.ref("/users/" + sessionStorage.myID).on('value', function(snap) {
			var name = snap.val().name;
			console.log(name);
			$('#playerNameDisplay').text(name);
			player = snap.val();
			setPlayer();
		})
     
	} else if (localStorage.myID) {
		console.log("Permanently signed in as ");
		var signedIn = true;
	} else {
		$('#nameInput').toggleClass("hidden");
		$('#signOut').toggleClass("hidden");
		$('#playerNameDisplay').text("Sign in with a Player Name");
	}
}

function setPlayer() {
	
	players.once('value', function(snap) {
		console.log(snap.val());

		if (snap.val() === 1) {
			console.log("you are the second player");
			database.ref('/playerB').set(sessionStorage.myID);
			players.set(2);
		} else if (snap.val() === 0) {
			console.log("you are the first player");
			database.ref('/playerA').set(sessionStorage.myID);
			players.set(1);
		} else {
			alert("Game is full. Please wait");
		}
	})
}

database.ref('/playerA').on('value', function(snap) {
	playerA_id = snap.val();
})

database.ref('/playerB').on('value', function(snap) {
	playerB_id = snap.val();
})

// If signed in, check if there are open spots in the game


// If not signed in, display the signin form


// if open spots exist, put player into the game and update number of open spots


// If no open spots exist, display message and wait for open spot


// Once in the game, check if there is an opponent. If opponent exists, begin the game


// Get choice from each player, determine outcome, append results to page


if(sessionStorage.myID) {
	
	var myKey = sessionStorage.myID;
	console.log(myKey);


}

// database.ref("/users/" + myKey).on('value', function(snap) {
// 	var name = snap.val().name;
// 	console.log(name);
// 	$('#playerNameDisplay').text(name);
// });



//===============================================================================







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
		wins: 0,
		losses: 0,
		rockCount: 0,
		paperCount: 0,
		scissorsCount: 0
	}
	console.log(newPlayer.name);



	// Add the newPlayer to the database and store the key
	var key = database.ref('/users').push(newPlayer).key;

	// add the player's id (key) to session storage or local storage if "remember me" is checked
	if ($("input[type='checkbox']").is(':checked')) {
		localStorage.setItem('myID', key);
		sessionStorage.setItem('myID', key);
	} else {
		sessionStorage.setItem('myID', key);
		localStorage.removeItem('myID');
	}

	database.ref('/users/' + key).on('value', function(snapshot) {
		console.log(snapshot.val().name);
		$('#playerNameDisplay').text(snapshot.val().name);
	})

	$('#nameInput').toggleClass("hidden");
	$('#signOut').toggleClass("hidden");
	signInCheck();
})




database.ref().on("value", function(snapshot) {
	
})

// check and log the player in if possible on load
signInCheck();



$('#signOut').on('click', function() {
	localStorage.removeItem("myID");
	sessionStorage.removeItem("myID");
	// clear out the new username input field
	$('#usernameInput').val("");
	signInCheck();
})