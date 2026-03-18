/* ./js/shiftNotes */
/* IMPORTS: */
import { saveData } from "./storage.js";
import { checkins, checkouts, reservations } from "./guests.js"
/* shiftNotes es un arreglo que contiene notas para el siguiente turno de recepcionista*/
let shiftNotes = [];

function addShiftNote(){

const text = document.getElementById("shiftNoteText").value;

if(!text) return;

shiftNotes.push(text);

document.getElementById("shiftNoteText").value="";

renderShiftNotes();

saveData();
}
function editShiftNote(index){
 const newText = prompt("Editar nota: ", shiftNotes[index]);
 if(newText === null) return;
	
 shiftNotes[index] = newText;
	
 saveData();
 renderShiftNotes();
}
//COPIAR REPORTES:
function copyShiftReport(){
let text = "INFORME RECEPCIÓN\n\n";
/* INGRESOS */
text += "INGRESOS:\n";
if(checkins.length === 0){
text += "NO HUBO\n";
}else{
checkins.forEach((c,i)=>{
let line = `${i+1}) Habitación ${c.room} | ${c.name} | Número de personas: ${c.people}`;
if(c.done) line = `~${line}~`;
text += line + "\n";
});
text += `TOTAL INGRESOS: ${checkins.length}\n`;
}
text += "\n";
/* EGRESOS */
text += "EGRESOS:\n";
if(checkouts.length === 0){
text += "NO HUBO\n";
}else{
checkouts.forEach((c,i)=>{
let line = `${i+1}) Habitaciones: ${c.room} | ${c.name} | Número de personas: ${c.people}`;
if(c.done) line = `~${line}~`;
text += line + "\n";
});
text += `TOTAL EGRESOS: ${checkouts.length}\n`;
}
text += "\n";
/* RESERVAS */
text += "RESERVAS:\n";
if(reservations.length === 0){
text += "NO HUBO\n";
}else{
reservations.forEach((r,i)=>{
let line = `${i+1}) Reserva #${r.number} | ${r.name || "Sin nombre"} | Habitación ${r.room} | Número de personas: ${r.people}`;
if (r.done) line = `~${line}~` ;
text += line + "\n";
});
text += `TOTAL RESERVAS: ${reservations.length}\n`;
}
text += "\n";
/* NOTAS DE TURNO */
text += "NOTAS PARA EL SIGUIENTE TURNO:\n";
if(shiftNotes.length === 0){
text += "NINGUNA\n";
}else{
shiftNotes.forEach((n,i)=>{
text += `${i+1}) ${n}\n`;
});
}
navigator.clipboard.writeText(text);
alert("Informe copiado");
}
function renderShiftNotes(){

const list = document.getElementById("shiftNoteList");

list.innerHTML="";

shiftNotes.forEach((n,i)=>{

const li = document.createElement("li");

li.textContent = n;
/* BOTON EDITAR*/
const editBtn = document.createElement("button");
editBtn.textContent = "✏";

editBtn.onclick = ()=>editShiftNote(i);
/* BOTON ELIMINAR*/
const delBtn = document.createElement("button");

delBtn.textContent = "🗑";

delBtn.onclick = ()=>{
const confirmDelete = confirm("¡¿Eliminar nota?!");
if(!confirmDelete) return;
shiftNotes.splice(i,1);

renderShiftNotes();

saveData();

};
li.appendChild(editBtn);

li.appendChild(delBtn);

list.appendChild(li);

});

}

window.addShiftNote = addShiftNote;
window.copyShiftReport = copyShiftReport;

export {
    shiftNotes,
    copyShiftReport,
    renderShiftNotes,
    addShiftNote,
    editShiftNote
};
