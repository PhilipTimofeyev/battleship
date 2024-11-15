

export function getSquareDom(coord, player) {
	return player.domboard.querySelector(`[data-coordinate=${coord}]`)
}

export function getSquareObj(square, player) {
	return player.gameboard.board[square.dataset.coordinate]
}

export function removeAllHandlers(player) {
	player.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
}

export function getRandomArrElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}

export function removeAllChildren(element) {
	while (element.firstChild) {element.removeChild(element.lastChild);}
}

export function selectRandomSecondSquare(firstCoord, ship) {
	console.log(this)
	const removeFirstCoord = (square) => square != firstCoord
	const validSquares = this.gameboard.showValidSquares(ship, firstCoord).filter(removeFirstCoord)

	return getRandomArrElement(validSquares)
}

export function alternatePlayerDisplay(announceBox, players) {
	if (announceBox.innerText === players[0].name) {
		announceBox.innerText = players[1].name
	} else {
		announceBox.innerText = players[0].name
	}
}

export function playAudio() {
	var music = document.getElementById("audio");
	music.play();
}