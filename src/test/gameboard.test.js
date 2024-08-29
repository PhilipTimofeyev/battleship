import { Gameboard } from '../gameboard';

let gameboard

beforeEach(() => {
  gameboard = new Gameboard;
});

test('creates board with 100 squares', () => {
	const squares = Object.keys(gameboard.squares)
  expect(squares.length).toBe(100);
});