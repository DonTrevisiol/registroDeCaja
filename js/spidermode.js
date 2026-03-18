/* ./js/spidermode.js */

/* === SPIDER MODE === */
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

/* SPIDER FUNCTIONS: */
document.addEventListener("click", function(e){

    if(!document.body.classList.contains("spider-mode")) return;

    createWeb(e.clientX, e.clientY);

});

export { toggleSpiderMode };
