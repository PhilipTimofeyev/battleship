import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

// DOM Elements
player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")

// Set up board

setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)


// Update Board

function updateBoard() {
	updatePlayerBoard(player1);
	updatePlayerBoard(player2);
}

const carrier = new Carrier
const battleship = new Battleship

player1.gameboard.placeShip(carrier, "A2", "A5")
player2.gameboard.placeShip(battleship, "F1", "D1")

updateBoard()


function playerOneTurn() {
	player2.domboard.childNodes.forEach((square) => square.addEventListener('click', function(e) {
		const square = e.target.dataset.coordinate;
		player2.gameboard.receiveAttack(square);
		console.log(player2.gameboard)
		updateBoard()
	}))
}

let currentPlayer = [player1, player2]

playerOneTurn()