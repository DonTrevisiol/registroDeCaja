/* ./js/movements.js*/
/* IMPORTS: */
import { MOVEMENT_TYPES, PAYMENT_METHODS } from "./constants.js";
import { horaActual } from "./utils.js";
import { uiShowMovements, uiMoney } from "./ui.js";
import { saveData } from "./storage.js";
/*movements es un arreglo de objetos donde cada objeto es el movimiento de caja que se hizo */
let movements = [];
/*totalCash es una variable que almacena la cantidad de efectivo con el que me pagaron*/
let totalCash = 0;
/*totalCard es la cantidad de dinero que tengo cargado en las tarjetas de crédito*/
let totalCard = 0;
/*totalQR es una variable que almacena la cantidad de dinero realizados de pagos por código QR*/
let totalQR = 0;
/*totalMoney es una variable que almacena todo el dinero que tengo en caja */
let totalMoney = 0;

/* RECALCULAR CAJAS: */
function recalculateTotals() {
    totalCash = 0;
    totalCard = 0;
    totalQR = 0;

    movements.forEach(m => {
        if(m.tipo === "ANTICIPO" || m.tipo === "AMBOS") {
            if(m.method === PAYMENT_METHODS.EFECTIVO) totalCash += Number(m.cash);
            if(m.method === PAYMENT_METHODS.TARJETA) totalCard += Number(m.cash);
            if(m.method === PAYMENT_METHODS.QR) totalQR += Number(m.cash);
        }
    });

    totalMoney = totalCash + totalCard + totalQR;
}

// AGREGAR MOVIMIENTO:
function payment(cash, room=0, info="", method) {
 if(!cash) {
  alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
  } else {
   cash = Number(cash);
    movements.push({
     tipo: MOVEMENT_TYPES.ANTICIPO,        
     cash,
     room,
     info,
     method,
     date: horaActual(),
     done: false
    });
    /* SUMAR SEGÚN MÉTODO: */
     if (method === PAYMENT_METHODS.EFECTIVO) totalCash += cash;
     if (method === PAYMENT_METHODS.TARJETA) totalCard += cash;
     if (method === PAYMENT_METHODS.QR) totalQR += cash;
     totalMoney = totalCash + totalCard + totalQR;
     
     alert(`ANTICIPO REGISTRADO: HAB ${room} - $${cash} - ${info}`);
     document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
     
     uiShowMovements()
     recalculateTotals();
     uiMoney();
     saveData();
  }
    
}

// AGREGAR CARGO:
function charge (cash, room=0, info="", method=null) {
 if (!cash) {
  alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
  } else {
   cash = Number(cash);

   movements.push({
   tipo: MOVEMENT_TYPES.CARGO,
   cash,
   room,
   info,
   method: null,
   date: horaActual(),
   done: false
   });
    alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
    document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
    uiShowMovements()
    
    recalculateTotals();
    uiMoney();
    saveData();
  }
    
}
// AGREGAR AMBOS:
function both (cash, room=0, info="", method) {
 if (!cash) {
  alert("EL CAMPO 'MONTO' NO PUEDE ESTAR VACÍO");
  } else {
   cash = Number(cash);
   movements.push({
   tipo: MOVEMENT_TYPES.AMBOS,
   cash,
   room,
   info,
   method,
   date: horaActual(),
   done: false
   });
    alert("CARGO REGISTRADO CON ÉXITO: ", "HAB.: ", room,"Dinero: $ ", cash, info )
    document.getElementById("toggleMovementsBtn").textContent = "OCULTAR";
    uiShowMovements()
    recalculateTotals();
    uiMoney();
    saveData();
  }
    
}
// ELIMINAR MOVIMIENTO:
function deleteItem(index){
    if(!confirm("¿Eliminar movimiento?")) return;
    const m = movements[index];
    const amount = Number(m.cash || 0);
    /* Solo restar si el movimiento tiene método de pago */
    if(m.method){
        totalMoney -= amount;
        if(m.method === PAYMENT_METHODS.EFECTIVO){
            totalCash -= amount;
        }
        if(m.method === PAYMENT_METHODS.TARJETA){
            totalCard -= amount;
        }
        if(m.method === PAYMENT_METHODS.QR){
            totalQR -= amount;
        }
    }
    /* eliminar movimiento */
    movements.splice(index,1);
    saveData();
    recalculateTotals();
    uiShowMovements();
    uiMoney();
}

// EDITAR MOVIMIENTO:
function editMovement(index) {
    const m = movements[index];
    const newCash = prompt("Editar monto:", m.cash);
    if (newCash === null) return;
    const newInfo = prompt("Editar info:", m.info);
    if (newInfo === null) return;
    const newRoom = prompt("Editar habitación:", m.room);
    const newMethod = prompt("Forma de pago (EFECTIVO / TARJETA / QR): ", m.method);
    /* RESTAR VALOR ANTERIOR: */
    if (m.method === PAYMENT_METHODS.EFECTIVO) totalCash -= Number(m.cash);
    if (m.method === PAYMENT_METHODS.TARJETA) totalCard -= Number(m.cash);
    if (m.method === PAYMENT_METHODS.QR) totalQR -= Number(m.cash);
    /* SUMAR NUEVO VALOR: */
    if (newMethod === PAYMENT_METHODS.EFECTIVO) totalCash += Number(newCash);
    if (newMethod === PAYMENT_METHODS.TARJETA) totalCard += Number(newCash);
    if (newMethod === PAYMENT_METHODS.QR) totalQR += Number(newCash);
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

function copyMovements() {

    if (movements.length === 0) {
        navigator.clipboard.writeText("No hubo movimientos.\n EFECTIVO: *0BS* \n TARJETA: *0BS* \n CÓDIGO QR: *0BS* \n\n TOTAL: *0BS*");
        alert("Copiado: No hubo movimientos");
        return;
    }

    let text = "MOVIMIENTOS DE CAJA: \n";

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalQR = 0;

    movements.forEach(m => {

        // Si es "AMBOS", en copia lo tratamos como ANTICIPO
        let tipo = (m.tipo === MOVEMENT_TYPES.AMBOS) ? "ANTICIPO" : m.tipo;

        // Método (si existe)
        let methodText = m.method ? ` | ${m.method}` : "";

        // Línea completa
        let roomText = m.room ? ` | Hab ${m.room}` : "";
        let infoText = m.info ? ` | ${m.info}` : "";
        text += `${tipo} | *${m.cash} BS.* ${methodText}${roomText}${infoText}\n`;

        // SOLO sumamos si tiene método (o sea, no es CARGO)
        if (m.method) {
            if (m.method === PAYMENT_METHODS.EFECTIVO) totalEfectivo += Number(m.cash);
            if (m.method === PAYMENT_METHODS.TARJETA) totalTarjeta += Number(m.cash);
            if (m.method === PAYMENT_METHODS.QR) totalQR += Number(m.cash);
        }
    });

    const total = totalEfectivo + totalTarjeta + totalQR;

    text += `\n`;
    text += `EFECTIVO: *${totalEfectivo}BS*\n`;
    text += `TARJETA: *${totalTarjeta}BS*\n`;
    text += `CÓDIGO QR: *${totalQR}BS*\n\n\n`;
    text += `*TOTAL: ${total}BS*`;

    navigator.clipboard.writeText(text);
    alert("Movimientos copiados");
}



function resetMovements(){
totalCash = 0;
totalCard = 0;
totalQR = 0;
totalMoney = 0;
movements.length = 0;
}

export {
    movements,
    totalCash,
    totalCard,
    totalQR,
    totalMoney,
    payment,
    charge,
    both,
    deleteItem,
    editMovement,
    recalculateTotals,
    copyMovements,
    resetMovements
};
