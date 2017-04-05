/// Variable globale
var lattitude = 45.781431999999995; // Pays initiale
var longitude = 4.8677681; // Pays initiale
var length_gn; // Taille elemnt
var zoom = 13; // Zoom initial
var marker = {}; // listes des marker
var attribut_gn = '0';
var featureGroup = new L.featureGroup(); // pour faire le resize

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});
if($_GET["q"]) {
if($_GET["q"].length!=0){
     geocode({
                q: $_GET["q"]
            }
      );
}
}

// Map
var mymap = L.map('mapid', {zoomControl: false}).setView([lattitude, longitude], zoom);
L.tileLayer('https://api.mapbox.com/styles/v1/sofiaa/cizvzm9h3002t2ro4a37h1own/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1Ijoic29maWFhIiwiYSI6ImNpenU4N2dnOTAwMmUyd2xoY2hsMmhrMDcifQ.3jTZDb2ABQuhQPIbucQCdQ'
}).addTo(mymap);

L.control.zoom({
    position:'topright'
}).addTo(mymap);

// Popup
var popup = L.popup();

//// Ajax for APIGeoname search name

function geocode(options) {
    options.username = 'sofiaafaddi';
    options.type = 'json';

    $.ajax({
        url: 'http://api.geonames.org/search',
        data: options,
        dataType: 'json',
        success: success_function,
        error : error_function,
        beforeSend: function() {
        $('#patientez').modal("show");
        },
        complete: function(){
       $('#patientez').modal("hide");
  },

    })
    function success_function(data) {
        console.log(data);
        getInformation(data);
    }
    function  error_function(message) {
        console.log(message)

    }
}
    function getInformation(data) {
// Affichage des donnees dans le marker
        if(data.status) {
            $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                '<span class="sr-only">Error:</span>Aucun resultats </div>');
            $(".search .resultats .alert").css('display', 'block');
        }


        else {
            if (data.geonames.length === 0) {

                $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                    '<span class="sr-only">Error:</span>Aucun resultats </div>');
                $(".search .resultats .alert").css('display', 'block');
            }

            else {
                $(".search .resultats ul").html(" ");
                $(".search .resultats .alert").css('display', 'none');
                for (var i = 0; i < data.geonames.length; i++) {


                    marker[data.geonames[i].geonameId] = new L.marker([data.geonames[i].lat, data.geonames[i].lng], {myCustomId: data.geonames[i].geonameId}).addTo(featureGroup).on('click', clickmarker);
                    $(".search .resultats ul").append("<li class='item_gn' id=" + data.geonames[i].geonameId + "><p><span style='padding-right: 10px;' class='glyphicon glyphicon-flag'" +
                        " aria-hidden='true'></span>" + data.geonames[i].name + "</p>" +
                        "<p><b>Pays: </b> " + data.geonames[i].countryName + "</p>")

                }



            mymap.addLayer(featureGroup);

            mymap.fitBounds(featureGroup.getBounds());
    
            }
        }


}

function geocodeReverse(lat, lng){
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
            if(data.status){
                $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                    '<span class="sr-only">Error:</span>Aucun résultat </div>');
                $(".search .resultats .alert").css('display', 'block');
            }
            else {
                if(data.geonames.length ===0) {

                    $(".search .resultats ul").append('<div class="alert alert-danger" role="alert">' +
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                        '<span class="sr-only">Error:</span>Aucun resultats </div>');
                    $(".search .resultats .alert").css('display', 'block');
                }
                else {
                    $(".search .resultats ul").html(" ");
                    $(".search .alert").css('display', 'none');
                    marker[data.geonames[0].geonameId] = new L.marker([data.geonames[0].lat, data.geonames[0].lng], {myCustomId: data.geonames[0].geonameId}).addTo(featureGroup);
                    mymap.addLayer(featureGroup);
                    $(marker[data.geonames[0].geonameId]._icon).css('animation', 'bounce 0.4s ease infinite');
                    $(marker[data.geonames[0].geonameId].bindPopup("<div class='titre'>" + data.geonames[0].name + "</div><a href='Tableaux.html'>" +
                        "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
                        "</span>Lien vers le matching </a>").openPopup());


                }
            }
        }, beforeSend: function() {
        $('#patientez').modal("show");
        },
        complete: function(){
       $('#patientez').modal("hide");
   }
    })



}

/// verification formulaire

$("#btn_search").click(function(e) {
    e.preventDefault();
    if ($("#input_search").val() == " ") {

        $(".search .alert").css('display', 'block');

        $(".search .resultats ul").html(" ");
        $(".resultats label").css("display", "none");
        $(".search img").css("display", "block");

    }
    else {

        $(".search .alert").css("display", "none");
        $(".search img").css("display", "none");
        $(".resultats label").css("display", "block");
        featureGroup.clearLayers();
        $(".search .resultats ul").html(" ");

        /* Recuperation des nom a chercher */
        var search_name = $("#input_search").val();
        geocode({
                q: search_name
            }
        );


        /* Recuperer le nombre de correspondance dans GN */


        $("#input_search").val(" ");


    }


    });


// Manipulation des resultats

$(".resultats").on('mouseenter','.item_gn',function () {


   if( attribut_gn != $(this).attr('id')) {
       $(this).css("color", "#022a3b");

       if(attribut_gn != 0) {
           $(marker['' + attribut_gn + '']._icon).css('animation', 'none');
       }
       $(marker['' + $(this).attr('id') + '']._icon).css('animation', 'bounce 0.4s ease infinite');
       $(marker[''+$(this).attr('id')+''].bindPopup("<div class='titre'>"+$(this).find('p').first().text()+"</div><a href='Tableaux.html'>" +
           "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
       "</span>Lien vers le matching </a>").openPopup());
       attribut_gn = $(this).attr('id');
   }


});

$(".search").on('click','#btn_annuler',function () {
    $(".btn-search").removeAttr('btn_search');
    $(".btn-search").attr('id','btn_annuler');
    $(".resultats label").css('display','none');
    $(".resultats ul").html(" ");
    $(".search img").css("display", "block");


})


// fonction pour intercepter clique
function onMapClick(e) {
    featureGroup.clearLayers();
    $(".search .resultats ul").html(" ");
    $(".resultats label").css("display", "none");
    geocodeReverse(e.latlng.lat, e.latlng.lng);
    mymap.setView(e.latlng,e.target._zoom);






}
   mymap.on('click', onMapClick);
   //marker.on('click', onMapClick);


function clickmarker(e) {
    console.log('huuu');
    if (attribut_gn != this.options.myCustomId) {
        if(attribut_gn != 0) {
            $(marker['' + attribut_gn + '']._icon).css('animation', 'none');
        }
        $(marker['' + this.options.myCustomId + '']._icon).css('animation', 'bounce 0.4s ease infinite');
        marker['' + this.options.myCustomId + ''].bindPopup("<div class='titre'>" + $("#" + this.options.myCustomId).find('p').first().text() + "</div><a href='Tableaux.html'>" +
            "<span class='glyphicon glyphicon-link' aria-hidden='true'>" +
            "</span>Lien vers le matching </a>").openPopup();
        attribut_gn = this.options.myCustomId;


    }
}



