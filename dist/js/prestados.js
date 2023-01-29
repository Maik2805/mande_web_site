//const { default: swal } = require("sweetalert");

$(document).ready(function () {
    // getUsuario()
    //     .then((usuario) => {

    //     }).catch((err) => console.error(err));

    // $("#tbl_servicios").bootstrapTable('updateFormatText', 'NoMatches', 'Por favor realice la busqueda');

});


function ajaxRequest(params) {
    try {
        let idUsuario = getUserData().usuario.celular;
        $.ajax({
            url: BASE_URL + "servicios/findByTrabajador/" + idUsuario,
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
            let trabajador = val.trabajador;
            let cliente = val.cliente;
            let labor = val.labor;
            data.push({
                id: val.id,
                fechaCreacion: new Date(val.fechaCreacion),
                fechaFinalizacion: val.fechaTerminacion,
                labor: labor.tipo,
                cliente: cliente.nombre + ' ' + cliente.apellido,
                descripcion: val.descripcion,
                laborId: labor.id,
                precio: val.precio,
                calificacion: val.calificacion,
                estado: val.estado,
                rowId: i
            });
        }
        return data

    } else {
        return res;
    }
}

function editarFormatter(value, row) {
    let disabled = 'disabled';
    if (row.estado == 'EN PROCESO') {
        disabled = '';
    }
    let element = `
    <button
    type="button" class="btn btn-info btn-sm col-12"
    data-toggle="modal" data-rowid="${row.rowId}" onClick="confirmDeletionModal(this)" ${disabled}>Finalizar</button>`;
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
            $('#tbl_servicios').bootstrapTable('refresh');
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
            $('#tbl_servicios').bootstrapTable('refresh');
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
    const rowData = $("#tbl_servicios").bootstrapTable('getRowByUniqueId', rowId);
    $("#formLaborName").val(rowData.tipo)
    $("#formLaborPrecio").val(rowData.precio)
    $("#formLaborUnidadPrecio").val(rowData.unidadPrecio)
    $("#formLaborId").val(rowData.laborId)
}

function confirmDeletionModal(btn) {
    var button = $(btn);
    var rowId = button.data('rowid');
    const rowData = $("#tbl_servicios").bootstrapTable('getRowByUniqueId', rowId);
    swal({
        title: "¿Seguro que quieres Finalizar la Labor?",
        text: `Será marcada para la que el cliente la califique.`,
        icon: "warning",
        buttons: ["Cancelar!", "Finalizar!"],
        dangerMode: true,
    })
        .then((willFinish) => {
            if (willFinish) {
                finalizarLabor(rowData.id);
            } else {
                swal("Finalización Cancelada!");
            }
        });
}


function finalizarLabor(idServicio) {
    if (idServicio == undefined || idServicio == null) return;
    let idUsuario = getUserData().usuario.celular;
    const json = {
        usuarioId: idUsuario,
        idServicio: idServicio
    }
    $.ajax({
        url: BASE_URL + "servicios/finalizar",
        type: 'post',
        data: JSON.stringify(json),
        headers: {
            "Authorization": "Bearer " + getToken(),
            "Content-Type": 'application/json'
        },
        dataType: 'text',
        success: function (data) {
            $('#tbl_servicios').bootstrapTable('refresh');
            swal("Servicio Finalzado", {
                icon: "success",
            });
        },
        error: function (data) {
            console.error(data);
            alert("ERROR: " + data.responseText);
        }
    });
}
