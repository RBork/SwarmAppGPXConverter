const request = require('request');
const fs = require('fs');

const endpoints = {
    userDetailsEndpoint: "https://api.foursquare.com/v2/users/",
    userCheckIns: "https://api.foursquare.com/v2/users/USER_ID/checkins"
};


let performCheckinsRequest = (uri, client_id, client_secret, token, offset, items, completionCallback) => {    
    request({
        uri: uri,
        method: "GET",
        qs: {
            client_id: client_id, 
            client_secret: client_secret,
            v: '20180323',
            oauth_token: token,
            offset: offset,
            limit: 250
        }
        }, 
        function(error, response, body) {
            if (error) {
                console.log(error);
            }
            let json = JSON.parse(body); 
            let newItemsCount = json.response.checkins.items.length;            
            for (let i of json.response.checkins.items) {
                items.push(i);
            }
            // items.concat(json.response.checkins.items);              
            console.log('Loaded ' + items.length + ' checkins.');
            
            // if checkins left, try again
            if (offset < json.response.checkins.count) {
                offset += newItemsCount;
                performCheckinsRequest(uri, client_id, client_secret, token, offset, items, completionCallback);                
            } else {                
                completionCallback(items);
            }
        }    
    );
}      

// download checkins
let downloadCheckins = (user_id, client_id, client_secret, oauth_token, downLoadCompletionHandler) => {     
    let checkinsUri = endpoints.userCheckIns.replace("USER_ID", user_id);
    let offsetLimitReached = false;
    let offset = 0;
    let checkins = [];
    
    console.log("Starting Download of checkins...")
    performCheckinsRequest(checkinsUri, client_id, client_secret, oauth_token, offset, checkins, downLoadCompletionHandler);        
}

// exports
module.exports.downloadCheckins = downloadCheckins;