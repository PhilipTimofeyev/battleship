import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

let players = [player1, player2]

// DOM Elements
player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")

// Set up board

setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)


// Update Board

function updateBoards() {
	updatePlayerBoard(player1);
	updatePlayerBoard(player2);
}

const carrier = new Carrier
const battleship = new Battleship

player1.gameboard.placeShip(carrier, "A2", "A5")
player2.gameboard.placeShip(battleship, "F1", "D1")

function beginTurn() {
	addHandlers()
}

function addHandlers() {
	players[0].domboard.childNodes.forEach((square) => square.addEventListener('click', playerTurn))
}

function removeHandlers() {
	player1.domboard.childNodes.forEach((square) => square.removeEventListener('click', playerTurn))
	player2.domboard.childNodes.forEach((square) => square.removeEventListener('click', playerTurn))
}

function playerTurn(e) {
	const square = e.target.dataset.coordinate;
	players[0].gameboard.receiveAttack(square);
	updateBoards()
	removeHandlers()
	players.reverse()
	addHandlers()
}

beginTurn()

