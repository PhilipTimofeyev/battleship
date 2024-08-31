import { Player } from './player';
import { setUpBoard, updatePlayerBoard, showShips, cloneShip } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';


const carrier = document.querySelector("#Carrier")
const battleship = document.querySelector("#Battleship")
const destroyer = document.querySelector("#Destroyer")
const patrol = document.querySelector("#Patrol")
const submarine = document.querySelector("#Submarine")

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

function createShip(name) {
	switch(name){  
		case 'Carrier': return new Carrier; 
		case 'Battleship': return new Battleship;
		case 'Destroyer': return new Destroyer; 
		case 'Patrol': return new Patrol;    
		case 'Submarine': return new Submarine;      
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
  const squareEl = players[0].domboard.querySelector(`[data-coordinate=${coord}]`)
  resetSquareColors()
  markValidSquares(dragged, coord)
});

// DROP

document.addEventListener("drop", function(event) {
		const shipsDiv = document.querySelector('.ships')
    event.preventDefault();
    const startCoord = event.target.dataset.coordinate
    removeHandlers() 
    addListeners(startCoord, dragged)
    const data = event.dataTransfer.getData("Text");
    event.target.appendChild(shipsDiv.querySelector(`.${data}`));
});

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
			showShips(players[0])
		})
	})
	removeHandlers()
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
	Array.from(players[0].domboard.children).forEach((square) => {
    square.setAttribute("style", "background-color: lightblue;")
	})
}

function beginTurn() {
	// players[0].domboard.style.display = "grid"
	// players[1].domboard.style.display = "grid"
	// players.reverse()
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

function cloneShipElements() {
	const shipsDiv = document.querySelector('.ships')

	const carrierClone = carrier.cloneNode(true);
	const battleshipClone = battleship.cloneNode(true);
	const destroyerClone = destroyer.cloneNode(true);
	const patrolClone = patrol.cloneNode(true);
	const submarineClone = submarine.cloneNode(true);

	const clonedShips = [carrierClone, battleshipClone, destroyerClone, patrolClone, submarineClone]

	clonedShips.forEach((ship) => {
		shipsDiv.appendChild(ship)
	})
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

// updateBoards()

// player1.gameboard.placeShip(new Battleship, "A1", "A2")
// player2.gameboard.placeShip(new Carrier, "F1", "D1")

// beginTurn()
// console.log(player1.gameboard.board)

startBtn.addEventListener('click', beginTurn)
switchPlayerBtn.addEventListener('click', function() {
	// players[0].domboard.style.display = "none"
	// players[1].domboard.style.display = "grid"
	cloneShipElements()
	players.reverse()
})