const events = [ {start: 30, end: 150}, {start: 200, end: 255}, {start: 540, end: 620}, {start: 630, end: 670} ];

layOutDay(events);

function generateMockEvents (n) {
  let events = [];
  let minutesInDay = 60 * 12;

  while (n > 0) {
    let start = Math.floor(Math.random() * minutesInDay)
    let end = start + Math.floor(Math.random() * (minutesInDay - start));
    events.push({start: start, end: end})
    n --;
  }

  return events;
}
