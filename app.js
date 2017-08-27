var playerScore = 0; // your starting scores
var scoreboard = document.getElementById('scores') // all player scores
var gamestart = false;
var winningScore = 25;

function newgame() {
  firebase.database().ref().remove();
  gamestart = false;
  document.getElementById('playerId').readOnly = false;
  document.getElementById('start-button').disabled = false;
}


function start() {
  let playerId = document.getElementById("playerId").value;
  if (playerId) {
    gamestart = true;
    document.getElementById('playerId').readOnly = true;
    document.getElementById('start-button').disabled = true;
    firebase.database().ref('players/' + playerId).set(playerScore);
  } else {
    alert("Player number is blank");
    return false;
  }
  updateScoreboard();
}

window.addEventListener("keydown", function(event) {
  console.log(gamestart);
  if (event.code == "Space" && gamestart) {
    let playerId = document.getElementById("playerId").value;
    if (playerId) {
      playerScore++;
      let updates = {};
      updates['players/' + playerId] = playerScore;
      firebase.database().ref().update(updates);

    } else {
      alert("Player number is blank");
      return false;
    }
  }
});

let scoresRef = firebase.database().ref('players');

scoresRef.on('child_added', function() {
  updateScoreboard();
});


scoresRef.on('child_changed', function() {
  updateScoreboard();
  weHaveAWinner();
});

scoresRef.on('child_removed', function() {
  playerScore = 0; //reset all players' local scores when new game is triggered.
  updateScoreboard();
});

var updateScoreboard = function() {
  scoresRef.once('value', function(snapshot) {
    scoreboard.innerHTML = '';
    snapshot.forEach(function(childSnapshot) {
      scoreboard.innerHTML += '<li>player ' + childSnapshot.key + ': ' + childSnapshot.val() + '</li>';
    });
  })
};

var weHaveAWinner = function() {
  scoresRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val() == winningScore) {
        window.gamestart = false;
        document.getElementById('gameover').innerHTML = 'Player ' + childSnapshot.key + ' is the winner! ';
        document.getElementById("playerId").value = '';
        // debugger;
      }
    });
  })
};
