
//========FIREBASE===========================================================

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

// declare glabal variables and constants
const dbRef = firebase.database();
const playerRef = dbRef.ref('players');
var myPos = "";
var myName = "";

//========FUNCTIONS=========================================================

// reset the message board and game variables for a new game
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

//========EVENT LISTENERS====================================================

// LOGIN AT BEGINNING OF GAME
// Add a new player when a name is submitted
$('#playerNameSubmit').on('click', function() {
	event.preventDefault(); 
	$('#chat').removeClass('hidden'); 
	if ($('#usernameInput').val().trim()) {
		myName = $('#usernameInput').val().trim();
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
	} else {return};
})

// PICKING R, P, OR S
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
	// Start a new game after p2 makes their selection
	newGame();
})

// ADD TO CHAT
// When chat text is submitted, ad to 'lastMessage' in the database
$(document).on('click', '#chatSubmit', function() {
	event.preventDefault();
	var message = $('#chatText').val().trim();
	$('#chatText').val(null);
	if (message) {
		dbRef.ref('lastMessage').set(myName + ": " + message);
	}
})

//===========DATABASE LISTENERS==========================================================

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
	// Turn Z is the state when the game is over
	if (turn === 'z') {
		$('#winner').text(sv.winner + " Wins!");
		$('#player1pick').text(sv.players.playerA.name + " picked " + sv.players.playerA.rps);
		$('#player2pick').text(sv.players.playerB.name + " picked " + sv.players.playerB.rps);
	}
	// Turn N is a new game / before the game starts
	if (turn === 'n') {
		$('#nameInput').removeClass('hidden');
		$('#player1').addClass('hidden');
		$('#player2').addClass('hidden');
		$('#chat').addClass('hidden');
		newGame();
	}
	// Turn B is the second player's turn.
	if (turn === 'b') {
		if (myPos === 'playerB') {
			$('#p2buttons').removeClass('hidden');
		}
	}
	
	// Turn A is the first player's turn.
	if (turn === 'a') {
		if (myPos === 'playerA') {
			$('#p1buttons').removeClass('hidden');
			$('#winner').text("");
			$('#player1pick').text("");
			$('#player2pick').text("");
		}
	}
})

// DB listener for lastMessage changes to append any new message to the chat log
dbRef.ref('lastMessage').on('value', function(snap) {
	var chat = $('<p>');
	chat.text(snap.val());
	$('#chatBox').prepend(chat);
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
	winner: "",
	lastMessage: ""
});


