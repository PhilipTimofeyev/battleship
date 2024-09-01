import { Gameboard } from '../gameboard';
import { Destroyer } from '../ship';
import { Carrier } from '../ship';

let gameboard

beforeEach(() => {
  gameboard = new Gameboard;
});

test('creates board with 100 squares', () => {
	const squares = Object.keys(gameboard.board)
  expect(squares.length).toBe(100);
});

test('places ship basic', () => {
	const ship = new Destroyer
	gameboard.placeShip(ship, "A1", "A2")

	expect(gameboard.board.A3.ship).toBe(ship)
});

test('places ship out of bounds', () => {
	const ship = new Destroyer

	expect(gameboard.placeShip(ship, "A1", "A6")).toBeNull()
});

test('places ship on rule breaking squares', () => {
	const ship = new Destroyer

	expect(gameboard.placeShip(ship, "C1", "D6")).toBeNull()
});

test('different ship out of bounds', () => {
	const ship = new Carrier

	expect(gameboard.placeShip(ship, "C4", "C1")).toBeNull()
});

test('cannot place ship on used square', () => {
	const ship1 = new Carrier
	const ship2 = new Destroyer

	gameboard.placeShip(ship1, "A1", "A4")

	expect(gameboard.placeShip(ship2, "A1", "C2")).toBeNull()
});

test('receiving attack', () => {
	const ship = new Carrier

	gameboard.placeShip(ship, "A1", "A4")

	gameboard.receiveAttack("A2")

	expect(ship.hits).toBe(1)
});

test('receiving multiple attacks', () => {
	const ship = new Carrier

	gameboard.placeShip(ship, "A1", "C1")

	gameboard.receiveAttack("D1")
	gameboard.receiveAttack("A1")
	gameboard.receiveAttack("B1")

	expect(ship.hits).toBe(3)
});

test('missed attack marks board', () => {
	gameboard.receiveAttack("D1")

	expect(gameboard.board.D1.miss).toBe(true)
});

test('allSunk returns false when all ships not sunk', () => {
	const ship1 = new Carrier
	const ship2 = new Destroyer

	gameboard.placeShip(ship1, "A1", "C1")
	gameboard.placeShip(ship2, "C2", "E2")

	expect(gameboard.allSunk()).toBe(false)
});

test('allSunk returns false when not all ships not sunk', () => {
	const ship1 = new Carrier
	const ship2 = new Destroyer

	ship1.sunk = true

	gameboard.placeShip(ship1, "A1", "C1")
	gameboard.placeShip(ship2, "C2", "E2")

	expect(gameboard.allSunk()).toBe(false)
});

test('allSunk returns true when all ships sunk', () => {
	const ship1 = new Carrier
	const ship2 = new Destroyer

	ship1.sunk = true
	ship2.sunk = true

	gameboard.placeShip(ship1, "A1", "C1")
	gameboard.placeShip(ship2, "C2", "E2")

	expect(gameboard.allSunk()).toBe(true)
});

test('returns valid squares', () => {
	const ship = new Destroyer
	const result = gameboard.showValidSquares(ship, "A1")

	expect(result).toEqual(['A1', 'A2', 'A3', 'B1', 'C1'])
});

test('returns valid squares right corner', () => {
	const ship = new Destroyer
});






