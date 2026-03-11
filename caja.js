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

/*	========	LOCAL STORAGE ========*/
/*		GUARDAR:	*/
function saveData(){
	localStorage.setItem("caja_movements", JSON.stringify(movements));
	localStorage.setItem("caja_notes", JSON.stringify(notes));
	localStorage.setItem("caja_totalCash", totalCash);
	localStorage.setItem("caja_totalCard", totalCard);
	localStorage.setItem("caja_totalQR", totalQR);
	localStorage.setItem("caja_totalMoney", totalMoney);
	localStorage.setItem("caja_turnInfo", document.getElementById("turnInfo").textContent);
	}
	
/*		CARGAR:		*/
function loadData(){
	movements = JSON.parse(localStorage.getItem("caja_movements")) || [];
	notes = JSON.parse(localStorage.getItem("caja_notes")) || [];
	totalCash = Number(localStorage.getItem("caja_totalCash")) || 0;
	totalCard = Number(localStorage.getItem("caja_totalCard")) || 0;
	totalQR = Number(localStorage.getItem("caja_totalQR")) || 0;
	totalMoney = Number(localStorage.getItem("caja_totalMoney")) || 0;
	document.getElementById("turnInfo").textContent = localStorage.getItem("caja_turnInfo") || "";
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

function copyMovements() {
    if(movements.length === 0) {
        alert("NO HAY MOVIMIENTOS PARA COPIAR");
        return;
    }

    let textToCopy = "💰 MOVIMIENTOS DE CAJA:\n\n";

    movements.forEach(m => {

        let methodText =
            (m.tipo === "ANTICIPO" || m.tipo === "AMBOS")
                ? ` | ${m.method}`
                : "";

        let line =
            `${m.date} | ${m.tipo} | BS: ${m.cash}${methodText} | ${formatRoom(m.room)} | ${m.info}`;

        if(m.done) {
            line = `~${line}~`;
        }

        textToCopy += line + "\n";
    });

    textToCopy += `\n*EFECTIVO:* ${totalCash}BS *TARJETA:* ${totalCard}BS\n *QR:* ${totalQR}BS \n*INGRESOS TOTALES:* ${totalMoney}BS`;

    navigator.clipboard.writeText(textToCopy);

    alert("MOVIMIENTOS COPIADOS AL PORTAPAPELES");
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
            deleteItem(movements, i, uiShowMovements);
            
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

function deleteItem(array, index, refreshFunction) {
    if (confirm("¿ELIMINAR ELEMENTO?")) {
        array.splice(index, 1);
        saveData();
        refreshFunction();
    }
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
		
		const date = fechaActual();
		const hour = horaActual();
		
		document.getElementById("turnInfo").textContent = "Turno iniciado: " + date + ' ' + hour;
		
		
		uiShowMovements();
		uiShowNotes();
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
