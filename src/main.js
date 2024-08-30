import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

// DOM Elements
const player1Board = document.querySelector(".player1")
const player2Board = document.querySelector(".player2")

// Set up board

setUpBoard(player1, player1Board)
setUpBoard(player2, player2Board)


// Update Board

function updateBoard() {
	updatePlayerBoard(player1, player1Board);
	updatePlayerBoard(player2, player2Board);
}

const carrier = new Carrier
const battleship = new Battleship

player1.gameboard.placeShip(carrier, "A2", "A5")
player2.gameboard.placeShip(battleship, "F1", "D1")

updateBoard()


function playerOneTurn() {
	player2Board.childNodes.forEach((square) => square.addEventListener('click', function(e) {
		const square = e.target.dataset.coordinate;
		player2.gameboard.receiveAttack(square);
		console.log(player2.gameboard)
		updateBoard()
	}))
}

playerOneTurn()