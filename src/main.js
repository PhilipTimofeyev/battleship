import { Player, Human, Computer } from './player';
import { setUpBoard, updatePlayerBoard, resetSquareColors } from './gameboard-dom';
import { addNewShipSet } from './ship-dom';
import { Ship } from './ship';
import { getSquareDom, getSquareObj, removeListener, removeAllHandlers } from './helper-methods';

// Players

const player1 = new Player
const player2 = new Computer(player1.gameboard)
let players = [player1, player2]

if (player2 instanceof Computer) player2.opponentBoard = player1.gameboard

// player2.opponentBoard = player1.gameboard
// console.log(player2.opponentBoard)
// console.log(player2.sendAttack())

// console.log(players[1].opponentboard)
// console.log(players[1].sendAttack())


const carrier2 = Ship.createShip('Carrier')
const battleship = Ship.createShip('Battleship')

// player1.gameboard.placeShip(battleship, 'A1', "A2")
// player1.gameboard.board.A3.hit = true
// const submarine = Ship.createShip('Submarine')

// const carrier2 = Ship.createShip('Carrier')

// console.log(player2.hitRandomSquare(player1.gameboard))

// carrier.hit()
// carrier.hit()

// battleship.hit()
// battleship.hit()
// battleship.hit()

// submarine.hit()
// console.log(player1.gameboard.getUpSquares(carrier, 'G3'))

// battleship.sunk = true

// carrier.sunk = true
// submarine.sunk = true

// player1.gameboard.placeShip(carrier, "A1", "A2")
// player1.gameboard.placeShip(submarine, "D3", "E3")
// player1.gameboard.placeShip(battleship, "B5", "B6")


player2.gameboard.placeShip(carrier2, "A1", "A2")

// // console.log(player2.determineShip(player1.gameboard))

// // player1.gameboard.placeShip(carrier, "I2", "J2")

// player1.gameboard.board.A1.hit = true
// player1.gameboard.board.A2.hit = true

// player1.gameboard.board.D3.hit = true
// // player1.gameboard.board.A2.hit = true
// // player1.gameboard.board.A1.hit = true

// player1.gameboard.board.B5.hit = true
// player1.gameboard.board.B6.hit = true
// player1.gameboard.board.B7.hit = true
// // player1.gameboard.board.B7.hit = true

// // player1.gameboard.board.E3.hit = true
// // player1.gameboard.board.D3.hit = true
// // player1.gameboard.board.F3.hit = true
// player1.gameboard.board.G3.hit = true

// player1.gameboard.board.E7.hit = true

// console.log(player2.sendAttack(player1.gameboard))


// DOM Elements

const boardsDiv = document.querySelector('.boards')

const startBtn = document.querySelector('#start-game')
const switchPlayerBtn = document.querySelector('#switch-player')

player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")


// Set up board
	
setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)

updateBoards(false)
// Button Listeners

startBtn.addEventListener('click', beginTurn)
switchPlayerBtn.addEventListener('click', function() {
	// players[0].domboard.style.display = "none"
	// players[1].domboard.style.display = "grid"
	addNewShipSet()
	// removePlayerTurnListener()
	removeAllHandlers(player1, player2) 
	players.reverse()
})


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

function beginTurn() {
	// players[0].domboard.style.display = "grid"
	// players[1].domboard.style.display = "grid"
	// players.reverse()
	removeDraggable()
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
	players.reverse()
	addPlayerTurnListener(players[1])
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



