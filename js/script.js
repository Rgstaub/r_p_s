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

const dbRef = firebase.database();
const playerRef = dbRef.ref('players');
var myPos = ""

function newGame() {
	setTimeout(function() {

		dbRef.ref('players/playerA/rps').set('dynamite');
		dbRef.ref('players/playerB/rps').set('dynamite');
		dbRef.ref('turn').set('a');
		$('#winner').text("");
		$('#player1pick').text("");
		$('#player2pick').text("");
	}, 5000)
}

$('#playerNameSubmit').on('click', function() {
	event.preventDefault();  
	var myName = $('#usernameInput').val().trim();
	var newPlayer = {
		name: myName,
		wins: 0,
		rps: "",
	}
	$('#usernameInput').val(null);
	dbRef.ref('players').once('value', function(snap) {
		if (snap.val().playerA.name === "") {
			dbRef.ref('players/playerA').set(newPlayer);
			myPos = "playerA";
			dbRef.ref('turn').set("a");
			$('#p1buttons').removeClass('hidden');
		} else if (snap.val().playerB.name === "") {
			dbRef.ref('players/playerB').set(newPlayer);
			myPos = "playerB";
		} else {
			alert("No open Spots");
			return;
		}
	})
	console.log(newPlayer);
	$('#player1').removeClass('hidden');
	$('#player2').removeClass('hidden');
	$('#nameInput').addClass('hidden');
})

//collect the button input from player 1 and update the DB
$(document).on('click', '.player1', function() {
	dbRef.ref('players/playerA').update({
		rps: this.value
	})
	dbRef.ref('turn').set("b");
	$('#p1buttons').addClass('hidden');
})

// collect the button input from player 2, update the DB, and evaluate the result
$(document).on('click', '.player2', function() {
	dbRef.ref('players/playerB').update({
		rps: this.value
	})
	$('#p2buttons').addClass('hidden');
	dbRef.ref('turn').set("z");
	// compare the values
	playerRef.once('value', function(snap) {
		var aPick = snap.val().playerA.rps;
		var bPick = snap.val().playerB.rps;
		var aWins = snap.val().playerA.wins;
		var bWins = snap.val().playerB.wins;
		var aName = snap.val().playerA.name;
		var bName = snap.val().playerB.name;
		if (aPick === "Rock") {
			if (bPick === "Scissors") {
				// playerA wins
				aWins++;
				dbRef.ref('players/playerA').update({
					wins: aWins
				});
				dbRef.ref('winner').set(aName)						
			} else if (bPick === "Paper") {
				//playerB wins
				bWins++;
				dbRef.ref('players/playerB').update({
					wins: bWins
				});
				dbRef.ref('winner').set(bName);	
			} else {
				//tie
				dbRef.ref('winner').set("Tie. Nobody");
			}
		} else if (aPick === "Paper") {
			if (bPick === "Rock") {
				// playerA wins
				aWins++;
				dbRef.ref('players/playerA').update({
					wins: aWins
				});
				dbRef.ref('winner').set(aName);		
			} else if (bPick === "Scissors") {
				//playerB wins
				bWins++;
				dbRef.ref('players/playerB').update({
					wins: bWins
				});
				dbRef.ref('winner').set(bName);					
			} else {
				//tie
				dbRef.ref('winner').set("Tie. Nobody");
			}
		} else if (aPick === "Scissors") {
			if (bPick === "Paper") {
				// playerA wins
				aWins++;
				dbRef.ref('players/playerA').update({
					wins: aWins
				});
				dbRef.ref('winner').set(aName);	
			} else if (bPick === "Rock") {
				//playerB wins
				bWins++;
				dbRef.ref('players/playerB').update({
					wins: bWins
				});
				dbRef.ref('winner').set(bName);			
			} else {
				//tie
				dbRef.ref('winner').set("Tie. Nobody");
			}
		}
	})
	
	newGame();
})

// Detect connected players
playerRef.on('value', function(snap) {
	$('#player1name').text(snap.val().playerA.name);
	$('#player1wins').text("Wins: " + snap.val().playerA.wins);
	$('#player2name').text(snap.val().playerB.name);
	$('#player2wins').text("Wins: " + snap.val().playerB.wins);
})

// A DB listener to adjust the game display depending on which turn it is
dbRef.ref().on('value', function(snap) {
	
	var turn = snap.val().turn;
	var winner = snap.val().winner;
	var sv = snap.val()
	if (turn === 'z') {
		$('#winner').text(sv.winner + " Wins!");
		$('#player1pick').text(sv.players.playerA.name + " picked " + sv.players.playerA.rps);
		$('#player2pick').text(sv.players.playerB.name + " picked " + sv.players.playerB.rps);
	}
	if (turn === 'n') {
		$('#nameInput').removeClass('hidden');
		$('#player1').addClass('hidden');
		$('#player2').addClass('hidden');
		newGame();
	}
	if (turn === 'b') {
		if (myPos === 'playerB') {
			$('#p2buttons').removeClass('hidden');
		}
	}
	if (turn === 'a') {
		if (myPos === 'playerA') {
			$('#p1buttons').removeClass('hidden');
			$('#winner').text("");
			$('#player1pick').text("");
			$('#player2pick').text("");

		}
	}
})



// reset the game when one player disconnects
dbRef.ref().onDisconnect().update({
	players: {
		playerA: {
			name: "",
			wins: "0",
			rps: "dynamite"
		},
		playerB: {
			name: "",
			wins: "0",
			rps: "dynamite"
		}
	},
	turn: "n",
	winner: ""
});



// function init() {
// 	playerRef.set({
// 		playerA: {
// 			name: "",
// 			wins: "0",
// 			rps: "dynamite"
// 		},
// 		playerB: {
// 			name: "",
// 			wins: "0",
// 			rps: "dynamite"
// 		}
// 	})
// 	refresh();
// }
















































/*
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
/*
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
*/