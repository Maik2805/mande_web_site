$(window).on("load", function () {
    const userData = getUserData();
    if (!userData) {
        window.location.replace("./login.html");
    } else if (new Date(userData.exp * 1000) < new Date()) {
        console.log(new Date(userData.exp));
        alert("Sesión expirada");
        window.location.replace("./login.html");
    } else {
        alert("OK");
    }
});

$(document).ready(function () {
    alert("after")
    //     const userData = getUserData();
    //     if (!userData) {
    //         window.location.replace("./login.html");
    //     } else if (new Date(userData.exp * 1000) < new Date()) {
    //         console.log(new Date(userData.exp));
    //         alert("Sesión expirada");
    //         window.location.replace("./login.html");
    //     } else {
    //         alert("OK");
    //     }
});