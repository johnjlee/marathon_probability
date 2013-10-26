function convertToMetersPerSecond(secondsPerMile) {
  return 1609.34 / secondsPerMile;
}

function milesToMeters(miles) {
  return 1609.34 * miles;
}

// Given a distance, in meters, from 0 to 42k, this returns the approximate
// lat/long on the marathon course.
function distanceToPoint(distance) {
  // TODO(jjl): binary search
  for (var index = 1; index < DISTANCES.length; ++index) {
    if (DISTANCES[index] > distance) {
      break;
    }
  }

  if (index >= DISTANCES.length) {
    return null;
  }

  var a = LATLNG[index - 1];
  var b = LATLNG[index];

  // Return a lat/lng using weighted averages.
  var f = (distance - DISTANCES[index - 1]) /
    (DISTANCES[index] - DISTANCES[index - 1]);

  return [a[0]*(1-f) + b[0]*f,  a[1]*(1-f) + b[1]*f];
}
