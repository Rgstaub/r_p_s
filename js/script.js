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
const database = firebase.database();
var openSpots;
const openSpotsRef = database.ref('openSpots');
const playersRef = database.ref('/players');

var player = {};
var opponent = {};
var playerIDs = [];
var host = false;


//var myPosition = "";
// var path = "/players/";
// var myPath = "";
// var playerA_id = "";
// var playerB_id = ""; 

// reset the database
// function init() {
// 	database.ref().set(null);
// 	database.ref('/players').set(playerIDs);
// 	reload();
// }

openSpotsRef.on('value', function(snap) {
	openSpots = snap.val();
	console.log(openSpots);
})

database.ref('/players').on('value', function(snap) {
	var playerArr = Object.keys(snap.val());
	console.log(playerArr);
	playerIDs = playerArr;
})

// Check if the player is signed in
function signInCheck() {
	if (sessionStorage.myID || localStorage.myID) {
		console.log("signed in as ");
		if (!sessionStorage.myID) {
			sessionStorage.myID = localStorage.myID;
		}
		database.ref("/users/" + sessionStorage.myID).on('value', function(snap) {
			var name = snap.val().name;
			console.log(name);
			$('#playerNameDisplay').text(name);
			player = snap.val();
			setPlayer();
		})
     
	// } else if (localStorage.myID) {
	// 	console.log("Permanently signed in as ");
	// 	var signedIn = true;
	} else {
		$('#nameInput').toggleClass("hidden");
		$('#signOut').toggleClass("hidden");
		$('#playerNameDisplay').text("Sign in with a Player Name");
	}
}

function setPlayer() {
	if (openSpots === 2) {
		host = true;
		openSpots--;
		openSpotsRef.set(openSpots);
		var tempKey = database.ref('/players').child(player.key).set(player.name);
		startGame();
	}
	else if (openSpots > 0) {
		openSpots--;
		openSpotsRef.set(openSpots);
		var tempKey = database.ref('/players').child(player.key).set(player.name);
		joinGame();
	}
	else {
		alert("No open Spots");
		return;
	}
}

function removePlayer() {

}

function startGame() {

}

function shoot(myThrow, oppThrow) {

}
// 	if(playerIDs.length === 0) {
// 		database.ref('/players/one').set(player.key);
// 		myPosition = "one";
// 		myPath = "/players/" + myPosition;
// 	} else if (playerIDs.length === 1) {
// 		database.ref('/players/two').set(player.key);
// 		myPosition = "two"
// 	} else {
// 		alert("All spots are full. Please wait");
// 	}
// 

// console.log(myPath);
// var thing = database.ref(myPath);
// thing.onDisconnect().set(null);

// database.ref('/playerA').on('value', function(snap) {
// 	playerA_id = snap.val();
// })


// database.ref('/playerB').on('value', function(snap) {
// 	playerB_id = snap.val();
// })

// If signed in, check if there are open spots in the game


// If not signed in, display the signin form


// if open spots exist, put player into the game and update number of open spots
/* 
	openSpots variable to be increment on each join/disconnect
	Build an array of the keys of players added to the database
	check the array for the id that doesn't match your own. Set that id to opponent
	lookup and display opponent info
	add the rps interface



*/

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
		$('#playerNameDisplay').text(snap.val().name);
		database.ref('/users/' + key + '/key').set(key);
	})

	$('#nameInput').toggleClass("hidden");
	$('#signOut').toggleClass("hidden");
	signInCheck();
})




// database.ref('/players').on("value", function(snap) {
// 	if (snap.val().one) {
// 		playerIDs[0] = snap.val().one;
// 	} if (snap.val().two) {
// 		playerIDs[1] = snap.val().two;
// 	}
// })

// check and log the player in if possible on load
signInCheck();



$('#signOut').on('click', function() {
	localStorage.removeItem("myID");
	sessionStorage.removeItem("myID");
	// clear out the new username input field
	$('#usernameInput').val("");
	//var position = playerIDs.indexOf(player.key);
	//console.log(position);
	//playerIDs[position] = "";
	signInCheck();
})