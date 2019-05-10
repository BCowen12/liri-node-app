require("dotenv").config();
const moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");
var inquirer = require("inquirer");
var axios = require("axios");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


  var Band_Artist = [{
      type: "input",
      name: "name",
      message: "What band do you want to search?"
  }];

  var Song_Name = [{
      type: "input",
      name: "name",
      message: "What band song do you want to search for?"
  }];

  var Movie = [{
      type: "input",
      name: "name",
      message: "What movie do you want to search?"
  }];
 
function run(){
    var doThis = "";
    var send = "";
  inquirer.prompt([
      {
          type: "list",
          name: "searchType",
          message: "What do you want to do?",
          choices: ["Band_Artist", "Song_Name", "Movie", "do-what-it-says", "Quit"]
        }
      ]).then(function(inquirerResponse) {
          doThis = inquirerResponse.searchType;
          if(doThis === "do-what-it-says"){
            var data = fs.readFileSync('random.txt', 'utf8');
                  var text = data.split(",");
                  doThis = text[0];
                  send = text[1];
          };   
    
      switch(doThis){
          case "Band_Artist":
              if(send !== "") band(send); 
              else{
                 inquirer.prompt(Band_Artist).then(function(answ){
                      send = answ.name;
                      band(send); 
                  });
              };  
          break;
          case "Song_Name":
          if(send !== "") song(send); 
          else{
              inquirer.prompt(Song_Name).then(function(answ){
                 send = answ.name;
                 song(send); 
              });
          }; 
          break;
          case "Movie":
          if(send !== "") movie(send); 
          else{
              inquirer.prompt(Movie).then(function(answ){
                 send = answ.name;
                 movie(send);
              });
          }; 
          break;
          case "Quit":
          console.log("Thank you for using Liri!");
          break;
          }; 
      }); 
    };

    run();


 



//OMDb search
function movie(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
    }
    if(movie[0]===`"` && movie[movie.length-1]===`"`){
        var newMovie = movie.split(`"`);
        movie = newMovie[1]; 
    }
    var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"

    axios.get(movieQueryURL).then(
        function (response) {
            
            if(response.data.Error){
                console.log(response.data.Error);
            }else{
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            for(var x in response.data.Ratings){
                switch(response.data.Ratings[x].Source){
                    case "Internet Movie Database":
                    console.log("IMDB Rating: " + response.data.Ratings[x].Value);
                    break;
                    case "Rotten Tomatoes":
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[x].Value);
                }
            };
            console.log("Country Where Produced: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
        run();
    }
    
    );
};

//Bands in Town search
function band(artist) {
    if (artist === "") {
        artist = "Muse";
    }
    if(artist[0]===`"` && artist[artist.length-1]===`"`){
        var newArtist = artist.split(`"`);
        artist = newArtist[1]; 
    }
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(bandQueryURL).then(
        function (response) {
            if(response.data.length === 0){
                console.log("Your search returned no results!");
            }else{
            for(var x in response.data){
                var date = moment(response.data[x].datetime).format('MM/DD/YYYY')
                console.log("Venue Name: " + response.data[x].venue.name);
                console.log("Location: "+ response.data[x].venue.city + ", " + response.data[x].venue.country);
                console.log("Date: " + date);
                console.log("----------------------------");
            }
        }
        run();
        }
    );
    
};

//spotify search
function song(song) {
    if (song === "") {
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song, limit: 10 }, function (err, data) {
        if (err) return console.log('Error occurred: ' + err);
        for(var x in data){
            for(var n in data[x].items){
                var artist = [];
                for(var a in data[x].items[n].artists){
                    artist.push(data[x].items[n].artists[a].name)
                }
                console.log("Artists: " + artist);
                console.log("Song Name: " + data[x].items[n].name);
                console.log("Preview Link: " + data[x].items[n].preview_url);
                console.log("Album Name: " + data[x].items[n].album.name);
                console.log("----------------------");
            }
            
        }
        run();
    });
    
};
