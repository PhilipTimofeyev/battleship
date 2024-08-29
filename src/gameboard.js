import { Ship } from './ship';


export class Gameboard {

	constructor() {
		this.squares = this.createSquares()
	}

	createSquares() {
		const letters = 'ABCDEFGHIJ'
		let squares = {}

		letters.split("").forEach((letter) =>{
			for (let i = 1; i < 11; i++) {
				squares[`${letter}${i}`] = null
			}
		})
		return squares
	}

	 placeShip(ship, initalSquare, nextSquare) {
		if (initalSquare === nextSquare) return

		const leftSquares = this.getLeftSquares(ship, initalSquare)
		const rightSquares = this.getRightSquares(ship, initalSquare)
		const upSquares = this.getUpSquares(ship, initalSquare)
		const downSquares = this.getDownSquares(ship, initalSquare)

		const options = [leftSquares, rightSquares, upSquares, downSquares]

		// Only show squares that contain the initial square and next square.
		const result =  options.filter((squares) => {return squares.includes(nextSquare)}).flat()

		if (result.length === 0) return null

		result.forEach((square) => {
			this.squares[square] = ship
		})
	}

	receiveAttack(coord) {
		const squareObj = this.squares[coord]
		if (squareObj instanceof Ship) {
			squareObj.hit()
		}
	}

	 showValidSquares(ship, coordStart) {
		let allSquares = []

		allSquares.push(getRightSquares(ship, coordStart))
		allSquares.push(getLeftSquares(ship, coordStart))
		allSquares.push(getUpSquares(ship, coordStart))
		allSquares.push(getDownSquares(ship, coordStart))

		// Remove duplicates and falsy
		const result = [...new Set(allSquares.flat().filter(Boolean))]
		return result
	}

	 getRightSquares(ship, coordStart) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = parseInt(coordStart[1])

		for (let i = startNum; i < startNum + ship.length ; i++) {
			activeSquares.push(`${startLet}${i}`)
		}

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getLeftSquares(ship, coordStart) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = parseInt(coordStart[1]) + 1

		for (let i = startNum - ship.length; i < startNum ; i++) {
			activeSquares.push(`${startLet}${i}`)
		}

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getUpSquares(ship, coordStart) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = coordStart[1]

		for (let i = 1; i <= ship.length ; i++) {
			activeSquares.push(`${startLet}${startNum}`)
			startLet = this.incrementChar(startLet)
		}

		return this.validateSize(activeSquares) && this.checkIfEmptySquares(activeSquares) ? activeSquares : []
	}

	 getDownSquares(ship, coordStart) {
		let activeSquares = []

		let startLet = coordStart[0]
		let startNum = coordStart[1]

		for (let i = 1; i <= ship.length ; i++) {
			activeSquares.push(`${startLet}${startNum}`)
			startLet = this.decrementChar(startLet)
		}

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
		const regex = /^[A-Z][1-9]$|^[A-Z]1[0]$/

		const withinBounds = (square) => !!square.match(regex)

		return squares.every(withinBounds)
	}

	checkIfEmptySquares(squares) {
		const  ifEmpty = (square) => this.squares[square] == null
		return squares.every(ifEmpty)
	}
}

