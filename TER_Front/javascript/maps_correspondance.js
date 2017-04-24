/**
 * Created by macair on 12/04/2017.
 */

"use strict";

var $_GET = {};
var idgn = 0;
var idosm = 0;
var featureGroup = new L.featureGroup(); // pour faire le resize
var information_data=[];
var mymap;
var marker = {}
var id_to_next;
var search_btn = $('.btn-search');
var correspondence_table = $("#correspondance tbody");
var valide_btn;
var invalide_btn;
var fields3;
var fields4;
var data_table;

function valider_invalider_sans_detail(url, reference_gn,reference_osm) {
    var elemnt_delete = 0;
    for (var i = 0; i < information_data.length; i++) {
        if (information_data[i].reference_gn == reference_gn && information_data[i].reference_osm == reference_osm) {
            var data = information_data[i];
            elemnt_delete =i;
            $.ajax({
                url: url,
                type: 'POST',
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),

                success: function (data) {
                    var elements_selected = $("#" + data.reference_gn + "-" + data.reference_osm);
                    elements_selected.remove();
                    data_table.init();
                    information_data.splice(elemnt_delete, 1);
                    if(information_data.length==0){
                        data_table.clear().draw();
                            toastr.options = {
                                "showDuration": "500",
                                "hideDuration": "1000",
                                "timeOut": "500",
                                "extendedTimeOut": "0"
                            }

                            toastr["info"]('Il n\' y plus de correspondence à valider');

                        }

                    else {
                        data_table.row("#" + data.reference_gn + "-" + data.reference_osm).remove();
                        data_table.draw();


                        toastr.options = {
                            "showDuration": "500",
                            "hideDuration": "1000",
                            "timeOut": "500",
                            "extendedTimeOut": "0"
                        },
                        toastr.success('Les entités ont été ajouté  ! Merci', {fadeAway: 100});

                    }
                },
                error: function (request, status, error) {
                    toastr.options = {
                        "showDuration": "300",
                        "hideDuration": "1000",
                        "timeOut": "500",
                        "extendedTimeOut": "0"
                    },
                        toastr["error"]('Une erreur s\'est produite réessayer plus tard',{ fadeAway: 100 });
                },
                beforeSend: function() {
                   // $('#patientez').modal("show");
                },
                complete: function() {
                   // $('#patientez').modal("hide");
                }

            });
        }
    }

}
function valider_invalider(url, reference_gn,reference_osm) {

        var elemnt_delete = 0;
        for (var i = 0; i < information_data.length; i++) {
            if (information_data[i].reference_gn == reference_gn && information_data[i].reference_osm == reference_osm) {
               var data = information_data[i];
                elemnt_delete =i;
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),

                    success: function (data) {
                        var elements_selected = $("#" + data.reference_gn + "-" + data.reference_osm);
                        var id_next = elements_selected.next().attr('id');
                        elements_selected.remove();
                        information_data.splice(elemnt_delete, 1);
                        if (id_next == undefined) {
                            id_next =correspondence_table.children("tr:first").attr('id');
                            if (id_next == undefined) {
                                toastr.options = {
                                    "showDuration": "500",
                                    "hideDuration": "1000",
                                    "timeOut": "500",
                                    "extendedTimeOut": "0"
                                },
                                toastr["info"]('Il n\' y plus de correspondence à valider');
                                $(document.body).removeClass('modal-open');
                                $("#myModal").removeClass('in');
                                $("#myModal").css('display','none');
                                $(".modal-backdrop.in").remove();
                            } else {
                                slider(id_next);
                            }
                        }
                        else {
                            slider(id_next);
                        }
                        toastr.options = {
                            "showDuration": "500",
                            "hideDuration": "1000",
                            "timeOut": "500",
                            "extendedTimeOut": "0"
                        },
                        toastr.success('Les entités ont été ajouté  ! Merci',{ fadeAway: 100 });
                    },
                    error: function (request, status, error) {
                        toastr.options = {
                            "showDuration": "500",
                            "hideDuration": "1000",
                            "timeOut": "500",
                            "extendedTimeOut": "0"
                        },
                        toastr["error"]('Une erreur s\'est produite réessayer plus tard',{ fadeAway: 100 });
                    },
                    beforeSend: function() {
                       // $('.spin').spin('show');
                    },
                    complete: function () {
                        //$('.spin').spin('hide');
                    }
                });
            }
        }
    }
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});
if($_GET["gn"]) {
    if($_GET["gn"].length!=0){
        array_information($_GET["gn"]);
    }
}
$(document).on('shown.bs.modal','#myModal ', function () {
    let  entity_geoname_span = $("#entity_geoname span");
    let  entity_osm_span = $("#entity_osm span");
    let height = $(".pal").height()+20;
    $('.grill').css('height', height);
    mymap = L.map('maps').setView([0, 0], 13);
     L.tileLayer('https://api.mapbox.com/styles/v1/sofiaa/cizvzm9h3002t2ro4a37h1own/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'your.mapbox.project.id',
        accessToken: 'pk.eyJ1Ijoic29maWFhIiwiYSI6ImNpenU4N2dnOTAwMmUyd2xoY2hsMmhrMDcifQ.3jTZDb2ABQuhQPIbucQCdQ'
    }).addTo(mymap);

     $(".right").on('click',function () {
         id_to_next = entity_geoname_span.text().slice(4)+"-"+entity_osm_span.text().slice(4);
        let id_next=  $("#"+id_to_next).next().attr('id');
        console.log(id_next);
        if(id_next == undefined) {
            id_next = correspondence_table.children("tr:first").attr('id');
        }
         slider(id_next);
     });
    $(".left").on('click',function () {
        let id_to_previous = entity_geoname_span.text().slice(4)+"-"+entity_osm_span.text().slice(4);
        let id_previous=  $("#"+id_to_previous).prev().attr('id');
        console.log(id_previous);
        if( id_previous == undefined) {
            id_previous = correspondence_table.children("tr:first").attr('id');

        }
        slider(id_previous);

    })

    $("#valider2").on('click', function () {
        var id_osm = $(this).parent().parent().find("input").attr("id");
        var valeur_osm = $("#"+id_osm).val();
            if(valeur_osm != "-") {


                var split_variable = valeur_osm.split("-");
                var key_osm = split_variable[0];
                var value_osm = split_variable[1];
                var code_gn = $("#g2fcode").val();
                var class_gn = $("#g2fclass").val();
                var data = {
                    'gn_feature_class':class_gn,
                    'gn_feature_code':code_gn,
                    'osm_key': key_osm,
                    'osm_value': value_osm,
                    'description': " test"
                }

                $.ajax({
                    url: 'http://localhost:8000/correspondence-types-close',
                    type: 'POST',
                    dataType :"json",
                    contentType: "application/json",
                    data: JSON.stringify(data),

                    success: function (data) {
                        toastr.options = {
                            "showDuration": "500",
                            "hideDuration": "1000",
                            "timeOut": "500",
                            "extendedTimeOut": "0"
                        }
                        toastr["success"]('La correspondance a été enregistré ! Merci');
                        },
                    error: function(request, status, error) {
                        toastr.options = {
                            "showDuration": "500",
                            "hideDuration": "1000",
                            "timeOut": "500",
                            "extendedTimeOut": "0"
                        }
                        toastr["error"]('Une erreur s\'est produite réessayer plus tard');

                        },
                    beforeSend: function() {

                    },
                    complete: function () {

                    }

                });

            }
    });
    $(document).on('click',"#validerCorrespondance",function (event) {
        event.preventDefault();
        var reference_gn = $("#entity_geoname span").text().slice(4);
        var reference_osm = $("#entity_osm span").text().slice(4);

        valider_invalider('http://localhost:8000/correspondence-valide', reference_gn, reference_osm);
    });
    $(document).on('click',"#invaliderCorrespondance",function (event) {
        var reference_gn = $("#entity_geoname span").text().slice(4);
        var reference_osm = $("#entity_osm span").text().slice(4);
        valider_invalider('http://localhost:8000/correspondence-invalide', reference_gn, reference_osm);
    });

});

var markerhide = L.icon({
    iconUrl: 'images/marker_green.png',
    className: 'hide_class'
});
var rougeIcon = L.icon({
    iconUrl: 'images/marker_rouge.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [12, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var greenIcon = L.icon({
    iconUrl: 'images/marker_green.png',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [22, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    className: 'my-own-class'
});
var BlackIcon = L.icon({
    iconUrl: 'images/marker_noir.svg',
    iconSize: [25, 25], // size of the icon
    iconAnchor: [22, 10], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
function overpasse(data) {
    var style_map = {
        "color": "#772184",
        "weight": 4,
        "opacity": 0.5,
        "background": "#772184"
    };

    $.post('http://overpass-api.de/api/interpreter', {
        data

    }).done(function (data) {
        var osmGeoJSON = osmtogeojson(data);
        var marker;

        if (osmGeoJSON.features.length > 0) {
            var convert_json = JSON.stringify(osmGeoJSON);
            var json_object = JSON.parse(convert_json);
            var planningAppsLayer = L.geoJSON(json_object, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng,  {icon: markerhide, myCustomId: "hide"});
                },
                style : function(feature) {
                    return {color: "#772184", weight: 4, "opacity": 0.5, background: "#772184" };
                }
            }).addTo(featureGroup);

            mymap.fitBounds(featureGroup.getBounds());
            /*var geojson = L.geoJSON(json_object, style_map, {
                pointToLayer: function(items, latlng) {
                    return L.circleMarker(latlng, style_map);
                }
                }
            );
                geojson.addTo(mymap);

            mymap.fitBounds(featureGroup.getBounds());*/

            // var osmFeatureLayer = L.GeoJSON(osmGeoJSON).addTo(mymap);
        }
    }).fail(function (error) {
        console.log(error);
        console.log("error");
    }).always(function () {
        console.log("complete");
    });
}
function  add_to_map(idgn,idosm) {
    $(".count_slider").html("");
    featureGroup.clearLayers();
    for (var i = 0; i < information_data.length; i++) {

        $(".count_slider").append('<div class=" bouton_entity bouton_count'+i+'">'+(i+1)+'</div>');

        if (information_data[i].reference_gn == idgn && information_data[i].reference_osm == idosm) {
            $(".bouton_count"+i).addClass('active');
            if(information_data[i].name_matching<0.5) {
                $("#nameg3").css('border-bottom','2px solid #ac2925');
                $("#nameo3").css('border-bottom','2px solid #ac2925');
                $("#nameg3").css('color','#ac2925');
                $("#nameo3").css('color','#ac2925');
                $('#distance .progress-bar').removeClass("progress-bar-success");
                $('#distance .progress-bar').addClass("progress-bar-danger");
                $("#distance .score").css('color','#ac2925');
            }
            else {
                $('#distance .progress-bar').removeClass("progress-bar-info");
                $('#distance .progress-bar').removeClass("progress-bar-danger");
                $('#distance .progress-bar').addClass("progress-bar-success");
                $(".informations .form-control").css('border-bottom','2px solid #1668b2');
                $(".informations .form-control").css('color','#1668b2');
                $("#distance .score").css('color','#5cb85c');
            }
            if(information_data[i].coordinates_matching<0.5) {
                $("#nameg1").css('border-bottom','2px solid #ac2925');
                $("#nameo1").css('border-bottom','2px solid #ac2925');
                $("#nameg1").css('color','#ac2925');
                $("#nameo1").css('color','#ac2925');
                $('#coordinate .progress-bar').removeClass("progress-bar-success");
                $('#coordinate .progress-bar').addClass("progress-bar-danger");
                $("#coordinate .score").css('color','#ac2925');
            }
            else {
                $('#coordinate .progress-bar').removeClass("progress-bar-info");
                $('#coordinate .progress-bar').removeClass("progress-bar-danger");
                $('#coordinate .progress-bar').addClass("progress-bar-success");
                $(".informations .form-control").css('border-bottom','2px solid #1668b2');
                $(".informations .form-control").css('color','#1668b2');
                $("#coordinate .score").css('color','#5cb85c');
            }
            if(information_data[i].type_matching<0.5) {
                $("#nameg2").css('border-bottom','2px solid #ac2925');
                $("#nameo2").css('border-bottom','2px solid #ac2925');
                $("#nameg2").css('color','#ac2925');
                $("#nameo2").css('color','#ac2925');
                $('#type .progress-bar').removeClass("progress-bar-success");
                $('#type .progress-bar').addClass("progress-bar-danger");
                $("#type .score").css('color','#ac2925');
            }
            else {
                $('#type .progress-bar').removeClass("progress-bar-info");
                $('#type .progress-bar').removeClass("progress-bar-danger");
                $('#type .progress-bar').addClass("progress-bar-success");
                $(".informations .form-control").css('border-bottom','2px solid #1668b2');
                $("#informations .form-control").css('color','#1668b2');
                $("#type .score").css('color','#5cb85c');
            }
            if(information_data[i].pertinence_score<0.5) {
                $('#pertinence .progress-bar').removeClass("progress-bar-success");
                $('#pertinence .progress-bar').addClass("progress-bar-danger");
                $("#pertinence .score").css('color','#ac2925');
            }
            else {
                $('#pertinence .progress-bar').removeClass("progress-bar-info");
                $('#pertinence .progress-bar').removeClass("progress-bar-danger");
                $('#pertinence .progress-bar').addClass("progress-bar-success");
                $("#pertinence .score").css('color','#5cb85c');
            }
            $("#entity_geoname h2 span").html("réf "+information_data[i].reference_gn);
            $("#entity_osm h2 span").html("réf "+information_data[i].reference_osm);
            $("#entity_geoname #nameg1").val(information_data[i].gn_latitude+" , "+information_data[i].gn_longitude);
            $("#entity_geoname #nameg2").val(information_data[i].gn_feature_name);
            $("#entity_geoname #nameg3").val(information_data[i].gn_name.toUpperCase());
            $("#entity_geoname #nameg4").val("point");
            $("#entity_osm #nameo1").val(information_data[i].osm_latitude+" , "+information_data[i].osm_longitude);
            $("#entity_osm #nameo2").val(information_data[i].osm_key_type+" = "+information_data[i].osm_value_type);
            $("#entity_osm #nameo3").val(information_data[i].osm_name.toUpperCase());
            $("#entity_osm #nameo4").val(information_data[i].osm_shape.toLowerCase());
            $("#g2fcode").val(information_data[i].gn_feature_code);
            $("#g2fclass").val(information_data[i].gn_feature_class);
            $("#pertinence .score").html(Math.round(information_data[i].pertinence_score*100,1)+"%");
            $("#pertinence .progress-bar ").attr("aria-valuenow", Math.round(information_data[i].pertinence_score*100));
            $("#pertinence .progress-bar ").css("width", Math.round(information_data[i].pertinence_score*100)+"%");
            $("#type .score").html(Math.round(information_data[i].type_matching*100,1)+"%");
            $("#type .progress-bar ").attr("aria-valuenow", Math.round(information_data[i].type_matching*100));
            $("#type .progress-bar ").css("width", Math.round(information_data[i].type_matching*100)+"%");
            $("#distance .score").html(Math.round(information_data[i].name_matching*100)+"%");
            $("#distance .progress-bar ").attr("aria-valuenow", Math.round(information_data[i].name_matching*100));
            $("#distance .progress-bar ").css("width", Math.round(information_data[i].name_matching*100)+"%");
            $("#coordinate .score").html(Math.round(information_data[i].coordinates_matching*100)+"%");
            $("#coordinate .progress-bar ").attr("aria-valuenow", Math.round(information_data[i].coordinates_matching*100,2));
            $("#coordinate .progress-bar ").css("width", Math.round(information_data[i].coordinates_matching*100,2)+"%");
            var data = information_data[i].osm_shape.toLowerCase()+"("+information_data[i].reference_osm +"); (._; > ;);out;";
            overpasse(data);

            marker[information_data[i].reference_gn] = L.marker([information_data[i].gn_latitude, information_data[i].gn_longitude], {icon: greenIcon},{ myCustomId: information_data[i].reference_gn}).addTo(featureGroup).on('click', click_marker);
            marker[information_data[i].reference_osm] = L.marker([information_data[i].osm_latitude, information_data[i].osm_longitude], {icon: rougeIcon},{ myCustomId: information_data[i].reference_osm}).addTo(featureGroup).on('click', click_marker);
        }
        else {


            marker[information_data[i].reference_osm] = new L.marker([information_data[i].osm_latitude, information_data[i].osm_longitude],{myCustomId: information_data[i].reference_osm,icon: BlackIcon}).addTo(featureGroup).on('click', click_marker);
        }

    }

}

function slider (idgn_idosm) {


    var fields = idgn_idosm.split('-');
    idgn=0;
    idosm=0;
    idgn = fields[0];
    idosm = fields[1];
    add_to_map(idgn,idosm);

}
$(document).on('click','.match_click', function () {
    var idgn_idosm =  $(this).parent().parent().attr('id');
    slider(idgn_idosm);

    mymap.addLayer(featureGroup);
        mymap.fitBounds(featureGroup.getBounds());

});
function array_information(gn) {

    $.ajax({
        dataType: 'json',
        url: 'http://localhost:8000/correspondence?gn=' + gn,

        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                information_data = data;
            }

            for (var i = 0; i < information_data.length; i++) {
                $("#correspondance tbody").append("<tr id='" + information_data[i].reference_gn + "-" + information_data[i].reference_osm + "'" +
                    "role='row' class='odd'><td style='text-decoration:underline;'>" + information_data[i].reference_gn + "</td><td>" + information_data[i].gn_name.toUpperCase() + "</td><td style='text-decoration:underline;'>" + information_data[i].reference_osm + "</td>" +
                    "<td>" + information_data[i].osm_name.toUpperCase() + "</td><td>" + (information_data[i].pertinence_score * 100).toFixed(1) + "%</td><td class='valide'><a>" +
                    "<i class='fa fa-check' aria-hidden='true'></i></a></td> <td class='invalide'><a><i class='fa fa-times' aria-hidden='true'></i></a></td> " +
                    "<td><a class='match_click' href='#' data-toggle='modal' data-target='#myModal'> <i class='fa fa-search-plus' aria-hidden='true'></i></a></td>")
            }
            /*console.log($('.valide').parent().attr('id'));
            if ($('.valide').parent().attr('id') != undefined && $('.invalide').parent().attr('id') != undefined) {
                console.log("hehe");
                valide_btn = $("#" + $('#valide').parent().attr('id') + " > .valide a");
                console.log(valide_btn);
                invalide_btn = $("#" + $(' .invalide').parent().attr('id') + "> .invalide a");
                fields3 = $('.valide').parent().attr('id').split('-');
                fields4 = $('.invalide').parent().attr('id').split('-');
            }*/
        },

        error: function () {
            toastr.options = {
                "showDuration": "500",
                "hideDuration": "1000",
                "timeOut": "500",
                "extendedTimeOut": "0"
            }
            toastr["error"]('Une erreur s\'est produite réessayer plus tard');

        },
        beforeSend: function () {
            $('#patientez').modal("show");
        },
        complete: function () {

            $("#patientez").removeClass('in');
            $("#patientez").css('display', 'none');
            $(".modal-backdrop.in").remove();


            if ($("#correspondance").length != 0) {

                data_table = $('#correspondance').DataTable({
                    "language": {
                        "lengthMenu": " Nombre de ligne par page _MENU_",
                        "zeroRecords": "Pas de resultat trouvé",
                        "info": " ",
                        "infoEmpty": "No records available",
                        "search": "Rechercher :",
                        "infoFiltered": "( _MAX_ total entrés)",
                        "paginate": {
                            "first": "Premier",
                            "last": "Dernier",
                            "next": "Suivant",
                            "previous": "Précédent"
                        },
                    },
                    "ordering": true,
                    "info": true,
                    "bInfo": false
                });
            }
        }
    });
}




$(document).on('hidden.bs.modal','#myModal ', function () {
    mymap.remove();
    if( marker ) {

        featureGroup.clearLayers();
    }
});

search_btn.click(function(){
    if ($("#input_search").val() == " ") {

        $(".search .alert").css('display', 'block');

        $(".search .resultats ul").html(" ");
        $(".resultats label").css("display", "none");
        $(".search img").css("display", "block");
        return false;

    }

});
function click_marker(e) {
    console.log(this.options);
    for (var i = 0; i < information_data.length; i++) {
        console.log(this.options.myCustomId);
        if(information_data[i].reference_osm===this.options.myCustomId){
            add_to_map(idgn,this.options.myCustomId);
            console.log("hello1");
        }
        else if(information_data[i].reference_gn===this.options.myCustomId) {
            console.log("hello2");
            return false;
        }
        else {
            console.log("hello3");
        }
    }
}

var idgn1=0;
var idgn2=0;
var idosm1=0;
var idosm2=0;
$('tbody').on('click','.valide', function (event) {
    event.preventDefault();
    var parent_element = $(this).parent().attr('id');
    if(parent_element!= undefined) {
        fields3 = parent_element.split('-')

    }

if(fields3[0]!= 0 && fields3[1]!=0) {

    idgn1 = fields3[0];
   idosm1 = fields3[1];

valider_invalider_sans_detail('http://localhost:8000/correspondence-valide', idgn1, idosm1);
}
});

$('tbody').on('click','.invalide',function (event) {
    var parent_element = $(this).parent().attr('id');
    console.log(parent_element);
    if(parent_element!= undefined) {
        fields4 = parent_element.split('-');
    }
    if (fields4[0] != 0 && fields4[1] != 0) {
        idgn2 = fields4[0];
        idosm2 = fields4[1];
        valider_invalider_sans_detail('http://localhost:8000/correspondence-invalide', idgn2, idosm2);

    }
});


