import { Gameboard } from './gameboard';
import { Ship } from './ship';
import { getRandomArrElement } from './helper-methods';

export class Player {
	constructor() {
		this.gameboard = new Gameboard
		this.domboard = null
		// this.opponentBoard = null
	}
}


export class Human extends Player {

}

export class Computer extends Player {

	constructor() {
		super()
		this.opponentBoard = null
	}

// Attacking

	sendAttack() {
	// 	this.opponentBoard = oppBoard
		const hitSquares = this.getHitSquares()
		const ship = this.determineShip()

		// console.log(this.opponentBoard)

		const attackOptions = this.getBestSquares(hitSquares, ship) 

		console.log(attackOptions)

		const response = hitSquares.length == 0 ? this.hitRandomSquare() : attackOptions[0]
		// console.log(response)
		return response

	}

	determineShip() {
		const sunkShips = this.shipsSunk(this.opponentBoard)
		const ships = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol']

		const shipsLeft = ships.filter(x => !sunkShips.includes(x));

		return Ship.createShip(shipsLeft[0])
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



	getBestSquares(hitSquares, ship) {
	 	this.bestOption = [1, 2, 3, 4, 5]
	 	this.greatestDiff = 0

	 	const ships = [Ship.createShip('Carrier'), Ship.createShip('Battleship'), Ship.createShip('Destroyer'), Ship.createShip('Submarine'), Ship.createShip('Patrol')]
		
	 	ships.forEach((ship) => {
	 		hitSquares.forEach((coord) => {
	 			this.bestSquares(hitSquares, coord, ship)
	 		})
	 	})

	 	// hitSquares.forEach((coord) => {
	 	// 	this.bestSquares(hitSquares, coord, Ship.createShip('Carrier'))
	 	// })
	 	// hitSquares.forEach((coord) => {
	 	// 	this.bestSquares(hitSquares, coord, Ship.createShip('Battleship'))
	 	// })
	 	// console.log(this.bestOption)
		return this.bestOption
	}

	bestSquares(hitSquares, coord, ship) {
		const bestLeft = this.bestLeftSquares(ship, coord, hitSquares) 
		const bestRight = this.bestRightSquares(ship, coord, hitSquares)
		const bestTop = this.bestTopSquares(ship, coord, hitSquares)
		const bestBottom = this.bestBottomSquares(ship, coord, hitSquares) 

		// Iterates through each line updating bestOption to whichever has the least amount of squares to fill out.
		const optionArrays = [bestLeft, bestRight, bestTop, bestBottom].forEach((option) => {
			console.log(`${ship.name}:${option}`)
			// console.log(this.greatestDiff)
			const difference = ship.length - option.length
			console.log(difference)
			if (0 < option.length && 
					option.length < this.bestOption.length &&
					this.greatestDiff <= difference
					) {
				this.bestOption = option;
				this.greatestDiff = difference
			}
		})

		// return bestLeft
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
		let squaresNeeded = []

		// console.log(line)

		const miss = (square) => this.opponentBoard.board[square].miss
		if (line.some(miss)) return squaresNeeded

		// const included = (square) => this.opponentBoard.board[square].miss
		// if (line.some(miss)) return squaresNeeded

		line.forEach((square) => {
			if (!hitSquares.includes(square)) squaresNeeded.push(square)	
		})
		// console.log(squaresNeeded)
		return squaresNeeded
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
		// const firstCoord = this.selectRandomFirstSquare()

		const removeFirstCoord = (square) => square != firstCoord
		const validSquares = this.gameboard.showValidSquares(ship, firstCoord).filter(removeFirstCoord)

		return getRandomArrElement(validSquares)
	}


}