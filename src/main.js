import { Player } from './player';

const player1 = new Player
const player2 = new Player

// DOM Elements
const boardContainer = document.querySelector(".board")

// Create Board

function addSquare(name) {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode(name);

  newDiv.classList.add('square')
  newDiv.appendChild(newContent);
  newDiv.dataset.coordinate = name
  boardContainer.appendChild(newDiv);
}


Object.entries(player1.gameboard.board).forEach(([k, v]) => {
	addSquare(k)
})
