
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