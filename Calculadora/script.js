/*Declarar las variables o constantespara manipular el DOM*/
/*definir variables o constantes*/

//const nro1 = document.getElementById("nro1")
//const nro2 = document.getElementById("nro2")
//const lblResultado = document.getElementById("lblResultado")

//querySelector()
//class .
//id #

const nro1 = document.querySelector("#nro1")
const nro2 = document.querySelector("#nro2")
const resultado = document.querySelector("#resultado")

function Operaciones(operador){
    //validar que los numeros existan

    if (nro1.value === "" || nro2.value === null){


function operaciones(operador) { 
    /*definir que los valores existan*/

    if(nro1.value === "" || nro2.value === "") {
    
        resultado.textContent = "Concentradito.... necesita dos numeros.";
    }else {
        switch(operador) {
            case "+": resultado.textContent = Number(nro1.value) + Number(nro2.value); break;
            case "-": resultado.textContent = Number(nro1.value) - Number(nro2.value); break;
            case "*": resultado.textContent = Number(nro1.value) * Number(nro2.value); break;
            case "/": resultado.textContent = Number(nro1.value) / Number(nro2.value); break;
            case "clear": limpiar(); break;
            default: resultado.textContent = "Operador no valido"; break;
            function limpiar() {
                nro1.value = "";
                nro2.value = "";
                resultado.textContent = "Resultado:";
            }
        }
    }
}