$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            if (!usuario.fotoRecibo) {
                alert("Debe Cargar una foto del recibo para contratar servicios");
            } else {
                var texto = usuario.fotoRecibo.split("_");
                $("#lbl_imagen").text(texto.length > 0 ? texto[texto.length - 1] : usuario.fotoRecibo);
            }
        }).catch((err) => console.error(err));
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
    console.log(row);
    let element = `<button
    type="button" class="btn btn-outline-info btn-sm"
    data-toggle="modal" data-target="#trabajadorModal" data-user="${value}" data-labor="${row.id}">Contratar</button>`;
    return element;
}

$('#trabajadorModal').on('show.bs.modal', function (event) {
    loadingModal();
    var button = $(event.relatedTarget);
    var usuario = button.data('user');
    var labor = button.data('labor');
    $.ajax({
        url: BASE_URL + "usuarios/getPublicInfo/" + usuario,
        success: (data) => loadTrabajadorCard(data, labor),
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

function loadTrabajadorCard(data, labor) {
    let defaultImg = "https://www.w3schools.com/bootstrap4/img_avatar1.png"
    let imgPath = data.fotoPerfil ? BASE_URL + "public/data_lake/imagenes/" + data.fotoPerfil : defaultImg;
    let html = `<div class="card" style="width:400px">
    <img class="card-img-top" src="${imgPath}"
        alt="Card image">
    <div class="card-body">
        <h4 class="card-title">${data.nombreCompleto}</h4>
        <h5 class="card-title">Email: ${data.correoElectronico}</h5>
        <h6>Numero Estrellas: ${data.numeroEstrellas}</h6>
        <h6>Promedio Estrellas: ${data.promedioEstrellas}</h6>
        <button class="btn btn-outline-primary contratar-btn" data-trabajador="${data.celular}" data-labor="${labor}"
         onClick="contratarTrabajadorLabor(this)">Contratar</button>
    </div>
</div>`;
    $("#modalBody").html(html);

}

function contratarTrabajadorLabor(btnClicked) {
    $(btnClicked).prop('disabled', true);
    let trabajador = $(btnClicked).data('trabajador');
    let labor = $(btnClicked).data('labor');
    let input = prompt('Cantidad a contratar.');

    let cantidad = parseInt(input);
    if (!isNaN(cantidad) && cantidad > 0) {
        const data = {
            "trabajador": trabajador,
            "labor": labor,
            "cantidad": cantidad
        }
        // alert("Contratando!: " + trabajador + ' ' + labor + ' cant: ' + cantidad)
        loadingModal();
        $.ajax({
            url: BASE_URL + "servicios/createBasic",
            type: 'post',
            data: JSON.stringify(data),
            headers: {
                "Content-Type": 'application/json',
                "Authorization": "Bearer " + getToken()
            },
            dataType: 'text',
            success: function (data) {
                $('#tbl_disponibles').bootstrapTable('refresh')
                swal("Servicio Contratado!", "El trabajador te contactará proximamente", "success");
            },
            error: function (data) {
                console.error(data);
                alert("ERROR: " + data.responseText);
            }
        }).done(() => {
            $(btnClicked).prop('disabled', false);
            $("#trabajadorModal").modal('hide');
        });
    }
}

const loadingModal = () => {
    $("#modalBody").html(`<div class="text-center">
                    <div class="spinner-border text-secondary m-4" role="status">
                    <span class="sr-only">Loading...</span>
                    </div>
                </div>`);
}