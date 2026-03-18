/* ./js/main.js */
// IMPORTS:
import { loadData, saveData } from "./storage.js";
import { uiPayment, uiCharge, uiBoth, uiAddNote, uiShowMovements, uiShowNotes, uiMoney } from "./ui.js";
import { addCheckin, addCheckout, addReservation, renderCheckins, renderCheckouts, renderReservations, checkins, checkouts, reservations } from "./guests.js";
import { renderShiftNotes, addShiftNote, copyShiftReport, shiftNotes } from "./shiftNotes.js";
import { recalculateTotals, movements, resetMovements, copyMovements } from "./movements.js";
import { notes, toggleNotes, copyNotes, deleteAllNotes } from "./notes.js";
import { fechaActual, horaActual } from "./utils.js";
import { loadDarkMode, toggleDarkMode } from "./theme.js";
import { toggleSpiderMode } from "./spidermode.js";

/*NUEVO TURNO: */

function newTurn(){
 if(confirm("¿INICIAR NUEVO TURNO? - SE BORRARÁN TODOS LOS DATOS. ¿DESEA CONTINUAR?")) {
  movements.length = 0;
        notes.length = 0;

        checkins.length = 0;
        checkouts.length = 0;
        reservations.length = 0;

        shiftNotes.length = 0;
  resetMovements();

  const date = fechaActual();
  const hour = horaActual();
  
  document.getElementById("turnInfo").textContent = "Turno iniciado: " + date + ' ' + hour;
  
  
  uiShowMovements();
  uiShowNotes();
  renderCheckins();
  renderCheckouts();
  renderReservations();
  renderShiftNotes();

  recalculateTotals();
  uiMoney();

  saveData();
  }
 }

    loadData();

uiShowMovements();
uiShowNotes();
uiMoney();

renderCheckins();
renderCheckouts();
renderReservations();
renderShiftNotes();

loadDarkMode();

window.newTurn = newTurn;
window.toggleDarkMode = toggleDarkMode;
window.toggleSpiderMode = toggleSpiderMode;

window.uiPayment = uiPayment;
window.uiCharge = uiCharge;
window.uiBoth = uiBoth;
window.copyMovements = copyMovements;

window.uiAddNote = uiAddNote;
window.toggleNotes = toggleNotes;
window.copyNotes = copyNotes;
window.deleteAllNotes = deleteAllNotes;

window.addCheckin = addCheckin;
window.addCheckout = addCheckout;
window.addReservation = addReservation;

window.addShiftNote = addShiftNote;
window.copyShiftReport = copyShiftReport;
