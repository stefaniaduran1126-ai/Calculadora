/*Declarar las variables o constantespara manipular el DOM*/
const nro1 = document.getElementById("nro1");
const nro2 = document.getElementById("nro2");
const resultado = document.getElementById("resultado");
const botones = document.querySelectorAll("input[type='button']");

function operaciones(operador) { 
    
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