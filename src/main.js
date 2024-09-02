import { Player, Human, Computer } from './player';
import { setUpBoard, updatePlayerBoard, resetSquareColors } from './gameboard-dom';
import { addNewShipSet } from './ship-dom';
import { Ship } from './ship';
import { getSquareDom, getSquareObj, removeListener, removeAllHandlers } from './helper-methods';

// Players

const player1 = new Player
// const player2 = new Computer(player1.gameboard)
const player2 = new Player
let players = [player1, player2]

if (player2 instanceof Computer) player2.opponentBoard = player1.gameboard

	// player2.placeAllShips()

// Gameplay




// DOM Elements

const boardsDiv = document.querySelector('.boards')

const startBtn = document.querySelector('#start-game')
const player1ReadyBtn = document.querySelector('#player1-ready')

player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")


// Set up board
	
setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)

updateBoards(false)
// Button Listeners

startBtn.addEventListener('click', startGame)
player1ReadyBtn.addEventListener('click', function() {
	startBtn.style.display = "block"
	addNewShipSet()
	removeAllHandlers(player1, player2) 
	switchPlayers()
	player1ReadyBtn.style.display = 'none'
})

// player2ReadyBtn.addEventListener('click', function() {

// })

function alternateGridDisplay() {
	let currentPlayerGrid = players[0].domboard.style.display

	if (currentPlayerGrid == 'none') {
		players[0].domboard.style.display = 'grid';
		players[1].domboard.style.display= 'none'
	} else {
		players[0].domboard.style.display = 'none';
		players[1].domboard.style.display= 'grid'
	}
}


// Drag and Drop

let draggedShip = null;
let draggedShipElement = null;

// Drag Start

document.addEventListener("dragstart", dragStart);

function dragStart(event) {
 	const shipType = event.target.id
	
	// Captures Ship element for future use
 	draggedShipElement = event.target
 	draggedShip = Ship.createShip(shipType)

 	// Removes the ship objects from the player's gameboard so there are no duplicates
	players[0].gameboard.removeShips(shipType)
}

document.addEventListener("dragover", dragOver);

// Drag Over

function dragOver(event) {
	event.preventDefault();
	if (!event.target.dataset.coordinate) return
	const coord = event.target.dataset.coordinate
	const squareEl = getSquareDom(coord, players[0])
	resetSquareColors(players[0])
	markValidSquares(draggedShip, coord)
}

function markValidSquares(ship, coord) {
	const validSquares = players[0].gameboard.showValidSquares(ship, coord)

	validSquares.forEach((square) => {
		const squareEl = getSquareDom(square, players[0])
		squareEl.setAttribute("style", "background-color: red;")
	})
}

// Drop

document.addEventListener("drop", drop);

function drop(event) {
	event.preventDefault();
	const startCoord = event.target.dataset.coordinate
	addSecondCoordListeners(startCoord, draggedShip)
	event.target.appendChild(draggedShipElement);
}

function addSecondCoordListeners(startCoord, ship) {
	const squares = players[0].gameboard.showValidSquares(ship, startCoord)

	squares.forEach((square) => {
		const squareEl = getSquareDom(square, players[0])
		squareEl.addEventListener('click', function(e) {

			// Once player selects the 2nd square, the board places the ships accordingly
			const endCoord = e.target.dataset.coordinate
			players[0].gameboard.placeShip(ship, startCoord, endCoord)
			resetSquareColors(players[0])
			updateBoards(true)
		})
	})
}

function updateBoards(showShips) {
	updatePlayerBoard(player1, showShips);
	updatePlayerBoard(player2, showShips);
}

function startGame() {
	players.reverse()
	removeDraggable()
	removeAllHandlers(player1, player2) 
	updateBoards(false)
	addPlayerTurnListener(players[1])
}

function addPlayerTurnListener(player) {
	Array.from(player.domboard.children).forEach((square) => {
		// Only make non-used squares clickable
		const playerSquare = getSquareObj(square, player) 
		if (playerSquare.miss == false && playerSquare.hit == false) square.addEventListener('click', playerTurn)
	})
}

// console.log(players[0])

function playerTurn(e) {
	const squareToAttack = e.target.dataset.coordinate;

	if (players[0] instanceof Computer) {
		const attackCoord = players[0].sendAttack(players[1].gameboard)
		players[1].gameboard.receiveAttack(attackCoord)
	} else {
		players[1].gameboard.receiveAttack(squareToAttack);
	}
	updateBoards()
	removeListener(players[1], playerTurn)
	if (gameOver()) return
	switchPlayers()
	addPlayerTurnListener(players[1])
}

function switchPlayers() {
	alternateGridDisplay() 
	players.reverse()
}

function gameOver() {
	if (players[0].gameboard.allSunk()) {
		alert("Game Over!")
		return true
	}
}

function removeDraggable() {
	document.removeEventListener("dragstart", dragStart)
	document.removeEventListener("dragover", dragOver)
	document.removeEventListener("drop", drop)
}

// beginTurn()



