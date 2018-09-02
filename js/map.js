var neighborhoods = [];
var markers = [];
var map;
var zoom = 18;
var distance = 0.001;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom : zoom,
		center : {
			lat : 37.483,
			lng : 126.901
		}
	});
}

function dropMarker() {
	clearMarkers();
	for (var i = 0; i < neighborhoods.length; i++) {
		addMarkerWithTimeout(neighborhoods[i], i * 200);
	}
	map.setCenter(neighborhoods[0].position);	
}

function addMarkerWithTimeout(position, timeout) {
	console.log(position);
	var infowindow = new google.maps.InfoWindow();
	window.setTimeout(function() {
		markers.push(new google.maps.Marker({
			position : position.position,
			map : map,
			animation : google.maps.Animation.DROP
		}));

		google.maps.event.addListener(markers[markers.length - 1], 'click',
				(function(marker, i) {
					return function() {
						infowindow.setContent(position.content);
						infowindow.open(map, marker);
					}
				})(markers[markers.length - 1], i));
		google.maps.event.trigger(markers[markers.length - 1], 'click');
	}, timeout);

	console.dir(markers);
}

function clearMarkers() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}
function clearNeighbor() {
	for (var i = 0; i < neighborhoods.length; i++) {
		neighborhoods.shift();
	}
	neighborhoods = [];
}

function addPoint(X, Y, label, stNm) {
	neighborhoods.push({
		position : {
			lat : Y * 1,
			lng : X * 1
		},
		content :'<div id="content" class="infoWindow">'+stNm+' : '+label+'</div>'
	});
}

function zoomIn(){
	map.setZoom(++zoom);
}
function zoomOut(){
	map.setZoom(--zoom);
}
function getZoom(){
	return zoom;
}
function zoomNum(size){
	map.setZoom(size*1);
	zoom = size*1;
}
function moveCenter(direction){
	var curCenter = map.getCenter();
	var lat = curCenter.lat();
	var lng = curCenter.lng();
	console.log(curCenter);
	
	if(zoom > 18)
		distance = 0.0001;
	else
		distance = 0.001;
	
	switch(direction){
	case 'u':
		lat += distance;
		break;
	case 'd':
		lat -= distance;
		break;
	case 'r':
		lng += distance;
		break;
	case 'l':
		lng -= distance;
		break;
	}
	map.setCenter({lat: lat, lng: lng});
}