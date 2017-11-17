var data = require('./data2.json'),
    dsv = require('d3-dsv'),
    fs = require('fs'),
    moment = require('moment');

function makeCSVReady(data) {

    var dayHeadings = ['sun', 'mon', 'tus', 'wed', 'thu', 'fri', 'sat', 'total'];

    data = data.reduce(function (dataOut, week) {
        var working = week.projects.find(function (project) {
                return project.title.match(/work/i) !== null;
            }),
            objOut = {
                startDate: week.startDate,
                title: working.title
            };

        //divy out the days to properties.
        dayHeadings.forEach(function (day, i) {
            var time = moment.duration(working.totals[i]),
                valOut = Math.floor(time.asHours()) + ':' + time.minutes() + ':' + time.seconds();
            if (working.totals[i] !== null) {
                objOut[day] = valOut;
            } else {
                objOut[day] = '';
            }
        });



        dataOut.push(objOut);
        return dataOut;
    }, []);

    return data;
}


var fixedData = makeCSVReady(data);
console.log(fixedData);
fs.writeFileSync('csvOut.csv', dsv.csvFormat(fixedData), 'utf8');