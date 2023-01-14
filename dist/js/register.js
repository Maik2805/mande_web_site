// $(document).ready(function () {

$("#register-form").on("submit", function (event) {
    event.preventDefault();
    const array = $(this).serializeArray();
    const json = {};
    $.each(array, function () {
        json[this.name] = this.value || "";
    });
    console.log(json);
    $.ajax({
        url: BASE_URL + "app/register",
        type: 'post',
        data: JSON.stringify(json),
        headers: {
            "Content-Type": 'application/json'
        },
        dataType: 'json',
        success: function (data) {
            console.info(data);
            alert("success");
        },
        error: function (data) {
            console.log(data);
            alert(data.responseText);
        }
    });
});
// });