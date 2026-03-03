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
function payment(cash, room=0, info="") {
	if(!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);
				movements.push({
					tipo: "ANTICIPO",        
					cash,
					room,
					info,
					date: horaActual(),
					done: false
				});
					totalMoney += cash;
					console.log("ANTICIPO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
					alert("ANTICIPO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
					document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
					saveData();
					uiShowMovements()
					uiMoney();
		}
    
}
/* FUNCTION CARGE: */
// ESTA FUNBCIÓN RECARGA EL DINERO QUE EL HUESPED DEBE EN LA HABITACIÓN: 
function charge (cash, room=0, info="") {
	if (!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);

			movements.push({
			tipo: "CARGO",
			cash,
			room,
			info,
			date: horaActual(),
			done: false
			});
				console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
				document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
				saveData();
				uiShowMovements()
				uiMoney();
			
		}
    
}

function both (cash, room=0, info="") {
	if (!cash) {
		alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
		} else {
			cash = Number(cash);
			movements.push({
			tipo: "AMBOS",
			cash,
			room,
			info,
			date: horaActual(),
			done: false
			});
				totalMoney += cash;
				console.log("ANTICIPO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				console.log("CARGO REGISTRADO: ", "HAB.: ", room,"Dinero: $ ", cash, info);
				alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
				document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
				saveData();
				uiShowMovements()
				uiMoney();
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
        document.getElementById("info").value
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
            deleteItem(movements, i, uiShowMovements);
            
        const editBtn = document.createElement("button");
		editBtn.textContent = "✏";
		editBtn.onclick = () => editMovement(i);

        const text = document.createElement("span");
        text.textContent =
            `${m.date} | ${m.tipo} | $${m.cash} | ${formatRoom(m.room)} | ${m.info}`;

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

    /* Ajustar totalMoney si cambia el monto */
    totalMoney -= Number(m.cash);
    totalMoney += Number(newCash);

    m.cash = Number(newCash);
    m.info = newInfo;
    m.room = newRoom;

    saveData();
    uiShowMovements();
    uiMoney();
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
    if(confirm("¿ESTÁ SEGURO QUE DESEA VOLVER LA CAJA A 0? SE ELIMINARÁN LOS DATOS DEL TURNO TAMBIÉN")) {
        document.getElementById("turnInfo").textContent = "";
    }
	totalMoney = 0;
    movements = [];
	notes = [];
    uiShowMovements();
	uiShowNotes();
    uiMoney()
    saveData();
}

function formatRoom(room) {
    if(!room || room === "0") return "";
    return `Habitación: ${room}`;
}

/*NUEVO TURNO: */
function newTurn(){
	if(confirm("¿INICIAR NUEVO TURNO? - SE BORRARÁN TODOS LOS DATOS. ¿DESEA CONTINUAR?")) {
		movements = [];
		notes = [];
		totalMoney = 0;
		
		const date = fechaActual();
		const hour = horaActual();
		
		document.getElementById("turnInfo").textContent = "Turno iniciado: " + date + ' ' + hour;
		
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
