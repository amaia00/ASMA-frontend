/// Variable globale
var lattitude = 45.781431999999995; // Pays initiale
var longitude = 4.8677681; // Pays initiale
var zoom = 13; // Zoom initial
var marker = {}; // listes des marker
var attribut_gn = '0';
var featureGroup = new L.featureGroup(); // pour faire le resize
var $_GET = {};
var data_country=[];
var message_show = '<div id="patientez"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">' +
    '<h2 class="modal-title">Patientez</h2></div> <div class="modal-body"><i class="fa fa-circle-o-notch fa-spin fa-4x fa-fw"></i>' +
    '<span class="sr-only">Loading...</span> </div></div></div> </div>';


// Recherche de l'entité dans l'api de geoname

if ($_GET["q"]) {
    if ($_GET["q"].length != 0) {
        geocode({
            q: $_GET["q"]
        });
    }
}

// Map
var mymap = L.map('mapid', {
    zoomControl: false
}).setView([lattitude, longitude], zoom);
L.tileLayer('https://api.mapbox.com/styles/v1/sofiaa/cizvzm9h3002t2ro4a37h1own/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1Ijoic29maWFhIiwiYSI6ImNpenU4N2dnOTAwMmUyd2xoY2hsMmhrMDcifQ.3jTZDb2ABQuhQPIbucQCdQ'
}).addTo(mymap);

L.control.zoom({
    position: 'topright'
}).addTo(mymap);

// Popup
var popup = L.popup();
function affichage_erreur() {
    var width_window = $(window).width() - 320 + 'px';
    $(".search").css('display', 'block');
    $(".search").css('width', '320px');
    $('#content').css('margin-left', '320px');
    $('#content').css('width', width_window);
    $('#search').css('padding', '20px');
    $("header").css('margin-left', '320px');
    $('header').css('width', width_window);
    $(this).css('display', 'none');
    $('.search .resultats label').css('display','none');
    $(".search img").css('display', 'none');
    $(".form_close").css('display', 'block');
    $('.search .resultats ul').html(" ");
    /*$(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
        '<span class="sr-only">Erreur : </span> </div>');*/
    //$(".search .resultats .alert").css('display', 'block');

}

//// Ajax for APIGeoname search name

function geocode(options) {
    options.username = 'sofiaafaddi';
    options.type = 'json';

    $.ajax({
        url: 'http://api.geonames.org/search',
        data: options,
        dataType: 'json',
        success: success_function,
        error: error_function,
        beforeSend: function() {
            $.blockUI({message: message_show})
        },
        complete: function() {
            $.unblockUI({message: message_show});
        },

    })

    function success_function(data) {
        getInformation(data);
    }

    function error_function(request, status, error) {
        affichage_erreur();
        $('.search .resultats .alert').html(request.statusText );


    }
}

function getInformation(data) {
    // Affichage des donnees dans le marker
    if (data.status) {
        $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
            '<span class="sr-only">Error:</span>Aucun resultats </div>');
        $(".search .resultats .alert").css('display', 'block');
    } else {
        if (data.geonames.length === 0) {

            $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                '<span class="sr-only">Error:</span>Aucun resultats </div>');
            $(".search .resultats .alert").css('display', 'block');
        } else {
            $.ajax({
                dataType: 'json',
                url: 'http://localhost:8000/country-imported',
                success: function(data) {
                    for(var i =0; i< data.results.length;i++) {
                        data_country.push(data.results[i].country_name.toLowerCase());
                    }
                },
                error: function(request, status, error) {
                },
            }).then(function () {


            $(".search .resultats ul").html(" ");
            $(".search .resultats .alert").css('display', 'none');
                $('.search .information_imported').remove();
            for (var i = 0; i < data.geonames.length; i++) {
                if(data_country.includes( data.geonames[i].countryName.toLowerCase()) ) {

                marker[data.geonames[i].geonameId] = new L.marker([data.geonames[i].lat, data.geonames[i].lng], {
                    myCustomId: data.geonames[i].geonameId
                }).addTo(featureGroup).on('click', clickmarker);
                $(".search .resultats ul").append("<li class='item_gn' id=" + data.geonames[i].geonameId + "><p><span style='padding-right: 10px;' class='glyphicon glyphicon-flag'" +
                    " aria-hidden='true'></span>" + data.geonames[i].name + "</p>" +
                    "<p><b>Pays: </b> " + data.geonames[i].countryName + "</p>");
                }
                else {

                    $(".search .resultats ul").append("<li class='item_gn non_imported' id=" + data.geonames[i].geonameId + "><p><span style='padding-right: 10px;' class='glyphicon glyphicon-flag'" +
                        " aria-hidden='true'></span>" + data.geonames[i].name + "</p>" +
                        "<p><b>Pays: </b> " + data.geonames[i].countryName + "</p>");
                    $('.search .information_imported').remove();
                    $('.search').prepend('<div class="information_imported"> Les pays grisés ne sont pas encore importés <a  target="_bank" href="import.html">cliquer pour importer</a></div>')

                    mymap.setView([0, 0], 3);


                }
            }
            mymap.addLayer(featureGroup);
            mymap.fitBounds(featureGroup.getBounds());
                })
            }
    }
}
function geocodeReverse(lat, lng) {
    $('.search .information_imported').remove();
    var options = {};
    options.username = 'sofiaafaddi';
    options.type = 'json';
    options.lat = lat;
    options.lng = lng;
    //    options.maxRows = 10;

    $.ajax({
        url: 'http://api.geonames.org/findNearbyPlaceName',
        data: options,
        style: 'full',
        dataType: 'json',
        success: function(data) {
            if (data.status) {
                $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                    '<span class="sr-only">Error:</span>Aucun résultat </div>');
                $(".search .resultats .alert").css('display', 'block');
            } else {
                if (data.geonames.length === 0) {

                    $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                        '<span class="sr-only">Error:</span>Aucun resultats </div>');
                    $(".search .resultats .alert").css('display', 'block');
                } else {
                    $.ajax({
                        dataType: 'json',
                        url: 'http://localhost:8000/country-imported',
                        success: function(data) {
                            for(var i =0; i< data.results.length;i++) {
                                data_country.push(data.results[i].country_name);
                            }
                        },
                        error: function(request, status, error) {
                        },
                    }).then(function () {
                    $(".search .resultats ul").html(" ");
                    $(".search .alert").css('display', 'none');
                        if(data_country.includes(data.geonames[0].countryName.toLowerCase()) ) {
                            marker[data.geonames[0].geonameId] = new L.marker([data.geonames[0].lat, data.geonames[0].lng], {
                                myCustomId: data.geonames[0].geonameId
                            }).addTo(featureGroup);
                            mymap.addLayer(featureGroup);
                            $(marker[data.geonames[0].geonameId]._icon).css('animation', 'bounce 0.4s ease infinite');
                            $(marker[data.geonames[0].geonameId].bindPopup("<div class='titre'>" + data.geonames[0].name + "</div>" +
                                "<a class='entite_link' id='" + data.geonames[0].geonameId + "'href='Tableaux.html?gn=" + data.geonames[0].geonameId + "'>" +
                                "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
                                "</span>Lien vers le matching </a>").openPopup());
                        }
                        else {
                            var width_window = $(window).width() - 320 + 'px';
                            affichage_erreur();
                            featureGroup.clearLayers();
                            $('.search').prepend('<div class="information_imported"> Nous n&apos;avons pas encore importer ce pays , <a target="_bank" href="import.html">cliquer pour importer</a></div>');


                        }

            })

        }
            }
        },

    })
}
/// verification formulaire



// Manipulation des resultats
$(".resultats").on('mouseenter', '.item_gn', function() {


        if($(this).hasClass('non_imported')) {
            if (attribut_gn != 0) {
                $(marker['' + attribut_gn + '']._icon).css('animation', 'none');
            $(marker['' + attribut_gn + ''].bindPopup("<div class='titre'>" + $(this).find('p').first().text() + "</div>" +
                "<a class='entite_link' id='" + $(this).attr('id') + "'href='Tableaux.html?gn=" + $(this).attr("id") + "'>" +
                "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
                "</span>Lien vers le matching </a>").closePopup());
            }

            attribut_gn =0;


        }

        else {

            if (attribut_gn != $(this).attr('id')) {
                if (attribut_gn != 0) {
                    console.log('differe 0',attribut_gn);
                    $(marker['' + attribut_gn + '']._icon).css('animation', 'none');
                }
                $(this).css("color", "#022a3b");

                $(marker['' + $(this).attr('id') + ''].bindPopup("<div class='titre'>" + $(this).find('p').first().text() + "</div>" +
                    "<a class='entite_link' id='" + $(this).attr('id') + "'href='Tableaux.html?gn=" + $(this).attr("id") + "'>" +
                    "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
                    "</span>Lien vers le matching </a>").openPopup());
                $(marker['' + $(this).attr('id') + '']._icon).css('animation', 'bounce 0.4s ease infinite');
           }
            attribut_gn = $(this).attr('id');
        }


});

$(".search").on('click', '#btn_annuler', function() {
    $(".btn-search").removeAttr('btn_search');
    $(".btn-search").attr('id', 'btn_annuler');
    $(".resultats label").css('display', 'none');
    $(".resultats ul").html(" ");
    $(".search img").css("display", "block");
})


// fonction pour intercepter clique
function onMapClick(e) {
    featureGroup.clearLayers();
    $(".search .resultats ul").html(" ");
    $(".resultats label").css("display", "none");
    geocodeReverse(e.latlng.lat, e.latlng.lng);
    mymap.setView(e.latlng, e.target._zoom);
}
mymap.on('click', onMapClick);


function clickmarker(e) {
    if (attribut_gn != this.options.myCustomId) {
        if (attribut_gn != 0) {
            $(marker['' + attribut_gn + '']._icon).css('animation', 'none');
        }
        if($(marker['' + this.options.myCustomId + '']._icon).hasClass('disable')) {
            $(marker['' + this.options.myCustomId + '']._icon).css('animation', 'bounce 0.4s ease infinite');
            marker['' + this.options.myCustomId + ''].bindPopup("<div class='titre'>" + $("#" + this.options.myCustomId).find('p').first().text() + "</div>>").openPopup();
        }
        else {
            $(marker['' + this.options.myCustomId + '']._icon).css('animation', 'bounce 0.4s ease infinite');
            marker['' + this.options.myCustomId + ''].bindPopup("<div class='titre'>" + $("#" + this.options.myCustomId).find('p').first().text() + "</div>" +
                "<a class='entite_link' id='" + this.options.myCustomId + "'href='Tableaux.html?gn=" + this.options.myCustomId + "'>" +
                "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
                "</span>Lien vers le matching </a>").openPopup();
        }
        attribut_gn = this.options.myCustomId;


    }
}

/*$("#content").on('click', '.entite_link', function(event) {
    event.preventDefault()
    var id_entity = $(this).attr('id');
    var url_entity = $(this).attr('href');


    $.ajax({
        dataType: 'json',

        url: 'http://localhost:8000/geonames/' + id_entity,

        success: function(data) {
            window.location.href = url_entity;
        },
        error: function(request, status, error) {
            if (request.statusText == 'Not Found') {
                byreturn false;
            }

        },
        beforeSend: function() {
            $.blockUI({message: message_show});
        },
        complete: function() {
            $.unblockUI({message: message_show});
        },
    })

});*/

$("#btn_search").click(function(e) {
    e.preventDefault();
    if ($("#input_search").val() == " ") {
        $(".search .alert").css('display', 'block');
        $(".search .resultats ul").html(" ");
        $(".resultats label").css("display", "none");
        $(".search img").css("display", "block");
    } else {
        $(".search .alert").css("display", "none");
        $(".search img").css("display", "none");
        $(".resultats label").css("display", "block");
        featureGroup.clearLayers();
        $(".search .resultats ul").html(" ");

        /* Recuperation des nom a chercher */
        var search_name = $("#input_search").val();
        geocode({
            q: search_name
        });

        /* Recuperer le nombre de correspondance dans GN */

        $("#input_search").val(" ");

    }

});