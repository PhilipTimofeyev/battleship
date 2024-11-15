import { Ship } from './ship';
import { Square } from './square';


 export class Gameboard {

	constructor() {
		this.board = this.createSquares()
	}

	createSquares() {
		const letters = 'ABCDEFGHIJ'
		let board = {}

		letters.split("").forEach((letter) =>{
			for (let i = 1; i < 11; i++) {
				board[`${letter}${i}`] = new Square
			}
		})
		return board
	}

	allSunk() {
		const squaresWithShips = Object.values(this.board).filter((square) => (square.ship))

		const isSunk = (square) => square.ship.sunk
		return squaresWithShips.every(isSunk)
	}

	 placeShip(ship, initalSquare, nextSquare) {
		if (initalSquare === nextSquare) return

		const leftSquares = this.getLeftSquares(ship, initalSquare)
		const rightSquares = this.getRightSquares(ship, initalSquare)
		const upSquares = this.getUpSquares(ship, initalSquare)
		const downSquares = this.getDownSquares(ship, initalSquare)

		const options = [leftSquares, rightSquares, upSquares, downSquares]

		// Only show squares that contain the initial square and next square.
		const result = options.filter((squares) => {return squares.includes(nextSquare)}).flat()

		if (result.length === 0) return null

		result.forEach((square) => {
			this.board[square].ship = ship
		})
	}

	receiveAttack(coord) {
		const ship = this.board[coord].ship
		if (ship instanceof Ship) {
			ship.hit();
			this.board[coord].hit = true
		} else {
			this.board[coord].miss = true
		}
	}

	 showValidSquares(ship, coordStart) {
		let allSquares = []

		allSquares.push(this.getRightSquares(ship, coordStart))
		allSquares.push(this.getLeftSquares(ship, coordStart))
		allSquares.push(this.getUpSquares(ship, coordStart))
		allSquares.push(this.getDownSquares(ship, coordStart))

		// Remove duplicates and falsy
		const result = [...new Set(allSquares.flat().filter(Boolean))]
		return result
	}

	 getRightSquares(ship, coordStart, computer) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = coordStart.length == 2 ? parseInt(coordStart[1]) : 10

		for (let i = startNum; i < startNum + ship.length ; i++) {
			activeSquares.push(`${startLet}${i}`)
		}

		if (computer && this.validateSize(activeSquares)) return activeSquares

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getLeftSquares(ship, coordStart, computer) {
		let activeSquares = []
		let startLet = coordStart[0]
		let startNum = coordStart.length == 2 ? parseInt(coordStart[1]) + 1 : 11

		for (let i = startNum - ship.length; i < startNum ; i++) {
			activeSquares.push(`${startLet}${i}`)
		}

		if (computer && this.validateSize(activeSquares)) return activeSquares

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getUpSquares(ship, coordStart, computer) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = coordStart.length == 2 ? coordStart[1] : 10

		for (let i = 1; i <= ship.length ; i++) {
			activeSquares.push(`${startLet}${startNum}`)
			startLet = this.incrementChar(startLet)
		}

		if (computer && this.validateSize(activeSquares)) return activeSquares

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getDownSquares(ship, coordStart, computer) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = coordStart.length == 2 ? coordStart[1] : 10

		for (let i = 1; i <= ship.length ; i++) {
			activeSquares.push(`${startLet}${startNum}`)
			startLet = this.decrementChar(startLet)
		}

		if (computer && this.validateSize(activeSquares)) return activeSquares

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 incrementChar(char) {
		const charNum = char.charCodeAt(0)
		const nextChar = String.fromCharCode(charNum + 1)
		return nextChar
	}

	 decrementChar(char) {
		const charNum = char.charCodeAt(0)
		const previousChar = String.fromCharCode(charNum - 1)
		return previousChar
	}

	 validateSize(squares) {
		// matches only A-J and 1 digit, or A-J and 10
		const regex = /^[A-J][1-9]$|^[A-J]1[0]$/

		const withinBounds = (square) => !!square.match(regex)

		return squares.every(withinBounds)
	}

	checkIfEmptySquares(squares) {
		const  ifEmpty = (square) => this.board[square] != null && 
								this.board[square].ship == null && 
								this.board[square].miss == false
		
		return squares.every(ifEmpty)
	}

	removeShips(name) {

		const squareWithShip = (square) => !!square.ship

		Object.values(this.board).filter(squareWithShip).forEach((square) => {
			if (square.ship.name === name) square.ship = null
		})
	}
}


