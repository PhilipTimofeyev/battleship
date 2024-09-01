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
		const ship = this.determineShip(opponentBoard)

		const attackOptions = this.determineDirection(opponentBoard, hitSquares, ship) 
		opponentBoard.receiveAttack(attackOptions[0])
	}

	determineShip(opponentBoard) {
		const sunkShips = this.shipsSunk(opponentBoard)
		const ships = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol']

		const shipsLeft = ships.filter(x => !sunkShips.includes(x));

		return Ship.createShip(shipsLeft[0])
	}

	shipsSunk(opponentBoard) {
		const sunkShip = (square) => square.ship && square.ship.sunk
		const shipName = (square) => square.ship.name
		
		const sunkShips =  Object.values(opponentBoard.board).filter(sunkShip).map(shipName)

		// Remove duplicates
		return [...new Set(sunkShips)]
	}

	getHitSquares(opponentBoard) {
		const hitSquare = ([coord, square]) => square.hit && square.ship
		const coord = (square) => square[0]
		const hitSquares = Object.entries(opponentBoard.board).filter(hitSquare).map(coord)

		return hitSquares
	}

	determineDirection(opponentBoard, hitSquares, ship) {
		let bestOption = [1, 2, 3, 4, 5]

		// const containsCoord = (coord) => 

		hitSquares.forEach((coord) => {
			// let workingArr = []
			// const rightLine = opponentBoard.getRightSquares(ship, coord, true)
			// rightLine.forEach((square) => {
			// 	if (!hitSquares.includes(square)) workingArr.push(square)	
			// })

			let workingArr = this.bestSquares(opponentBoard, hitSquares, coord, ship)

			workingArr.forEach((option) => {
				if (option.length < bestOption.length) bestOption = option
			})

			// if (workingArr.length < bestOption.length) bestOption = workingArr

			// const leftLine = opponentBoard.getLeftSquares(ship, coord, true)
			// leftLine.forEach((square) => {
			// 	if (!hitSquares.includes(square)) workingArr.push(square)	
			// })

			// if (workingArr.length < bestOption.length) bestOption = workingArr
		})

		return bestOption
	}

	bestSquares(opponentBoard, hitSquares, coord, ship, lineFunction) {
		let workingArr = [[1, 2, 3, 4, 5]]

		const rightLine = opponentBoard.getRightSquares(ship, coord, true)
		const leftLine = opponentBoard.getLeftSquares(ship, coord, true)
		const topLine = opponentBoard.getUpSquares(ship, coord, true)
		const bottomLine = opponentBoard.getDownSquares(ship, coord, true)

		this.checkLine(rightLine, workingArr, hitSquares)
		this.checkLine(leftLine, workingArr, hitSquares)
		this.checkLine(topLine, workingArr, hitSquares)
		this.checkLine(bottomLine, workingArr, hitSquares)

		// console.log(workingArr)
		// this.checkLine(bottomLine, workingArr, hitSquares)

		// rightLine.forEach((square) => {
		// 	if (!hitSquares.includes(square)) workingArr.push(square)	
		// })

		// console.log(workingArr)

		return workingArr
	}

	checkLine(line, workingArr, hitSquares) {
		let hmm = []
		line.forEach((square) => {
			if (!hitSquares.includes(square)) hmm.push(square)	
		})

		// workingArr.push(hmm)
		// console.log(hmm.length)
		// console.log(hmm)
		// console.log(workingArr[0].length)
		// console.log(`working ${workingArr[0]}`)
		if (0 < hmm.length && hmm.length < workingArr[0].length) {
			workingArr.shift()
			workingArr.push(hmm)
		}
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