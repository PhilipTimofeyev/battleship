import { Gameboard } from '../gameboard';
import { Ship } from '../ship';
import { Destroyer } from '../ship';
import { Carrier } from '../ship';

let gameboard

beforeEach(() => {
  gameboard = new Gameboard;
});

test('creates board with 100 squares', () => {
	const squares = Object.keys(gameboard.squares)
  expect(squares.length).toBe(100);
});

test('places ship basic', () => {
	const ship = new Destroyer
	gameboard.placeShip(ship, "A1", "A2")

	expect(gameboard.squares.A3).toBe(ship)
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

	expect(gameboard.squares.D1).toBe("X")
});