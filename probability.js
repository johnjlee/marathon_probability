var PACE = 3.5762;  // meters per second

// Seconds per mile, one entry per mile.
var PACES_PER_MILE = [
  516,  // miles 0-1 are run at 8:36, or 516 sec/mile
  397,  // mile 1-2 is downhill, 6:37/mile = 397
  453,
  442,
  442,
  433,
  440,
  447,
  457,
  427,
  455,
  433,
  441,
  448,
  457,
  465,
  429,
  434,
  440,
  449,
  443,
  441,
  442,
  472,
  436,
  446,
  450 // This is for the last 0.22 miles
];
// Given a distance in meters into the race, this returns the pace I'll be
// running based on the even-effort data and elevation chart.
function getPaceAtLocation(distance) {
  var mileMarker = Math.min(Math.floor(distance / 1609.34), 26);
  return PACES_PER_MILE[mileMarker];
}

// Given a distribution (an Object of {distance: probability} samples), compute
// the distribution of where I'll be timeOffset seconds from now.
// Distances are in meters and time is in seconds.
// Pace is in seconds per mile.
function computeDistribution(distribution, timeOffset) {
  var newDist = {};

  normalizeDistribution(distribution, 100000);

  for (distance in distribution) {
    var targetPace = getPaceAtLocation(distance);
    // Take each of these samples and distribute them uniformly across
    // a range of paces.
    var minSpeed = convertToMetersPerSecond(targetPace + 20);
    var maxSpeed = convertToMetersPerSecond(targetPace - 15);

    distance = parseInt(distance);
    // Distribute the weight in this bucket evenly across the range of
    // speeds.
    var newMinDistance = Math.round(distance + minSpeed*timeOffset);
    var newMaxDistance = Math.round(distance + maxSpeed*timeOffset);
    var numBuckets = (newMaxDistance - newMinDistance) + 1;
    var increment = distribution[distance] / numBuckets;

    for (var i = newMinDistance; i <= newMaxDistance; i += 3) {
      if (i in newDist) {
        newDist[i] += increment;
      } else {
        newDist[i] = increment;
      }
    }
  }

  normalizeDistribution(newDist, 100000);
  return newDist;
}

// Normalizes a distribution (in place) to add up to (approximately) N.
function normalizeDistribution(distribution, N) {
  var sum = 0;
  for (distance in distribution) {
    sum += distribution[distance];
  }

  for (distance in distribution) {
    distribution[distance] = Math.ceil(N * distribution[distance]/sum);
  }
}


function curve(x) {
  return 10*Math.sqrt(x);
}

function getDisplayDistribution(distribution) {
  var max = 0;
  for (distance in distribution) {
    if (distribution[distance] > max) {
      max = distribution[distance];
    }
  }

  var newDist = {};
  for (distance in distribution) {
    var value = 100*distribution[distance]/max;
    newDist[distance] = curve(value);
  }
  return newDist;
}
