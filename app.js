const downloader = require('./downloader.js');
const gpx_converter = require('./gpxconverter.js')

const yargs = require('yargs')
    .usage('Usage: $0 --clientId <ClientID> --secret <ClientSecret>  --token <OauthToken>')
    .demandOption(['clientId','secret', 'token'])
    .alias('i', 'clientId')    
    .describe('i', 'ClientID of your FourSquare App')
    .alias('s', 'secret')    
    .describe('s', 'Client Secret of your FourSquare App')
    .alias('t', 'token')    
    .describe('t', 'OAuth Token for swarmapp.com');

// start GPX generation after the download is finished
let downloadCompletionHandler = (checkins) => {
    console.log("Download finished");    
    gpx_converter.convert_to_gpx(checkins);   
}

// read arguments with yargs
const argv = yargs.argv;

let client_id = argv.clientId;
let client_secret = argv.secret;
let user_id = argv.userId;
let token = argv.token;

downloader.downloadCheckins("self", client_id, client_secret, token, downloadCompletionHandler);