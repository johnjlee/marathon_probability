var MAP;

var HEATMAP = new google.maps.visualization.HeatmapLayer({
  radius: 8,
  opacity: 1.0,
  maxIntensity: 600,
  zIndex: 2
});

var ACTUAL_POSITION_MARKER = null;
var ACTUAL_POSITION_OFFSET= 1;
function init() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(40.6235188,-74.0411376),
    mapTypeId: google.maps.MapTypeId.MAP
  };

  MAP = new google.maps.Map(document.getElementById('canvas'),
                            mapOptions);
  HEATMAP.setMap(MAP);

  // Plot the marathon course.
  var marathonCourse = [];
  for (var i = 0; i < LATLNG.length; ++i) {
    marathonCourse.push(new google.maps.LatLng(LATLNG[i][0], LATLNG[i][1]));
  }
  var path = new google.maps.Polyline({
    path: marathonCourse,
    strokeColor: '#737c95',
    strokeOpacity: 0.25,
    strokeWeight: 8,
    zIndex: -1,
    clickable: false,
    map: MAP
  });

  // Place markers at each mile.
  for (var i = 1; i <= 26; ++i) {
    var location = distanceToPoint(milesToMeters(i));
    var latlng = new google.maps.LatLng(location[0], location[1]);
    var marker = new google.maps.Marker({
      position: latlng,
      map: MAP,
      icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + i + "|f15a22|000000",
      title: '' + i
    });
  }

  ACTUAL_POSITION_MARKER = new google.maps.Marker({
    position: new google.maps.LatLng(ACTUAL_POSITIONS[ACTUAL_POSITION_OFFSET][0], ACTUAL_POSITIONS[ACTUAL_POSITION_OFFSET][1]),
    map: MAP,
    icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=J|39ff14|000000",
    title: 'jjl'
  });
}


// Plots a distribution (obj of distance: sampleCount) as a heatmap.
function plotDistribution(dist) {
  dist = getDisplayDistribution(dist);
  var points = [];
  var count = 0;
  for (distance in dist) {
    var latlng = distanceToPoint(parseInt(distance));
    if (latlng === null) {
      break;
    }
    var loc = {
      "location": new google.maps.LatLng(latlng[0], latlng[1]),
      "weight": dist[distance]
    };
    points.push(loc);
  }

  MAP.panTo(points[Math.floor(points.length/2)].location);
  HEATMAP.setData(new google.maps.MVCArray(points));
}

function plotActualPosition(minute) {
  var pos = ACTUAL_POSITIONS[minute+ACTUAL_POSITION_OFFSET];
  ACTUAL_POSITION_MARKER.setPosition(new google.maps.LatLng(pos[0], pos[1]));
}
