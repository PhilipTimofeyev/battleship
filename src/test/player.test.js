import { Human, Computer } from '../player';
import { Gameboard } from '../gameboard';
import { Ship } from '../ship';

let gameboard
let computer

beforeEach(() => {
  gameboard = new Gameboard;
  computer = new Computer;
});

test('Computer uses next biggest ship that is not sunk ', () => {
  const battleship = Ship.createShip('Battleship')
  const submarine = Ship.createShip('Submarine')

  battleship.sunk = true
  submarine.sunk = true

  gameboard.placeShip(battleship, 'A1', 'A2')
  gameboard.placeShip(submarine, 'B1', 'E2')

  const result = computer.determineShip(gameboard).name

  expect(result).toBe('Carrier')
});

test('Computer uses next biggest ship that is not sunk ', () => {
  const carrier = Ship.createShip('Carrier')
  const battleship = Ship.createShip('Battleship')
  const submarine = Ship.createShip('Submarine')

  carrier.sunk = true
  battleship.sunk = true
  submarine.sunk = true

  gameboard.placeShip(battleship, 'A1', 'A2')
  gameboard.placeShip(submarine, 'B1', 'E2')
  gameboard.placeShip(carrier, 'E4', 'E5')

  const result = computer.determineShip(gameboard).name

  expect(result).toBe('Destroyer')
});





