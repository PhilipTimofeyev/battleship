import { Player } from './player';

const player1 = new Player
const player2 = new Player

// DOM Elements
const boardContainer = document.querySelector(".board")

// Create Board

function addSquare(name) {
  // create a new div element
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode(name);
  newDiv.classList.add('square')

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  // const currentDiv = document.getElementById("div1");
  boardContainer.appendChild(newContent);
}


Object.entries(player1.gameboard.board).forEach(([k, v]) => {
	addSquare(k)
})

// addElement()