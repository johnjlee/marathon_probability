init();

var distributions = [];
// This is an array of distribution objects. Consecutive entries are 1 minute
// apart.
var lastDistribution =  {0: 100000};


distributions.push(lastDistribution);
var maxSamples = 198;
for (var x = 1; x < maxSamples; ++x) {
  var newDistribution = computeDistribution(distributions[x-1], 60);
  distributions.push(newDistribution);
}


// Given an offset in minutes, this returns a pretty string with
// 9:42AM + offset.
function formatTime(minutes) {
  var totalMinutes = 9*60+42 + minutes;

  var hours = Math.floor(totalMinutes / 60);
  var remainderMinutes = totalMinutes % 60;

  if (remainderMinutes < 10) {
    remainderMinutes = '0' + remainderMinutes;
  }

  var ampm = 'AM';
  if (hours > 12) {
    hours -= 12;
    ampm = 'PM';
  } else if (hours == 12) {
    ampm = 'PM';
  }
  return hours + ':' + remainderMinutes + ' ' + ampm;
}



var slider = document.getElementById('slider');
var display = document.getElementById('time-display');

function updateDisplay() {
  var value = parseInt(slider.value);
  display.innerHTML = formatTime(value);
  plotActualPosition(value);
  plotDistribution(distributions[value]);
  updateTable(distributions[value]);
}

updateDisplay(distributions[0]);
slider.onchange = updateDisplay;
