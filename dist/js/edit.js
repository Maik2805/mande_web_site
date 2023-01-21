/**
jquery hace una consulta de los elementos de la base de datos
onload 
una vez obtenido los pinto con jquery
.val() 
 */

//In progress

async function getName() {
    const userData = getUserData();
    var usuario = null;
    await $.ajax({
        url: BASE_URL + "usuarios/find/" + userData.usuario.nombre,
        success: (data) => { usuario = data },
        dataType: "json",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    return usuario;
}

$("#edit-form").on("submit", function (event) {
  event.preventDefault();
  const array = $(this).serializeArray();
  const json = {};
  $.each(array, function () {
    json[this.name] = this.value || "";
  });
  console.log(json);
  $.ajax({
    url: BASE_URL + "app/usuarios/find/326778084",
    type: "get",
    data: JSON.stringify(json),
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: function (data) {
      console.info(data);
      alert("success");
    },
    error: function (data) {
      console.log(data);
      alert(data.responseText);
    },
  });
});
