import { Player, Human, Computer } from './player';
import { setUpBoard, updatePlayerBoard, resetSquareColors } from './gameboard-dom';
import { addNewShipSet, checkAllShipsUsed } from './ship-dom';
import { Ship } from './ship';
import { getSquareDom, getSquareObj, removeListener, removeAllHandlers, removeAllChildren } from './helper-methods';

// Players

let player1
let player2

let players


// DOM Elements

const boardsDiv = document.querySelector('.boards')
const playerOneShips = document.querySelector('#player-one-ships')
let playerTwoShips = document.querySelector('#player-two-ships')

// Buttons
const pvpBtn = document.querySelector('#pvp')
const pvcBtn = document.querySelector('#pvc')
const startBtn = document.querySelector('#start-game')
const player1ReadyBtn = document.querySelector('#player1-ready')
const compReadyBtn = document.querySelector('#comp-ready')
const passBtn = document.querySelector('#pass')

// Containers
const player1Container = document.querySelector('#player1Container')
const player2Container = document.querySelector('#player2Container')

// Gameplay
		
startBtn.addEventListener('click', startGame)
player1ReadyBtn.addEventListener('click', prepPlayerTwo)
passBtn.addEventListener('click', passPlayer)
compReadyBtn.addEventListener('click', startGame)
pvcBtn.addEventListener('click', pvcStart)
pvpBtn.addEventListener('click', pvpStart)

function pvpStart() {
	player1 = new Human
	player2 = new Human
	
	initialSetup()
	
	player1Container.style.display = 'block'
	player1ReadyBtn.style.display = 'block'
}

function prepPlayerTwo() {
	if (!checkAllShipsUsed(playerOneShips)) return
	startBtn.style.display = "block"
	addNewShipSet(playerTwoShips)
	removeAllHandlers(player1, player2) 
	switchPlayers()
	player1ReadyBtn.style.display = 'none'
}

function pvcStart() {
	player1 = new Human
	player2 = new Computer
	
	initialSetup()
	player2.opponentBoard = player1.gameboard
	player2.placeAllShips()

	player1Container.style.display = 'block'
	player2Container.style.display = 'block'
	compReadyBtn.style.display = 'block'
}

function initialSetup() {
	player1.domboard = document.querySelector(".player1")
	player2.domboard = document.querySelector(".player2")
	removeAllHandlers(player1, player2) 
	addDraggable()
	removeAllChildren(player1.domboard)
	removeAllChildren(player2.domboard)
	setUpBoard(player1, player1.domboard)
	setUpBoard(player2, player2.domboard)
	playerOneShips.style.display = 'flex'

	pvpBtn.style.display = "none"
	pvcBtn.style.display = "none"

	players = [player1, player2]

	updateBoards(false)
}

function startGame() {
	if (!checkAllShipsUsed(playerOneShips)) return
	if (!checkAllShipsUsed(playerTwoShips)) return
	compReadyBtn.style.display = 'none'
	if (player2 instanceof Human) players.reverse()
	removeDraggable()
	removeAllHandlers(player1, player2) 
	updateBoards(false)
	addPlayerTurnListener(players[1], turnType())
	startBtn.style.display = 'none'
}

function addPlayerTurnListener(player, turnType) {
	Array.from(player.domboard.children).forEach((square) => {
		// Only make non-used squares clickable
		const playerSquare = getSquareObj(square, player) 
		if (playerSquare.miss == false && playerSquare.hit == false) square.addEventListener('click', turnType)
	})
}

function turnType() {
	return player2 instanceof Computer ? pvcTurn : pvpTurn
}

function pvcTurn(e) {
	const squareToAttack = e.target.dataset.coordinate;
	player2.gameboard.receiveAttack(squareToAttack)

	const attackCoord = player2.sendAttack(player1.gameboard)
	player1.gameboard.receiveAttack(attackCoord)

	updateBoards()
	gameOver()
}

function pvpTurn(e) {
	const squareToAttack = e.target.dataset.coordinate;
	players[1].gameboard.receiveAttack(squareToAttack)
	updateBoards()
	removeListener(players[1], pvpTurn)
	if (gameOver()) return
	passBtn.style.dispay = 'block'
}

function passPlayer() {
	switchPlayers()
	addPlayerTurnListener(players[1], pvpTurn)
	passBtn.style.visibility = 'hidden'
}

function gameOver() {
	if (players[0].gameboard.allSunk() || players[1].gameboard.allSunk() ) {
		alert("Game Over!")
		showAllBoards()
		pvpBtn.style.display = "block"
		pvcBtn.style.display = "block"
		return true
	}
}

function alternateBoardDisplay() {
	let currentPlayerGrid = player1Container.style.display

	if (currentPlayerGrid == 'none') {
		player1Container.style.display = 'block';
		player2Container.style.display = 'none'
	} else {
		player1Container.style.display = 'none';
		player2Container.style.display = 'block'
	}
}

// Drag and Drop

let draggedShip = null;
let draggedShipElement = null;

document.addEventListener("dragstart", dragStart);
document.addEventListener("dragover", dragOver);
document.addEventListener("drop", drop);

// Drag Start

function dragStart(event) {
 	const shipType = event.target.id
	
	// Captures Ship element for future use
 	draggedShipElement = event.target
 	draggedShip = Ship.createShip(shipType)

 	// Removes the ship objects from the player's gameboard so there are no duplicates
	players[0].gameboard.removeShips(shipType)
}

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
	updatePlayerBoard(player2, false);
}

function switchPlayers() {
	alternateBoardDisplay() 
	players.reverse()
}

function showAllBoards() {
	player1Container.style.display = 'grid'
	player2Container.style.display = 'grid'
}

function removeDraggable() {
	document.removeEventListener("dragstart", dragStart)
	document.removeEventListener("dragover", dragOver)
	document.removeEventListener("drop", drop)
}

function addDraggable() {
	document.addEventListener("dragstart", dragStart)
	document.addEventListener("dragover", dragOver)
	document.addEventListener("drop", drop)
}
