// $(document).ready(function () {
$("#login-form").on("submit", function (event) {
    event.preventDefault();
    const array = $(this).serializeArray();
    const json = {};
    $.each(array, function () {
        json[this.name] = this.value || "";
    });
    console.log(json);
    $.ajax({
        url: BASE_URL + "app/login",
        type: 'post',
        data: JSON.stringify(json),
        headers: {
            "Content-Type": 'application/json'
        },
        dataType: 'text',
        success: function (data) {
            console.log(data);
            saveToken(data.toString());
            //swal("Estás dentro!", "Gracias por elegir Mande App")
            swal({
                title: "Estás dentro!",
                text: "Gracias por elegir mande App",
                type: "success",
                timer: 2500,
                showConfirmButton: false                
                })
            .then(() => {
                window.location.replace("./index.html");
            })
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });
});

// });