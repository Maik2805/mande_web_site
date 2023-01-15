$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            console.log("aaaaaa", usuario)
            if (!usuario.fotoRecibo) {
                alert("Debe Cargar una foto del recibo para contratar servicios");
            } else {
                var texto = usuario.fotoRecibo.split("_");
                console.log(texto)
                $("#lbl_imagen").text(texto[1] ? texto[1] : usuario.fotoRecibo);
            }
        }).catch((err) => console.error(err));

    // $("#tbl_disponibles").bootstrapTable('updateFormatText', 'NoMatches', 'Por favor realice la busqueda');


    // $("#tbl_disponibles").bootstrapTable({
    //     data: [
    //         {
    //             'id': 0,
    //             'name': 'Item 0',
    //             'price': '$0'
    //         },
    //         {
    //             'id': 1,
    //             'name': 'Item 1',
    //             'price': '$1'
    //         },
    //         {
    //             'id': 2,
    //             'name': 'Item 2',
    //             'price': '$2'
    //         },
    //         {
    //             'id': 3,
    //             'name': 'Item 3',
    //             'price': '$3'
    //         },
    //         {
    //             'id': 4,
    //             'name': 'Item 4',
    //             'price': '$4'
    //         },
    //         {
    //             'id': 5,
    //             'name': 'Item 5',
    //             'price': '$5'
    //         }
    //     ]
    // })


});

$("#cargar_recibo").on("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);

    $.ajax({
        url: BASE_URL + "usuarios/uploadFotoRecibo",
        type: 'post',
        data: formData,
        headers: { "Authorization": "Bearer " + getToken() },
        processData: false,
        contentType: false,
        success: function (data) {
            alert("Imagen cargada Correctamente: " + data);
            $('#cargar_recibo').trigger("reset");
            var texto = data.split("_");
            $("#lbl_imagen").text(texto[1] ? texto[1] : texto);
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });

});


function ajaxRequest(params) {
    console.log("aquiii");
    $.ajax({
        url: BASE_URL + "labores/disponibles/",
        success: (data) => {
            console.log(data);
            params.success({
                rows: data
            });
        },
        dataType: "json",
        headers: { "Authorization": "Bearer " + getToken() }
    });

}
