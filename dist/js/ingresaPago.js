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

$("#fecha_expiracion").datepicker( {
  format: "mm-yyyy",
  startView: "months", 
  minViewMode: "months"
});