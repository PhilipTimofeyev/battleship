

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
}

