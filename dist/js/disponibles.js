$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            if (!usuario.fotoRecibo) {
                alert("Debe Cargar una foto del recibo para contratar servicios");
            } else {
                var texto = usuario.fotoRecibo.split("_");
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
        url: BASE_URL + "labores/disponiblesRaw",
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

function contratarFormatter(value, row) {
    let element = `<button
    type="button" class="btn btn-outline-info btn-sm"
    data-toggle="modal" data-target="#trabajadorModal" data-user="${value}">Contratar</button>`;
    return element;
}

$('#trabajadorModal').on('show.bs.modal', function (event) {
    $("#modalBody").html(`<div class="text-center">
                    <div class="spinner-border text-secondary m-4" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                </div>`);
    var button = $(event.relatedTarget);
    var usuario = button.data('user');
    $.ajax({
        url: BASE_URL + "usuarios/getPublicInfo/" + usuario,
        success: (data) => loadTrabajadorCard(data),
        error: (msg) => {
            $(this).modal('hide');
            alert("Error: " + msg.responseText)
        },
        dataType: "json",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    var modal = $(this)
    // modal.find('#modal_content').text(usuario)
    // modal.find('.modal-body input').val(recipient)
});

function loadTrabajadorCard(data) {
    console.log(data);
    let html = `<div class="card" style="width:400px">
    <img class="card-img-top" src="${BASE_URL}public/data_lake/imagenes/${data.fotoPerfil}"
        alt="Card image">
    <div class="card-body">
        <h4 class="card-title">${data.nombreCompleto}</h4>
        <h5 class="card-title">Email: ${data.correoElectronico}</h5>
        <h6>Numero Estrellas: ${data.numeroEstrellas}</h6>
        <h6>Numero Estrellas: ${data.promedioEstrellas}</h6>
        <a href="#" class="btn btn-primary text-center">Contratar</a>
    </div>
</div>`;
    $("#modalBody").html(html);

}
