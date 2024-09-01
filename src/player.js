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
		return this.getHitSquares(opponentBoard) 
	}

	shipsSunk(opponentBoard) {
		const sunkShip = (square) => square.ship && square.ship.sunk
		const shipName = (square) => square.ship.name
		
		const sunkShips =  Object.values(opponentBoard).filter(sunkShip).map(shipName)

		// Remove duplicates
		return [...new Set(sunkShips)]
	}

	getHitSquares(opponentBoard) {
		const hitSquare = ([coord, square]) => square.hit && square.ship
		const coord = (square) => square[0]
		const hitSquares = Object.entries(opponentBoard).filter(hitSquare).map(coord)

		return hitSquares
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