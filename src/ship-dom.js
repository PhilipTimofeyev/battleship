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

export function addNewShipSet(playerShips) {
	while (playerShips.firstChild) {
		playerShips.removeChild(playerShips.lastChild);
	}
	const shipNames = ['Carrier', 'Battleship', 'Destroyer', 'Patrol', 'Submarine']
	shipNames.forEach((ship) => playerShips.appendChild(cloneShip(ship)))
}

export function checkAllShipsUsed(shipContainer) {
	if (shipContainer.children.length != 0) {
		alert("Please place all ships")
		return false
	}
	return true
}




