$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            if (!usuario.fotoDocumento) {
                alert("Debe Cargar su documento de identidad para ofrecer servicios.");
            } else {
                let texto = usuario.fotoDocumento.split("_");
                $("#lbl_documento").text(texto[1] ? texto[1] : usuario.fotoDocumento);
            }
            if (!usuario.fotoPerfil) {
                alert("Debe Cargar su foto de perfil para ofrecer servicios.");
            } else {
                let texto = usuario.fotoPerfil.split("_");
                $("#lbl_imagen").text(texto.length > 0 ? texto[texto.length - 1] : usuario.fotoDocumento);
            }
        }).catch((err) => console.error(err));

    // $("#tbl_labores").bootstrapTable('updateFormatText', 'NoMatches', 'Por favor realice la busqueda');

});

$("#cargar_documento").on("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);

    $.ajax({
        url: BASE_URL + "usuarios/uploadDocumento",
        type: 'post',
        data: formData,
        headers: { "Authorization": "Bearer " + getToken() },
        processData: false,
        contentType: false,
        success: function (data) {
            alert("Documento cargado Correctamente: " + data);
            $('#cargar_documento').trigger("reset");
            var texto = data.split("_");
            $("#lbl_documento").text(texto[1] ? texto[1] : texto);
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });

});

$("#cargar_foto_perfil").on("submit", function (event) {
    event.preventDefault();
    var formData = new FormData(this);

    $.ajax({
        url: BASE_URL + "usuarios/uploadFotoPerfil",
        type: 'post',
        data: formData,
        headers: { "Authorization": "Bearer " + getToken() },
        processData: false,
        contentType: false,
        success: function (data) {
            alert("Foto de perfil cargada correctamente: " + data);
            $('#cargar_documento').trigger("reset");
            var texto = data.split("_");
            $("#lbl_documento").text(texto[1] ? texto[1] : texto);
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });

});


function ajaxRequest(params) {
    try {
        let idUsuario = getUserData().usuario.celular;
        $.ajax({
            url: BASE_URL + "labores/findByUsuario/" + idUsuario,
            success: (data) => {
                // console.log(data);
                params.success(data);
            },
            dataType: "json",
            headers: { "Authorization": "Bearer " + getToken() }
        });
    } catch (error) {
        params.error();
    }

}

function responseHandler(res) {
    if (res.length > 0) {
        let data = [];
        console.log("En respH", res);
        for (var i = 0; i < res.length; i++) {
            var val = res[i];
            let labDetail = val.laborTrabajador[0];
            data.push({
                id: val.id,
                tipo: val.tipo,
                descripcion: val.descripcion,
                laborId: labDetail.laborId,
                precio: labDetail.precio,
                unidadPrecio: labDetail.unidadPrecio,
                usuarioId: labDetail.usuarioId,
                rowId: i
            });
        }
        return data

    } else {
        return res;
    }
}

function editarFormatter(value, row) {
    console.log(row);
    let element = `<button
    type="button" class="btn btn-outline-info btn-sm col-6"
    data-toggle="modal" data-target="#laborModal" data-rowid="${row.rowId}" data-user="${row.usuarioId}" data-labor="${value}">Editar</button>
    <button
    type="button" class="btn btn-danger btn-sm col-6"
    data-toggle="modal" data-target="#trabajadorEliminar" data-rowid="${row.rowId}" data-user="${row.usuarioId}" data-labor="${value}">Eliminar</button>`;
    return element;
}

$('#laborModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var rowId = button.data('rowid');
    loadFormEditarLabor(rowId);
});

$("#actualizarLaborForm").on("submit", function (event) {
    $("#btnSubmitActualizarLabor").prop('disabled', true);
    event.preventDefault();
    const array = $(this).serializeArray();
    let idUsuario = getUserData().usuario.celular;
    const json = {};
    $.each(array, function () {
        json[this.name] = this.value || "";
    });
    json["usuarioId"] = idUsuario;
    json["laborId"] = $("#formLaborId").val();
    console.log("JSON A ENVIAR: ", json)
    $.ajax({
        url: BASE_URL + "usuarios/addLaborUsuario",
        type: 'post',
        data: JSON.stringify({ laborTrabajador: json }),
        headers: {
            "Authorization": "Bearer " + getToken(),
            "Content-Type": 'application/json'
        },
        dataType: 'text',
        success: function (data) {
            console.log(data);
            $('#tbl_labores').bootstrapTable('refresh');
            swal("Labor Actualizada!", "", "success");
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    }).done(() => {
        $("#btnSubmitActualizarLabor").prop('disabled', false);
        $("#laborModal").modal('hide');
    });
});

function loadFormEditarLabor(rowId) {
    console.log("rowwwId", rowId);
    const rowData = $("#tbl_labores").bootstrapTable('getRowByUniqueId', rowId);
    $("#formLaborName").val(rowData.tipo)
    $("#formLaborPrecio").val(rowData.precio)
    $("#formLaborUnidadPrecio").val(rowData.unidadPrecio)
    $("#formLaborId").val(rowData.laborId)
    console.log(rowData);
}