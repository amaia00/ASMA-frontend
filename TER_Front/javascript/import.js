/**
 * Created by SOFIAA FADDI on 26/04/2017.
 */
var provider;
var nom_file;
$('#import').on('click',function (e) {
    e.preventDefault();
    provider = $('#provider').val();
    nom_file = $('#nom_file').val();
    if (provider  != '' &&  nom_file != '') {
        importation();
    }
    else {
        toastr["error"]('les champs sont vides réessayer', {fadeAway: 2000});
    }

});

function importation() {
    var data = { provider : provider,  file_name : nom_file, name : 'importation_process'};
    console.log(data);

    $.ajax({
        url: 'http://localhost:8000/importation',
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data:  JSON.stringify(data),

        success: function (data) {
            console.log(data);
            $('#import_table tbody').append('<tr><td>'+ data.provider+'</td><td>'+ data.status+'</td>' +
                '<td>'+ data.initial_date+'</td><td>'+data.affected_rows+'</td><td>'+data.error_rows+'</td><td>'+data.total_rows+'</td> ');
            $('#import_table').css('display', 'block');
            toastr.success('L\'importation va commencer', {fadeAway: 100});
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    });
}

