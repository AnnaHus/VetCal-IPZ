document.addEventListener('DOMContentLoaded', function() {
  fetch('/activeUser').then(response => response.text()).then(data => document.querySelector("#username").innerHTML = data);
  const now = new Date();
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridDay',
    height: '80%',
    nowIndicator: 'true',
    businessHours: {
      // days of week. an array of zero-based day of week integers (0=Sunday)
      daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Thursday

      startTime: '8:00', // a start time (10am in this example)
      endTime: '17:00', // an end time (6pm in this example)
    },
    slotDuration: '00:15:00',
    locale: 'cz',
    customButtons: {
      newApp: {
        text: 'Nová návštěva',
        click: function() {
          openNewApp();
        }
      }
    },
    buttonText: {
      today:    'dnes',
      month:    'měsíc',
      week:     'týden',
      day:      'den',
      list:     'list'
    },
    themeSystem: 'bootstrap',
    bootstrapFontAwesome: {
      close: 'fa-times',
      prev: 'fa-chevron-left',
      next: 'fa-chevron-right',
      prevYear: 'fa-angle-double-left',
      nextYear: 'fa-angle-double-right'
    },
    headerToolbar: {
      start: 'today prev,next', // will normally be on the left. if RTL, will be on the right
      center: 'title',
      end: 'newApp' // will normally be on the right. if RTL, will be on the left
    },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: 'false'
    },
    selectable: true,
    select: function(info) {
      if(info.allDay){
        datum = info.start;
        createNewShift();
      }else{
        if(info.end){
          e = new Date(info.end);
          s = new Date(info.start);
          d = Math.abs(e-s)/ 60000;
        }
        openNewApp(s, d);
      }
    },
    events: {
      url: '/apps',
      method: 'GET',
      failure: function() {
        alert('there was an error while fetching events!');
      }
    },
    eventDataTransform: function( eventData ) {
      var ro = new Object();
      ro.start = eventData.dateTime;
      let d = new Date(eventData.dateTime);
      d.setMinutes(d.getMinutes() + eventData.duration);
      ro.end = d.toISOString();
      ro.allDay = eventData.allDay;
      ro.title = eventData.clientName;
      ro.note = eventData.optionalDesc;
      ro.sourceObject = eventData;
      console.log("converted event", ro);
      return ro;
    },
    scrollTime: '08:00:00',
    allDayText: "Služba",
    eventContent: function(arg) {
      return {
        html: arg.event.title + '<br>' + arg.event.extendedProps.note
      }
    },
  });
  calendar.render();
  //const now = new Date();

  // number of milliseconds since the Unix Epoch
  const ms = now.getTime();

  console.log(ms);
  // calendar.scrollToTime(now); 


let newAppForm = document.querySelector("#newApp");
let shiftForm = document.querySelector("#newShiftForm");

const openNewApp = (start = new Date(), duration = 15) => {
  z = start.getTimezoneOffset() * 60 * 1000;
  tLocal = start-z;
  tLocal = new Date(tLocal);
  iso = tLocal.toISOString();
  iso = iso.slice(0, 19);
  iso = iso.replace('T', ' ');
  
  document.querySelector("#startInput").value = iso;
  console.log(document.querySelector("#startInput").value);
  document.querySelector("#durationInput").value = duration;
  $('#newAppModal').modal();
}

const saveNewApp = (event) => {
  event.preventDefault();
  const clientName = document.querySelector("#nameInput").value;
  const start = document.querySelector("#startInput").value;
  const duration = document.querySelector("#durationInput").value;
  const note = document.querySelector("#noteInput").value;
  console.log("Client name: " + clientName + "\n" + "Start: " + start + "\n" + "Duration: " + duration + "\n" + "Note: " + note);
  var app = new Object();
  app.clientName = clientName;
  app.dateTime = start;
  app.duration = duration;
  app.optionalDesc = note;
  app.allDay = false;
  calendar.addEvent( app );
  fetch('https://vetcal.herokuapp.com/apps',{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(app) // body data type must match "Content-Type" header
  }).then(response => console.log(response.json()));
  newAppForm.reset();
  $('#newAppModal').modal('hide');
  calendar.refetchEvents();
  calendar.render();
}

const createNewShift = () => {
  fetch('https://vetcal.herokuapp.com/users')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    var select = document.querySelector("#doctorSelect");
    for (let val of data) {
      var option = document.createElement("option");
      option.value = val.username;
      option.text = val.username;
      select.appendChild(option);
    }
  });

  $('#shiftModal').modal();
}

const newShift = (event) => {
  event.preventDefault();
  console.log(datum.toISOString());
  let app = new Object();
  app.clientName = document.querySelector("#doctorSelect").value;
  app.dateTime = datum.toISOString();
  app.duration = 1440;
  app.allDay = true;
  fetch('https://vetcal.herokuapp.com/apps',{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(app) // body data type must match "Content-Type" header
  }).then(response => console.log(response.json()));
  shiftForm.reset();
  $('#shiftModal').modal('hide');
  calendar.refetchEvents();
  calendar.render();
}

newAppForm.addEventListener("submit", saveNewApp);
shiftForm.addEventListener("submit", newShift);
});