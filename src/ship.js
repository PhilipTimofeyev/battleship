
export class Ship {
	constructor(length) {
		this.length = length
		this.hits = 0;
		this.sunk = false;
	}

	hit() {
		this.hits++
		this.isSunk()
	}

	isSunk() {
		this.sunk = this.hits >= this.length
		return this.sunk
	}
}

export class Carrier extends Ship {
	constructor() {
		super(5)
		this.name = "Carrier"
	}
}

export class Battleship extends Ship {
	constructor() {
		super(4)
		this.name = "Battleship"
	}
}

export class Destroyer extends Ship {
	constructor() {
		super(3)
		this.name = "Destroyer"
	}
}

export class Submarine extends Ship {
	constructor() {
		super(3)
		this.name = "Submarine"
	}
}

export class Patrol extends Ship {
	constructor() {
		super(2)
		this.name = "Patrol"
	}
}