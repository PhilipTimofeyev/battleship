import { Carrier, Battleship, Destroyer, Submarine, Patrol } from './ship';

let dragged = null;
let draggedElement = null;

export function dragStart(event) {
 	event.dataTransfer.setData("Text", event.target.id);
 	const shipType = event.target.id
	 
 	draggedElement = event.target
 	dragged = createShip(shipType)
	players[0].gameboard.removeShips(shipType)
}

function createShip(name) {
	switch(name){  
		case 'Carrier': return new Carrier; 
		case 'Battleship': return new Battleship;
		case 'Destroyer': return new Destroyer; 
		case 'Patrol': return new Patrol;    
		case 'Submarine': return new Submarine;      
	}
}