

export function getSquareDom(coord, player) {
	return player.domboard.querySelector(`[data-coordinate=${coord}]`)
}

export function getSquareObj(square, player) {
	return player.gameboard.board[square.dataset.coordinate]
}

export function removeListener(player, listenerFunc) {
	player.domboard.childNodes.forEach((square) => square.removeEventListener('click', listenerFunc))
}

export function removeAllHandlers(player1, player2) {
	player1.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
	player2.domboard.childNodes.forEach((square) => square.replaceWith(square.cloneNode(true)))
}

export function removeDraggable() {
	document.removeEventListener("dragstart", dragStart)
	document.removeEventListener("dragover", dragOver)
	document.removeEventListener("drop", drop)
}