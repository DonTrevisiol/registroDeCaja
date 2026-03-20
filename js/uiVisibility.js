/* ./js/uiVisibility.js */
/* ===== VISIBILIDAD MOVIMIENTOS ===== */
/* ===== MOSTRAR MOVIMIENTOS ===== */
import { uiShowMovements, uiShowNotes } from "./ui.js";
let movementsVisible = false;
let notesVisible = false;
function toggleMovements() {
    const ul = document.getElementById("movements");
    const btn = document.getElementById("toggleMovementsBtn");
	
	movementsVisible = !movementsVisible;
	
    if (movementsVisible) {
        uiShowMovements();
        btn.textContent = "OCULTAR";
    } else {
        ul.innerHTML = "";
        btn.textContent = "MOSTRAR";
    }
}

function toggleNotes() {
    const ul = document.getElementById("notes");
    const btn = document.getElementById("toggleNotesBtn");
    
    notesVisible = !notesVisible

    if (notesVisible) {
        uiShowNotes();
        btn.textContent = "OCULTAR";
    } else {
        ul.innerHTML = "";
        btn.textContent = "MOSTRAR";
    }
}
window.toggleMovements = toggleMovements;
window.toggleNotes = toggleNotes

export { movementsVisible, toggleMovements, notesVisible, toggleNotes };
