//caja.js
/* TURN DATA */
/*movements es un arreglo de objetos donde cada objeto es el movimiento de caja que se hizo */
let movements = [];
/*notes es un arreglo que sirve para informar noticias que no tengan que ver con los mivimientos de caja */
let notes = [];
/*totalCash es una variable que almacena la cantidad de efectivo con el que me pagaron*/
let totalCash = 0;
/*totalCard es la cantidad de dinero que tengo cargado en las tarjetas de crédito*/
let totalCard = 0;
/*totalQR es una variable que almacena la cantidad de dinero realizados de pagos por código QR*/
let totalQR = 0;
/*totalMoney es una variable que almacena todo el dinero que tengo en caja */
let totalMoney = 0;
/*checkins es un arreglo de ingresos de huéspedes*/
let checkins = [];
/*checkouts es un arreglo de egresos de huéspedes*/
let checkouts = [];
/*reservations es un arreglo de reservaciones*/
let reservations = [];
/*shiftNotes es un arregloque contiene notas para el siguiente turno de recepcionista*/
let shiftNotes = [];

/*	========	LOCAL STORAGE ========*/
/*		GUARDAR:	*/
function saveData(){
	localStorage.setItem("caja_movements", JSON.stringify(movements));
	localStorage.setItem("caja_notes", JSON.stringify(notes));
	localStorage.setItem("caja_totalCash", totalCash);
	localStorage.setItem("caja_totalCard", totalCard);
	localStorage.setItem("caja_totalQR", totalQR);
	localStorage.setItem("caja_totalMoney", totalMoney);
	localStorage.setItem("checkins", JSON.stringify(checkins));
	localStorage.setItem("checkouts", JSON.stringify(checkouts));
	localStorage.setItem("reservations", JSON.stringify(reservations));
	localStorage.setItem("caja_turnInfo", document.getElementById("turnInfo").textContent);
	localStorage.setItem("shiftNotes", JSON.stringify(shiftNotes));
	}	
/*		CARGAR:		*/
function loadData(){
	movements = JSON.parse(localStorage.getItem("caja_movements")) || [];
	notes = JSON.parse(localStorage.getItem("caja_notes")) || [];
	checkins = JSON.parse(localStorage.getItem("checkins")) || [];
	checkouts = JSON.parse(localStorage.getItem("checkouts")) || [];
	reservations = JSON.parse(localStorage.getItem("reservations")) || [];
	shiftNotes = JSON.parse(localStorage.getItem("shiftNotes")) || [];
	totalCash = Number(localStorage.getItem("caja_totalCash")) || 0;
	totalCard = Number(localStorage.getItem("caja_totalCard")) || 0;
	totalQR = Number(localStorage.getItem("caja_totalQR")) || 0;
	totalMoney = Number(localStorage.getItem("caja_totalMoney")) || 0;
	document.getElementById("turnInfo").textContent = localStorage.getItem("caja_turnInfo") || "";
	renderShiftNotes();
	renderCheckins();
	renderCheckouts();
	renderReservations();
	}
/* FUNCTIONS */
/* FUNCTION PAYMENT: */
// ESTA FUNCIÓN SIRVE PARA REGISTRAR TODO EL DINERO DEJÓ EL HUESPÉD EN CAJA:
function payment(cash, room=0, info="", method) {
	if(!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);
				movements.push({
					tipo: "ANTICIPO",        
					cash,
					room,
					info,
					method,
					date: horaActual(),
					done: false
				});
				/*	SUMAR SEGÚN MÉTODO:	*/
					if (method === "EFECTIVO") totalCash += cash;
					if (method === "TARJETA") totalCard += cash;
					if (method === "QR") totalQR += cash;
					totalMoney = totalCash + totalCard + totalQR;
					
					alert("ANTICIPO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
					document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
					
					uiShowMovements()
					recalculateTotals();
					uiMoney();
					saveData();
		}
    
}
/* FUNCTION CARGE: */
// ESTA FUNBCIÓN RECARGA EL DINERO QUE EL HUESPED DEBE EN LA HABITACIÓN: 
function charge (cash, room=0, info="", method=null) {
	if (!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);

			movements.push({
			tipo: "CARGO",
			cash,
			room,
			info,
			method: null,
			date: horaActual(),
			done: false
			});
				console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
				document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
				uiShowMovements()
				
				recalculateTotals();
				uiMoney();
				saveData();
		}
    
}
function both (cash, room=0, info="", method) {
	if (!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);
			movements.push({
			tipo: "AMBOS",
			cash,
			room,
			info,
			method,
			date: horaActual(),
			done: false
			});
				console.log("ANTICIPO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
				document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
				uiShowMovements()
				recalculateTotals();
				uiMoney();
				saveData();
		}
    
}
/*FUNCTION NOTES: */
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
			console.log("NOTA AGREGADA SATISFACTORIAMENTE: ", "En habitación: ", room);
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
        let line = `${n.date} | ${n.text} ${formatRoom(n.room)}`;

        if(n.done) {
            line = `~${line}~`;
        }

        textToCopy += line + "\n";
    });

    navigator.clipboard.writeText(textToCopy);

    alert("NOTAS COPIADAS AL PORTAPAPELES");
}
function copyMovements(){

if(movements.length === 0){

navigator.clipboard.writeText("No hubo movimientos en la caja.");
alert("Texto copiado");
return;

}

let text = "MOVIMIENTOS PENDIENTES:\n\n";

movements.forEach((m,i)=>{

let line = `${i+1}) ${m.info} | $${m.cash}`;

text += line + "\n";

});

navigator.clipboard.writeText(text);

alert("Movimientos copiados");

}
/* FUNCTION GET: */
// FUNCIÓN PARA SOLICITAR EL ESTADO
function getMoney() {
    return totalMoney;
}
function getMovements() {
    console.table(movements);
    return movements;
}
function getNotes() {
    console.table(notes)
    return notes;
}
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
//RENDERS:
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
function renderShiftNotes(){

const list = document.getElementById("shiftNoteList");

list.innerHTML="";

shiftNotes.forEach((n,i)=>{

const li = document.createElement("li");

li.textContent = n;
/*	BOTON EDITAR*/
const editBtn = document.createElement("button");
editBtn.textContent = "✏";

editBtn.onclick = ()=>editShiftNote(i);
/*	BOTON ELIMINAR*/
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
/*CRUD:*/
function toggleCheckin(i){

checkins[i].done = !checkins[i].done;

saveData();
renderCheckins();
}
function deleteCheckin(i){

if(!confirm("¿Eliminar ingreso?")) return;

checkins.splice(i,1);

saveData();
renderCheckins();
}
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
function toggleCheckout(i){

checkouts[i].done = !checkouts[i].done;

saveData();
renderCheckouts();
}
function deleteCheckout(i){

if(!confirm("¿Eliminar egreso?")) return;

checkouts.splice(i,1);

saveData();
renderCheckouts();
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
function toggleReservation(i){

reservations[i].done = !reservations[i].done;

saveData();
renderReservations();
}
function deleteReservation(i){

if(!confirm("¿Eliminar reserva?")) return;

reservations.splice(i,1);

saveData();
renderReservations();
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
        movementsVisible = true;
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
        movementsVisible = true;        
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
        movementsVisible = true;        
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
        notesVisible = true;
}
function uiMoney() {
	document.getElementById("cashTotal").textContent = totalCash;
	document.getElementById("cardTotal").textContent = totalCard;
	document.getElementById("qrTotal").textContent = totalQR;
	
    document.getElementById("moneyTotal").textContent = getMoney();
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
            deleteItem(notes, i, uiShowNotes);
        
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
//  EDITAR NOTA:
function editNote(index) {
    const newText = prompt("Editar texto:", notes[index].text);
    if (newText === null) return;

    const newRoom = prompt("Editar habitación:", notes[index].room);

    notes[index].text = newText;
    notes[index].room = newRoom;

    saveData();
    uiShowNotes();
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
/* */
/* ===== VISIBILIDAD MOVIMIENTOS ===== */
/* ===== MOSTRAR MOVIMIENTOS ===== */
let movementsVisible = false;
function toggleMovements() {
    const ul = document.getElementById("movements");
    const btn = document.getElementById("toggleMovementsBtn");

    if (!movementsVisible) {
        uiShowMovements();
        btn.textContent = "OCULTAR";
        movementsVisible = true;
    } else {
        ul.innerHTML = "";
        btn.textContent = "MOSTRAR";
        movementsVisible = false;
    }
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
        const methodText = (m.tipo === "ANTICIPO" || m.tipo === "AMBOS") ? ` | ${m.method}` : "";
		text.textContent = `${m.date} | ${m.tipo} | $${m.cash} ${methodText} | ${formatRoom(m.room)} | ${m.info}`;
        li.append(doneBtn, delBtn, editBtn, text);
        ul.appendChild(li);
    });
}
//	EDITAR MOVIMIENTO
function editMovement(index) {
    const m = movements[index];

    const newCash = prompt("Editar monto:", m.cash);
    if (newCash === null) return;

    const newInfo = prompt("Editar info:", m.info);
    if (newInfo === null) return;

    const newRoom = prompt("Editar habitación:", m.room);
    
    const newMethod = prompt("Forma de pago (EFECTIVO / TARJETA / QR): ", m.method);
    
    /*	RESTAR VALOR ANTERIOR:	*/
    if (m.method === "EFECTIVO") totalCash -= Number(m.cash);
    if (m.method === "TARJETA") totalCard -= Number(m.cash);
    if (m.method === "QR") totalQR -= Number(m.cash);
    
    /*	SUMAR NUEVO VALOR:	*/
    
    if (newMethod === "EFECTIVO") totalCash += Number(newCash);
    if (newMethod === "TARJETA") totalCard += Number(newCash);
    if (newMethod === "QR") totalQR += Number(newCash);
    
    m.cash = Number(newCash);
    m.info = newInfo;
    m.room = newRoom;
    m.method = newMethod;
    
    totalMoney = totalCash + totalCard + totalQR; 
    
    uiShowMovements();
    recalculateTotals();
	uiMoney();
	saveData();
}
/* NUEVA FUNCIÓN */
function toggleDone(array, index, refresh) {
    array[index].done = ! array[index].done;
    saveData();
	refresh();
}

function deleteItem(index){

if(!confirm("¿Eliminar movimiento?")) return;

const m = movements[index];
const amount = Number(m.cash || 0);

/* Solo restar si el movimiento tiene método de pago */

if(m.method){

totalMoney -= amount;

if(m.method === "Efectivo"){
cashTotal -= amount;
}

if(m.method === "Tarjeta"){
cardTotal -= amount;
}

if(m.method === "QR"){
qrTotal -= amount;
}

}

/* eliminar movimiento */

movements.splice(index,1);

saveData();
recalculateTotals();
uiShowMovements();
uiMoney();

}


function uiRestartMoney() {
    if(confirm("¿ESTÁ SEGURO QUE DESEA VOLVER TODAS LAS CAJAS A 0? LOS MOVIMIENTOS PENDIENTES TAMBIÉN SE PERDERÁN")) {
        document.getElementById("turnInfo").textContent = "";
    }
    totalCash = 0;
    totalCard = 0;
    totalQR = 0;
	totalMoney = 0;
    movements = [];
    
    uiShowMovements();
	uiShowNotes();
    uiMoney()
    saveData();
    alert("CAJA REINICIADA");
}
function formatRoom(room) {
    if(!room || room === "0") return "";
    return `Habitación: ${room}`;
}
/*	RECALCULAR CAJAS:	*/
function recalculateTotals() {
	totalCash = 0;
	totalCard = 0;
	totalQR = 0;
	
	movements.forEach(m => {
		if(m.tipo === "ANTICIPO" || m.tipo === "AMBOS") {
			if(m.method === "EFECTIVO") totalCash += Number(m.cash);
			if(m.method === "TARJETA") totalCard += Number(m.cash);
			if(m.method === "QR") totalQR += Number(m.cash);
			}
			totalMoney = totalCash + totalCard + totalQR;
		})
	}
/*NUEVO TURNO: */
function newTurn(){
	if(confirm("¿INICIAR NUEVO TURNO? - SE BORRARÁN TODOS LOS DATOS. ¿DESEA CONTINUAR?")) {
		movements = [];
		notes = [];
		totalCash = 0;
		totalCard = 0;
		totalQR = 0;
		totalMoney = 0;
		checkins = [];
		checkouts = [];
		reservations = [];
		shiftNotes = [];
		const date = fechaActual();
		const hour = horaActual();
		
		document.getElementById("turnInfo").textContent = "Turno iniciado: " + date + ' ' + hour;
		
		
		uiShowMovements();
		uiShowNotes();
		renderCheckins();
		renderCheckouts();
		renderReservations();

		renderShiftNotes();
		newsUpdates
		recalculateTotals();
		uiMoney();
		saveData();
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
/*	===	DARK MODE ===	*/
function toggleDarkMode() {
	document.body.classList.toggle("dark");
		//guardar preferencia:
	if(document.body.classList.contains("dark")) {
		localStorage.setItem("darkMode", "enabled");
		} else {
			localStorage.setItem("darkMode", "disabled");
			}
		}	
/*	===	SPIDER MODE	===	*/
function toggleSpiderMode() {

    document.body.classList.toggle("spider-mode");

    if(document.body.classList.contains("spider-mode")){
        localStorage.setItem("spiderMode", "on");
    } else {
        localStorage.removeItem("spiderMode");
    }
}
	if(localStorage.getItem("spiderMode") === "on"){
    document.body.classList.add("spider-mode");
}	
/*	=== CARGAR PREFERENCIA AL INICIAR ===	*/
function loadDarkMode() {
	const darkMode = localStorage.getItem("darkMode");
	
	if(darkMode === "enabled") {
		document.body.classList.add("dark");
		}
	}
/*	SPIDER FUNCTIONS:	*/
document.addEventListener("click", function(e){

    if(!document.body.classList.contains("spider-mode")) return;

    createWeb(e.clientX, e.clientY);

});
function createWeb(x,y){

    const web = document.createElement("div");

    web.className = "click-web";

    web.style.left = x + "px";
    web.style.top = y + "px";

    document.body.appendChild(web);

    setTimeout(()=>{
        web.remove();
    },1000);

}
loadData();
uiShowMovements();
uiShowNotes();
uiMoney();
loadDarkMode();
renderCheckins();
renderCheckouts();
renderReservations();
