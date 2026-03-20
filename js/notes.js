/* ./js/notes.js */
/* IMPORTS: */
import { horaActual, formatRoom } from "./utils.js";
import { saveData } from "./storage.js"
import { uiShowNotes } from "./ui.js"
import { notesVisible, toggleNotes } from "./uiVisibility.js"
/* VARIABLES */
/*notes es un arreglo que sirve para informar noticias que no tengan que ver con los mivimientos de caja */
let notes = [];

// FUNCIONES:
// FUNCION PARA CREAR NOTAS:
function addNote(text, room=0) {
 if(!text) {
  alert("EL TEXTO NO PUEDE ESTAR VACÍO")
  } else {
   notes.push({
   text,
   room,
   date: horaActual(),
   done: false
    });
   
   alert("NOTA AGREGADA SATISFACTORIAMENTE: ", room)
   if (!notesVisible) {
	 toggleNotes();  
	 } else {
		uiShowNotes(); 
		}
   }
   saveData();
}
// FUNCIÓN PARA COPIAR NOTAS:
function copyNotes() {
    if(notes.length === 0) {
        alert("NO HAY NOTAS PARA COPIAR");
        return;
    }

    let textToCopy = "📝 BITÁCORA ESPECIAL: 📝\n\n";

    notes.forEach(n => {
		let roomText = formatRoom(n.room)
        let line = `${n.date} | ${n.text}${roomText ? " | " + roomText : ""}`;

        if(n.done) {
            line = `~${line.trim()}~`;
        }

        textToCopy += line + "\n";
    });

    navigator.clipboard.writeText(textToCopy);

    alert("NOTAS COPIADAS AL PORTAPAPELES");
}
// FUNCION PARA EDITAR NOTA:
function editNote(index) {
    const newText = prompt("Editar texto:", notes[index].text);
    if (newText === null) return;

    const newRoom = prompt("Editar habitación:", notes[index].room);

    notes[index].text = newText;
    notes[index].room = newRoom;

    saveData();
    uiShowNotes();
}
//FUNCION PARA ELIMINAR UNA NOTA:
function deleteNote(index) {
	if(!confirm("¡¿ELIMINAR NOTA?!"))
	return;
	notes.splice(index, 1);
	
	saveData();
	uiShowNotes();
}
//FUNCION PARA ELIMINAR TODAS LAS NOTAS:
function deleteAllNotes(){
 if(notes.length === 0){
  alert("NO HAY NOTAS PARA ELIMINAR");
   return;
 }
 if(!confirm("¡¿Eliminar TODAS las notas?!")) return;
	
 notes = [];
 uiShowNotes();
 saveData();
 alert("TODAS LAS NOTAS FUERON ELIMINADAS SATISFACTORIAMENTE");
}

export {
    notes,
    addNote,
    editNote,
    deleteNote,
    deleteAllNotes,
    copyNotes,
    toggleNotes
}
