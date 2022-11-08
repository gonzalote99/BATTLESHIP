var view = {
  displayMessage: function(message) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = message;
  },

displayHit: function(location) {
  var cell = document.getElementById(location);
  cell.setAttribute("class", "hit")

},

displayMiss: function(location) {
  var cell = document.getElementById(location);
  cell.setAttribute("class", "miss")
}



};

var model = {
 boardSize:7,
 numShips:3,
 shipLength:3,
 shipsSunk:0,


 ships: [
   {locations:[0, 0, 0], hits:["", "", ""] },
   {locations:[0, 0, 0], hits:["", "", ""] },
   {locations:[0, 0, 0], hits:["", "", ""] }
 ],


 generateShipLocations: function() {
  var locations;
  for (var i = 0; i < this.numShips; i++) {
    do {
      locations = this.generateShip();

    } while (this.collision(locations));
    this.ships[i].locations = locations;
  }
  console.log("ships:");
  console.log(this.ships)
 },

 generateShip: function() {
   var direction = Math.floor(Math.random() * 2);
   var row, col;

   if (direction === 1) {
     row = Math.floor(Math.random()*this.boardSize);
     col = Math.floor(Math.random()*(this.boardSize - this.shipLength));

   } else {
     row = Math.floor(Math.random()*this.boardSize - this.shipLength);
     col = Math.floor(Math.random()*this.boardSize);
   }
   var newShipLocations = [];
   for (var i = 0; i < this.shipLength; i++) {
     if (direction === 1) {
       newShipLocations.push(row + "" + (col + i));
     } else {
       newShipLocations.push((row+ + i) + "" + col);
     }
   }
   return newShipLocations;
 },

 collision: function (locations) {
     for (var i = 0; i < this.numShips; i++) {
       var ship = this.ships[i];
       for (var j = 0; j < locations.length; j ++ ) {
         if (ship.locations.indexOf(locations[j]) >= 0 ) {
           return true;
         }
       }
      
     }
     return false;
 },

  fire: function (guess) {
   for (var i = 0; i < this.numShips; i++ ) {
     var ship = this.ships[i];

     var index = ship.locations.indexOf(guess);
     if(ship.hits[index] === "hit") {
       view.displayMessage("already hit");
       return true;
     } else if (index >= 0) {
        ship.hits[index] = "hit";
       view.displayHit(guess);
       view.displayMessage("hit");
       if(this.isSunk(ship)) {
          view.displayMessage("shank")
          this.shipsSunk++
       }
       return true;
     }

   }
   view.displayMiss(guess);
   view.displayMessage("missed")
   return false;
  },

  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if(ship.hits[i] !== "hit") {
        return false
      }
    }
    return true

  }







};

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses ++;
      var isHit = model.fire(location);
      if(isHit && model.shipsSunk === model.numShips) {
       view.displayMessage("sank all" + this.guesses + "guesses");
      }
    } 
  }
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if(guess === null || guess.length !==2) {
    alert("error")
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if(isNaN(row) || isNaN(column)) {
      alert("error");

    } else if (row < 0 || 
       row >= model.boardSize || column < 0 || 
       column >= model.boardSize) {
         alert("error")
       } else {
         return row + column;
       }
  }
  return null;
}

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}


function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
var fireButton = document.getElementById("fireButton");
if(e.keyvode === 13) {
  fireButton.click();
  return false;
}
}

window.onload = init;