/* ./js/utils.js */
import { saveData } from "./storage.js";
function toggleDone(list, index, render){
	if(!list[index]) return;
	
	list[index].done = !list[index].done;
	render();
	saveData();
	}
	
function formatRoom(room) {
    if(!room || room === "0") return "";
    return `Habitación: *${room}*`;
}

/* HOUR FUNCTION: */
function fechaActual() {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();

    return `${dia}/${mes}/${anio}` ;
}

function horaActual() {
 const d = new Date();
 const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    
    return `${hora}:${min}` ;
 }

export {
	toggleDone,
    formatRoom,
    fechaActual,
    horaActual
};
