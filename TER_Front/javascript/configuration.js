/**
 * Created by FADDI SOFIAA on 23/04/2017.
 */
var parametre_data = [];
var data_value = [];
var sendone = 0;
var boolsend = false;
var reinitialise = false;
var height_chart = 250;
var width_chart = $(window).width()- $(window).width()*0.3;
var codes={};
var error= false;

$(document).on('mouseover', '.tool ', function(e)  {
    var $e = $(e.target);
    console.log("ddddd");
    if ($e.is('option')) {
        $('.select_class').tooltip('destroy');
        $('.select_class').tooltip({
            placement: 'right',
            title: $e.attr("data-title"),
        });
    }
});

$("#testList").on('mouseleave', function(e) {
    $('#testList').popover('destroy');
});



$(document).on('click','#historique', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    history('weight_matching_global', 'Historique des indices de similarités par défaut',e);
    return false;


});
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
    var data  = {
        name: $(this).parent().find('.name').text(),
        value: $(this).parent().find('.valeur').val(),
        description: $(this).parent().find('.description').text()
    };
    var element_change = $(this).parent().attr('id').split('-');
    console.log($(this).parent().find('.valeur').val());
    var element_change_id = element_change[1];
    console.log($(this).parent().find('.name').text());
    $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: 'http://localhost:8000/parameters/' + element_change_id,
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        data: JSON.stringify(data),
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
getfeature_code(codes);


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
    if (i == 'weight_type') {
        nom = 'Indice de similarité sur le type';
    }
    else if (i == 'weight_name') {
        nom = 'Indice de similarité sur le nom';
    }
    else if (i == 'weight_coordinates') {
        nom = 'Indice de similarité sur les coordonnées';
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
                    $('.btn_pardefaut').append('<button type="button" title="Enregistrer" class="add_type" id="send_type-'+  + data.results[i].id+'"> ' +
                        '<i class="fa fa-floppy-o" aria-hidden="true"></i> Enregistrer</button> <button type="button" title="Historique des indices de similarité"  data-target="#history"  id="historique"> ' +
                        '<i class="fa fa-history" aria-hidden="true"></i></i>Historique</button> <button type="button" title="Demarer l&apos;alignement" class="add_demare" id="demare"> ' +
                        '<i class="fa fa-cog" aria-hidden="true"></i>Démarer</button><button type="button" title="indice de similarité optimal" ' +
                        'class="indice" id="indice"> ' +
                        '<i class="fa fa-wrench" aria-hidden="true"></i>Valeurs optimales</button><br/> <br/>');


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
                    var form='<div class="each_element-' + data.results[i].id + ' parametre_type_specific"><div class="geoname_type"> <div class="sous_cat"> <label>Classe Geoname</label> <select id="class_gn-' + data.results[i].id + '" type="text" class=" select_class classgn form-control classgnselect_1"  placeholder="Par exemple S ">' +
                        '<option class="tool" data-toggle="tooltip" data-placement="left" title="Tooltip on left" value="'+data.results[i].gn_feature_class+'">'+data.results[i].gn_feature_class+'</option>';
                    for (var k in codes){
                        if (codes.hasOwnProperty(k) && k!='null' && k!=data.results[i].gn_feature_class) {
                            form=form+'<option class="tool" data-trigger="hover" data-toggle="tooltip" data-placement="left" title="Tooltip on left" value="'+k+'">'+k+'</option>';
                        }
                    }
                    form=form+'</select> ' +
                        '</div> <div class="sous_cat"> <label>Code Geoname</label> <select id="code_gn-' + data.results[i].id + '" class="form-control codegn  codegnselect_1">'+'<option value="'+data.results[i].gn_feature_code+'">'+data.results[i].gn_feature_code+'</option>'+'</select> ' + '</div> </div></div><br/>';
                    $(".autres").append(form);
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
        beforeSend: function () {
           // $.noConflict();
             //$('#patientez').modal("show");
            // a refaire avec ma méthode
        },
        complete: function () {
            //$.noConflict();
           // $('#patientez').modal("hide");

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
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
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
    var type_edit = $(this).parent().parent().find('.type_edit').val();
    var name_edit = $(this).parent().parent().find('.name_edit').val();
    var coordinate_edit = $(this).parent().parent().find('.coordinate_edit').val();
    //var osmcle = $(this).parent().parent().find('.osmcle').val();
    //var osmvaleur = $(this).parent().parent().find('.osmvaleur').val();
    var classgn = $(this).parent().parent().find('.classgn').val();
    var codegn = $(this).parent().parent().find('.codegn').val();
    console.log(codegn);
    if (type_edit == ''|| name_edit == ''|| coordinate_edit == ''||  classgn == ''|| codegn== '' ) {
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

                    if (type_edit == parametre_data.results[j].weight_type  && name_edit == parametre_data.results[j].weight_name &&
                        coordinate_edit == parametre_data.results[j].weight_coordinates  && classgn == parametre_data.results[j].gn_feature_class
                        && codegn== parametre_data.results[j].gn_feature_code) {

                        boolsend = false;
                            toastr["info"]('Vous avez rien modifié', {fadeAway: 5000});

                    } else if(type_edit == parametre_data.results[j].weight_type  && name_edit == parametre_data.results[j].weight_name &&
                        coordinate_edit == parametre_data.results[j].weight_coordinates   && classgn ==undefined
                        && codegn== undefined) {
                        boolsend = false;
                        toastr["info"]('Vous avez rien modifié', {fadeAway: 5000});

                    }
                    else {
                        boolsend = true;
                    }
                }
            }
             if(id == 'defaut') {

                sendpost(type_edit, name_edit, coordinate_edit ,classgn, codegn);
            }
            else if(id==sendone && boolsend == true) {
                sendonerequest(type_edit, name_edit, coordinate_edit);
                height_chart+= 60;
            }
            if (id != 'defaut' && id !=sendone  && boolsend == true) {
                sendrequest( type_edit, name_edit, coordinate_edit, classgn, codegn);
            }
        }
        }


});
$(document).on('click', '#defaut_param', function () {

    //get_all_parameter();
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
function sendrequest( type_edit, name_edit, coordinate_edit, classgn, codegn) {
    var data = {
        name: "weight_matching",
        weight_type: type_edit,
        weight_name: name_edit,
        weight_coordinates: coordinate_edit,
        gn_feature_class: classgn,
        gn_feature_code: codegn,
        all_types: false,
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://localhost:8000/parameters-score-pertinence',
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        data: JSON.stringify(data),

        success: function (data) {
                toastr.success('Les données ont été modifiés  ! Merci');

        },
        error: function (request, status, error) {
            console.log(request);
            toastr["error"]('Une erreur s\'est produite réessayer plus tard');
        }
    });
}
function sendpost( type_edit, name_edit, coordinate_edit,  classgn, codegn) {
    var data = {
        name: "weight_matching",
        weight_type: type_edit,
        weight_name: name_edit,
        weight_coordinates: coordinate_edit,
        gn_feature_class: classgn.toUpperCase(),
        gn_feature_code: codegn.toUpperCase(),
        all_types: false,
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        url: 'http://localhost:8000/parameters-score-pertinence',
        data: JSON.stringify(data),
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
    var data =  {
            name: "weight_matching_global",
            weight_type: el1,
            weight_name: el2,
            weight_coordinates: el3,
            osm_key_type: null,
            osm_value_type: null,
            gn_feature_class: null,
            gn_feature_code: null,
            all_types: false,
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        url: 'http://localhost:8000/parameters-score-pertinence',
        data : JSON.stringify(data),

        success: function (data) {
                toastr.success('Les données ont été modifiés  ! Merci', {fadeAway: 100});
            $('.par_defaut').find('input[type="number"]').attr('disabled', 'disabled');

        },

        error: function (request, status, error) {
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


        }
    });
}

function history(id, texte,e) {
    $.ajax({
        type: 'GET',
        headers: {
            'Authorization':'Token '+localStorage.getItem('id_session'),
            'Content-Type':'application/json'
        },
        url: 'http://127.0.0.1:8000/parameters-score-pertinence-history',


        success: function (data) {
            callback_hight(data, texte,e);

        },

        error: function (request, status, error) {
            toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


        }
    });

}

///////////////////////////////////////////////////////////////////////////////////

function callback_hight(data,texte,e) {


    var date = [];
    var similarity_name = [];
    var similarity_coordinates = [];
    var similarity_type = [];
    for(var i =0; i<data.results.length;i++) {
        res =  data.results[i].date;
       date_tow = res.split(' ');
       date_only = date_tow[0];

        date.push(date_only);
        similarity_name.push(parseFloat(data.results[i].weight_name)*100);
        similarity_coordinates.push(parseFloat(data.results[i].weight_coordinates)*100);
        similarity_type.push(parseFloat(data.results[i].weight_type)*100);

    }
    height_chart += date.length*40;

    if(data.results.length != 0) {
        $.noConflict();

         $("#history").modal('show');
        chart(date, texte, similarity_name, similarity_coordinates, similarity_type);
    }
    else {

        toastr["info"]("Il n'y a pas d'historique pour le moment");
        return false;
    }
    }



function chart(date,texte,similarity_name , similarity_coordinates,similarity_type) {

    Highcharts.chart('hist', {
        chart: {
            type: 'bar',
            height: height_chart,
            width: width_chart,
        },
        borderColor: '#022a3b',

        title: {
            text: texte,
        },

        xAxis: {
            categories: date,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'indice de similarité',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'horizental',
            align: 'center',
            x: -20,
            y: 10,
            floating: false,
            borderWidth: 2,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        colors: ['#1668b2', '#e85e03','#772184', '#1668b2', '#f7a35c', '#8085e9',
            '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
        series: [{
            name: 'Indice de similartité sur le nom',
            data: similarity_name
        }, {
            name: 'Indice de similartité sur les coordonnées',
            data: similarity_coordinates
        }, {
            name: 'Indice de similarité sur le type',
            data: similarity_type
        }]
    });
}
function iteration(url,code){
    //var newurl='http://127.0.0.1:8000/feature-code';
   // console.log('iteration url =');
    //console.log(url);
    var keys=Object.keys(code);
    var key = keys[keys.length-1];
    var value=code[key];
    if(url==null){
        console.log('fin');
        console.log(codes);
        codes=code;
        get_all_parameter();
        var form='';
        for (var k in codes){
            if (codes.hasOwnProperty(k) && k!='null') {
                form=form+'<option value="'+k+'">'+k+'</option>'
            }
        }
        $('.classgnselect_2').append(form);
    }else{
        $.ajax({
            type: 'GET',
            headers: {
                'Authorization':'Token '+localStorage.getItem('id_session'),
                'Content-Type':'application/json'
            },
            url: url,


            success: function (data) {
                //console.log(url);
                //console.log('ok');
                //console.log(data);
                url=data.next;

                for(var i = 0; i<data.results.length; i++) {
                    //console.log('i='+i);
                    select_class= data.results[i].code.split('.');
                    //console.log('select_class[0]');
                    //console.log(select_class[0]);
                    //console.log('key');
                    //console.log(key);
                    //value = code[key];
                    //console.log('value');
                    //console.log(value);


                    if(key != select_class[0]){
                        //console.log('in if');
                        key = select_class[0];
                        value=[];
                        value.push([select_class[1],data.results[i].name]);
                    }else{
                        //console.log('in else');
                        value=code[key];
                        value.push([select_class[1],data.results[i].name]);
                    }
                    //console.log('after key=');
                    //console.log(key);
                    code[key]=value;

                    //console.log('after add value=');
                    //console.log(code[key]);


                 }
                 //console.log(code);

                 /*$.each(code, function(i, el){
                 if($.inArray(el, code_finale) === -1) code_finale.push(el);
                 });
                 console.log(code_finale);*/

            },

            error: function (requestss, status, error) {
                toastr["error"]('Une erreur s\'est produite réessayer plus tard', {fadeAway: 100});


            }
        }).then(function(){
            //console.log('newurl=');
            //console.log(url);
            //console.log(code);
            iteration(url,code);
        });
    }

    //console.log('newurl='+newurl);
}

function getfeature_code(code) {
    code= {};
    var code_finale = [];
    var url='http://127.0.0.1:8000/feature-code';
    iteration(url,code);
}

$(document).on('change','.classgnselect_1',function(){
    var form='';
    $('.codegnselect_1').empty();
    for (var k in codes){
        if (codes.hasOwnProperty(k) && k==$(this).val()) {
            for(var i =0; i<codes[k].length ; i++){
                form=form+'<option value="'+codes[k][i][0]+'"><a href="#" data-toggle="tooltip" data-placement="bottom" title="'+codes[k][i][1]+'">'+codes[k][i][0]+'</a></option>'
            }
            break;
        }
    }
    $('.codegnselect_1').append(form);
    //$.noConflict();
    //$('[data-toggle="tooltip"]').tooltip();
});
$(document).on('change','.classgnselect_2',function(){
    $('.codegnselect_2').empty();
    console.log('ok');
    var form='';
    for (var k in codes){
        if (codes.hasOwnProperty(k) && k==$(this).val()) {
            for(var i =0; i<codes[k].length ; i++){
                form=form+'<option value="'+codes[k][i][0]+'" data-toggle="tooltip" data-placement="bottom" title="'+codes[k][i][1]+'">'+codes[k][i][0]+'</option>'
            }
            break;
        }
    }
    $('.codegnselect_2').append(form);
    //$.noConflict();
    //$('[data-toggle="tooltip"]').tooltip();
});
var interval = null;
$(document).on('click','#demare',function (e) {
    var data = {name: 'global-match'};
    var id='';
    console.log(data);

    $.ajax({
        url: 'http://localhost:8000/scheduled-work',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('id_session'),
            'Content-Type': 'application/json'
        },
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),

        success: function (data) {
            id=data.id;
            toastr["success"]('Correspondance plannifiée. Elle démarera dans quelque instatnt. Merci de patienter.', {fadeAway: 2000});
            /*$('#import_table tbody').append('<tr><td>'+ data.provider+'</td><td>'+ data.status+'</td>' +
             '<td>'+ data.initial_date+'</td><td>'+data.affected_rows+'</td><td>'+data.error_rows+'</td><td>'+data.total_rows+'</td> ');
             $('#import_table').css('display', 'block');
             toastr.success('L\'importation va commencer', {fadeAway: 100});*/
        }
        ,
        error: function (request) {
            $('.attendre').css('display','none');
            console.log(request.responseText);

        }

    }).then(function () {
        $('.attendre').css('display','block');
        $('.attendre .progress').css('display','none');
        interval = setInterval("checkfin(" + id + ")", 5500);
    });
});

var b = false;
function checkfin(id){
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
                if(data.status=='IN PROGRESS' ){
                    var pourcentage = parseInt(data.affected_rows)/parseInt(data.total_rows);
                    error = false;
                    $('.attendre .progress').css('display','block');
                    $(".attendre .progress-bar ").attr("aria-valuenow", Math.round(pourcentage * 100));
                    $(".attendre .progress-bar ").css("width",  Math.round(pourcentage * 100)+'%');

                }
                if(data.status=='FINALIZED' || data.status=='ERROR' ){
                    b=true;
                    if(data.status=='FINALIZED'){
                        clearInterval(interval); // stop the interval
                        toastr["success"]('L\'alignement des données a réussi.', {fadeAway: 2000});
                    }
                    if(data.status=='ERROR'){
                        b=false;
                        clearInterval(interval); // stop the interval

                        register(error);
                        toastr["error"]('L\'alignement des données a échoué.', {fadeAway: 2000});
                    }
                }
            }
        }
        ,
        error: function (request) {

            console.log(request.responseText);

        }

    }).then(function(){
        console.log(b);
        if(b){
            $('.attendre').css('display','none');
        }
    });
}

function register(error_local) {
    error = error_local;

}

$(document).on('click','#indice',function (e) {
    var data = {name: 'learning-algorithm'};
    var id='';

    $.ajax({
        url: 'http://localhost:8000/scheduled-work',
        headers: {
            'Authorization': 'Token ' + localStorage.getItem('id_session'),
            'Content-Type': 'application/json'
        },
        type: 'POST',
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify(data),

        success: function (data) {
            id=data.id;
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

    }).then(function () {

    });
});