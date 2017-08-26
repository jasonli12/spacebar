var playerScore = 0; // your starting scores
var scoreboard = document.getElementById('scores') // all player scores


function start() {
  let playerId = document.getElementById("playerId").value;
  if (playerId) {
    document.getElementById('playerId').readOnly = true;
    firebase.database().ref('players/' + playerId).set(playerScore);
  } else {
    alert("Player number is blank");
    return false;
  }
  updateScoreboard();
}


window.addEventListener("keydown", function(event) {
  if (event.code == "Space") {
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


scoresRef.on('child_changed', function(data) {
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
