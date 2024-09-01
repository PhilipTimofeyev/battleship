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

  computer.opponentBoard = gameboard

  carrier = Ship.createShip('Carrier')
  battleship = Ship.createShip('Battleship')
  submarine = Ship.createShip('Submarine')
});

test('Computer uses next biggest ship that is not sunk ', () => {
  const battleship = Ship.createShip('Battleship')
  const submarine = Ship.createShip('Submarine')

  battleship.sunk = true
  submarine.sunk = true

  computer.opponentBoard .placeShip(battleship, 'A1', 'A2')
  computer.opponentBoard .placeShip(submarine, 'B1', 'E2')

  const result = computer.determineShip().name

  expect(result).toBe('Carrier')
});

test('Computer uses next biggest ship that is not sunk ', () => {

  carrier.sunk = true
  battleship.sunk = true
  submarine.sunk = true

  computer.opponentBoard .placeShip(battleship, 'A1', 'A2')
  computer.opponentBoard .placeShip(submarine, 'B1', 'E2')
  computer.opponentBoard .placeShip(carrier, 'E4', 'E5')

  const result = computer.determineShip().name

  expect(result).toBe('Destroyer')
});

test('Returns correct ships that are sunk', () => {

  carrier.sunk = true
  battleship.sunk = true
  submarine.sunk = true

  computer.opponentBoard .placeShip(battleship, 'A1', 'A2')
  computer.opponentBoard .placeShip(submarine, 'B1', 'D1')
  computer.opponentBoard .placeShip(carrier, 'E4', 'E5')

  const result = computer.shipsSunk()

  expect(result).toEqual(['Battleship', 'Submarine', 'Carrier'])
});

test('Returns correct hit squares', () => {

  computer.opponentBoard.placeShip(battleship, 'A1', 'A2')
  computer.opponentBoard.placeShip(submarine, 'B1', 'D1')
  computer.opponentBoard.placeShip(carrier, 'E4', 'E5')

  computer.opponentBoard.board.A1.hit = true
  computer.opponentBoard.board.E4.hit = true

  const result = computer.getHitSquares()

  expect(result).toEqual(['A1', 'E4'])
});

test('Returns correct hit squares when ship sunk', () => {

  computer.opponentBoard.placeShip(battleship, 'A1', 'A2')
  computer.opponentBoard.placeShip(submarine, 'B1', 'D1')
  computer.opponentBoard.placeShip(carrier, 'E4', 'E5')

  battleship.sunk = true

  computer.opponentBoard.board.A1.hit = true
  computer.opponentBoard.board.E4.hit = true

  const result = computer.getHitSquares()

  expect(result).toEqual(['E4'])
});

// test('Returns best squares simple', () => {
//   computer.opponentBoard.board["A6"].miss = true

//   computer.opponentBoard.board.A5.hit = true
//   computer.opponentBoard.board.A4.hit = true


//   console.log(computer.opponentBoard)

//   const result = computer.getBestSquares(['A5', 'A4', 'A9'], carrier)

//   expect(result).toEqual(['A1', 'A2', 'A3'])
// });

test('Returns best square when miss', () => {
  computer.opponentBoard.placeShip(carrier, 'A1', 'A2')
  // computer.opponentBoard.placeShip(submarine, 'B1', 'D1')
  // computer.opponentBoard.placeShip(carrier, 'E4', 'E5')

  computer.opponentBoard.board.A4.hit = true
  computer.opponentBoard.board.A5.hit = true
  computer.opponentBoard.board.A6.miss = true

  // console.log(computer.opponentBoard.board)

  const result = computer.sendAttack()

  expect(result).toEqual('A3')
});







