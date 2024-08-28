
class Ship {
	constructor(length) {
		this.length = length
		this.hits = 0;
		this.sunk = false;
	}

	hit() {
		this.hits++
	}

	isSunk() {
		this.sunk = this.hits >= this.length
		return this.sunk
	}
}


class Carrier extends Ship {
	constructor() {
		super(5)
	}
}

function sums(a, b) {
  return a + b;
}

module.exports = sums;



// let hmm = new Carrier

// hmm.hit()
// hmm.hit()
// hmm.hit()
// hmm.hit()
// hmm.hit()

// console.log(hmm)
// console.log(hmm.isSunk())
// console.log(hmm)
