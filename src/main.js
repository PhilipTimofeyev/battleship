import { Human, Computer } from './player';
import { setUpBoard, updatePlayerBoard, resetSquareColors } from './gameboard-dom';
import { addNewShipSet, checkAllShipsUsed } from './ship-dom';
import { Ship } from './ship';
import { getSquareDom, getSquareObj, removeAllHandlers, removeAllChildren, alternatePlayerDisplay, playAudio } from './helper-methods';

// Players

let player1
let player2

let players

// DOM Elements

// const boardsDiv = document.querySelector('.boards')
let playerOneShips = document.querySelector('#player-one-ships')
let playerTwoShips = document.querySelector('#player-two-ships')
const announceBox = document.querySelector('#announceBox')

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
player1ReadyBtn.addEventListener('click', setUpPlayerTwo)
passBtn.addEventListener('click', passPlayer)
compReadyBtn.addEventListener('click', startGame)
pvcBtn.addEventListener('click', pvcStart)
pvpBtn.addEventListener('click', pvpStart)

// Player vs Player
function pvpStart() {
	player1 = new Human('Player 1')
	player2 = new Human('Player 2')
	
	initialSetup()
	
	player1ReadyBtn.style.display = 'block'
	compReadyBtn.style.display = 'none'

	announceBox.style.visibility = 'visible'
	announceBox.innerText = players[0].name
}

// Player vs Computer
function pvcStart() {
	player1 = new Human('Player')
	player2 = new Computer('Computer')

	initialSetup()

	player2.opponentBoard = player1.gameboard
	player2.placeAllShips()

	compReadyBtn.style.display = 'block'
	player1ReadyBtn.style.display = 'none'
	passBtn.style.display = 'none';

	announceBox.style.visibility = 'visib'
	announceBox.innerText = players[0].name
}

function initialSetup() {
	player1.domboard = document.querySelector(".player1")
	player2.domboard = document.querySelector(".player2")

	player1Container.style.display = 'block'
	player2Container.style.display = 'none'
	startBtn.style.display = "none"

	setUpPlayerOne()
	addDraggable()
	removeAllChildren(player1.domboard)
	removeAllChildren(player2.domboard)
	setUpBoard(player1, player1.domboard)
	setUpBoard(player2, player2.domboard)

	players = [player1, player2]

	//false passed to update boards without showing ships
	updateBoards(false)
}

function setUpPlayerOne() {
	addNewShipSet(playerOneShips)
	playerOneShips.style.display = 'flex'
}

function setUpPlayerTwo() {
	if (!checkAllShipsUsed(playerOneShips)) return
	switchPlayers()

	addNewShipSet(playerTwoShips)
	playerTwoShips.style.display = "flex"

	player1ReadyBtn.style.display = "none"
	startBtn.style.display = "block"
}

function startGame() {
	if (!checkAllShipsUsed(playerOneShips)) return
	if (!checkAllShipsUsed(playerTwoShips)) return
	if (player2 instanceof Human) {	
		players.reverse()
	} else {
		player2Container.style.display = 'block'
	}
	
	startGameDom()
	removeDraggable()
	updateBoards(false)
	addPlayerTurnListener(players[1], turnType())
	playAudio()
}

function startGameDom() {
	// hide ready/start buttons and ships
	compReadyBtn.style.display = 'none'
	startBtn.style.display = 'none'

	playerOneShips.style.display = 'none'
	playerTwoShips.style.display = 'none'

	// Display player 1 name
	announceBox.innerText = players[0].name
}

// Players' Turns

function pvpTurn(e) {
	// player attacks player
	const squareToAttack = e.target.dataset.coordinate;
	players[1].gameboard.receiveAttack(squareToAttack)

	passBtn.style.visibility = 'visible';
	passBtn.style.display = 'block';

	updateBoards()
	removeAllHandlers(players[1])
	gameOver()
}

function pvcTurn(e) {
	// players attacks computer
	const squareToAttack = e.target.dataset.coordinate;
	player2.gameboard.receiveAttack(squareToAttack)

	// computer attacks player
	const attackCoord = player2.sendAttack(player1.gameboard)
	player1.gameboard.receiveAttack(attackCoord)

	updateSquareListeners()
	updateBoards()
	gameOver()
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

function passPlayer() {
	switchPlayers()
	addPlayerTurnListener(players[1], pvpTurn)
}

function gameOver() {
	if (displayWinner()) {
		showAllBoards()
		pvpBtn.style.display = "block"
		pvcBtn.style.display = "block"
		passBtn.style.visibility = 'hidden';
		passBtn.style.display = 'none';
		removeAllHandlers(player1)
		removeAllHandlers(player2)
		return true
	}
}

function determineWinner() {
	if (players[0].gameboard.allSunk()) {
		return players[1].name
	} else if (players[1].gameboard.allSunk()) {
		return players[0].name
	}

	return false
}

function displayWinner() {
	const winner = determineWinner()
	if (!winner) return false

	announceBox.style.visibility = 'visible'
	announceBox.innerText = `${winner} wins!`

	return true
}

// Drag and Drop Ships

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

	// Only allow dropping ship on board
	if (!(event.toElement.className == 'square')) return

	const startCoord = event.target.dataset.coordinate
	addSecondCoordListeners(startCoord, draggedShip)
	event.target.appendChild(draggedShipElement);

	// Remove ability to drag other ships until selected ship is fully placed
	removeDraggable()
}

// Set up clickable squares for horizontal vs vertical ship placement
function addSecondCoordListeners(startCoord, ship) {
	const squares = players[0].gameboard.showValidSquares(ship, startCoord)

	squares.forEach((square) => {
		if (square === startCoord) return
		const squareEl = getSquareDom(square, players[0])
		squareEl.addEventListener('click', function(e) {

			// Once player selects the 2nd square, the board places the ships accordingly
			const endCoord = e.target.dataset.coordinate
			players[0].gameboard.placeShip(ship, startCoord, endCoord)
			resetSquareColors(players[0])
			player2 instanceof Human ? updateBoards(true) : updatePlayerBoard(player1, true)

			// Clears out event listeners on squares
			removeAllHandlers(player1) 
			removeAllHandlers(player2) 
			// Add ability to drag ships once player fully places ship
			addDraggable()
		})
	})
}

// Misc.

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

function updateSquareListeners() {
	const removeClick = (square) => square.removeEventListener('click', pvcTurn)
	const addClick = (square, playerSquare) => {if (playerSquare.miss == false && playerSquare.hit == false) square.addEventListener('click', pvcTurn);}
	
	Array.from(player2.domboard.children).forEach((square) => {
		const coord = square.dataset.coordinate
		const playerSquare = player2.gameboard.board[coord]
		removeClick(square);
		addClick(square, playerSquare)
	})
}

function updateBoards(showShips) {
	updatePlayerBoard(player1, showShips);
	updatePlayerBoard(player2, showShips);
}

function switchPlayers() {
	alternatePlayerDisplay(announceBox, players)
	alternateBoardDisplay() 
	players.reverse()
	passBtn.style.visibility = 'hidden'
}

function showAllBoards() {
	player1Container.style.display = 'grid'
	player2Container.style.display = 'grid'
	playerOneShips.style.display = 'none'
	playerTwoShips.style.display = 'none'
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
