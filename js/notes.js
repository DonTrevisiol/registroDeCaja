/* ./js/notes.js */
/* IMPORTS: */
import { horaActual, formatRoom } from "./utils.js";
import { saveData } from "./storage.js"
import { uiShowNotes } from "./ui.js"
/*notes es un arreglo que sirve para informar noticias que no tengan que ver con los mivimientos de caja */
let notes = [];


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
   document.getElementById("toggleNotesBtn").textContent = "OCULTAR";
   }
   saveData();
}
function copyNotes() {
    if(notes.length === 0) {
        alert("NO HAY NOTAS PARA COPIAR");
        return;
    }

    let textToCopy = "📝 BITÁCORA ESPECIAL:\n\n";

    notes.forEach(n => {
        let line = `${n.date} | ${n.text} | ${formatRoom(n.room)}`;

        if(n.done) {
            line = `~${line}~`;
        }

        textToCopy += line + "\n";
    });

    navigator.clipboard.writeText(textToCopy);

    alert("NOTAS COPIADAS AL PORTAPAPELES");
}
// EDITAR NOTA:
function editNote(index) {
    const newText = prompt("Editar texto:", notes[index].text);
    if (newText === null) return;

    const newRoom = prompt("Editar habitación:", notes[index].room);

    notes[index].text = newText;
    notes[index].room = newRoom;

    saveData();
    uiShowNotes();
}
let notesVisible = false;
function toggleNotes() {
    const ul = document.getElementById("notes");
    const btn = document.getElementById("toggleNotesBtn");

    if (!notesVisible) {
        uiShowNotes();
        btn.textContent = "OCULTAR";
        notesVisible = true;
    } else {
        ul.innerHTML = "";
        btn.textContent = "MOSTRAR";
        notesVisible = false;
    }
}

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
    deleteAllNotes,
    copyNotes,
    toggleNotes
}
