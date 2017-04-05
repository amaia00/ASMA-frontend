

$(document).on('shown.bs.modal','#myModal ', function () {

    var height = $(".pal").height()+10;
    $('.grill').css('height',height);

    // get click button to valide data


	// marker 1 :
	var rougeIcon = L.icon({
    iconUrl: 'images/marker_rouge.png',

    iconSize:     [42, 42], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
	var greenIcon = L.icon({
    iconUrl: 'images/marker_green.png',

    iconSize:     [42, 42], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var mymap = L.map('maps').setView([-3.781013, -38.514633], 13);
  

L.tileLayer('https://api.mapbox.com/styles/v1/sofiaa/cizvzm9h3002t2ro4a37h1own/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
     trackResize: true,
    id: 'your.mapbox.project.id',
    accessToken: 'pk.eyJ1Ijoic29maWFhIiwiYSI6ImNpenU4N2dnOTAwMmUyd2xoY2hsMmhrMDcifQ.3jTZDb2ABQuhQPIbucQCdQ'
}).addTo(mymap);

 mymap.invalidateSize(false);

L.marker([-3.781013, -38.514633], {icon: rougeIcon}).addTo(mymap);
L.marker([-3.784313, -38.509493], {icon: greenIcon}).addTo(mymap);
L.marker([-3.781053, -38.514653]).addTo(mymap)
L.marker([-3.781653, -38.528613]).addTo(mymap)
L.marker([-3.781853, -38.522643]).addTo(mymap)
L.marker([-3.781953, -38.546683]).addTo(mymap)


});
$('#myModal').on('hidden',function(){
    if( marker ) {
        map.removeLayer(marker);
        marker = null;
    }
});

$('.btn-search').click(function(){
    if ($("#input_search").val() == " ") {

        $(".search .alert").css('display', 'block');

        $(".search .resultats ul").html(" ");
        $(".resultats label").css("display", "none");
        $(".search img").css("display", "block");
        return false;

    }
 
});