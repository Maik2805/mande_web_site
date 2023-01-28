//const { default: swal } = require("sweetalert");

$(document).ready(function () {
    getUsuario()
        .then((usuario) => {
            let texto = "";
            if (!usuario.fotoDocumento) {
                texto += "Debe cargar su documento de identidad para ofrecer servicios.\n" 
                //alert("Debe Cargar su documento de identidad para ofrecer servicios.");
                //swal("Debe cargar su documento de identidad para ofrecer servicios.");
            } else {
                let texto = usuario.fotoDocumento.split("_");
                $("#lbl_documento").text(texto[1] ? texto[1] : usuario.fotoDocumento);
            }
            if (!usuario.fotoPerfil) {
                texto += "Debe cargar su foto de perfil para ofrecer servicios."
                //alert("Debe Cargar su foto de perfil para ofrecer servicios.");
                //swal("Debe cargar su foto de perfil para ofrecer servicios.");
            } else {
                let texto = usuario.fotoPerfil.split("_");
                $("#lbl_imagen").text(texto.length > 0 ? texto[texto.length - 1] : usuario.fotoDocumento);
            }
            if(texto){
                swal("IMPORTANTE", texto);
            }
            loadLaboresInactivasUsuario(usuario);
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
            $("#lbl_imagen").text(texto[1] ? texto[1] : texto);
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
    let element = `<button
    type="button" class="btn btn-outline-info btn-sm col-6"
    data-toggle="modal" data-target="#laborModal" data-rowid="${row.rowId}" data-user="${row.usuarioId}" data-labor="${value}">Editar</button>
    <button
    type="button" class="btn btn-danger btn-sm col-6"
    data-toggle="modal" data-target="#trabajadorEliminar" data-rowid="${row.rowId}" onClick="confirmDeletionModal(this)">Eliminar</button>`;
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

$("#addLaborForm").on("submit", function (event) {
    $("#btnSubmitAddLabor").prop('disabled', true);
    event.preventDefault();
    const array = $(this).serializeArray();
    let idUsuario = getUserData().usuario.celular;
    const json = {};
    $.each(array, function () {
        json[this.name] = this.value || "";
    });
    json["usuarioId"] = idUsuario;
    console.log(json)
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
            $('#tbl_labores').bootstrapTable('refresh');
            loadLaboresInactivasUsuario();
            $('#addLaborForm').trigger("reset");
            swal("Labor Almacenada!", "", "success");
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    }).done(() => {
        $("#btnSubmitAddLabor").prop('disabled', false);
    });
});

function loadFormEditarLabor(rowId) {
    const rowData = $("#tbl_labores").bootstrapTable('getRowByUniqueId', rowId);
    $("#formLaborName").val(rowData.tipo)
    $("#formLaborPrecio").val(rowData.precio)
    $("#formLaborUnidadPrecio").val(rowData.unidadPrecio)
    $("#formLaborId").val(rowData.laborId)
}

function confirmDeletionModal(btn) {
    var button = $(btn);
    var rowId = button.data('rowid');
    const rowData = $("#tbl_labores").bootstrapTable('getRowByUniqueId', rowId);
    swal({
        title: "¿Seguro que quieres Eliminar la Labor?",
        text: `No podrán contratarte para la labor: "${rowData.tipo}"`,
        icon: "warning",
        buttons: ["Cancelar!", "Eliminar!"],
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deleteLabor(rowData.laborId);
            } else {
                swal("Eliminación Cancelada!");
            }
        });
}

function deleteLabor(idLabor) {
    if (idLabor == undefined || idLabor == null) return;
    let idUsuario = getUserData().usuario.celular;
    const json = {
        usuarioId: idUsuario,
        laborId: idLabor
    }
    $.ajax({
        url: BASE_URL + "usuarios/inactiveLaborUsuario",
        type: 'post',
        data: JSON.stringify({ laborTrabajador: json }),
        headers: {
            "Authorization": "Bearer " + getToken(),
            "Content-Type": 'application/json'
        },
        dataType: 'text',
        success: function (data) {
            $('#tbl_labores').bootstrapTable('refresh');
            swal("Labor Eliminada", {
                icon: "success",
            });
            loadLaboresInactivasUsuario();
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });
}

function loadLaboresInactivasUsuario(usuario) {
    if (!usuario) usuario = getUserData().usuario;
    // $("#formAddLaborLabor")
    $.ajax({
        url: BASE_URL + "labores/listarInactivasByUsuario/" + usuario.celular,
        success: (data) => {
            console.log(data);
            var $dropdown = $("#formAddLaborLabor");
            $dropdown.find('option').remove().end();
            $dropdown.append($("<option />").val("").text("Seleccione un trabajo"));
            $.each(data, function () {
                $dropdown.append($("<option />").val(this.id).text(this.tipo));
            });
        },
        dataType: "json",
        headers: { "Authorization": "Bearer " + getToken() }
    });
    return usuario;
}