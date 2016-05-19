angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

  // These icon classes are for mapping the selected guesses to the UI
  $scope.icons = ['ion-social-apple', 'ion-social-android','ion-social-angular','ion-social-html5', 'ion-more'];

  // The current selected icon to assign to any clicked position.
  // TODO: Needs to be set when buttons in menu.html are clicked.
  $scope.selectedIcon = 0;

  $scope.changeSelectedIcon = function (index) {
    $scope.selectedIcon = index
  }

  // TODO: You're going to need a data structure to hold a list of "turns";
  // and those "turns" are likely going to be objects...

  $scope.turns = []
  $scope.answer = []

  function newTurn () {
    var emptyTurn = {
      guesses: [4,4,4,4],
      perfect: 0,
      almost: 0,
      scored: false
    }
    return emptyTurn
  }

  $scope.choose = function (row, col) {
    if(row != $scope.turns.length - 1) {
      return
    }

    if ($scope.turns[row].guesses[col] >= 3){
      $scope.turns[row].guesses[col] = 0
    } else {
      $scope.turns[row].guesses[col]++
    }
  }

  $scope.iconFor = function (guess, turnIndex) {
    return $scope.icons[$scope.turns[turnIndex].guesses[guess]]
  }

  // Initialize game state
  $scope.newGame = function() {
    // TODO: Set all data properties/structures to their beginning state

    $scope.turns = []

    $scope.turns.push(newTurn())

    $scope.answer = []

    for(var i = 0; i < 4; i++) {
      $scope.answer.push(Math.floor(Math.random()*4))
    }
    console.log("answer is " + $scope.answer)
  };

  // Run newGame() upon loading
  $scope.newGame();

  /*
  TODO: Call this function when the user clicks a 'score' button.
        The 'score' button should remain disabled until all positions have a value.
        Maybe a button with an icon of a checkmark would be a good UI choice? Or,
        just use a small button with text of 'Score'?
  */
  $scope.scoreTurn = function() {
    // TODO: Score the turn
    var guesses = $scope.turns[$scope.turns.length - 1].guesses.slice()
    var answerArr = $scope.answer.slice()

    if(guesses.indexOf(4) != -1) {
      return false
    }

    $scope.turns[$scope.turns.length - 1].scored = true
    $scope.turns[$scope.turns.length - 1].perfect = perfectScore(guesses, answerArr)

    removePerfect(guesses, answerArr)

    $scope.turns[$scope.turns.length - 1].almost = almostScore(guesses, answerArr)

    if($scope.turns[$scope.turns.length - 1].perfect == 4) {
      $scope.winModal.show();
    } else {
      $scope.turns.push(newTurn())
    }



    // TODO: Show winModal IF turn is correct. Put line below in an if statement.
  };

  function perfectScore (guesses, answer) {
    var score = 0
    guesses.forEach(function (guess, index) {
      if (guess === answer[index]) {
        score ++
      }
    })
    return score
  }

  function removePerfect(guesses, answerArr) {
    guesses.forEach(function (guess, index) {
      if (guess == answerArr[index]){
        guesses.splice(index, 1)
        answerArr.splice(index, 1)
      }
    })
  }

  function almostScore (guesses, answer) {
    var score = 0
    var tempAns = []
    // console.log("ans = "+answer)
    guesses.forEach(function (guess, index) {
      tempAns = answer.slice()
      tempAns.splice(index,1)
      // console.log("tempans = "+tempAns + "--------")
      if (tempAns.indexOf(guess) != -1) {
        answer.splice(answer.indexOf(guess),1)
        score++
      }
      // console.log("guess = "+guess)
      // console.log("score = "+score)
      // console.log("answer = "+answer)
    })
    return score
  }

  // console.log("\n\n\n")
  // almostScore([0,0,0,0],[1,3,3,0].slice())
  // console.log()

  // Create the winner modal.
  $ionicModal.fromTemplateUrl('templates/winner.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.winModal = modal;
  });

  // TODO: Call this function from the 'Play Again!' button in winModal's html (winner.html)
  $scope.playAgain = function() {
    $scope.newGame();
    $scope.winModal.hide();
  };

});
