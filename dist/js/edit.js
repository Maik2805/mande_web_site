$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            $("#nombre").val(usuario.nombre);
            $("#apellido").val(usuario.apellido);
            $("#tipoDocumento").val(usuario.tipoDocumento);
            $("#documento").val(usuario.documento);
            $("#celular").val(usuario.celular);
            $("#correoElectronico").val(usuario.correoElectronico);
            $("#direccion").val(usuario.direccion);
            
        }).catch((err) => console.error(err));
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

  $("#edit-form").on("submit",function (event) {
    event.preventDefault();

    const array = $(this).serializeArray();
    const json = {};
    $.each(array, function () {
        json[this.name] = this.value || "";
    });  
    json["celular"] = getUserData().usuario.celular;
    $.ajax({
      type: "post",
      url: BASE_URL + "usuarios",
      data: JSON.stringify(json),
      headers: {
        "Authorization": "Bearer " + getToken(),
        "Content-Type": 'application/json'
    },
    dataType: 'json',
      success: function (response) {
        swal({
          title: "Gracias por actualizar tus datos!",
        })
      },
      error: function (error) {
        
        alert("Tuki X-X");
      },
    });
  });