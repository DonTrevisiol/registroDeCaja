/* ./js/ui.js */
import { MOVEMENT_TYPES } from "./constants.js";
import { payment, charge, both, deleteItem, editMovement, resetMovements, movements, totalCash, totalCard, totalQR, totalMoney } from "./movements.js";
import { addNote, editNote, notes } from "./notes.js";
import { movementsVisible } from "./uiVisibility.js";
import { formatRoom, toggleDone } from "./utils.js";
import { saveData } from "./storage.js";
/* ===========================
   FUNCIONES PARA INTERFAZ
=========================== */
function uiPayment() {
    /*payment(room, cash, info="") */
    payment(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value,
        document.getElementById("paymentMethod").value
    );
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()
}
function uiCharge() {
    /*carge (room, cash, info="") */
    charge(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value
    );
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()     
}
function uiBoth() {
    /*function both (cash, room, info="") */
    both(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value,
        document.getElementById("paymentMethod").value
    );
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()
}

function uiShowMovements() {
    const ul = document.getElementById("movements");
    ul.innerHTML = "";

    movements.forEach((m, i) => {
        const li = document.createElement("li");

        if (m.done) li.classList.add("done");

        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✔";
        doneBtn.onclick = () =>
            toggleDone(movements, i, uiShowMovements);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.onclick = () =>
            deleteItem(i);
            
        const editBtn = document.createElement("button");
  editBtn.textContent = "✏";
  editBtn.onclick = () => editMovement(i);

        const text = document.createElement("span");
        const methodText = (m.tipo === MOVEMENT_TYPES.ANTICIPO || m.tipo === MOVEMENT_TYPES.AMBOS) ? ` | ${m.method}` : "";
  text.textContent = `${m.date} | ${m.tipo} | $${m.cash} ${methodText} | ${formatRoom(m.room)} | ${m.info}`;
        li.append(doneBtn, delBtn, editBtn, text);
        ul.appendChild(li);
    });
}

function uiAddNote() {
    /*addNote(text, room=0) */
    addNote(
        document.getElementById("noteText").value,
        document.getElementById("noteRoom").value
    );
        document.getElementById("noteText").value = "";
        document.getElementById("noteRoom").value = "";
        uiShowNotes();
}

function uiShowNotes() {
    const ul = document.getElementById("notes");
    ul.innerHTML = "";

    notes.forEach((n, i) => {
        const li = document.createElement("li");

        if (n.done) li.classList.add("done");

        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✔";
        doneBtn.onclick = () =>
            toggleDone(notes, i, uiShowNotes);

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑";
        delBtn.onclick = () =>
            deleteNote(i);
        
        const editBtn = document.createElement("button");
  editBtn.textContent = "✏";
  editBtn.onclick = () => editNote(i);



        const text = document.createElement("span");
        text.textContent =
            ` ${n.date} | ${n.text} | ${formatRoom(n.room)} `;

        li.append(doneBtn, delBtn, editBtn, text);
        ul.appendChild(li);
    });
}

function uiMoney() {
 document.getElementById("cashTotal").textContent = totalCash;
 document.getElementById("cardTotal").textContent = totalCard;
 document.getElementById("qrTotal").textContent = totalQR;
	
    document.getElementById("moneyTotal").textContent = totalMoney;
}

function uiRestartMoney() {
    if(confirm("¿ESTÁ SEGURO QUE DESEA VOLVER TODAS LAS CAJAS A 0? LOS MOVIMIENTOS PENDIENTES TAMBIÉN SE PERDERÁN")) {
        document.getElementById("turnInfo").textContent = "";
    }
    resetMovements();
    
    uiShowMovements();
 uiShowNotes();
    uiMoney()
    saveData();
    alert("CAJA REINICIADA");
}

window.uiPayment = uiPayment;
window.uiCharge = uiCharge;
window.uiBoth = uiBoth;

window.uiAddNote = uiAddNote;

window.uiRestartMoney = uiRestartMoney;




export {
uiPayment,
uiCharge,
uiBoth,
uiShowMovements,
uiAddNote,
uiShowNotes,
uiMoney,
uiRestartMoney
};
