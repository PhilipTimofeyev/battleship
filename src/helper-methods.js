

export function getSquareDom(coord, player) {
	return player.domboard.querySelector(`[data-coordinate=${coord}]`)
}

export function getSquareObj(square, player) {
	return player.gameboard.board[square.dataset.coordinate]
}

export function removeAllHandlers(player) {
	player.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
	// player2.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
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