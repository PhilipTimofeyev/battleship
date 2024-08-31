import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

const carrier = new Carrier
const patrol = new Patrol

let players = [player1, player2]

// DOM Elements
player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")

let dragged = null;

function createShip(name) {
	switch(name){  
		case 'Carrier': return new Carrier; 
		case 'Battleship': return new Battleship;      
	}
}

document.addEventListener("dragstart", function(event) {
  event.dataTransfer.setData("Text", event.target.id);
  const shipType = event.target.id
  
  dragged = createShip(shipType)
});

document.addEventListener("dragover", function(event) {
  event.preventDefault();
  if (!event.target.dataset.coordinate) return
  const coord = event.target.dataset.coordinate
  const squareEl = player1.domboard.querySelector(`[data-coordinate=${coord}]`)
  resetSquareColors()
  markValidSquares(dragged, coord)
});

// DROP

document.addEventListener("drop", function(event) {
    event.preventDefault();
    // resetSquareColors() 
    const startCoord = event.target.dataset.coordinate
    removeHandlers() 
    addListeners(startCoord, dragged)
    const data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
});

function markValidSquares(ship, coord) {
	const validSquares = player1.gameboard.showValidSquares(ship, coord)
	validSquares.forEach((square) => {
		const squareEl = player1.domboard.querySelector(`[data-coordinate=${square}]`)
		squareEl.setAttribute("style", "background-color: red;")
	})
}

function addListeners(startCoord, ship) {
	// console.log(startCoord)
	const squares = player1.gameboard.showValidSquares(ship, startCoord)

	// squares.forEach((square) => {
	// 	squares.addEventListener('click', function(e) {
	// 		console.log(e)
	// 	})
	// })

	squares.forEach((square) => {
		const squareEl = player1.domboard.querySelector(`[data-coordinate=${square}]`)
		squareEl.addEventListener('click', function(e) {
			const endCoord = e.target.dataset.coordinate
			player1.gameboard.placeShip(ship, startCoord, endCoord)
			console.log(player1.gameboard.board)
		})
	})
}


// Set up board
	
setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)

// Update Board

function updateBoards() {
	updatePlayerBoard(player1);
	updatePlayerBoard(player2);
}

function resetSquareColors() {
	Array.from(player1.domboard.children).forEach((square) => {
    square.setAttribute("style", "background-color: lightblue;")
	})
}


// player1.gameboard.placeShip(patrol, "A1", "A2")
// player2.gameboard.placeShip(carrier, "F1", "D1")

function beginTurn() {
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

beginTurn()
