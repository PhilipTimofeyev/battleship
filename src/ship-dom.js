
const shipsDiv = document.querySelector('.ships')

// Ship Elements

const carrier = document.querySelector("#Carrier")
const battleship = document.querySelector("#Battleship")
const destroyer = document.querySelector("#Destroyer")
const patrol = document.querySelector("#Patrol")
const submarine = document.querySelector("#Submarine")

// Ship Functions

export function cloneShip(ship) {
	switch(ship) {
	case "Carrier": return carrier.cloneNode(true);
	case "Battleship": return battleship.cloneNode(true);
	case "Destroyer": return destroyer.cloneNode(true);
	case "Patrol": return patrol.cloneNode(true);
	case "Submarine": return submarine.cloneNode(true);
	}
}

export function addNewShipSet() {
	const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Patrol', 'Submarine']
	shipNames.forEach((ship) => shipsDiv.appendChild(cloneShip(ship)))
}

export function showShips(player) {
	Object.entries(player.gameboard.board).forEach(([coord, square]) => {
		displaySquare(coord, square, player)
	})
}

// Helper Methods

function displaySquare(coord, square, player) {
	const squareElement = getDomSquare(coord, player)
	if (square.ship){
		const shipClone = cloneShip(square.ship.name)
		removeAllChildren(squareElement)
		squareElement.appendChild(shipClone) 
	} else {
		squareElement.innerText = ""
	}
}

function getDomSquare(coord, player) {
	return player.domboard.querySelector(`[data-coordinate=${coord}]`)
}

function removeAllChildren(element) {
	while (element.firstChild) {element.removeChild(element.lastChild);}
}




