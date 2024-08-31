import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { addNewShipSet } from './ship-dom';
import { Ship } from './ship';

const shipsDiv = document.querySelector('.ships')
const boardsDiv = document.querySelector('.boards')

const startBtn = document.querySelector('#start-game')
const switchPlayerBtn = document.querySelector('#switch-player')

const player1 = new Player
const player2 = new Player

let players = [player1, player2]

// DOM Elements
player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")

// player2.domboard.style.display = "none"

let dragged = null;
let draggedElement = null;

document.addEventListener("dragstart", dragStart);

function dragStart(event) {
 	event.dataTransfer.setData("Text", event.target.id);
 	const shipType = event.target.id
	 
 	draggedElement = event.target
 	dragged = Ship.createShip(shipType)
	players[0].gameboard.removeShips(shipType)
}

document.addEventListener("dragover", dragOver);

function dragOver(event) {
	event.preventDefault();
	if (!event.target.dataset.coordinate) return
	const coord = event.target.dataset.coordinate
	const squareEl = players[0].domboard.querySelector(`[data-coordinate=${coord}]`)
	resetSquareColors()
	markValidSquares(dragged, coord)
}

// DROP

document.addEventListener("drop", drop);

function drop(event) {
	event.preventDefault();
	const startCoord = event.target.dataset.coordinate
	removeHandlers() 
	addListeners(startCoord, dragged)
	const data = event.dataTransfer.getData("Text");
	event.target.appendChild(draggedElement);
}

function markValidSquares(ship, coord) {
	const validSquares = players[0].gameboard.showValidSquares(ship, coord)
	validSquares.forEach((square) => {
		const squareEl = players[0].domboard.querySelector(`[data-coordinate=${square}]`)
		squareEl.setAttribute("style", "background-color: red;")
	})
}

function addListeners(startCoord, ship) {
	const squares = players[0].gameboard.showValidSquares(ship, startCoord)

	squares.forEach((square) => {
		const squareEl = players[0].domboard.querySelector(`[data-coordinate=${square}]`)
		squareEl.addEventListener('click', function(e) {
			const endCoord = e.target.dataset.coordinate
			players[0].gameboard.placeShip(ship, startCoord, endCoord)
			resetSquareColors()
			updateBoards(true)
			console.log(players[0].gameboard.board)
		})
	})
	removeHandlers()
}


// Set up board
	
setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)

// Update Board

function updateBoards(showShips) {
	updatePlayerBoard(player1, showShips);
	updatePlayerBoard(player2, showShips);
}

function resetSquareColors() {
	Array.from(players[0].domboard.children).forEach((square) => {
    square.setAttribute("style", "background-color: lightblue;")
	})
}

function beginTurn() {
	players[0].domboard.style.display = "grid"
	players[1].domboard.style.display = "grid"
	// players.reverse()
	removeDraggable()
	updateBoards()
	addHandlers()
}

function addHandlers() {
	Array.from(players[0].domboard.children).forEach((square) => {
		// Prevent a used square from being clicked
		const playerSquare = players[0].gameboard.board[square.dataset.coordinate]
		if (playerSquare.miss == false && playerSquare.hit == false) square.addEventListener('click', playerTurn)
	})
}

function removeHandlers() {
	player1.domboard.childNodes.forEach((square) => square.removeEventListener('click', playerTurn))
	player2.domboard.childNodes.forEach((square) => square.removeEventListener('click', playerTurn))
}

function removeAllHandlers() {
	player1.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
	player2.domboard.childNodes.forEach((square) => square.removeEventListener('click', playerTurn))
}


function playerTurn(e) {
	const square = e.target.dataset.coordinate;
	players[0].gameboard.receiveAttack(square);
	updateBoards()
	removeHandlers()
	if (gameOver()) return
	players.reverse()
	addHandlers()
}

function gameOver() {
	return players[0].gameboard.allSunk()
}

function removeDraggable() {
	document.removeEventListener("dragstart", dragStart)
	document.removeEventListener("dragover", dragOver)
	document.removeEventListener("drop", drop)
}

// player1.gameboard.placeShip(new Battleship, "A1", "A2")
// player2.gameboard.placeShip(new Battleship, "A10", "A9")



startBtn.addEventListener('click', beginTurn)
switchPlayerBtn.addEventListener('click', function() {
	// players[0].domboard.style.display = "none"
	// players[1].domboard.style.display = "grid"
	addNewShipSet()
	// removeHandlers()
	removeAllHandlers() 
	players.reverse()
})