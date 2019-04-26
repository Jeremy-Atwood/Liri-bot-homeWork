require("dotenv").config();

const keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require("moment");
var request = require("request");
// var bandsintown = require("bandsinTown")(keys.Bands);

var divider = "\n-----------------------------\n";

var spotify = new Spotify(keys.Spotify);

function spotifyQuery() {

    var queryTerm;

    var combination = "";

    for (var i = 3; i < process.argv.length; i++) {
        combination += process.argv[i] + " ";
    }

    if (process.argv[2] === "spotify-this-song" && process.argv[3] != undefined) {
        queryTerm = combination;
    } else if (process.argv[2] === "spotify-this-song" && process.argv[3] == undefined) {
        queryTerm = "Float, Flogging Molly";
    }

    spotify.search({ type: 'track', query: queryTerm }, function (err, data) {
        if (data.tracks.items[0] == undefined) {
            console.log("No Songs Found");
            return;
        }
        var artist = data.tracks.items[0].artists[0].name;;

        for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
            artist += ", " + data.tracks.items[0].artists[i].name;
        }

        var song = "Song: " + data.tracks.items[0].name + "\nArtist: " + artist + "\nAlbum: " + data.tracks.items[0].album.name + "\nLink: " + data.tracks.items[0].external_urls.spotify;

        song += divider;

        console.log(divider + song);

        fs.appendFile("random.txt", song, function (err) {
            if (err) {
                console.log("error occured: " + err);
            }
        })
    });
}

function movieQuery() {
    var queryTerm;
    var combination = "";

    for (var i = 3; i < process.argv.length; i++) {
        combination += process.argv[i] + " ";
    }

    if (process.argv[2] === "movie-this" && process.argv[3] != undefined) {
        queryTerm = combination;
    } else if (process.argv[2] === "movie-this" && process.argv[3] == undefined) {
        queryTerm = "Mr. Brooks";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + queryTerm + "&apikey=trilogy";

    request(queryUrl, function (err, response, body) {
        var obj = JSON.parse(body);

        if (obj.response === false) {
            console.log("Movie not found");
        }
        var movie = "Title: " + obj.Title + "\nYear: " + obj.Year + "\nIMDB Rating: " + obj.Ratings[0].Value + "\nRotten Tomatoes Rating: " + obj.Ratings[1].Value + "\nCountry: " + obj.Country + "\nLanguage: " + obj.Language + "\nPlot: " + obj.Plot + "\nActors: " + obj.Actors;

        movie += divider;
        console.log(divider + movie);

        fs.appendFile("random.txt", movie, function (err) {
            if (err) {
                console.log("Error: " + err)
            }
        })

    })
}

function bandQuery(parameter){

    if(process.argv[2] === 'concert-this'){
        var artistName="";
        for (var i = 3; i < process.argv.length; i++)
        {
            artistName+=process.argv[i];
        }
        console.log(artistName);
    }
    else{
        artistName=parameter;
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {
      
          var JS = JSON.parse(body);
          for (i = 0; i < JS.length; i++)
          {
            var dTime = JS[i].datetime;
              var month = dTime.substring(5,7);
              var year = dTime.substring(0,4);
              var day = dTime.substring(8,10);
              var dateForm = month + "/" + day + "/" + year
        
              var artist = "Date: " + dateForm + "\nName: " + JS[i].venue.name + "\nCity: " + JS[i].venue.city;
              if (JS[i].venue.region != "") {
                  var region = "Country: " + JS[i].venue.region;
              }
              var region = "\nCountry: " + JS[i].venue.country;

              var band = artistName + "\n" + artist + region;

              fs.appendFile("random.txt", band, function (err) {
                            if (err) {
                                console.log("Error: " + err)
                            }
                        })
           
          }
        }
    });
}

var input = process.argv[2];

switch (input) {
    case "spotify-this-song":
        spotifyQuery();
        break;

    case "movie-this":
        movieQuery();
        break;

    case "concert-this":
        bandQuery();
        break;
    default:
        console.log("Please use the proper commands: \nspotify-this-song \nmovie-this \nconcert-this \ndo-what-i-say");
        break;
}