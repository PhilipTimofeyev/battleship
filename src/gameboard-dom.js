
const carrier = document.querySelector("#Carrier")
const battleship = document.querySelector("#Battleship")
const destroyer = document.querySelector("#Destroyer")
const patrol = document.querySelector("#Patrol")
const submarine = document.querySelector("#Submarine")

// Create Board

function createSquare(coord, square) {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode("");

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
		let ship = null
		if (square.ship) ship = cloneShip(square.ship.name)

		const result = squareStatus(ship, square)

		if (result instanceof Node) {
			squareElement.firstChild ? squareElement.firstChild.replaceWith(ship) : squareElement.appendChild(ship)
		} else {
			squareElement.innerText = result
		}
	})
}

export function showShips(player) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		const squareElement = player.domboard.querySelector(`[data-coordinate=${coord}]`)
		if (square.ship){
			let ship = cloneShip(square.ship.name)
			while (squareElement.firstChild) {squareElement.removeChild(squareElement.lastChild);}
			squareElement.appendChild(ship) 
		} else {
			squareElement.innerText = ""
		}
	})
}

function squareStatus(ship, square){   
  switch(true){  
  	case !!square.ship && square.ship.sunk: return "Sunk!"; 
    case !!square.ship && square.hit: return ship;
    case square.miss: return "Miss!";
    default: return "";      
  }
}

function cloneShip(ship) {
	switch(ship) {
	case "Carrier": return carrier.cloneNode(true);
	case "Battleship": return battleship.cloneNode(true);
	case "Destroyer": return destroyer.cloneNode(true);
	case "Patrol": return patrol.cloneNode(true);
	case "Submarine": return submarine.cloneNode(true);
	}
}