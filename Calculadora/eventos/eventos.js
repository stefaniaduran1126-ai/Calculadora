
//capturar los datos a modificar
const miTexto = document.getElementById('texto')
const miBoton = document.getElementById('miBoton')

//crear tres funciones para un clic, doble clic, clic derecho

function unClic(){
    miTexto.textContent = "👏Haz hecho clic 👏"
    miTexto.style.backgroundColor = "orange"
}

function dobleClic(){
    miTexto.textContent = "✌Haz realizado dos clic ✌"
    miTexto.style.backgroundColor = "yellow"
}

function clicDerecho(){
    miTexto.textContent = "👌Haz realizado clic derecho 👌"
    miTexto.style.backgroundColor = "red"
}

capturar los eventos de los botones y asociarlos a las funciones

document.getElementById("miBoton").addEventListener("click", function(){
    unclick()
})

document.getElementById("miBoton").addEventListener("dblclick", function(){
    dobleClic()
})

miBoton.addEventListener("contextmenu", function(event){
    (event).preventDefault()
    clicDerecho()
})