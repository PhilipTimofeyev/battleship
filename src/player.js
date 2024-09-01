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
		const hitSquare = ([coord, square]) => square.hit && square.ship && !square.ship.sunk
		const coord = (square) => square[0]
		const hitSquares = Object.entries(opponentBoard.board).filter(hitSquare).map(coord)

		return hitSquares
	}

	determineDirection(opponentBoard, hitSquares, ship) {
		let bestOption = [1, 2, 3, 4, 5]

		// const containsCoord = (coord) => 
	// console.log(`hit squares ${hitSquares}`)
		// console.log(hitSquares)
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

	hitRandomSquare(opponentBoard) {
		const validSquares = Object.entries(opponentBoard.board).filter(([coord, square]) => {
			return !square.miss && !square.hit
		})

		return getRandomArrElement(validSquares)[0]
	}

	bestSquares(opponentBoard, hitSquares, coord, ship, lineFunction) {
		let workingArr = [[1, 2, 3, 4, 5]]

		let rightLine = opponentBoard.getRightSquares(ship, coord, true)
		let leftLine = opponentBoard.getLeftSquares(ship, coord, true)
		let topLine = opponentBoard.getUpSquares(ship, coord, true)
		let bottomLine = opponentBoard.getDownSquares(ship, coord, true)

		// console.log(topLine)
		// console.log(coord)
		rightLine = rightLine.filter((coord) => !opponentBoard.board[coord].miss && !opponentBoard.board[coord].sunk )
		leftLine = leftLine.filter((coord) => !opponentBoard.board[coord].miss && !opponentBoard.board[coord].sunk)
		topLine = topLine.filter((coord) => !opponentBoard.board[coord].miss)
		bottomLine = bottomLine.filter((coord) => !opponentBoard.board[coord].miss)

		// console.log(rightLine)

		this.checkLine(rightLine, workingArr, hitSquares, opponentBoard)
		this.checkLine(leftLine, workingArr, hitSquares, opponentBoard)
		this.checkLine(topLine, workingArr, hitSquares, opponentBoard)
		this.checkLine(bottomLine, workingArr, hitSquares, opponentBoard)

		// console.log(`working array${workingArr}`)
		// this.checkLine(bottomLine, workingArr, hitSquares)

		// rightLine.forEach((square) => {
		// 	if (!hitSquares.includes(square)) workingArr.push(square)	
		// })

		// console.log(workingArr)

		return workingArr
	}

	checkLine(line, workingArr, hitSquares, opponentBoard) {
		let hmm = []
		line.forEach((square) => {
			// console.log(!!opponentBoard.board[square])
			// console.log(square)
			// if (!!opponentBoard.board[square]) {
			// 	// if (opponentBoard.board[square].miss && !hitSquares.includes(square)) {
			// 	// 	hmm.push(square)	
			// 	// }
			// }
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
			// console.log(`hmm ${hmm}`)
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