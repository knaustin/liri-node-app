require("dotenv").config();
const moment = require('moment')
const fs = require('fs');
const axios = require('axios');
const Spotify = require('node-spotify-api');
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var nodeArgs = process.argv;
var userInput = "";
var userText = "";


for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "%20" + nodeArgs[i];
    }
    else {
        userInput += nodeArgs[i];
    }
}
for (var i = 3; i < nodeArgs.length; i++) {
    userText = userInput.replace(/%20/g, " ");
}

switch (command) {
    case "concert-this":
        concert();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doTheThing();
        break;
}

function concert() {
    queryUrl = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            let date = response.data[0].datetime;
            date = moment(date).format("MM/DD/YYYY")
            console.log('Band: ' + response.data[0].lineup + '\nVenue: ' + response.data[0].venue.name + '\nDate: ' + date);
            fs.appendFileSync("log.txt", 'Band: ' + response.data[0].lineup + '\nVenue: ' + response.data[0].venue.name + '\nDate: ' + date + "\n----------------\n")
        })
}

function spotifyThis() {
    if (!userInput) {
        userInput = "The%20Sign";
        userText = userInput.replace(/%20/g, " ");
    }
    fs.appendFileSync("log.txt", userText + "\n----------------\n", function (error) {
        if (error) {
            console.log(error);
        };
    });
    spotify.search({
        type: "track",
        query: userInput
    }, function (err, data) {
        if (err) {
            console.log("Error occured: " + err)
        }
        var info = data.tracks.items
        for (var i = 0; i < info.length; i++) {
            var albumObject = info[i].album;
            var trackName = info[i].name
            var preview = info[i].preview_url
            var artistsInfo = albumObject.artists
            for (var j = 0; j < artistsInfo.length; j++) {
                console.log("Artist: " + artistsInfo[j].name)
                console.log("Song Name: " + trackName)
                console.log("Preview of Song: " + preview)
                console.log("Album Name: " + albumObject.name)
                console.log("----------------")
                fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of Song: " + preview + "\nAlbum Name: " + albumObject.name + "\n----------------\n", function (error) {
                    if (error) {
                        console.log(error);
                    };
                });
            }
        }
    })
}
function movieThis() {
    if (!userInput) {
        userInput = "Mr%20Nobody";
        prettyUserInput = userInput.replace(/%20/g, " ");
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + userText + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nRating: " + response.data.Ratings + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n----------------");
            fs.appendFileSync("log.txt", "Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nRating: " + response.data.Ratings + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors + "\n----------------")
        }
    );

}

function doTheThing() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        
        var textArr = data.split(",");
        command = textArr[0];
        userInput = textArr[1];
        userText = userInput.replace(/%20/g, " ");
       
    })

}