var builder = require('xmlbuilder');
var fs = require('fs');

let convert_to_gpx = (items) => {
    console.log("Converting checkins to GPX...");
    // add root xml information
    let xml = builder.create('gpx', { encoding: 'utf-8' })
        .att('xmlns', 'http://www.topografix.com/GPX/1/1')
        .att('version', '1.1')
        .att('creator', 'GPXConverter')
        .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        .att('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');                    

    // add all checkins as waypoints
    for (let item of items){
        if (item.venue) {
            xml
            .ele('trk')
                .ele('name', item.venue.name).up()                
            .ele('trkseg')
            .ele('trkpt', { 'lat': item.venue.location.lat, 'lon': item.venue.location.lng})
                .ele('time', convertTimeToISO8601(item.createdAt)).up()                
                .ele('ele', '0').up().up()                
            .ele('trkpt', { 'lat': item.venue.location.lat, 'lon': item.venue.location.lng})
                .ele('time', convertTimeToISO8601(item.createdAt)).up()                
                .ele('ele', '0').up();                
        }
    }
    xml.end({pretty: true});

    // write xml data to file (but delete the old file first if there is already one)
    console.log("Writing GPX file SwarmCheckins.gpx...");
    fs.unlink('SwarmCheckins.gpx', function(err) {
        fs.appendFile('checkins_gpx.gpx', xml, function(err) {
            if (err) {
                console.log('Unable to write file');
            } else {
                console.log("Finished");
            }
        });
     });
    }

let convertTimeToISO8601 = (time) => {
    let date = new Date(time * 1000);
    let year = date.getFullYear();
    let month = padWithLeadingZero(date.getMonth() + 1);
    let day = padWithLeadingZero(date.getDate());
    let hour = padWithLeadingZero(date.getHours());
    let minute = padWithLeadingZero(date.getMinutes());
    let second = padWithLeadingZero(date.getSeconds());
    let dateString = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
    return dateString;
}

let padWithLeadingZero = (value) => {
    return (value < 10) ? '0' + value : value; 
}

// export function
module.exports.convert_to_gpx = convert_to_gpx