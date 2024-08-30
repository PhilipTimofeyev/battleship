import { Player } from './player';
import { setUpBoard, updatePlayerBoard } from './gameboard-dom';
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

const player1 = new Player
const player2 = new Player

let players = [player1, player2]

// DOM Elements
player1.domboard = document.querySelector(".player1")
player2.domboard = document.querySelector(".player2")


document.addEventListener("dragstart", function(event) {
    event.dataTransfer.setData("Text", event.target.id);
    // console.log(event.target.id)
});

/* Events fired on the drop target */
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});

document.addEventListener("drop", function(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    event.target.appendChild(document.getElementById(data));
    // document.getElementById("demo").innerHTML = "The p element was dropped";
});


// Set up board

setUpBoard(player1, player1.domboard)
setUpBoard(player2, player2.domboard)


// Update Board

function updateBoards() {
	updatePlayerBoard(player1);
	updatePlayerBoard(player2);
}

const carrier = new Carrier
const patrol = new Patrol

player1.gameboard.placeShip(patrol, "A1", "A2")
player2.gameboard.placeShip(carrier, "F1", "D1")

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

