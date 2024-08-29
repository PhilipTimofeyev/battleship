
import { Carrier, Battleship, Destroyer, Submarine, Patrol } from '../ship';

let carrier
let battleship
let destroyer
let submarine
let patrol

beforeEach(() => {
  carrier = new Carrier;
  battleship = new Battleship;
  destroyer = new Destroyer;
  submarine = new Submarine;
  patrol = new Patrol
});

test('carrier length', () => {
  expect(carrier.length).toBe(5);
});

test('carrier hit', () => {
	carrier.hit()
  expect(carrier.hits).toBe(1);
});

test('carrier not sunk', () => {
	carrier.hit()
  expect(carrier.isSunk()).toBe(false);
});

test('carrier sunk', () => {
	carrier.hit()
	carrier.hit()
	carrier.hit()
	carrier.hit()
	carrier.hit()
  expect(carrier.isSunk()).toBe(true);
});

test('battleship length', () => {
  expect(battleship.length).toBe(4);
});

test('battleship sunk', () => {
	battleship.hit()
	battleship.hit()
	battleship.hit()
	battleship.hit()
  expect(battleship.isSunk()).toBe(true);
});

test('destroyer length', () => {
  expect(destroyer.length).toBe(3);
});

test('destroyer sunk', () => {
	destroyer.hit()
	destroyer.hit()
	destroyer.hit()
  expect(destroyer.isSunk()).toBe(true);
});

test('submarine length', () => {
  expect(submarine.length).toBe(3);
});

test('submarine sunk', () => {
	submarine.hit()
	submarine.hit()
	submarine.hit()
  expect(submarine.isSunk()).toBe(true);
});

test('patrol length', () => {
  expect(patrol.length).toBe(2);
});

test('patrol sunk', () => {
	patrol.hit()
	patrol.hit()
  expect(patrol.isSunk()).toBe(true);
});

test('patrol sunk', () => {
	patrol.hit()
	patrol.hit()
  expect(patrol.sunk).toBe(true);
});