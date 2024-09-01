import { Gameboard } from './gameboard';
import { Ship } from './ship';
import { getRandomArrElement } from './helper-methods';

export class Player {
	constructor() {
		this.gameboard = new Gameboard
		this.domboard = null
	}
}


export class Human extends Player {

}

export class Computer extends Player {

// Attacking

	sendAttack(opponentBoard) {
		// return this.shipsSunk(opponentBoard)
		const hitSquares = this.getHitSquares(opponentBoard)

		return this.determineDirection(opponentBoard, hitSquares) 
	}

	shipsSunk(opponentBoard) {
		const sunkShip = (square) => square.ship && square.ship.sunk
		const shipName = (square) => square.ship.name
		
		const sunkShips =  Object.values(opponentBoard,board).filter(sunkShip).map(shipName)

		// Remove duplicates
		return [...new Set(sunkShips)]
	}

	getHitSquares(opponentBoard) {
		const hitSquare = ([coord, square]) => square.hit && square.ship
		const coord = (square) => square[0]
		const hitSquares = Object.entries(opponentBoard.board).filter(hitSquare).map(coord)

		return hitSquares
	}

	determineDirection(opponentBoard, hitSquares) {
		const ship = Ship.createShip('Carrier')

		let bestOption = [1, 2, 3, 4, 5]

		// const containsCoord = (coord) => 

		hitSquares.forEach((coord) => {
			let workingArr = []
			const rightLine = opponentBoard.getRightSquares(ship, coord, true)
			rightLine.forEach((square) => {
				if (!hitSquares.includes(square)) workingArr.push(square)	
			})

			if (workingArr.length < bestOption.length) bestOption = workingArr

			const leftLine = opponentBoard.getLeftSquares(ship, coord, true)
			leftLine.forEach((square) => {
				if (!hitSquares.includes(square)) workingArr.push(square)	
			})

			if (workingArr.length < bestOption.length) bestOption = workingArr
		})

		return bestOption
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