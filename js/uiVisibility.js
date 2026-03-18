/* ./js/uiVisibility.js */
/* ===== VISIBILIDAD MOVIMIENTOS ===== */
/* ===== MOSTRAR MOVIMIENTOS ===== */
import { uiShowMovements } from "./ui.js";
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

window.toggleMovements = toggleMovements;

export { movementsVisible, toggleMovements };
