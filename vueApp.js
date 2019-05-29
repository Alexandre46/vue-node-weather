const API = "https://api.openweathermap.org/data/2.5/forecast";
const KEY = "88d2151398a5960afd2b42a1bb914c39";
const hours = 8;

var app = new Vue({
    el: "#app",
    data: {
      chart: null,
      month: '',
      city: "City,Country code",
      country: "",
      dates: [],
      temperature: "",
      maxTemperature : "",
      minTemperature: "",
      pressure: '',
      humidity: '',
      wind: '',
      overcast: '',
      temps: [],
      loading: false,
      errored: false,
      description:'',
      population: '',
      language: 'pt',
      forecasts: [],
    },
    watch: {
        // whenever question changes, this function will run
        city: function (newQuestion, oldQuestion) {
            this.debouncedGetAnswer()
        }
    },
    created: function () {
        // _.debounce is a function provided by lodash to limit how
        // often a particularly expensive operation can be run.
        // In this case, we want to limit how often we access
        // yesno.wtf/api, waiting until the user has completely
        // finished typing before making the ajax request. To learn
        // more about the _.debounce function (and its cousin
        // _.throttle), visit: https://lodash.com/docs#debounce
        this.getCity();
      this.debouncedGetAnswer = _.debounce(this.getData, 3000)
    },
    methods: {

      getLanguage() {
        const languageElement = document.getElementById('language');
        return languageElement.value;
      },

      month() {
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        now = new Date();
        return monthNames[now.getMonth()];
      },

        getCity(){
           axios.get('https://ipapi.co/json/',{

           }).then( response =>{
             console.log(response.data);
               this.city = response.data.city;
               this.country = response.data.country;
             this.postal = response.postal;
             return [this.city, this.postal];
           })
        },

      getData: function() {
        this.loading = true;

        if (this.chart != null) {
          this.chart.destroy();
        }

          //city without country if exists comma
          //separated city by country
          if(this.city.indexOf(',') > -1){
              var onlyCity = this.city.split(',');
              this.city = onlyCity[0];
              //country
              this.country = onlyCity[1];
          }

        axios
          .get(API, {
            params: {
              q: this.city+','+this.country,
              lang: this.getLanguage(),
              cnt: hours,
              units: language === 'pt' ? "metric" : 'imperial',
              appid: KEY
            }
          })
          .then(response => {
            this.dates = response.data.list.map(list => {
              return list.dt_txt;
            });

            this.temps = response.data.list.map(list => {
              return list.main.temp;
            });

            this.forecasts = response.data.list.map(list => {
              list.icon = "http://openweathermap.org/img/w/" + list.weather[0].icon + ".png";
              return list;
            });

          console.log(response.data);

          //country
          this.country          = response.data.city.country;
          //weather info
          this.temperature      = Math.round(response.data.list[0].main.temp);
          this.maxTemperature   = response.data.list[0].main.temp_max;
          this.minTemperature   = response.data.list[0].main.temp_min;
          this.humidity         = response.data.list[0].main.humidity + '%';
          this.pressure         = response.data.list[0].main.pressure;
          this.wind             = response.data.list[0].wind.speed + 'm/s';
          this.overcast         = response.data.list[0].weather[0].description;
          //description
          this.description      = response.data.list[0].weather[0].description;
          //population
          this.population       = response.data.city.population;


          //icons
          var icons = new Skycons({"color": "black"});
          const currentWeather = response.data.list[0].weather[0].main;
          const currentWeatherDesc =   response.data.list[0].weather[0].description;

          //change background img
            ChangeBgImage(currentWeather);

          if(currentWeather === 'Rain'){
          icons.set("icon1", Skycons.RAIN);
          }
          if(currentWeather === 'Clouds'){
              icons.set("icon1", Skycons.CLOUDY);
          }
          if(currentWeather === 'Snow'){
              icons.set("icon1", Skycons.SNOW);
          }
          if(currentWeather === 'Windy'){
              icons.set("icon1", Skycons.WIND);
          }
          if(currentWeather === 'Clear' || currentWeatherDesc === '%Clear%sky%'){
              icons.set("icon1", Skycons.CLEAR_DAY);
          }

          icons.play();


            var ctx = document.getElementById("myChart");
            this.chart = new Chart(ctx, {
              type: "line",
              data: {
                labels: this.dates,
                datasets: [
                  {
                    label: "Avg. Temp",
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgb(54, 162, 235)",
                    fill: false,
                    data: this.temps
                  }
                ]
              },
              options: {
                title: {
                  display: true,
                  text: "Temperature graph"
                },
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var label =
                        data.datasets[tooltipItem.datasetIndex].label || "";

                      if (label) {
                        label += ": ";
                      }

                      label += Math.floor(tooltipItem.yLabel);
                      return label + "°C";
                    }
                  }
                },
                scales: {
                  xAxes: [
                    {
                      type: "time",
                      time: {
                        unit: "hour",
                        displayFormats: {
                          hour: "M/DD @ hA"
                        },
                        tooltipFormat: "MMM. DD @ hA"
                      },
                      scaleLabel: {
                        display: true,
                        labelString: "Date/Time"
                      }
                    }
                  ],
                  yAxes: [
                    {
                      scaleLabel: {
                        display: true,
                        labelString: "Temperature (°C)"
                      },
                      ticks: {
                        callback: function(value, index, values) {
                          return value + "°C";
                        }
                      }
                    }
                  ]
                }
              }
            });
          })
          .catch(error => {
            console.log(error);
            this.error = true;
          })
          .finally(() => (this.loading = false));
      }
    }
  });


//Change div app background img pending on weather
function ChangeBgImage(currentWeather) {
  const urlString = 'url(images/' + currentWeather + '.png)';
    document.getElementById('app').style.backgroundImage =  urlString;
    document.getElementById('app').style.backgroundPosition = 'center';
    document.getElementById('app').style.backgroundRepeat = 'no-repeat';
}

function refreshPage(){
    window.location.reload();
}

