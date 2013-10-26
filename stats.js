// Given a probability distribution of locations for a specific time,
// this populates the table with info about the probability that I've
// passed a certain mile marker.
function updateTable(distribution) {
  var sum = 0;
  for (distance in distribution) {
    sum += distribution[parseInt(distance)];
  }

  var table = document.getElementById('table');

  for (var i = 1; i <= 26; ++i) {
    var row = table.getElementsByTagName('tr')[i];
    var cell = row.getElementsByTagName('td')[1];

    var pastProb = 0;
    for (distance in distribution) {
      distance = parseInt(distance);
      if (distance > milesToMeters(i)) {
        pastProb += distribution[distance];
      }
    }
    cell.innerHTML = 100*(Math.floor(100*(pastProb / sum)))/100 + '%';
  }

  cell = document.getElementById('finish');
  var pastProb = 0;
  for (distance in distribution) {
    distance = parseInt(distance);
    if (distance > milesToMeters(26.22)) {
      pastProb += distribution[distance];
    }
  }
  cell.innerHTML = 100*(Math.floor(100*(pastProb / sum)))/100 + '%';
}
