
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

export class Carrier extends Ship {
	constructor() {
		super(5)
	}
}

export class Battleship extends Ship {
	constructor() {
		super(4)
	}
}

export class Destroyer extends Ship {
	constructor() {
		super(3)
	}
}

export class Submarine extends Ship {
	constructor() {
		super(3)
	}
}

export class Patrol extends Ship {
	constructor() {
		super(2)
	}
}