/* ./js/storage.js */
import { STORAGE_KEYS } from "./constants.js";
import { movements, totalCash, totalCard, totalQR, totalMoney } from "./movements.js";
import { notes } from "./notes.js";
import { checkins, checkouts, reservations, renderCheckins, renderCheckouts, renderReservations } from "./guests.js";
import { shiftNotes, renderShiftNotes } from "./shiftNotes.js";

function saveData(){

const data = {
movements,
notes,
checkins,
checkouts,
reservations,
shiftNotes,
totalCash,
totalCard,
totalQR,
totalMoney,
turnInfo: document.getElementById("turnInfo").textContent
};

localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(data));

}


function loadData(){

const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.APP));

if(!data) return;

/* mantener referencias */

movements.length = 0;
movements.push(...(data.movements || []));

notes.length = 0;
notes.push(...(data.notes || []));

checkins.length = 0;
checkins.push(...(data.checkins || []));

checkouts.length = 0;
checkouts.push(...(data.checkouts || []));

reservations.length = 0;
reservations.push(...(data.reservations || []));

shiftNotes.length = 0;
shiftNotes.push(...(data.shiftNotes || []));

document.getElementById("turnInfo").textContent = data.turnInfo || "";

renderShiftNotes();
renderCheckins();
renderCheckouts();
renderReservations();

}

export {
saveData,
loadData
};
