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
            alert("success");
        },
        error: function (data) {
            console.error(data);
            alert(data.responseText);
        }
    });
});

// });