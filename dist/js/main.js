$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['es-ES']);
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
    $("#username_header").text(userData.usuario.nombre_completo)
});

$(document).ready(function () {
    console.log("Page Ready")
    bsCustomFileInput.init()
    completeUserInfo();
});

function completeUserInfo() {
    const userData = getUserData().usuario;
    $("#username_header").text(userData.nombre_completo)
}

async function getUsuario() {
    const userData = getUserData();
    var usuario = null;
    await $.ajax({
        url: BASE_URL + "usuarios/find/" + userData.usuario.celular,
        success: (data) => { usuario = data },
        dataType: "json",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    return usuario;
}