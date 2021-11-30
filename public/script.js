const containerHeight = 720;
const containerWidth = 1280;
const minutesinDay = 60 * 12;
let collisions = [];
let width = [];
let leftOffSet = [];

var modal = document.getElementById("add-event-modal");
var btn = document.getElementById("add");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var createEvent = (height, top, left, units) => {

  let node = document.createElement("DIV");
  node.className = "event";
  node.innerHTML = 
  "<span class='title'> Ing. Někdo Něco </span>";

  node.style.width = (containerWidth/units) + "px";
  node.style.height = height + "px";
  node.style.top = 100 + top + "px";
  node.style.left = 175 + left + "px";

  document.getElementById("events").appendChild(node);
}


function getCollisions (events) {

  collisions = [];

  for (var i = 0; i < 24; i ++) {
    var time = [];
    for (var j = 0; j < events.length; j++) {
      time.push(0);
    }
    collisions.push(time);
  }

  events.forEach((event, id) => {
    let end = event.end;
    let start = event.start;
    let order = 1;

    while (start < end) {
      timeIndex = Math.floor(start/30);

      while (order < events.length) {
        if (collisions[timeIndex].indexOf(order) === -1) {
          break;
        }
        order ++;
      }

      collisions[timeIndex][id] = order;
      start = start + 30;
    }

    collisions[Math.floor((end-1)/30)][id] = order;
  });
};

function getAttributes (events) {

  width = [];
  leftOffSet = [];

  for (var i = 0; i < events.length; i++) {
    width.push(0);
    leftOffSet.push(0);
  }

  collisions.forEach((period) => {

    let count = period.reduce((a,b) => {
      return b ? a + 1 : a;
    })

    if (count > 1) {
      period.forEach((event, id) => {

        if (period[id]) {
          if (count > width[id]) {
            width[id] = count;
          }
        }

        if (period[id] && !leftOffSet[id]) {
          leftOffSet[id] = period[id];
        }
      })
    }
  });
};

var layOutDay = (events) => {

var myNode = document.getElementById("events");
myNode.innerHTML = '';

  getCollisions(events);
  getAttributes(events);

  events.forEach((event, id) => {
    let height = (event.end - event.start) / minutesinDay * containerHeight;
    let top = event.start / minutesinDay * containerHeight; 
    let end = event.end;
    let start = event.start;
    let units = width[id];
    if (!units) {units = 1};
    let left = (containerWidth / width[id]) * (leftOffSet[id] - 1) + 10;
    if (!left || left < 0) {left = 10};
    createEvent(height, top, left, units);
  });
}