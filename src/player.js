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
		this.workingArr = 'LOL'
	}

// Attacking

	sendAttack(opponentBoard) {
		const hitSquares = this.getHitSquares(opponentBoard)
		const ship = this.determineShip(opponentBoard)

		const attackOptions = this.determineDirection(opponentBoard, hitSquares, ship) 
		// console.log(opponentBoard.board)
		// return attackOptions[0]

		const response = hitSquares.length == 0 ? this.hitRandomSquare(opponentBoard) : attackOptions[0]
		// console.log(attackOptions[0])
		console.log(this.hitRandomSquare(opponentBoard))
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

	hitRandomSquare(opponentBoard) {
		const validSquares = Object.entries(opponentBoard.board).filter(([coord, square]) => {
			return !square.miss && !square.hit
		})

		return getRandomArrElement(validSquares)[0]
	}

	determineDirection(hitSquares, ship) {
	 	this.bestOption = [1, 2, 3, 4, 5]

		hitSquares.forEach((coord) => {
			this.bestSquares(hitSquares, coord, ship)
		})

		return this.bestOption
	}

	bestSquares(hitSquares, coord, ship) {
		const bestLeft = this.bestLeftSquares(ship, coord, hitSquares) 
		const bestRight = this.bestRightSquares(ship, coord, hitSquares)
		const bestTop = this.bestTopSquares(ship, coord, hitSquares)
		const bestBottom = this.bestBottomSquares(ship, coord, hitSquares) 

		// Iterates through each line updating bestOption to whichever has the least amount of squares to fill out.
		const optionArrays = [bestLeft, bestRight, bestTop, bestBottom].forEach((option) => {
			if (0 < option.length && option.length < this.bestOption.length) this.bestOption = option
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
		let squaresNeeded = []
		line.forEach((square) => {
			if (!hitSquares.includes(square)) squaresNeeded.push(square)	
		})
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