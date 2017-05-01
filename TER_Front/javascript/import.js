/**
 * Created by SOFIAA FADDI on 26/04/2017.
 */
var nom_file;
var nom_country;
var imported_countries;
$('#import').on('click',function (e) {
    e.preventDefault();
    nom_file = $('#nom_file').val();
    nom_country = $('#nom_country').val();
    if (nom_country  != '' &&  nom_file != '') {
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization':'Token '+localStorage.getItem('id_session'),
                'Content-Type':'application/json'
            },
            url: 'http://localhost:8000/country-imported',


            success: function (data) {
                console.log(data);
                imported_countries=data.results;
                $('#patientez').modal({backdrop: 'static', keyboard: false, show: true})  ;

            },

            error: function (request, status, error) {
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


            }
        }).then(function(){
            var b = false;
            for(var i = 0 ; i<imported_countries.length ; i++){
                if(imported_countries[i].country_name==nom_country){
                    b = true;
                    break;
                }
            }
            if(!b){
                importation();
            }
            else{
                toastr["error"]('ce pays existe déjà', {fadeAway: 2000});
            }
        });

    }
    else {
        toastr["error"]('les champs sont vides réessayer', {fadeAway: 2000});
    }

});

function importation() {
    var data = { name : 'importation',  file_name : nom_file, country_name : nom_country};
    console.log(data);
    var id='';
    $.ajax({
        url: 'http://localhost:8000/scheduled-work',
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
            toastr["success"]('Importation plannifiée. Elle démarera dans quelque instatnt. Merci de patienter.', {fadeAway: 2000});

            $('#patientez').modal('show');
            id=data.id;
            //while(!b){

            //}
            /*$('#import_table tbody').append('<tr><td>'+ data.provider+'</td><td>'+ data.status+'</td>' +
                '<td>'+ data.initial_date+'</td><td>'+data.affected_rows+'</td><td>'+data.error_rows+'</td><td>'+data.total_rows+'</td> ');
            $('#import_table').css('display', 'block');
            toastr.success('L\'importation va commencer', {fadeAway: 100});*/
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    }).then(function(){
        setInterval("checkfin("+id+")", 5500);
    });
}

$('#corr').on('click',function (e) {
    var data = { name : 'global-match'};
    console.log(data);

    $.ajax({
        url: 'http://localhost:8000/scheduled-work',
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
            toastr["success"]('Correspondance plannifiée. Elle démarera dans quelque instatnt. Merci de patienter.', {fadeAway: 2000});
            /*$('#import_table tbody').append('<tr><td>'+ data.provider+'</td><td>'+ data.status+'</td>' +
             '<td>'+ data.initial_date+'</td><td>'+data.affected_rows+'</td><td>'+data.error_rows+'</td><td>'+data.total_rows+'</td> ');
             $('#import_table').css('display', 'block');
             toastr.success('L\'importation va commencer', {fadeAway: 100});*/
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    });
});
$('#type_corr').on('click',function (e) {
    var data = { name : 'type-matching'};
    console.log(data);

    $.ajax({
        url: 'http://localhost:8000/scheduled-work',
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
            toastr["success"]('Correspondance des Types plannifiée. Elle démarera dans quelque instatnt. Merci de patienter.', {fadeAway: 2000});
            /*$('#import_table tbody').append('<tr><td>'+ data.provider+'</td><td>'+ data.status+'</td>' +
             '<td>'+ data.initial_date+'</td><td>'+data.affected_rows+'</td><td>'+data.error_rows+'</td><td>'+data.total_rows+'</td> ');
             $('#import_table').css('display', 'block');
             toastr.success('L\'importation va commencer', {fadeAway: 100});*/
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    });
});
var b = false;
function checkfin(id){
    console.log('checkfin');
    $.ajax({
        url: 'http://localhost:8000/scheduled-work/'+id,
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        type: 'GET',
        dataType: 'json',
        contentType: "application/json",

        success: function (data) {
            if(data.detail!= 'Not found.'){
                if(data.status=='FINALIZED' || data.status=='ERROR' ){
                    b=true;
                    if(data.status=='FINALIZED'){
                        toastr["success"]('Importation des données réussite.', {fadeAway: 2000});
                    }
                    if(data.status=='ERROR'){
                        toastr["error"]('L\'importation des données a échoué.', {fadeAway: 2000});
                    }
                }
            }
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    }).then(function(){
        if(b){
            $('#patientez').modal('hidde');
        }
    });
}