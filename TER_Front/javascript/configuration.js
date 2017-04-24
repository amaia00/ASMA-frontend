/**
 * Created by FADDI SOFIAA on 23/04/2017.
 */
var parametre_data=[];
var compare_valeur1 = [];
var data_value = [];
var compare_valeur2 = [];
$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

function beginRequestHandler(sender, args) {
    $.blockUI({ message: '<h1><i class="fa fa-circle-o-notch fa-spin fa-4x fa-fw"></i><br/> Patientez un instant...</h1>' });
}

// unblock when ajax activity stops
function endRequestHandler() {
    $.unblockUI(); // previously was $.unblockUI;
}
$('#accordion').collapse({
    toggle: true
})
var selectIds = $('#collapse1,#collapse2');
$(function ($) {
    selectIds.on('show.bs.collapse hidden.bs.collapse', function () {
        $(this).prev().find('i').toggleClass('fa-plus fa-minus');
    })
});
$('#config tbody').on('click','.edit', function () {
    var element_change = $(this).parent().attr('id').split('-');
    var element_change_id = element_change[1];
    console.log($(this).parent().find('.name').text());
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://localhost:8000/parameters/'+element_change_id,
        data: {
            "id": element_change_id,
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
            toastr.success('Les données ont été modifiés  ! Merci',{ fadeAway: 100 });

        },
        beforeSend: function() {
           // $('#patientez').modal("show");
        },
        complete: function() {

        },
        error: function (request, status, error) {
            toastr.options = {
                "showDuration": "1000",
                "hideDuration": "1000",
                "timeOut": "700",
                "extendedTimeOut": "0"
            },
            toastr["error"]('Une erreur s\'est produite réessayer plus tard',{ fadeAway: 100 });


        }
    });

});

$.ajax({
    dataType: 'json',
    url: 'http://localhost:8000/parameters',
    success: function (data) {
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
            $("#config tbody").append("<tr id='element-" + data.results[i].id +"'role='row' class='odd'>" +
                "<td class='name' id='"+data.results[i].name+"' style='text-decoration:underline;'>" + data.results[i].name.toUpperCase()  +"</td>" +
                "<td><input type='number' min='0' step='0.1' max='1' class='form-control valeur' value='"+ data.results[i].value +"'/></td><td class='description'>" + data.results[i].description+ "</td><td class='edit'><a><i class='fa fa-floppy-o' aria-hidden='true'></i>Enregistrer</a></td>");
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
                  "lengthMenu": [ 4, 8, 12, 16, 20, 24, 28, 32],
                "info": true,
                "bInfo": false,
                  columnDefs: [{
                      targets: "datatable-nosort",
                      orderable: false
                  }]

            });
        }
    },
    beforeSend: function() {
           // $.blockUI({ message: '<h1><i class="fa fa-circle-o-notch fa-spin fa-4x fa-fw"></i><br/> Patientez un instant...</h1>' });
    },
    complete: function() {
        //$(".blockUI").fadeOut("slow");

    }
});
$.ajax({
    dataType: 'json',
    url: 'http://localhost:8000/parameters-score-pertinence',
    success: function (data) {
        parametre_data = data;
        data_value.length = 0;
        for(i=0;i<data.results.length;i++) {
            $('#name_parametre').append('<li id="'+ data.results[i].name+'defaut">'+data.results[i].name+' <span> ' +i+'*</span></li>');
            $('#valeur_parametre').append('<li><div class="para_cat"><input value="'+data.results[i].value +'"type="number"min="0" step="0.1" max="1" class="form-control valeur_input" disabled>' +
                '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li>');
            $(".rectangles_information").append('<p><span>'+i+'* </span>'+data.results[i].description+'</p>');
            $('#name_parametre_speci').append('<li id="'+ data.results[i].name+'defaut">'+data.results[i].name+' <span> ' +i+'*</span></li>');
            $('#valeur_parametre_speci').append('<li><div class="para_cat"><input value="'+data.results[i].value +'"type="number"min="0" max="1" step="0.1"  class="form-control valeur_input" disabled>' +
                '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li>');
            data_value.push(data.results[i].value);
        }
    },
});
$(document).on('click','#show_more',function () {
    $(this).find('i').removeClass("fa-plus");
    $(this).find('i').addClass("fa-minus");
    $(this).removeAttr('id');
    $(this).attr('id','hide_more');
    $(".rectangles_information").css('display','inline-block');
});
$(document).on('click','#hide_more',function () {
    $(this).find('i').removeClass("fa-minus");
    $(this).find('i').addClass("fa-plus");
    $(this).removeAttr('id');
    $(this).attr('id','show_more');
    $(".rectangles_information").css('display','none');
});
$(document).on('click','.name_parametre a', function (event) {
    event.preventDefault();

    var input_configuration = $(this).prev();

    input_configuration.prop("disabled", false);
    input_configuration.focus();
});
function disabled_function(parametre) {
    console.log($(parametre).parent('para_cat'));
    var input_configuration = $(parametre).prev();

    input_configuration.prop("disabled", false);
    input_configuration.focus();
}
$(document).on('click','#send_type',function () {
    compare_valeur1.length = 0;
    compare_valeur2.length = 0;
    var cleosm = $('#cle_osm').val();
    var class_gn = $('#class_gn').val();
    var valeur_osm = $('#valeur_osm').val();
    var code_gn= $('#code_gn').val();
    $( "#valeur_parametre li" ).each(function() {
        compare_valeur1.push($(this).find('input').val());
    });
    $("#valeur_parametre_speci li ").each(function() {
        compare_valeur2.push($(this).find('input').val());
    });
    var res_compare1 = compare_to_array(data_value, compare_valeur1);
    var res_compare2 = compare_to_array(data_value, compare_valeur2);

    if(res_compare1== true && res_compare2 == true) {
        // rien a faire

    }
    else if(res_compare1== false && res_compare2 == true) {
        // une requete qui depend des poids
        if(correct_form(compare_valeur1)) {
            //fonction pour envoyer
            // mettre les données dans la data
        }
        else {
            toastr.options = {
                "showDuration": "2000",
                "hideDuration": "3000",
                "timeOut": "500",
                "extendedTimeOut": "0"
            },
            toastr["error"]("La somme des poids doit être égale à 1");
        }

    }
    else if(res_compare1== true && res_compare2 == false) {
        if(correct_form(compare_valeur2) && cleosm != '' && class_gn !='' && valeur_osm != '' && class_gn!= '') {
            //fonction pour envoyer
            // mettre les données dans la data
        }
        else {


                toastr["error"](" Vous avez des erreurs la sommme des poids est differente de 1 ou  des champs sont vides");
        }

    }
    else if(res_compare1== false && res_compare2 == false) {
        if(correct_form(compare_valeur1) && correct_form(compare_valeur2) && cleosm != '' && class_gn !='' && valeur_osm != '' && class_gn!= ''){
            // envoi deux requetes
        }
        else {

            toastr["error"](" Vous avez des erreurs la sommme des poids est differente de 1 ou des champs sont vides");
        }

            }
});
$(document).on('click','#defaut_param',function () {
    $('#name_parametre').html(" ");
    $('#valeur_parametre').html(" ");
    $('#name_parametre_speci').html(" ");
    $('#valeur_parametre_speci').html(" ");
    $(".rectangles_information").html(" ");
    for(i=0;i<parametre_data.results.length;i++) {
        $('#name_parametre').append('<li id="'+ parametre_data.results[i].name+'defaut">'+parametre_data.results[i].name+' <span> ' +i+'*</span></li>');
        $('#valeur_parametre').append('<li><div class="para_cat"><input value="'+parametre_data.results[i].value +'"type="number"min="0" step="0.1" max="1" class="form-control valeur_input" disabled>' +
            '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li>');
        $(".rectangles_information").append('<p><span>'+i+'* </span>'+parametre_data.results[i].description+'</p>');
        $('#name_parametre_speci').append('<li id="'+ parametre_data.results[i].name+'defaut">'+parametre_data.results[i].name+' <span> ' +i+'*</span></li>');
        $('#valeur_parametre_speci').append('<li><div class="para_cat"><input value="'+parametre_data.results[i].value +'"type="number"min="0" max="1" step="0.1"  class="form-control valeur_input" disabled>' +
            '<a><i class="fa fa-pencil" aria-hidden="true"></i></a></div></li>');
    }
    toastr["info"]("Les données ont été reinitialisé");
});
function compare_to_array(array1, array2) {
    var resultat = false;
    for(i=0;i<array1.length;i++) {
        if(array1[0] == array2[0]) {
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
    for(i=0;i<array1.length;i++) {
        somme+= parseFloat(array1[i]);
    }
    if(somme == 1) {
        return true;
    }
    else {
        return false;
    }
}

/*
$(document).on('change', '#name_default', function(){
    empty_value('#name_default');
});

function empty_value(parametre) {
    var valeur_nom = $(parametre).val();
    var parent_element = $(parametre).parent();
    if(valeur_nom!=" ") {
        parent_element.find('a').css('display','inline-block');
        search(valeur_nom, parametre);
    }
    else {
        parent_element.find('a').css('display','none');
        parent_element.find('input[type="number"]').prop("disabled", true);
        parent_element.find('input[type="checkbox"]').attr( 'checked', false);
        parent_element.find('input[type="number"]').val('');
    }
}
function search(valeur_nom, parametre) {
    var input_configuration = $(parametre).parent().find('input[type="number"]');
    for(i=0;i<parametre_data.results.length;i++) {

        if(parametre_data.results[i].name== valeur_nom) {
            input_configuration.val(parametre_data.results[i].value);
        }
    }

}

$(document).on('click','.name_parametre a', function (event) {
    event.preventDefault();
    disabled_function('.name_parametre a');


});



}*/
