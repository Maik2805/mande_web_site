/**
jquery hace una consulta de los elementos de la base de datos
onload 
una vez obtenido los pinto con jquery
.val() 
 */

//Por si se ingresa erroneamente a Edut, poder redirigir a Login.
$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);

$(document).ready(function () {
    console.log("Tuki");
    completeUserInfo();
});

$(window).on("load", function () {
    const userData = getUserData();
    if (!userData) {
        alert("Debe iniciar sesión");
        window.location.replace("./login.html");
    } else if (new Date(userData.exp * 1000) < new Date()) {
        console.log(new Date(userData.exp));
        alert("Sesión expirada");
        window.location.replace("./login.html");
    }
});

function completeUserInfo() {
    const userData = getUserData().usuario;
    $("#nombre_completo").val(userData.nombre_completo);
    $("#documento").val(userData.documento);
    $("#celular").val(userData.celular);
    $("#correoElectronico").val(userData.correoElectronico);
}