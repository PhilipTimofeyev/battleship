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
	gameboard.placeShip("B3", "D3", ship)

	expect(gameboard.B3).toBe(ship)
});

