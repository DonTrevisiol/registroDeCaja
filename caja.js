//caja.js
/* TURN DATA */
/*movements es un arreglo de objetos donde cada objeto es el movimiento de caja que se hizo */
let movements = [];
/*notes es un arreglo que sirve para informar noticias que no tengan que ver con los mivimientos de caja */
let notes = [];
/*totalMoney es una variable que almacena todo el dinero que tengo en caja */
let totalMoney = 0;

/*	========	LOCAL STORAGE ========*/
/*		GUARDAR:	*/
function saveData(){
	localStorage.setItem("caja_movements", JSON.stringify(movements));
	localStorage.setItem("caja_notes", JSON.stringify(notes));
	localStorage.setItem("caja_totalMoney", totalMoney);
	localStorage.setItem("caja_turnInfo", document.getElementById("turnInfo").textContent);
	}
	
/*		CARGAR:		*/
function loadData(){
	movements = JSON.parse(localStorage.getItem("caja_movements")) || [];
	notes = JSON.parse(localStorage.getItem("caja_notes")) || [];
	totalMoney = Number(localStorage.getItem("caja_totalMoney")) || 0;
	document.getElementById("turnInfo").textContent = localStorage.getItem("caja_turnInfo") || "";
	}


/* FUNCTIONS */

/* FUNCTION PAYMENT: */
// ESTA FUNCIÓN SIRVE PARA REGISTRAR TODO EL DINERO DEJÓ EL HUESPÉD EN CAJA:
function payment(cash, room="No hay habitación", info="") {
    cash = Number(cash);
    movements.push({
        tipo: "ANTICIPO",        
        cash,
        room,
        info,
        date: fechaActual(),
        done: false
    });
    totalMoney += cash;
    console.log("ANTICIPO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
    saveData();
    uiShowMovements()
    uiMoney();
}
/* FUNCTION CARGE: */
// ESTA FUNBCIÓN RECARGA EL DINERO QUE EL HUESPED DEBE EN LA HABITACIÓN: 
function charge (cash, room="No hay habitación", info="") {
    cash = Number(cash);

    movements.push({
        tipo: "CARGO",
        cash,
        room,
        info,
        date: fechaActual(),
        done: false
    });
    console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
    saveData();
    uiShowMovements()
    uiMoney();
}

function both (cash, room, info="") {
    cash = Number(cash);
    movements.push({
        tipo: "AMBOS",
        cash,
        room,
        info,
        date: fechaActual(),
        done: false
    });
    totalMoney += cash;
    console.log("ANTICIPO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
    console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
    saveData();
    uiShowMovements()
    uiMoney();
}

/*FUNCTION NOTES: */
// FUNCION PARA CREAR NOTAS:

function addNote(text, room=0) {
    notes.push({
        text,
        room,
        date: fechaActual(),
        done: false
    });
    saveData();
    console.log("NOTA AGREGADA SATISFACTORIAMENTE: ", "En habitación: ", room);
    alert("NOTA AGREGADA SATISFACTORIAMENTE: ", room)
}

/* FUNCTION GET: */
// FUNCIÓN PARA SOLICITAR EL ESTADO
function getMoney() {
    console.log("Total de caja: ", totalMoney);
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

/* ===========================
   FUNCIONES PARA INTERFAZ
=========================== */

function uiPayment() {
    /*payment(room, cash, info="") */
    payment(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value
    );
        alert("ANTICIPO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()
        movementsVisible = true;
        document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
}

function uiCharge() {
    /*carge (room, cash, info="") */
    charge(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value
    );
        alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()
        movementsVisible = true;
        document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
}
function uiBoth() {
    /*function both (cash, room, info="") */
    both(
        document.getElementById("cash").value,
        document.getElementById("room").value,
        document.getElementById("info").value
    );
        alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
        document.getElementById("room").value = "";
        document.getElementById("cash").value = "";
        document.getElementById("info").value = "";
        uiShowMovements()
        movementsVisible = true;
        document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
        
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
        document.getElementById("toggleNotesBtn").textContent = "OCULTAR";
}

function uiMoney() {
    document.getElementById("money").textContent = getMoney();
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

        const text = document.createElement("span");
        text.textContent =
            ` ${n.date} | ${n.text} ${formatRoom(n.room)}`;

        li.append(doneBtn, delBtn, text);
        ul.appendChild(li);
    });
}




/* HOUR FUNCTION: */
function fechaActual() {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();

    const hora = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${anio} ${hora}:${min} -->` ;
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
            deleteItem(movements, i, uiShowMovements);

        const text = document.createElement("span");
        text.textContent =
            ` ${m.date} | ${m.tipo} | $${m.cash} | ${m.info} ${formatRoom(m.room)}`;

        li.append(doneBtn, delBtn, text);
        ul.appendChild(li);
    });
}


/* NUEVA FUNCIÓN */
function toggleDone(array, index, refresh) {
    array[index].done = ! array[index].done;
    saveData();
	refresh();
}

function deleteItem(array, index, refreshFunction) {
    if (confirm("¿ELIMINAR ELEMENTO?")) {
        array.splice(index, 1);
        saveData();
        refreshFunction();
    }
}

function uiRestartMoney() {
    if(confirm("¿ESTÁ SEGURO QUE DESEA VOLVER LA CAJA A 0?")) {
        totalMoney = 0
        saveData();
    }
    uiMoney()
}

function formatRoom(room) {
    if(!room || room === "0") return "";
    return ` | Hab ${room} `;
}

/*NUEVO TURNO: */
function newTurn(){
	if(confirm("¿INICIAR NUEVO TURNO? - SE BORRARÁN TODOS LOS DATOS. ¿DESEA CONTINUAR?")) {
		movements = [];
		notes = [];
		totalMoney = 0;
		
		const now = fechaActual();
		
		document.getElementById("turnInfo").textContent = "Turno iniciado: " + now;
		
		saveData();
		uiShowMovements();
		uiShowNotes();
		uiMoney();
		}
	}



loadData();
uiShowMovements();
uiShowNotes();
uiMoney();
