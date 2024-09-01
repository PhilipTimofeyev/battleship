import { Human, Computer } from '../player';
import { Gameboard } from '../gameboard';
import { Ship } from '../ship';

let gameboard
let computer
let carrier
let battleship
let submarine

beforeEach(() => {
  gameboard = new Gameboard;
  computer = new Computer;

  carrier = Ship.createShip('Carrier')
  battleship = Ship.createShip('Battleship')
  submarine = Ship.createShip('Submarine')
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

  carrier.sunk = true
  battleship.sunk = true
  submarine.sunk = true

  gameboard.placeShip(battleship, 'A1', 'A2')
  gameboard.placeShip(submarine, 'B1', 'E2')
  gameboard.placeShip(carrier, 'E4', 'E5')

  const result = computer.determineShip(gameboard).name

  expect(result).toBe('Destroyer')
});

test('Returns correct ships that are sunk', () => {

  carrier.sunk = true
  battleship.sunk = true
  submarine.sunk = true

  gameboard.placeShip(battleship, 'A1', 'A2')
  gameboard.placeShip(submarine, 'B1', 'D1')
  gameboard.placeShip(carrier, 'E4', 'E5')

  const result = computer.shipsSunk(gameboard)

  expect(result).toEqual(['Battleship', 'Submarine', 'Carrier'])
});





