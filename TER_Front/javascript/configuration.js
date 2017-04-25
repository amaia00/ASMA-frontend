/**
 * Created by FADDI SOFIAA on 23/04/2017.
 */
var parametre_data = [];
var compare_valeur1 = [];
var data_value = [];
var sendone = 0;
$(document).ajaxStart($.blockUI({message: '<h1><i class="fa fa-circle-o-notch fa-spin fa-4x fa-fw"></i><br/> Patientez un instant...</h1>'})).ajaxStop($.unblockUI);

var boolsend = false;
var reinitialise = false;


$('#accordion').collapse({
    toggle: true
});

var selectIds = $('#collapse1,#collapse2');
$(function ($) {
    selectIds.on('show.bs.collapse hidden.bs.collapse', function () {
        $(this).prev().find('i').toggleClass('fa-plus fa-minus');
    })
});

$('#config tbody').on('click', '.edit', function () {
    var element_change = $(this).parent().attr('id').split('-');
    console.log($(this).parent().find('.valeur').val());
    var element_change_id = element_change[1];
    console.log($(this).parent().find('.name').text());
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://localhost:8000/parameters/' + element_change_id,
        data: {
            "name": $(this).parent().find('.name').text(),
            "value": $(this).parent().find('.valeur').val(),
            "description": $(this).parent().find('.description').text()
        },
        success: function (data) {
            toastr.options = {
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "700",
                "extendedTimeOut": "0"
            },
                toastr.success('Les données ont été modifiés  ! Merci', {fadeAway: 100});

        },
        error: function (request, status, error) {
            toastr.options = {
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "700",
                "extendedTimeOut": "0"
            },
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});
        }
    });
});

get_all_parameter();

    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8000/parameters',
        success: function (data) {
            for (var i = 0; i < data.results.length; i++) {
                $("#config tbody").append("<tr id='element-" + data.results[i].name + "'role='row' class='odd'>" +
                    "<td class='name' id='" + data.results[i].name + "' style='text-decoration:underline;'>" + data.results[i].name.toUpperCase() + "</td>" +
                    "<td><input type='number' min='0' step='0.1' max='1' class='form-control valeur' value='" + parseFloat(data.results[i].value) + "'/></td><td class='description'>" + data.results[i].description + "</td><td class='edit'><a><i class='fa fa-floppy-o' aria-hidden='true'></i>Enregistrer</a></td>");
            }
            if ($("#config").length != 0) {
                $('#config').DataTable({
                    "language": {
                        "lengthMenu": " Nombre de ligne par page _MENU_",
                        "zeroRecords": "Pas de resultat trouvé",
                        "info": " ",
                        "infoEmpty": "No records available",
                        "search": "Rechercher :",
                        "infoFiltered": "( _MAX_ total entrés )",
                        "paginate": {
                            "first": "Premier",
                            "last": "Dernier",
                            "next": "Suivant",
                            "previous": "Précédent"
                        },
                    },
                    "ordering": true,
                    "lengthMenu": [4, 8, 12, 16, 20, 24, 28, 32],
                    "info": true,
                    "bInfo": false,
                    columnDefs: [{
                        targets: "datatable-nosort",
                        orderable: false
                    }]

                });
            }
        }
    });



function nommage(i) {
    var nom = 'gekk';
    if (i == 'weight_type') {
        nom = 'Poids du type';
    }
    else if (i == 'weight_name') {
        nom = 'Poids du nom';
    }
    else if (i == 'weight_coordinates') {
        nom = 'Poids des coordonnées';
    }
    return nom;

}
function get_all_parameter() {
    $('#name_parametre').html(" ");
    $('#valeur_parametre').html(" ");
    $('.autres').html(" ");
    $('.btn_pardefaut').html(" ");

    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence',
        success: function (data) {
            parametre_data = data;
            data_value.length = 0;
            for (i = 0; i < data.results.length; i++) {
                if (data.results[i].name == "weight_matching_global") {
                    sendone = data.results[i].id;
                    for (j = 2; j < 5; j++) {
                        $('#name_parametre').append('<li id="scoreper-' + j + '-defaut">' + nommage(Object.keys(data.results[0])[j]) +
                            '<span> ' + parseInt(j - 2) + '*</span></li>');
                    }
                    $('#valeur_parametre').append('<li><input class="type_edit form-control" value="' + data.results[i].weight_type + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled></li><li><input class="name_edit form-control" value="' + data.results[i].weight_name + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled></li><li><input class="coordinate_edit form-control" value="' + data.results[i].weight_coordinates + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled>' +
                        '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li>');
                    $('.btn_pardefaut').append('<button type="button" title="Add new specific type" class="add_type" id="send_type-'+  + data.results[i].id+'"> ' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button> <br/> <br/>');


                    data_value.push(data.results[i].weight_type);
                    data_value.push(data.results[i].weight_name);
                    data_value.push(data.results[i].weight_coordinates);

                }
                else {
                    $('.autres').append('<div class=" name_parametre_speci each_element-' + data.results[i].id + '"><label>Nom du paramètre : </label>');
                    for (j = 2; j < 5; j++) {
                        $('.autres').append('<ul class="name_parametre_speci each_element-' + data.results[i].id + '">' +
                            '<li id="scoreper-' + data.results[i].id + '-' + j + '">' + nommage(Object.keys(data.results[i])[j]) + '' +
                            ' <span> ' + parseInt(j - 2) + '*</span></li></ul>');
                    }
                    $('.autres').append('<br/><div class="each_element-' + data.results[i].id + '"><label>Valeur( entre 0 et 1) : </label><ul class="valeur_parametre_speci"><li><input class="type_edit form-control" value="' + data.results[i].weight_type + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled></li><li><input class="name_edit form-control" value="' + data.results[i].weight_name + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled></li><li><input class="coordinate_edit form-control" value="' + data.results[i].weight_coordinates + '"type="number"min="0" step="0.1" ' +
                        'max="1" class="form-control valeur_input" disabled>' +
                        '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li></ul></div>');
                    $(".autres").append('<div class="each_element-' + data.results[i].id + ' parametre_type_specific"> <div class="osm_type"><div class="sous_cat"> <label>Clé OpenStreetMap</label> ' +
                        '<input id="cle_osm-' + data.results[i].id + '" type="text" class="form-control osmcle" value="' + data.results[i].osm_key_type + '" placeholder="Par exemple amenity"/> </div> <div class="sous_cat"> ' +
                        '<label>Valeur OpenStreetMap</label> <input id="valeur_osm-' + data.results[i].id + '" type="text"  value="' + data.results[i].osm_value_type + '" class="osmvaleur form-control" placeholder="Par exemple restaurant"/> </div> </div> ' +
                        '<div class="geoname_type"> <div class="sous_cat"> <label>Classe Geoname</label> <input maxlength="1" id="class_gn-' + data.results[i].id + '" type="text" class=" classgn form-control" value="' + data.results[i].gn_feature_class + '" placeholder="Par exemple S "/> ' +
                        '</div> <div class="sous_cat"> <label>code Geoname</label> <input class="codegn" id="code_gn-' + data.results[i].id + '" value="' + data.results[i].gn_feature_code + '" type="text" class="form-control codegn" placeholder="Par exemple rest "/> ' +
                        '</div> </div></div><br/>');
                    $(".autres").append('<div class="each_element-' + data.results[i].id + '" style="text-align: center;"><br/><br/><button type="button" title="Add new specific type" ' +
                        'class="add_type" id="send_type-' + data.results[i].id + '">' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button><button type="button" title="remove specific type" ' +
                        'class="remove_type" id="remove_type-' + data.results[i].id + '">' +
                        '<i class="fa fa-trash" aria-hidden="true"></i> Supprimer</button><br/><br/></div>');
                    $(".autres").append('<div class="separateur each_element-' + data.results[i].id + '"></div>');
                    $(".each_element-" + data.results[i].id + "").wrapAll("<div class=' all_element_config' id='all_element-" + data.results[i].id + "'/>");
                }
            }
            reinitialise = true;
        },
        error: function (request, status, error) {
            toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 5000});

            reinitialise = false;
        },


    });
    return reinitialise;
}
$.ajax({
    dataType: 'json',
    url: 'http://localhost:8000/parameters/weight_matching_description',
    success: function (data) {
        var donnes_score = JSON.parse(data.value);
        $(".rectangles_information").append('<p><span>0* </span>' + donnes_score.weight_type_matching + '</p>');
        $(".rectangles_information").append('<p><span>1* </span>' + donnes_score.weight_name_matching + '</p>');
        $(".rectangles_information").append('<p><span>2* </span>' + donnes_score.weight_geographical_coordinates + '</p>');
    },
});
$(document).on('click', '#show_more', function () {
    $(this).find('i').removeClass("fa-plus");
    $(this).find('i').addClass("fa-minus");
    $(this).removeAttr('id');
    $(this).attr('id', 'hide_more');
    $(".rectangles_information").css('display', 'inline-block');
});
$(document).on('click', '#hide_more', function () {
    $(this).find('i').removeClass("fa-minus");
    $(this).find('i').addClass("fa-plus");
    $(this).removeAttr('id');
    $(this).attr('id', 'show_more');
    $(".rectangles_information").css('display', 'none');
});
$(document).on('click', '.score_pertinences_link a', function (event) {
    event.preventDefault();
    var input_configuration = $(this).parent().parent().find('input');
    input_configuration.prop("disabled", false);
    input_configuration.focus();
});
$(document).on('click','.remove_type',function () {
    var split_element = $(this).attr('id').split('-');
    var id = split_element[1];
    var this_div = $(this);
    $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence/' + id,
        data: {

        },
        success: function (data) {
            toastr.options = {
                "showDuration": "5000",
                "hideDuration": "5000",
                "timeOut": "700",
                "extendedTimeOut": "0"
            },
                toastr.success('Les données ont été supprimé avec succes   ! Merci', {fadeAway: 5000});
            this_div.parent().parent().remove();

        },

        error: function (request, status, error) {
           toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 5000});

           return false;


        }
    });
});

$(document).on('click', '.add_type', function () {
    var split_element = $(this).attr('id').split('-');
    var id = split_element[1];
    console.log(id);

    var type_edit = $(this).parent().parent().find('.type_edit').val();
    console.log(type_edit);
    var name_edit = $(this).parent().parent().find('.name_edit').val();
    var coordinate_edit = $(this).parent().parent().find('.coordinate_edit').val();
    var osmcle = $(this).parent().parent().find('.osmcle').val();
    var osmvaleur = $(this).parent().parent().find('.osmvaleur').val();
    var classgn = $(this).parent().parent().find('.classgn').val();
    var codegn = $(this).parent().parent().find('.codegn').val();
    console.log(codegn);
    if (type_edit == ''|| name_edit == ''|| coordinate_edit == ''|| osmcle == ''|| osmvaleur == ''|| classgn == ''|| codegn== '' ) {
            toastr["error"]('Un des champs est vide', {fadeAway: 5000});


    }
    else {

        if((parseFloat(type_edit)+ parseFloat(name_edit)+parseFloat(coordinate_edit)) !=1) {
                toastr["error"]('La somme des poids doit etre egales a 1', {fadeAway: 5000});
            $(this).parent().parent().find('input[type="number"]').css('border','1px solid #d9534f');

        }

        else {
            $(this).parent().parent().find('input[type="number"]').css('border','1px solid #ccc');

            for(j=0; j<parametre_data.results.length;j++) {

                if(parametre_data.results[j].id==id) {

                    console.log(type_edit == parametre_data.results[j].weight_type  && name_edit == parametre_data.results[j].weight_name &&
                    coordinate_edit == parametre_data.results[j].weight_coordinates  && osmcle == undefined &&
                    osmvaleur == undefined  && classgn ==undefined
                    && codegn== undefined);
                    if (type_edit == parametre_data.results[j].weight_type  && name_edit == parametre_data.results[j].weight_name &&
                        coordinate_edit == parametre_data.results[j].weight_coordinates  && osmcle == parametre_data.results[j].osm_key_type &&
                        osmvaleur == parametre_data.results[j].osm_value_type  && classgn == parametre_data.results[j].gn_feature_class
                        && codegn== parametre_data.results[j].gn_feature_code) {

                        boolsend = false;
                            toastr["info"]('Vous avez rien modifié', {fadeAway: 5000});

                    } else if(type_edit == parametre_data.results[j].weight_type  && name_edit == parametre_data.results[j].weight_name &&
                        coordinate_edit == parametre_data.results[j].weight_coordinates  && osmcle == undefined &&
                        osmvaleur == undefined  && classgn ==undefined
                        && codegn== undefined) {
                        boolsend = false;
                        toastr["info"]('Vous avez rien modifié', {fadeAway: 5000});

                    }
                    else {
                        console.log('jiji');
                        boolsend = true;
                    }
                }
            }
             if(id == 'defaut') {

                sendpost(type_edit, name_edit, coordinate_edit, osmcle, osmvaleur, classgn, codegn);
            }
            else if(id==sendone && boolsend == true) {
                console.log('sendone');
                sendonerequest(type_edit, name_edit, coordinate_edit)
            }
            if (id != 'defaut' && id !=sendone  && boolsend == true) {
                console.log('pardefaullt');
                sendrequest(id, type_edit, name_edit, coordinate_edit, osmcle, osmvaleur, classgn, codegn);
            }
        }
        }


});
$(document).on('click', '#defaut_param', function () {

    get_all_parameter();
    if(reinitialise) {
        toastr["info"]("Les données ont été reinitialisé");
    }
});
function compare_to_array(array1, array2) {
    var resultat = false;
    for (i = 0; i < array1.length; i++) {
        if (array1[i] == array2[i]) {
            resultat = true;
        }
        else {
            return false
        }
    }
    return resultat;
}
function correct_form(array1) {
    var somme = 0;
    for (i = 0; i < array1.length; i++) {
        somme += parseFloat(array1[i]);
    }
    if (somme == 1) {
        return true;
    }
    else {
        return false;
    }
}
function sendrequest(id, type_edit, name_edit, coordinate_edit, osmcle, osmvaleur, classgn, codegn) {
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence/' + id,
        data: {
            "id": id,
            "name": "weight_matching",
            "weight_type": type_edit,
            "weight_name": name_edit,
            "weight_coordinates": coordinate_edit,
            "osm_key_type": osmcle,
            "osm_value_type": osmvaleur,
            "gn_feature_class": classgn,
            "gn_feature_code": codegn,
            "all_types": false,
        },
        success: function (data) {
                toastr.success('Les données ont été modifiés  ! Merci');

        },
        error: function (request, status, error) {
            toastr["error"]('Une erreur s\'est produite réessayer plus tard');
        }
    });
}
function sendpost( type_edit, name_edit, coordinate_edit, osmcle, osmvaleur, classgn, codegn) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence',
        data: {
            //"id": sendone,
            "name": "weight_matching",
            "weight_type": type_edit,
            "weight_name": name_edit,
            "weight_coordinates": coordinate_edit,
            "osm_key_type": osmcle.toLowerCase(),
            "osm_value_type": osmvaleur.toLowerCase(),
            "gn_feature_class": classgn.toUpperCase(),
            "gn_feature_code": codegn.toUpperCase(),
            "all_types": false,
        },
        success: function (data) {
            toastr.success('Les données ont été modifiés  ! Merci');
            get_all_parameter();
            $('.name_parametre_specific_autre').find('input[type="number"]').val('1');
            $('.name_parametre_specific_autre').find('input[type="number"]').attr('disabled', 'disabled');
            $('.name_parametre_specific_autre').find('input[type="text"]').val(' ');

        },
        beforeSend: function () {
            // $('#patientez').modal("show");
        },
        complete: function () {

        },
        error: function (request, status, error) {
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


        }
    });
}
function sendonerequest(el1, el2, el3) {
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence/' + sendone,
        data: {
            "id": sendone,
            "name": "weight_matching_global",
            "weight_type": el1,
            "weight_name": el2,
            "weight_coordinates": el3,
            "osm_key_type": null,
            "osm_value_type": null,
            "gn_feature_class": null,
            "gn_feature_code": null,
            "all_types": false,
        },
        success: function (data) {
                toastr.success('Les données ont été modifiés  ! Merci', {fadeAway: 100});
            $('.par_defaut').find('input[type="number"]').attr('disabled', 'disabled');

        },

        error: function (request, status, error) {
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


        }
    });
}
