import { Player } from './player';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

// DOM Elements
const player1Board = document.querySelector(".player1")
const player2Board = document.querySelector(".player2")

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

function setUpBoard(player, board) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		const newSquare = createSquare(coord, square)
		addSquare(newSquare, board)
	})
}

// Update Board

function updateBoard() {
	updatePlayerBoard(player1, player1Board);
	updatePlayerBoard(player2, player2Board);

}

function updatePlayerBoard(player, board) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		const coordElement = board.querySelector(`[data-coordinate=${coord}]`)
		coordElement.innerText = square.ship ? square.ship.name : coord
	})
}

setUpBoard(player1, player1Board)
setUpBoard(player2, player2Board)

const carrier = new Carrier

player1.gameboard.placeShip(carrier, "A2", "A5")
player2.gameboard.placeShip(carrier, "A2", "A5")

updateBoard()