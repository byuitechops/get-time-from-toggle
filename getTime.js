/* eslint no-console:0, no-unused-vars:0 */

var TogglClient = require('toggl-api'),
    asyncLib = require('async'),
    moment = require('moment'),
    fs = require('fs'),
    toggl = new TogglClient({
        apiToken: process.argv[3]
    }),
    startDay = moment('5-21-2017', 'MM-DD-YYYY'), //make sure it's a sunday
    today = moment(),
    weekStartDays = [],
    fileOutName = 'data2.json',
    reportSettings;

//get all the sundays
while (startDay.isBefore(today)) {
    weekStartDays.push(startDay.format('YYYY-MM-DD'));
    startDay.add(7, 'days');
}

// console.log(weekStartDays);


function getReport(date, cb) {
    var settings = {
        user_agent: process.argv[2],
        since: date,
        workspace_id: 601479,
    };


    toggl.weeklyReport(settings, function (err, report) {
        if(err){
            console.log(err);
            cb(err, null);
        }
        var reportOut = {
            startDate: date,
            projects: report.data.map(function(project){
                return {
                    title : project.title.project,
                    totals: project.totals
                };
            })
        };

        cb(err, reportOut);
    });
}



asyncLib.mapSeries(weekStartDays, getReport, function (err, report) {
    if(err){
        console.log(err);
    }

    
    //console.log(report);
    fs.writeFileSync('data2.json',JSON.stringify(report,null,2),'utf8');
    console.log('Done: Wrote '+ fileOutName);
});
/*
getReport(weekStartDays[0],function(err,report){
    console.log(err);
    console.log(report);
});
*/
// toggl.getWorkspaces(function (err, data) {
//     console.log(err);
//     console.log(data);
// });