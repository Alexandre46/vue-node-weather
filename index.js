const argv = require('yargs').argv;

let request = require('request');

let apiKey = '88d2151398a5960afd2b42a1bb914c39';
let city = argv.c || 'Funchal';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

request(url, function (err, response, body) {
    if(err){
      console.log('error:', error);
    } else {
      let weather = JSON.parse(body)
      let fahrenheit = weather.main.temp ;
      let message = `It's `+fahrenheit+` degrees in ${weather.name}!`;
      console.log(message);
    }
  });
