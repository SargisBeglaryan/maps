var polygonPats = [];
var polygonArea;
var polygon;
var address;
var drawingManager = null;
var autocomplete = null;
var locationNumber;
var currentLocation;
$(document).ready(function(){

   $('.confirm-button').on('click', function(){
    if(currentLocation){
      locationNumber = currentLocation;
    } else if($('.locations-table tbody tr').length){
      locationNumber = parseInt($('.locations-table tbody tr').last().find('button').data('number')) + 1
    } else {
      locationNumber = 1;
    }
    var tableRow = '<tr class="locationRow"><td>'+address+ '</td>';
    tableRow += '<td>'+polygonArea+'m<sup>2</sup></td><td class="polygonPats">';
    for(let i = 0; i < polygonPats.length; i++){
        tableRow += polygonPats[i] + '<br>';
    }
    tableRow += '</td><td><button data-number="'+locationNumber+'"  class="editLocation btn">Edit</button></td></tr>'
    $('.locations-table tbody').append(tableRow);
    $('#mapModal').modal('hide');
    currentLocation = false;

  });

  $('.reset-button').on('click', function(){

    polygon.setMap(null);
    $(this).addClass('disabled');
    $('.confirm-button').addClass('disabled');

  });

  $('.locations-table').on('click', '.editLocation', function (){
    currentLocation = $(this).data('number');
    var locationCordinates = [];
    var points = $(this).closest('.locationRow').find('.polygonPats').html().split('<br>','');
    points.pop();
    for(let i = 0; i < points.length; i++){
      var currentLatLng = points[i].split(',');
      locationCordinates.push({lat : currentLatLng[0], lng: currentLatLng[1]});

    }
    polygon = new google.maps.Polygon({
          paths: locationCordinates,
          strokeColor: '#fff',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#fff',
          fillOpacity: 0.35
        });
      polygon.setMap(map);
      $('#mapModal').modal('show');
  });
  
  
});

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  var input = document.getElementById('pac-input');

  autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].long_name || '')
      ].join(' ');
    }

    if(drawingManager == null){
        drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon']
        }
      });
    }
    drawingManager.setMap(map);
    changeButtonDisabled('reset-button');
    
  });
  drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      }
    });
  google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < polygon.getPath().getLength(); i++) {
          polygonPatString = polygon.getPath().getAt(i).toUrlValue(6);
          patLatLng = polygonPatString.split(",");
          bounds.extend(new google.maps.LatLng(patLatLng[0], patLatLng[1])),
          polygonPats.push(polygon.getPath().getAt(i).toUrlValue(6));
      }
      drawingManager.setMap(null);
      drawingManager.drawingControl = null;
      polygonArea = Math.round(google.maps.geometry.spherical.computeArea(polygon.getPath()));
      infowindow.setPosition(bounds.getCenter());
      infowindow.setContent(polygonArea+'m<sup>2</sup>');
      infowindow.open(map, polygon);
      changeButtonDisabled('confirm-button');
  });
}

function changeButtonDisabled(buttonClass){
  if($('.'+ buttonClass).hasClass('disabled')){
    $('.'+ buttonClass).removeClass('disabled')
  } else {
    $('.'+ buttonClass).addClass('disabled')
  }
}
// function createDrawObject(){
//   drawingManager = new google.maps.drawing.DrawingManager({
//       drawingMode: google.maps.drawing.OverlayType.MARKER,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: ['polygon']
//       }
//     });
// }