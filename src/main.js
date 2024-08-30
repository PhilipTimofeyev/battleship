import { Player } from './player';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

// DOM Elements
const boardContainer = document.querySelector(".board")

// Create Board

function addSquare(coord, square) {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode(coord);

  newDiv.classList.add('square')
  newDiv.appendChild(newContent);
  newDiv.dataset.coordinate = coord
  boardContainer.appendChild(newDiv);
}


Object.entries(player1.gameboard.board).forEach(([coord, square]) => {
	addSquare(coord, square)
})


function updateBoard() {
	Object.entries(player1.gameboard.board).forEach(([coord, square]) => {
		const coordElement = boardContainer.querySelector(`[data-coordinate=${coord}]`)
		coordElement.innerText = square.ship
	})
}

updateBoard()

const carrier = new Carrier

player1.gameboard.placeShip(carrier, "A1", "C1")

updateBoard()