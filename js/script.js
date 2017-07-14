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
var playerIDs = [];

var players = database.ref('/connectedPlayers');
var myPosition = "";
var playerA_id = "";
var playerB_id = ""; 

// reset the database
function initialize() {
	database.ref().set(null);
	database.ref('/players').set(playerIDs);
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
	if(playerIDs.length === 0) {
		database.ref('/players/one').set(player.key);
		myPosition = "one";
	} else if (playerIDs.length === 1) {
		database.ref('/players/two').set(player.key);
		myPosition = "two"
	} else {
		alert("All spots are full. Please wait");
	}
}

database.ref('/players').onDisconnect().update({myPosition: null});

database.ref('/playerA').on('value', function(snap) {
	playerA_id = snap.val();
}
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


//===============================================================================



//	ADD PLAYER MODULE
//================================================================================

// Handle a new player submission
$('#playerNameSubmit').on('click', function() {
	event.preventDefault();

	//create a new player object
	var newPlayer = {
		name: $('#usernameInput').val().trim(),
		key: "placeholder",
		wins: 0,
		losses: 0,
		rockCount: 0,
		paperCount: 0,
		scissorsCount: 0
	}
	console.log(newPlayer.name);



	// Add the newPlayer to the database and store the key
	var key = database.ref('/users').push(newPlayer).key;
	newPlayer.key = key;
	
	// add the player's id (key) to session storage or local storage if "remember me" is checked
	if ($("input[type='checkbox']").is(':checked')) {
		localStorage.setItem('myID', key);
		sessionStorage.setItem('myID', key);
	} else {
		sessionStorage.setItem('myID', key);
		localStorage.removeItem('myID');
	}

	database.ref('/users/' + key).on('value', function(snap) {
		console.log(snap.val().name);
		$('#playerNameDisplay').text(snap.val().name);
		database.ref('/users/' + key + '/key').set(key);
	})

	$('#nameInput').toggleClass("hidden");
	$('#signOut').toggleClass("hidden");
	signInCheck();
})




database.ref('/players').on("value", function(snap) {
	if (snap.val().one) {
		playerIDs[0] = snap.val().one;
	} if (snap.val().two) {
		playerIDs[1] = snap.val().two;
	}
})

// check and log the player in if possible on load
signInCheck();



$('#signOut').on('click', function() {
	localStorage.removeItem("myID");
	sessionStorage.removeItem("myID");
	// clear out the new username input field
	$('#usernameInput').val("");
	var position = playerIDs.indexOf(player.key);
	console.log(position);
	playerIDs.splice(position, 1);
	signInCheck();
})