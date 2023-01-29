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
            url: BASE_URL + "servicios/findByCliente/" + idUsuario,
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
                trabajador: trabajador.nombre + ' ' + trabajador.apellido,
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
    if (row.estado == 'FINALIZADO') {
        disabled = '';
    }
    let element = `
    <button
    type="button" class="btn btn-info btn-sm col-12"
    data-toggle="modal" data-rowid="${row.rowId}" onClick="confirmCalificateModal(this)" ${disabled}>Calificar</button>`;
    return element;
}

$('#laborModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var rowId = button.data('rowid');
    loadFormEditarLabor(rowId);
});

function confirmCalificateModal(btn) {
    var button = $(btn);
    var rowId = button.data('rowid');
    const rowData = $("#tbl_servicios").bootstrapTable('getRowByUniqueId', rowId);

    swal({
        text: 'Search for a movie. e.g. "La La Land".',
        content: {
            element: "input",
            attributes: {
                type: "number",
                placeholder: "Califica de 1 a 10",
                min: "1",
                max: "10"
            }
        },
        input: 'number',
        buttons: ["Cancelar!", "Calificar!"]
    })
        .then(calificacion => {
            if (calificacion) {
                let json = {
                    usuarioId: getUserData().usuario.celular,
                    calificacion: calificacion,
                    idServicio: rowData.id
                }
                $.ajax({
                    url: BASE_URL + "servicios/calificar",
                    type: 'post',
                    data: JSON.stringify(json),
                    headers: {
                        "Authorization": "Bearer " + getToken(),
                        "Content-Type": 'application/json'
                    },
                    dataType: 'text',
                    success: function (data) {
                        swal("Servicio Calificado", {
                            icon: "success",
                        });
                    },
                    error: function (data) {
                        console.error(data);
                        alert("ERROR: " + data.responseText);
                    },
                    complete: () => $('#tbl_servicios').bootstrapTable('refresh')
                });

            }
        })
    // swal({
    //     title: "¿Seguro que quieres Finalizar la Labor?",
    //     text: `Será marcada para la que el cliente la califique.`,
    //     icon: "warning",
    //     buttons: ["Cancelar!", "Finalizar!"],
    //     dangerMode: true,
    // })
    //     .then((willFinish) => {
    //         if (willFinish) {
    //             calificarLabor(rowData.id);
    //         } else {
    //             swal("Finalización Cancelada!");
    //         }
    //     });
}


function calificarLabor(idServicio) {
    if (idServicio == undefined || idServicio == null) return;
    let idUsuario = getUserData().usuario.celular;
    const json = {
        usuarioId: idUsuario,
        idServicio: idServicio
    }
    $.ajax({
        url: BASE_URL + "servicios/calificar",
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
