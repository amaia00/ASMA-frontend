/**
 * Created by FADDI SOFIAA on 25/04/2017.
 */
var password;
var login;
montrer_data();
$('.btn_authen').on('click', function (e) {
    e.preventDefault();
    password = $('#pass_login').val();
    login = $('#login').val();
    console.log(password);
    if (password != '' && login != '') {
        authentification();
    }
    else {
        toastr["error"]('les champs sont vides réessayer', {fadeAway: 2000});
    }

});
function authentification() {
    var data = { username:login, password:password };

    $.ajax({
        url: 'http://localhost:8000/api-token-auth/',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),

    success: function (data) {
            console.log(data);
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("id_session", data.token );
            document.location.href="index.html"

        } else {
            toastr["error"]('Erreur', {fadeAway: 2000});
        }

    }
,
    error: function (request) {
        var erreur = JSON.parse(request.responseText).non_field_errors[0];
        if(erreur=='Unable to log in with provided credentials.') {
            toastr["error"]('Mot de passe et login sont incorrect', {fadeAway: 2000});
        }

    }

});
}

function montrer_data() {
    var id_session_user = localStorage.getItem('id_session');
    if(id_session_user != null) {
        $('#menu').prepend('<li><a href="configuration.html">Configuration</a></li>')
    }

}