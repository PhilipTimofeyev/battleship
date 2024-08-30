
// Create Board

function createSquare(coord, square) {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode(coord);

  newDiv.classList.add('square')
  newDiv.appendChild(newContent);
  newDiv.dataset.coordinate = coord;
  return newDiv
}

function addSquare(square, board) {
  board.appendChild(square)
}

export function setUpBoard(player) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		const newSquare = createSquare(coord, square)
		addSquare(newSquare, player.domboard)
	})
}

// Update Board

export function updatePlayerBoard(player) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		const squareElement = player.domboard.querySelector(`[data-coordinate=${coord}]`)

		squareElement.innerText = squareStatus(coord, square)
	})
}

function squareStatus(coord, square){   
  switch(true){   
    case !!square.ship && square.hit: return "Hit";
    case square.miss: return "Miss!";
    default: return coord;      
  }
}