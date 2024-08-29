import { Gameboard } from '../gameboard';
import { Destroyer } from '../ship';

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
	gameboard.placeShip(ship, "A1", "A6")

	expect(gameboard.placeShip(ship, "A1", "A6")).toBeNull()
});

