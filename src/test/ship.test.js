
import { Carrier } from '../ship';

let carrier

beforeEach(() => {
  carrier = new Carrier;
});

test('carrier length', () => {
  expect(carrier.length).toBe(5);
});

test('hit', () => {
	carrier.hit()
  expect(carrier.hits).toBe(1);
});

test('not sunk', () => {
	carrier.hit()
  expect(carrier.isSunk()).toBe(false);
});

test('sunk', () => {
	carrier.hit()
	carrier.hit()
	carrier.hit()
	carrier.hit()
	carrier.hit()
  expect(carrier.isSunk()).toBe(true);
});