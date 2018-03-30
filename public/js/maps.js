var polygonPats = [];
var polygonArea;
var editingPolygon;
var address;
var drawingManager = null;
var locationNumber;
var currentLocation;
var defaultLocation = {lat: 40.237368, lng: 44.442798};
var zoom = 8;
$(document).ready(function(){

    $('.add-new').on('click', function (){
        if(currentLocation){
          $(".reset-button").trigger("click");
        }
    });

   $('.confirm-button').on('click', function(){
    if(currentLocation){
      locationNumber = currentLocation;
    } else if($('.locations-table tbody tr').length){
      locationNumber = parseInt($('.locations-table tbody tr').last().find('button').data('number')) + 1
    } else {
      locationNumber = 1;
    }
    var allPointsString = '';
    for(let i = 0; i < polygonPats.length; i++){
          allPointsString += polygonPats[i] + '<br>';
    }
    if(currentLocation){
      currentEditButton = $('.locations-table').find("[data-number='" + currentLocation + "']");
      polygonArea = $(currentEditButton).closest('.locationRow').find('.polygonArea').html(polygonArea);
      address = $(currentEditButton).closest('.locationRow').find('.locationAddress').text(address);
      var points = $(currentEditButton).closest('.locationRow').find('.polygonPats').html(allPointsString);
    } else {
      var tableRow = '<tr class="locationRow"><td class="locationAddress">'+address+ '</td>';
      tableRow += '<td class="polygonArea">'+polygonArea+'m<sup>2</sup></td><td class="polygonPats">';
      tableRow += allPointsString;
      tableRow += '</td><td><button data-number="'+locationNumber+'"  class="editLocation btn">Edit</button></td></tr>'
      $('.locations-table tbody').append(tableRow);
    }
    $('#mapModal').modal('hide');
    currentLocation = false;
    $(".reset-button").trigger("click");

  });

  $('.reset-button').on('click', function(){
    defaultLocation = {lat: 40.237368, lng: 44.442798};
    editingPolygon = null;
    currentLocation = false;
    polygonArea = null;
    zoom = 8;
    $('#pac-input').val('');
    $('.confirm-button').addClass('disabled').attr('disabled', true);
    $(this).addClass('disabled').attr('disabled', true);
    initMap();

  });

  $('.locations-table').on('click', '.editLocation', function (){
    zoom = 4;
    currentLocation = $(this).data('number');
    var locationCordinates = [];
    polygonArea = $(this).closest('.locationRow').find('.polygonArea').html();
    $('#pac-input').val($(this).closest('.locationRow').find('.locationAddress').text());
    address = $(this).closest('.locationRow').find('.locationAddress').text();
    polygonPats = $(this).closest('.locationRow').find('.polygonPats').html().split('<br>');
    polygonPats.pop();
    for(let i = 0; i < polygonPats.length; i++){
      var currentLatLng = polygonPats[i].split(',');
      locationCordinates.push({lat : parseFloat(currentLatLng[0]), lng: parseFloat(currentLatLng[1])});

    }
    defaultLocation = {lat: locationCordinates[0].lat, lng: locationCordinates[0].lng};
    editingPolygon = new google.maps.Polygon({
          paths: locationCordinates,
          strokeColor: '#000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#000',
          fillOpacity: 0.35
        });
      $('.confirm-button').removeClass('disabled').attr('disabled', false);
      $('.reset-button').removeClass('disabled').attr('disabled', false);
      $('#mapModal').modal('show');
      initMap();
  });

});

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: defaultLocation,
    zoom: zoom
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

    if(drawingManager.drawingControl == false){
        drawingManager.drawingControl = true;
    };
    drawingManager.setMap(map);
    $('.confirm-button').addClass('disabled').attr('disabled', true);
    $('.reset-button').removeClass('disabled').attr('disabled', false);
  });

  if(editingPolygon){
    polygonPats = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < editingPolygon.getPath().getLength(); i++) {
        polygonPatString = editingPolygon.getPath().getAt(i).toUrlValue(6);
        patLatLng = polygonPatString.split(",");
        bounds.extend(new google.maps.LatLng(parseFloat(patLatLng[0]), parseFloat(patLatLng[1]))),
        polygonPats.push(editingPolygon.getPath().getAt(i).toUrlValue(6));
    }
    infowindow.setPosition(bounds.getCenter());
    infowindow.setContent(polygonArea);
    infowindow.open(map, editingPolygon);
    editingPolygon.setMap(map);
  }

  drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      }
    });
  google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      editingPolygon = polygon;
      polygonPats = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < editingPolygon.getPath().getLength(); i++) {
          polygonPatString = editingPolygon.getPath().getAt(i).toUrlValue(6);
          patLatLng = polygonPatString.split(",");
          bounds.extend(new google.maps.LatLng(parseFloat(patLatLng[0]), parseFloat(patLatLng[1]))),
          polygonPats.push(editingPolygon.getPath().getAt(i).toUrlValue(6));
      }
      drawingManager.setMap(null);
      drawingManager.drawingControl = null;
      polygonArea = Math.round(google.maps.geometry.spherical.computeArea(editingPolygon.getPath()));
      infowindow.setPosition(bounds.getCenter());
      infowindow.setContent(polygonArea+'m<sup>2</sup>');
      infowindow.open(map, editingPolygon);
      $('.confirm-button').removeClass('disabled').attr('disabled', false);
  });
}