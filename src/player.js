import { Gameboard } from './gameboard';
import { Ship } from './ship';

export class Player {
	constructor() {
		this.gameboard = new Gameboard
		this.domboard = null
	}
}


export class Human extends Player {

}

export class Computer extends Player {


	placeAllShips() {
		const ship = Ship.createShip('Battleship')

		this.placeShip(ship)
	}

	placeShip(ship) {
		const firstCoord = this.selectRandomFirstSquare()
		const secondCoord = this.selectRandomSecondSquare(firstCoord, ship)

		this.gameboard.placeShip(ship, firstCoord, secondCoord)

		console.log(this.gameboard.board)
	}



	selectRandomFirstSquare() {
		const emptySquare = ([key, square]) => !square.ship
		const emptySquares = Object.entries(this.gameboard.board).filter(emptySquare)

		const randSquare = this.getRandomArrElement(emptySquares)
		// Returns key which is coordinat
		return randSquare[0]
		// return "A1"
	}

	selectRandomSecondSquare(firstCoord, ship) {
		// const firstCoord = this.selectRandomFirstSquare()

		const removeFirstCoord = (square) => square != firstCoord
		const validSquares = this.gameboard.showValidSquares(ship, firstCoord).filter(removeFirstCoord)

		return this.getRandomArrElement(validSquares)
	}

	getRandomArrElement(array) {
		return array[Math.floor(Math.random() * array.length)]
	}


}