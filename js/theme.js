/* ./js/theme.js */
/* === DARK MODE === */
function toggleDarkMode() {
 document.body.classList.toggle("dark");
  //guardar preferencia:
 if(document.body.classList.contains("dark")) {
  localStorage.setItem("darkMode", "enabled");
  } else {
   localStorage.setItem("darkMode", "disabled");
   }
  } 

/* === CARGAR PREFERENCIA AL INICIAR === */
function loadDarkMode() {
 const darkMode = localStorage.getItem("darkMode");
	
 if(darkMode === "enabled") {
  document.body.classList.add("dark");
 }
}

export { toggleDarkMode, loadDarkMode };
