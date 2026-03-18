/* ./js/guests.js */
/* IMPORTS: */
import { saveData } from "./storage.js";
/*checkins es un arreglo de ingresos de huéspedes*/
let checkins = [];
/*checkouts es un arreglo de egresos de huéspedes*/
let checkouts = [];
/*reservations es un arreglo de reservaciones*/
let reservations = [];

/*
 * ==========================
 * FUNCIONES PARA REGISTRO DE HUÉSPEDES
 * ==========================
 * */
 /*INGRESOS:*/
 function addCheckin(){

    const room = document.getElementById("inRoom").value;
    const name = document.getElementById("inName").value;
    const people = document.getElementById("inPeople").value;

    if(!room || !name) return alert("Faltan datos");

    checkins.push({
        room,
        name,
        people,
        done:false
    });

    saveData();

    document.getElementById("inRoom").value="";
    document.getElementById("inName").value="";
    document.getElementById("inPeople").value="";
 renderCheckins();
}
/*EGRESOS:*/
function addCheckout(){

    const room = document.getElementById("outRoom").value;
    const name = document.getElementById("outName").value;
    const people = document.getElementById("outPeople").value;

    if(!room || !name) return alert("Faltan datos");

    checkouts.push({
        room,
        name,
        people,
        done:false
    });

    saveData();

    document.getElementById("outRoom").value="";
    document.getElementById("outName").value="";
    document.getElementById("outPeople").value="";
 renderCheckouts();
}
/*RESERVAS:*/
function addReservation(){

    const number = document.getElementById("resNumber").value;
    const name = document.getElementById("reservationName").value;
    const room = document.getElementById("resRoom").value;
    const people = document.getElementById("resPeople").value;

    if(!room || !number) return alert("Faltan datos");

    reservations.push({
        number,
        name,
        room,
        people,
        done:false
    });

    saveData();

    document.getElementById("resNumber").value="";
    document.getElementById("reservationName").value="";
    document.getElementById("resRoom").value="";
    document.getElementById("resPeople").value="";
 renderReservations();
}
// RENDERS:
function renderCheckins(){

const list = document.getElementById("checkinList");

list.innerHTML = "";

checkins.forEach((c,i)=>{

const li = document.createElement("li");

if(c.done) li.classList.add("done");

li.textContent =
`Habitación ${c.room} | ${c.name} | Personas: ${c.people}`;

const doneBtn = document.createElement("button");
doneBtn.textContent = "✔";
doneBtn.onclick = ()=>toggleCheckin(i);

const editBtn = document.createElement("button");
editBtn.textContent = "✏";
editBtn.onclick = ()=>editCheckin(i);

const delBtn = document.createElement("button");
delBtn.textContent = "🗑";
delBtn.onclick = ()=>deleteCheckin(i);

li.appendChild(doneBtn);
li.appendChild(editBtn);
li.appendChild(delBtn);

list.appendChild(li);

});

}
function renderCheckouts(){

const list = document.getElementById("checkoutList");

list.innerHTML = "";

checkouts.forEach((c,i)=>{

const li = document.createElement("li");

if(c.done) li.classList.add("done");

li.textContent =
`Habitación ${c.room} | ${c.name} | Personas: ${c.people}`;

const doneBtn = document.createElement("button");
doneBtn.textContent = "✔";
doneBtn.onclick = ()=>toggleCheckout(i);

const editBtn = document.createElement("button");
editBtn.textContent = "✏";
editBtn.onclick = ()=>editCheckout(i);

const delBtn = document.createElement("button");
delBtn.textContent = "🗑";
delBtn.onclick = ()=>deleteCheckout(i);

li.appendChild(doneBtn);
li.appendChild(editBtn);
li.appendChild(delBtn);

list.appendChild(li);

});

}
function renderReservations(){

const list = document.getElementById("reservationList");

list.innerHTML = "";

reservations.forEach((r,i)=>{

const li = document.createElement("li");
if(r.done) li.classList.add("done");

li.textContent =
`Reserva #${r.number} | ${r.name || "Sin nombre"} | Habitación ${r.room} | Personas: ${r.people}`;

const doneBtn = document.createElement("button");
doneBtn.textContent = "✔";
doneBtn.onclick = ()=>toggleReservation(i);

const editBtn = document.createElement("button");
editBtn.textContent = "✏";
editBtn.onclick = ()=>editReservation(i);

const delBtn = document.createElement("button");
delBtn.textContent = "🗑";
delBtn.onclick = ()=>deleteReservation(i);

li.appendChild(doneBtn);
li.appendChild(editBtn);
li.appendChild(delBtn);

list.appendChild(li);

});

}
// TOOGLES
function toggleCheckin(i){

checkins[i].done = !checkins[i].done;

saveData();
renderCheckins();
}
function toggleCheckout(i){

checkouts[i].done = !checkouts[i].done;

saveData();
renderCheckouts();
}
function toggleReservation(i){

reservations[i].done = !reservations[i].done;

saveData();
renderReservations();
}
// EDITS:

function editCheckin(i){

const c = checkins[i];

const room = prompt("Habitación:",c.room);
if(room===null) return;

const name = prompt("Nombre:",c.name);
if(name===null) return;

const people = prompt("Personas:",c.people);

c.room = room;
c.name = name;
c.people = people;

saveData();
renderCheckins();
}
function editCheckout(i){

const c = checkouts[i];

const room = prompt("Habitaciones:",c.room);
if(room===null) return;

const name = prompt("Nombre:",c.name);
if(name===null) return;

const people = prompt("Personas:",c.people);

c.room = room;
c.name = name;
c.people = people;

saveData();
renderCheckouts();
}
function editReservation(i){

const r = reservations[i];

const room = prompt("Habitación:",r.room);
if(room===null) return;

const number = prompt("Número reserva:",r.number);
if(number===null) return;

const people = prompt("Personas:",r.people);

r.room = room;
r.number = number;
r.people = people;

saveData();
renderReservations();
}
// DELETES:
function deleteCheckin(i){

if(!confirm("¿Eliminar ingreso?")) return;

checkins.splice(i,1);

saveData();
renderCheckins();
}
function deleteCheckout(i){

if(!confirm("¿Eliminar egreso?")) return;

checkouts.splice(i,1);

saveData();
renderCheckouts();
}
function deleteReservation(i){

if(!confirm("¿Eliminar reserva?")) return;

reservations.splice(i,1);

saveData();
renderReservations();
}

window.addCheckin = addCheckin;
window.addCheckout = addCheckout;
window.addReservation = addReservation;

export {
    checkins,
    checkouts,
    reservations,

    addCheckin,
    addCheckout,
    addReservation,

    renderCheckins,
    renderCheckouts,
    renderReservations
}
