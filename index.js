const csv = require("csvtojson");
var dayOfWeek = require('day-of-week').get;
var weekday = require('weekday');
const fs = require("fs");

var json = [];
csv()
.fromFile("./data.csv")
.on('json',(jsonObj)=>{
  var newObj = {};
    newObj.date = jsonObj["Date"];
    newObj.users = parseInt(jsonObj["Total Current Users"]);
    newObj.weekday = weekday(dayOfWeek(jsonObj["Date"], 'America/New_York') + 1);
    json.push(newObj);
})
.on('done',(error)=>{
  dayOfTheWeekStats(json);
  dayOfTheMonthStats(json);
});



function dayOfTheMonthStats(data){
  var newData = data.map((day)=>{
    day.date = day.date.slice("-")[2];
    return day;
  });
  var days = [];

  for (var i = 0; i < 33; i++){
    var oneDay = matching("date", i, newData);
  console.log(oneDay);
    var dayMean = avg(oneDay, "users");
    var dayMedian = med(oneDay, "users");
    days.push({"date": i, "mean": dayMean, "median": dayMedian});
  }
  console.log(days);
}



function dayOfTheWeekStats(data){
  var mon = avgForDay("day", "Monday", data);
  var tue = avgForDay("day", "Tuesday", data);
  var wed = avgForDay("day", "Wednesday", data);
  var thu = avgForDay("day", "Thursday", data);
  var fri = avgForDay("day", "Friday", data);
  var sat = avgForDay("day", "Saturday", data);
  var sun = avgForDay("day", "Sunday", data);
}

function avgForDay(prop, day, data){
  var dayAvg = avg(matching(prop, day, data), "users");
  var dayMed = med(matching(prop, day, data), "users");
  console.log(day, "Mean", dayAvg, "Median", dayMed);
  return dayAvg;
}

function matching(prop, value, arr){
  console.log(prop, value);
  return arr.filter(obj => obj[prop] === value);
}

function avg(arr, prop){
  var propArray = arr.map((item)=>{
    return item[prop];
  })
  return parseInt(propArray.reduce((a,b) => a + b, 0) / propArray.length);
}


function med(arr, prop) {
  var propArray = arr.map((item)=>{
    return item[prop];
  })
    propArray.sort( function(a,b) {return a - b;} );

    var half = Math.floor(propArray.length/2);

    if(propArray.length % 2)
        return propArray[half];
    else
        return (propArray[half-1] + propArray[half]) / 2.0;
}
