import { cloneShip } from './ship-dom';
import { getSquareDom } from './helper-methods';
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

export function updatePlayerBoard(player, showShips) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		displaySquare(coord, square, player, showShips)
	})
}

function displaySquare(coord, square, player, showShips) {
	const squareElement = getSquareDom(coord, player)
	const result = getSquareStatus(square, squareElement, showShips)

	if (result instanceof Node) {
		squareElement.appendChild(result)
	} else {
		squareElement.innerText = result
	}
}

function getSquareStatus(square, squareElement, showShips) {
	if (square.ship) {
		// Clone ship and remove square children
		const shipClone = cloneShip(square.ship.name)
		removeAllChildren(squareElement)  
		return squareShipStatus(square, shipClone, showShips)
	} else {
		return  squareNoShipStatus(square)
	}
}

function removeAllChildren(element) {
	while (element.firstChild) {element.removeChild(element.lastChild);}
}

function squareNoShipStatus(square){  
	return square.miss ? "Miss!" : ""
}

function squareShipStatus(square, ship, showShips){ 
  switch(true){  
  	case square.ship.sunk: return "Sunk!"; 
    case square.hit: return ship;
    case showShips: return ship  
    default: return "SHIP"
  }
}

export function resetSquareColors(player) {
	Array.from(player.domboard.children).forEach((square) => {
    square.setAttribute("style", "background-color: lightblue;")
	})
}

