import { Gameboard } from './gameboard';
import { Ship } from './ship';
import { getRandomArrElement } from './helper-methods';

export class Player {
	constructor(name) {
		this.gameboard = new Gameboard
		this.domboard = null
		this.name = name
	}
}

// Can modify if needed
export class Human extends Player {

}

export class Computer extends Player {

	constructor(name) {
		super(name)
		this.opponentBoard = null
	}

// Attacking

	sendAttack() {
		const hitSquares = this.getHitSquares()
		const ships = this.determineShips()

		const attackOptions = this.getBestSquares(hitSquares, ships) 

		const response = hitSquares.length == 0 ? this.hitRandomSquare() : attackOptions[0]
		return response

	}

	determineShips() {
		const sunkShips = this.shipsSunk(this.opponentBoard)
		const ships = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol']

		const shipsLeft = ships.filter(x => !sunkShips.includes(x));
		const shipsLeftArr = shipsLeft.map(ship => Ship.createShip(ship))

		return shipsLeftArr
	}

	shipsSunk() {
		const sunkShip = (square) => square.ship && square.ship.sunk
		const shipName = (square) => square.ship.name
		
		const sunkShips =  Object.values(this.opponentBoard.board).filter(sunkShip).map(shipName)

		// Remove duplicates
		return [...new Set(sunkShips)]
	}

	getHitSquares() {
		const hitSquare = ([coord, square]) => square.hit && square.ship && !square.ship.sunk
		const coord = (square) => square[0]
		const hitSquares = Object.entries(this.opponentBoard.board).filter(hitSquare).map(coord)

		return hitSquares
	}

	hitRandomSquare() {
		const validSquares = Object.entries(this.opponentBoard.board).filter(([coord, square]) => {
			return !square.miss && !square.hit
		})

		return getRandomArrElement(validSquares)[0]
	}

	// Finding best options Algo

	getBestSquares(hitSquares, ships) {
	 	this.bestOption = [1, 2, 3, 4, 5]
	 	this.greatestDiff = 0
		
	 	ships.forEach((ship) => {
	 		hitSquares.forEach((coord) => {
	 			this.bestSquares(hitSquares, coord, ship)
	 		})
	 	})

		return this.bestOption
	}

	bestSquares(hitSquares, coord, ship) {
		// Retrieves best options for every direction.
		const bestLeft = this.bestLeftSquares(ship, coord, hitSquares) 
		const bestRight = this.bestRightSquares(ship, coord, hitSquares)
		const bestTop = this.bestTopSquares(ship, coord, hitSquares)
		const bestBottom = this.bestBottomSquares(ship, coord, hitSquares) 

		// Iterates through each line updating bestOption to whichever has the least amount of squares to fill out.
		const optionArrays = [bestLeft, bestRight, bestTop, bestBottom].forEach((option) => {

			// Greatest difference determines the confidence of options. The greater the difference, but better (more confident).
			const difference = ship.length - option.length

			if (0 < option.length && 
					option.length < this.bestOption.length &&
					difference >= this.greatestDiff
					) {
							this.bestOption = option;
							this.greatestDiff = difference
						}
			})
	}

	// Functions to get best options for directional squares
	// Passes in true to prevent computer from cheating

	bestRightSquares(ship, coord, hitSquares) {
		let rightLine = this.opponentBoard.getRightSquares(ship, coord, true)
		return this.checkLine(rightLine, hitSquares)
	}

	bestLeftSquares(ship, coord, hitSquares) {
		let leftLine = this.opponentBoard.getLeftSquares(ship, coord, true)
		return this.checkLine(leftLine, hitSquares)
	}

	bestTopSquares(ship, coord, hitSquares) {
		let topLine = this.opponentBoard.getUpSquares(ship, coord, true)
		return this.checkLine(topLine, hitSquares)
	}

	bestBottomSquares(ship, coord, hitSquares) {
		let bottomLine = this.opponentBoard.getDownSquares(ship, coord, true)
		return this.checkLine(bottomLine, hitSquares)
	}

	// Checks the line against hit squares, returns squares needed to fill line

	checkLine(line, hitSquares) {
		let potentialSquares = []

		// If any of the squares in the line are miss squares, ignore the line.
		const miss = (square) => this.opponentBoard.board[square].miss || (this.opponentBoard.board[square].ship && this.opponentBoard.board[square].ship.sunk)
		if (line.some(miss)) return potentialSquares

		// Add whichever squares in the line that are not used(hit) to the potetial squares arr.
		line.forEach((square) => {
			if (!hitSquares.includes(square)) potentialSquares.push(square)	
		})

		return potentialSquares
	}

// Placing Ships

	placeAllShips() {
		const allShips = ['Carrier', 'Battleship', 'Destroyer', 'Patrol', 'Submarine']

		allShips.forEach((shipName) => this.placeShip(Ship.createShip(shipName)))
	}

	placeShip(ship) {
		const firstCoord = this.selectRandomFirstSquare()
		const secondCoord = this.selectRandomSecondSquare(firstCoord, ship)

		this.gameboard.placeShip(ship, firstCoord, secondCoord)
	}

	selectRandomFirstSquare() {
		const emptySquare = ([key, square]) => !square.ship
		const emptySquares = Object.entries(this.gameboard.board).filter(emptySquare)

		const randSquare = getRandomArrElement(emptySquares)

		// Returns key which is coordinate
		return randSquare[0]
	}

	selectRandomSecondSquare(firstCoord, ship) {
		const removeFirstCoord = (square) => square != firstCoord
		const validSquares = this.gameboard.showValidSquares(ship, firstCoord).filter(removeFirstCoord)

		return getRandomArrElement(validSquares)
	}


}